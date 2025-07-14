import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

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
  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  };
};
export const verifyOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!user.otp || !user.otp.code) throw new Error("No OTP found, please request a new one");

  const { code, expiresAt, verified } = user.otp;

  if (verified) throw new Error("OTP already verified");
  
  if (!otp || code.trim() !== otp.trim()) throw new Error("Invalid OTP");
  
  if (!expiresAt || Date.now() > new Date(expiresAt).getTime()) throw new Error("OTP expired");

  user.otp.verified = true;
  user.isVerified = true;
  await user.save();

  return {
    message: "OTP verified successfully",
    user: {
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    },
  };
};

export const handleGoogleAuth = async ({ email, name, picture }) => {
  let user = await User.findOne({ email });

  if (!user) {
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otp = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    };

    user = new User({ email, name, image: picture, otp, isVerified: false });
    await user.save();

    await sendOtpEmail(email, otpCode);
  } else if (!user.isVerified) {
    const otpCode = crypto.randomInt(100000, 999999).toString();
    user.otp = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    };
    await user.save();

    await sendOtpEmail(email, otpCode);
  }

  const token = generateToken(user._id);

  return {
    message: "Logged in via Google",
    user: {
      name: user.name,
      email: user.email,
      picture: user.image,
      isVerified: user.isVerified,
    },
    token,
  };
};

