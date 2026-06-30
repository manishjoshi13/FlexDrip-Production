import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncWrapper.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { AppError } from "../utils/appError.js";
import bcrypt from "bcryptjs";
import { createCart } from "./cart.controller.js";
import Cart from "../models/cart.model.js";
import sendEmail from "../services/email.service.js";
import { getVerifyAccountHTML, getSuccessHTML, getErrorHTML } from "../html/verifyAccount.js";
import { getAccountRegisteredHTML } from "../html/accountRegistered.js";
import { getSellerWelcomeHTML } from "../html/sellerWelcome.js";
import { getChangePasswordHTML } from "../html/changePassword.js";

const getFrontendUrl = () => {
    return config.FRONTEND_URL;
};

export const register = asyncHandler(async (req, res) => {
    const { fullName, email, password, phone, role } = req.body;

    if (!fullName || !email || !password || !phone || !role) {
        throw new AppError("All fields are required", 400);
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
        throw new AppError("User with this email or phone already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token with 15 minutes expiration
    const verificationToken = jwt.sign(
        { fullName, email, password: hashedPassword, phone, role },
        config.JWT_SECRET,
        { expiresIn: '15m' }
    );

    // Send verification email
    const frontendUrl = getFrontendUrl();
    const emailHtml = getVerifyAccountHTML(fullName, verificationToken, frontendUrl);

    await sendEmail(
        email,
        "Verify Your FlexDrip Account",
        "Verify your account by clicking the link.",
        emailHtml
    ).catch(err => console.error("Verify email error:", err));

    res.status(200).json({
        success: true,
        message: "Verification email has been sent to your inbox. The link will be active for 15 minutes."
    });
})


export const login = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        throw new AppError("All fields are required", 400);
    }

    const user = await User.findOne({ email, role }).select("+password +googleLogin");
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.googleLogin) {

        throw new AppError("User is registered with google, please login with google", 400);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid password", 401);
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

    // cookie
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    const options = {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    const userObject = user.toObject();
    delete userObject.password

    res.cookie("token", token, options);


    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: userObject
    })

})

export const logout = asyncHandler(async (req, res) => {
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.clearCookie("token", {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax"
    });
    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    })

})

export const getMe = asyncHandler(async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user
    })

})



export const googleAuthenticate = asyncHandler(async (req, res) => {
    const frontendUrl = getFrontendUrl();
    let user = await User.findOne({ email: req.user.emails[0].value }).select("+googleLogin");
    if (user && !user.googleLogin) {
        return res.redirect(`${frontendUrl}/login?error=not registred with google`);
    }
    if (!user) {
        user = await User.create({
            fullName: req.user.displayName,
            email: req.user.emails[0].value,
            role: "buyer",
            googleLogin: true,

        })
    }
    console.log(user)
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });


    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    const options = {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, options);

    res.redirect(frontendUrl)

})

export const updateProfile = asyncHandler(async (req, res) => {
    const { fullName, phone, role } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (!fullName || !phone) {
        throw new AppError("Full name and phone number are required", 400);
    }

    // Validate phone number format (must be 10 digits)
    const phoneStr = phone.toString().trim();
    if (phoneStr.length !== 10 || isNaN(phone)) {
        throw new AppError("Phone number must be a 10-digit number", 400);
    }

    // Role validation
    if (role && !["buyer", "seller"].includes(role)) {
        throw new AppError("Invalid role specified", 400);
    }

    // Only allow role changes if profile is not completed yet
    if (!user.profileCompleted) {
        if (role) {
            user.role = role;
        }
    }

    user.fullName = fullName;
    user.phone = Number(phone);
    user.profileCompleted = true;

    await user.save();

    // If role is buyer, ensure they have a cart
    if (user.role === "buyer") {
        const existingCart = await Cart.findOne({ user: user._id });
        if (!existingCart) {
            await Cart.create({ user: user._id });
        }
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    });
});

export const verifyRegistration = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.send(getErrorHTML("Verification token is missing."));
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const { fullName, email, password, phone, role } = decoded;

        // Double check if user already exists
        const checkUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (checkUser) {
            return res.send(getErrorHTML("User with this email or phone is already registered."));
        }

        // Create the user in the database
        const user = await User.create({
            fullName,
            email,
            password, // already hashed
            phone,
            role,
            profileCompleted: true
        });

        // Initialize cart if user is a buyer
        if (user.role === "buyer") {
            const existingCart = await Cart.findOne({ user: user._id });
            if (!existingCart) {
                await Cart.create({ user: user._id });
            }
        }

        // Send welcome email
        const frontendUrl = getFrontendUrl();
        if (user.role === 'seller') {
            const welcomeHtml = getSellerWelcomeHTML(user.fullName, frontendUrl);
            await sendEmail(
                user.email,
                "Welcome to the FlexDrip Seller Network",
                "Your store is ready to set up on FlexDrip!",
                welcomeHtml
            );
        } else {
            const welcomeHtml = getAccountRegisteredHTML(user.fullName, frontendUrl);
            await sendEmail(
                user.email,
                "Welcome to FlexDrip",
                "Your account has been registered successfully!",
                welcomeHtml
            );
        }

        return res.send(getSuccessHTML());
    } catch (error) {
        console.error("Verification error:", error);
        return res.send(getErrorHTML("Verification link has expired or is invalid."));
    }
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new AppError("Email is required", 400);
    }

    const user = await User.findOne({ email }).select("+googleLogin");
    if (!user) {
        throw new AppError("User not found with this email", 404);
    }

    if (user.googleLogin) {
        throw new AppError("This account is registered with Google. Please sign in via Google.", 400);
    }

    // Generate reset token with 15 minutes expiration
    const resetToken = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const frontendUrl = getFrontendUrl();
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    const emailHtml = getChangePasswordHTML(user.fullName, resetUrl);

    sendEmail(
        user.email,
        "Reset Your FlexDrip Password",
        `Reset your password using this link: ${resetUrl}`,
        emailHtml
    ).catch(err => console.error("Reset password email error:", err));

    res.status(200).json({
        success: true,
        message: "Password reset link has been sent to your email. The link is active for 15 minutes."
    });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        throw new AppError("Token and new password are required", 400);
    }

    // Validate newPassword rules (min length 8, uppercase, lowercase, numeric)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (newPassword.length < 8 || !passwordRegex.test(newPassword)) {
        throw new AppError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number", 400);
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const userId = decoded.id;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findById(userId);
        if (!user) {
            throw new AppError("User not found or invalid token", 404);
        }

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully."
        });
    } catch (error) {
        console.error("Password reset error:", error);
        throw new AppError("Password reset token is invalid or has expired", 400);
    }
});

