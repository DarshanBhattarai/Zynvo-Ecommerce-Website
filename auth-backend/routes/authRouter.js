import express from "express";
import {
  signupController,
  loginController,
  signUpVerifyOtpController,
  unifiedResendOtpController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  getMeController,
} from "../controllers/auth.Controller.js";
import {
  githubCallback,
  githubAuthRedirect,
} from "../controllers/githubAuth.Controller.js";
import { googleLogin } from "../controllers/googleAuth.Controller.js";
import { authenticateUser } from "../middleware/authenticate.js";

const router = express.Router();

// Auth basics
router.post("/signup", signupController);
router.post("/verify-signup-otp", signUpVerifyOtpController);
router.post("/resend-otp", unifiedResendOtpController);
router.post("/login", loginController);
router.post("/logout", authenticateUser, logoutController);

// Password recovery
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

// Social Auth
router.get("/google", googleLogin);
router.get("/github", githubAuthRedirect);
router.get("/github/callback", githubCallback);

// Profile
router.get("/me", authenticateUser, getMeController);

export default router;
