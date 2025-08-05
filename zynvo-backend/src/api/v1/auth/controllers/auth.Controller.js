import asyncHandler from "../../../../utils/asyncHandler.js";
import {
  createUser,
  loginUser,
  signUpVerifyOtp,
  resendOtpService,
  resendSignUpOtpService,
  forgotPasswordService,
  resetPasswordService,
  getUserFromToken,
} from "../../../../services/authServices.js";
import { createAdminUserService } from "../../../../services/adminService.js";
import logger from "../../../../utils/logger.js"; // ✅ logger added
import jwt from "jsonwebtoken";

// ✅ SIGNUP
export const signupController = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "All fields are required" });

  logger.info(`Signup attempt for email: ${email}`);

  const result = await createUser({ name, email, password, role });

  logger.info(`Signup successful for email: ${email}`);

  res.status(201).json({
    message:
      "User registered successfully. Please verify your email with the OTP sent.",
    email: result.email,
  });
});

export const signUpVerifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    logger.warn(`OTP verification attempt with missing email or otp.`);
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    logger.info(`OTP verification attempt for email: ${email}`);

    const result = await signUpVerifyOtp({ email, otp });

    if (result.token) {
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: false, // Set to true in production
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
    }

    logger.info(`OTP verification successful for email: ${email}`);

    res.status(200).json({
      message: "Email verified successfully",
      user: result.user,
    });
  } catch (err) {
    if (
      err.message === "Invalid OTP" ||
      err.message === "OTP expired. Please sign up again." ||
      err.message === "No signup request found for this email"
    ) {
      logger.warn(
        `OTP verification failed for email: ${email} - Reason: ${err.message}`
      );
      return res.status(400).json({ message: err.message });
    }

    logger.error(
      `OTP verification error for email: ${email} - Error: ${
        err.stack || err.message
      }`
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const unifiedResendOtpController = asyncHandler(async (req, res) => {
  const { email, type } = req.body;

  if (!email || !type)
    return res.status(400).json({ message: "Email and type are required" });

  logger.info(`Resend OTP request - type: ${type} for email: ${email}`);

  let result;

  if (type === "signup") {
    result = await resendSignUpOtpService(email);
  } else if (type === "forgot") {
    result = await resendOtpService(email);
  } else {
    return res.status(400).json({ message: "Invalid OTP type" });
  }

  logger.info(`OTP resent successfully to email: ${result.email}`);

  res.status(200).json({
    message: "OTP resent successfully",
    email: result.email,
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  logger.info(`Login attempt for email: ${email}`);

  try {
    const { user, isVerified, isTempUser } = await loginUser({
      email,
      password,
    });
    if (isTempUser || !isVerified) {
      try {
        await resendSignUpOtpService(email);
      } catch (err) {
        logger.error(`Failed to resend OTP: ${err.stack}`);
        return res
          .status(500)
          .json({ message: "Failed to resend OTP. Try again later." });
      }

      return res.status(403).json({
        message:
          "User account not verified. OTP resent to your email. Please verify to login.",
        email,
      });
    }

    // Proceed with login: create token, set cookie
    const cookieExpiry = rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: cookieExpiry }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: cookieExpiry,
      sameSite: "lax",
      path: "/",
    });

    logger.info(`Login successful for email: ${email}`);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
      role: user.role,
    });
  } catch (error) {
    logger.error(`Login failed for email: ${email} - ${error.message}`);
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ message: error.message });
    }
    if (error.message === "User account not verified") {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ FORGOT PASSWORD
export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  logger.info(`Forgot password request for email: ${email}`);

  const result = await forgotPasswordService(email);

  logger.info(`OTP sent for password reset to email: ${result.email}`);

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

  logger.info(`Password reset attempt for email: ${email}`);

  const result = await resetPasswordService({ email, otp, newPassword });

  logger.info(`Password reset successful for email: ${email}`);

  res.status(200).json({ message: result.message });
});

export const createAdminUser = async () => {
  try {
    const result = await createAdminUserService();
    if (result) {
      logger.info(`Admin user created: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    logger.error(`Error creating admin user: ${error.message}`);
  }
};

// in your controller file (like authController.js)
export const logoutController = asyncHandler(async (req, res) => {
  const email = req.user?.email || "Unknown user"; // if you have user info from middleware

  logger.info(`Logout attempt for email: ${email}`);

  res.clearCookie("token", {
    path: "/", // Ensure the cookie is cleared for the correct path
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
  });

  logger.info(`Logout successful for email: ${email}`);

  res.status(200).json({ message: "Logged out successfully" });
});

export const getMeController = asyncHandler(async (req, res) => {
  // console.log("Cookies received:", req.cookies); // Verify cookie exists
  const token = req.cookies.token;

  try {
    const user = await getUserFromToken(token);
    // Verify user lookup
    logger.info(`getMe request successful for user: ${user.email}`);

    res.status(200).json({ user });
  } catch (error) {
    console.error("getMe error:", error.message); // Log specific error
    res.status(401).json({ message: error.message });
  }
});
