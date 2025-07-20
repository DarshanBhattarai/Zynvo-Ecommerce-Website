import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1d";

export const createUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);
  const otpCode = crypto.randomInt(100000, 999999).toString();

  const otp = {
    code: otpCode,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    verified: false,
  };

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    otp,
    isVerified: false,
    role: req.body.role || "user",
    provider: "email",
  });

  await newUser.save();
  return { email: newUser.email, otp: otpCode }; // send otpCode for testing/dev
};

export const loginUser = async ({ email, password }) => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Optional: check if user is verified
  if (!user.isVerified) {
    throw new Error("User account not verified");
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
    }
  );

  

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      isVerified: user.isVerified,
      role: user.role,
    },
  };
};
export const verifyOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!user.otp || !user.otp.code)
    throw new Error("No OTP found, please request a new one");

  const { code, expiresAt, verified } = user.otp;

  if (verified) throw new Error("OTP already verified");

  if (!otp || code.trim() !== otp.trim()) throw new Error("Invalid OTP");

  if (!expiresAt || Date.now() > new Date(expiresAt).getTime())
    throw new Error("OTP expired");

  user.otp.verified = true;
  user.isVerified = true;
  await user.save();

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
    }
  );

  return {
    message: "OTP verified successfully",
    token, // include the token
    user: {
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    },
  };
};

// adjust path if needed

export const resendOtpService = async (email) => {
  // 1. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User with this email does not exist");
  }

  // 2. Skip if already verified
  if (user.isVerified) {
    throw new Error("User is already verified");
  }

  // 3. Generate 6-digit OTP
  const otpCode = crypto.randomInt(100000, 999999).toString();

  // 4. Update OTP fields in user model
  user.otp = {
    code: otpCode,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    isverified: false, // should be false until verified
  };

  await user.save();

  // 5. Send email
  await sendOtpEmail(email, otpCode);

  // 6. Return confirmation
  return { email: user.email };
};

// FORGOT PASSWORD SERVICE
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.otp = {
    code: hashedOtp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 min expiry
    verified: false,
    type: "forgot-password",
  };

  await user.save();
  await sendOtpEmail(email, otp, "Password Reset");

  return { email };
};

// RESET PASSWORD SERVICE
export const resetPasswordService = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const isValid =
    user.otp &&
    user.otp.code === hashedOtp &&
    user.otp.type === "forgot-password" &&
    user.otp.expiresAt > Date.now();

  if (!isValid) throw new Error("Invalid or expired OTP");

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined; // clear OTP

  await user.save();

  return { message: "Password reset successful" };
};
