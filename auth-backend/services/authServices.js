import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";
import TempUser from "../models/tempUser.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TIMEOUT = process.env.JWT_TIMEOUT || "1d";

// Helper: hash OTP
const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");
// Signup service: create temp user and send OTP
// Signup service: create temp user and send OTP
export const createUser = async ({ name, email, password, role = "user" }) => {
  // Check if user already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered");

  // Create OTP & hash password
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = hashOtp(otpCode);
  const hashedPassword = await bcrypt.hash(password, 10);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save/update temp user record with hashed OTP code
  await TempUser.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password: hashedPassword,
      role,
      provider: "email",
      otp: { code: hashedOtp, expiresAt: otpExpiresAt },
    },
    { upsert: true, new: true }
  );

  // Send OTP email (async)
  await sendOtpEmail(email, otpCode, "Verify your email");

  return { email }; // remove otp in production
};
export const signUpVerifyOtp = async ({ email, otp }) => {
  // Find the temp user (unverified user)
  const tempUser = await TempUser.findOne({ email });
  if (!tempUser) throw new Error("No signup request found for this email");

  const { code, expiresAt } = tempUser.otp;

  // Check if OTP expired
  if (!expiresAt || Date.now() > new Date(expiresAt).getTime()) {
    await TempUser.deleteOne({ email }); // Cleanup expired temp user
    throw new Error("OTP expired. Please sign up again.");
  }

  // Compare hashed OTP
  if (!otp || code !== hashOtp(otp.toString().trim())) {
    throw new Error("Invalid OTP");
  }

  // Create user in the main User collection
  const user = new User({
    name: tempUser.name,
    email: tempUser.email,
    password: tempUser.password,
    role: tempUser.role,
    provider: tempUser.provider,
    isVerified: true,
  });



  user.otp = { verified: true, type: "signup" };
  await user.save();

  // Delete temp user as OTP is verified and user is created
  await tempUser.deleteOne({ email });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_TIMEOUT }
  );

  return {
    message: "OTP verified successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    },
  };
};

export const resendSignUpOtpService = async (email) => {
  const tempUser = await TempUser.findOne({ email });
  if (!tempUser) throw new Error("No signup request found for this email");

  const newOtp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = hashOtp(newOtp);
  tempUser.otp.code = hashedOtp;
  tempUser.otp.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await tempUser.save();
  console.log(`Sending OTP email to ${email} with code ${newOtp}`);
  await sendOtpEmail(email, newOtp, "Your signup verification OTP");
  console.log(`OTP email sent to ${email}`);

  return { email };
};
// adjust path if needed

export const resendOtpService = async (email) => {
  // 1. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User with this email does not exist");
  }

  // 3. Generate 6-digit OTP
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = hashOtp(otpCode);

  // 4. Update OTP fields in user model
  user.otp = {
    code: hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  };

  await user.save();

  // 5. Send email
  await sendOtpEmail(email, otpCode);

  // 6. Return confirmation
  return { email: user.email };
};

export const loginUser = async ({ email, password, rememberMe }) => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    const tempUser = await TempUser.findOne({ email });
    if (tempUser) {
      const isMatch = await bcrypt.compare(password, tempUser.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }
      // Password matches but user not verified yet
      return { user: null, isVerified: false, isTempUser: true };
    }
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Instead of throwing error here, return user + verified flag
  return {
    user,
    isVerified: user.isVerified,
  };
  const expiresIn = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 24 * 60 * 60 * 1000; // 1 day
  // Generate JWT token
};

// FORGOT PASSWORD SERVICE
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.otp = {
    code: hashedOtp,
    expiresAt: new Date (Date.now() + 10 * 60 * 1000), // 10 min expiry
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
    user.otp && user.otp.code === hashedOtp && user.otp.expiresAt > Date.now();

  if (!isValid) throw new Error("Invalid or expired OTP");

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;

  await user.save();

  return { message: "Password reset successful" };
};

export const getUserFromToken = async (token) => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid or expired token");
  }
};
