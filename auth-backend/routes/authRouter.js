import express from "express";
import {
  signupController,
  loginController,
  verifyOtpController,
  resendOtpController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.Controller.js";
import {
  githubCallback,
  githubAuthRedirect,
} from "../controllers/githubAuth.Controller.js";
import { googleLogin } from "../controllers/googleAuth.Controller.js";

const router = express.Router();

router.get("/google", googleLogin);
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);
router.get("/github/callback", githubCallback);
router.get("/github", githubAuthRedirect);

export default router;
