import oauth2Client from "../utils/googleConfig.js";
import UserModel from "../models/userModel.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../utils/logger.js"; // import your logger
import { configDotenv } from "dotenv";
configDotenv();

export const googleLogin = asyncHandler(async (req, res) => {
  const { code } = req.query;
  logger.info("Google login attempt started");

  // Step 1: Exchange code for tokens
  const googleRes = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(googleRes.tokens);
  logger.info("Received Google tokens");

  // Step 2: Get user info from Google
  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );

  const { email, name, picture } = userRes.data;
  logger.info(`Google user info fetched for email: ${email}`);

  // Step 3: Find or create user
  let user = await UserModel.findOne({ email });

  if (!user) {
    user = await UserModel.create({
      name,
      email,
      image: picture,
      isVerified: true,
      provider: "google",
      role: "user",
      otp: {
        code: null, // No OTP for Google users
        expiresAt: null,
        verified: true,
        type: "google-login",
      },
    });
    logger.info(`Created new user from Google login: ${email}`);
  } else {
    logger.info(`Existing user logged in via Google: ${email}`);
  }

  // Step 4: Generate JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_TIMEOUT || "7d" }
  );
  logger.info(`JWT generated for Google user: ${email}`);

  // After JWT token generation in googleLogin:
  const cookieExpiry = 30 * 24 * 60 * 60 * 1000; // 30 day

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: cookieExpiry,
    sameSite: "lax",
    path: "/",
  });
  // Step 6: Send response with token
  res.status(200).json({
    message: "User logged in successfully",

    user: {
      name: user.name,
      email: user.email,
      image: user.image,
      isVerified: user.isVerified,
      provider: user.provider,
      role: user.role,
    },
  });

  logger.info(`Google login response sent for user: ${email}`);
});
