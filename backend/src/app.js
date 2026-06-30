import express from "express";
import {config} from "./config/config.js";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import sendEmail from "./services/email.service.js";

 


const app=express();
app.set('trust proxy', 1);   
app.use(passport.initialize());


passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
  proxy: true,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));




app.use(express.urlencoded({extended:true}));
app.use(express.json({}));
app.use(cors({
    origin:config.FRONTEND_URL,
    credentials:true
}))
app.use(morgan("dev"));
app.use(cookieParser());




export default app;
