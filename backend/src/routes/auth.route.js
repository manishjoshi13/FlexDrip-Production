import { Router } from "express";
import { register,login,logout,getMe,googleAuthenticate,updateProfile, verifyRegistration, forgotPassword, resetPassword } from "../controller/auth.controller.js";
import { validateRegister,validateLogin } from "../validator/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";
import passport from "passport";
import {config} from "../config/config.js"
let redirectUrl=`${config.FRONTEND_URL}/login`

const router = Router();

router.post("/register",validateRegister,register)

router.get("/verify-registration", verifyRegistration)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password", resetPassword)

router.post("/login",validateLogin,login)

router.post("/logout",authenticate,logout)

router.get("/get-me",authenticate,getMe)

router.put("/update-profile",authenticate,updateProfile)

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false,failureRedirect:redirectUrl }),googleAuthenticate
);





export default router;