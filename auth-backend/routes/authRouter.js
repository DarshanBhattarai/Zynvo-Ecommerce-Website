import express from "express";
import { googleLogin , signupController, loginController , verifyOtpController } from "../controllers/authController.js";

const router = express.Router();


router.get("/google", googleLogin);
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/verify-otp", verifyOtpController);

export default router;
