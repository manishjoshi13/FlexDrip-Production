import { asyncHandler } from "../utils/asyncWrapper.js";
import { AppError } from "../utils/appError.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { User } from "../models/user.model.js";

export const authenticate = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        throw new AppError("Unauthorized", 401);
    }
    // console.log("token",token)
    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decodedToken.id);

    if (!user) {
        throw new AppError("User not found", 404);
    }
    req.user = user;
    next();
})

export const sellerAuth = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "seller") {
        throw new AppError("Only seller can create product", 403);
    }
    next();
})

export const buyerAuth = asyncHandler(async (req, res, next) => {
    if (req.user.role != "buyer")
        throw new AppError("Only buyer can buy product", 403);
    next();
})

export const optionalAuthenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decodedToken = jwt.verify(token, config.JWT_SECRET);
            const user = await User.findById(decodedToken.id);
            if (user) {
                req.user = user;
            }
        }
    } catch (err) {
        // Ignore validation errors to keep guests anonymous
    }
    next();
};