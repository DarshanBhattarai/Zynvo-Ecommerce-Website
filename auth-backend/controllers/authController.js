import oauth2Client from "../utils/googleConfig.js";
import UserModel from "../models/userModel.js";
import { createUser } from "../services/authServices.js";
import { loginUser } from "../services/authServices.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import { verifyOtp } from "../services/authServices.js";
import { handleGoogleAuth } from "../services/authServices.js";
import axios from "axios";
import jwt from "jsonwebtoken";

export const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;
    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        image: picture,
      });
    }

    const { _id } = user;
    const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        name,
        email,
        image: picture,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const result = await createUser({ name, email, password });

    // Send OTP email after user is created
    await sendOtpEmail(result.email, result.otp);

    return res.status(201).json({
      message:
        "User registered successfully. Please verify your email with the OTP sent.",
      email: result.email,
      // otp: result.otp, // Do NOT send OTP in production
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ message: err.message || "Signup failed" });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const result = await loginUser({ email, password });

    return res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const result = await verifyOtp({ email, otp });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// authController.js

export const googleAuthController = async (req, res) => {
  try {
    const result = await handleGoogleAuth(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
