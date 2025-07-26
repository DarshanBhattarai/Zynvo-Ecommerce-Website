import express from "express";
import {
  signupController,
  loginController,
  signUpVerifyOtpController,
  unifiedResendOtpController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
} from "../controllers/auth.Controller.js";
import {
  githubCallback,
  githubAuthRedirect,
} from "../controllers/githubAuth.Controller.js";
import { googleLogin } from "../controllers/googleAuth.Controller.js";
import { authenticateUser } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/google", googleLogin);
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/verify-signup-otp", signUpVerifyOtpController);
router.post("/resend-otp", unifiedResendOtpController);
router.get("/github/callback", githubCallback);
router.get("/github", githubAuthRedirect);
router.post("/logout", authenticateUser, logoutController);

export default router;
