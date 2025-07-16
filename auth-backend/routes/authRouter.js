import express from "express";
import {
  googleLogin,
  signupController,
  loginController,
  verifyOtpController,
  resendOtpController,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/google", googleLogin);
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);

export default router;
