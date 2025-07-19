import oauth2Client from "../utils/googleConfig.js";
import UserModel from "../models/userModel.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";

export const googleLogin = asyncHandler(async (req, res) => {
  const { code } = req.query;

  // Step 1: Exchange code for tokens
  const googleRes = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(googleRes.tokens);

  // Step 2: Get user info from Google
  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );

  const { email, name, picture } = userRes.data;

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
    });
  }

  // Step 4: Generate JWT
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_TIMEOUT || "7d" }
  );

  // Step 5: Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "Strict",
  });

  // Step 6: Send response with token
  res.status(200).json({
    message: "User logged in successfully",
    token, // Include token in JSON response
    user: {
      name: user.name,
      email: user.email,
      image: user.image,
      isVerified: user.isVerified,
      provider: user.provider,
      role: user.role,
    },
  });
});