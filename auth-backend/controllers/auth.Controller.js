import asyncHandler from "../middleware/asyncHandler.js";
import {
  createUser,
  loginUser,
  signUpVerifyOtp,
  resendOtpService,
  resendSignUpOtpService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/authServices.js";
import { createAdminUserService } from "../services/adminService.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

// ✅ SIGNUP
export const signupController = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "All fields are required" });

  const result = await createUser({ name, email, password, role });
  await sendOtpEmail(result.email, result.otp);

  res.status(201).json({
    message:
      "User registered successfully. Please verify your email with the OTP sent.",
    email: result.email,
  });
});

// ✅ VERIFY OTP
export const signUpVerifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required" });

  const result = await signUpVerifyOtp({ email, otp });

  if (result.token) {
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });
  }

  res.status(200).json({
    message: "Email verified successfully",
    user: result.user,
  });
});

export const unifiedResendOtpController = asyncHandler(async (req, res) => {
  const { email, type } = req.body;

  if (!email || !type)
    return res.status(400).json({ message: "Email and type are required" });


  let result;

  if (type === "signup") {
    result = await resendSignUpOtpService(email);
  } else if (type === "forgot") {
    result = await resendOtpService(email);
  } else {
    return res.status(400).json({ message: "Invalid OTP type" });
  }

  res.status(200).json({
    message: "OTP resent successfully",
    email: result.email,
  });
});

// ✅ LOGIN
export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const result = await loginUser({ email, password });

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "Strict",
  });

  res.status(200).json({
    message: "Login successful",
    user: result.user,
    token: result.token,
    role: result.user.role,
  });
});

// ✅ FORGOT PASSWORD
export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const result = await forgotPasswordService(email);

  res.status(200).json({
    message: "OTP sent to your email for password reset.",
    email: result.email,
  });
});

// ✅ RESET PASSWORD
export const resetPasswordController = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "All fields are required" });

  const result = await resetPasswordService({ email, otp, newPassword });

  res.status(200).json({ message: result.message });
});

export const createAdminUser = async () => {
  try {
    const result = await createAdminUserService();
    if (result) {
      console.log(result);
    }
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};
