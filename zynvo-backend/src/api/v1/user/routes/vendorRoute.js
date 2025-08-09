import express from "express";
import { createVendor } from "../controllers/vendorController.js";
import { protect } from "../../auth/middleware/authenticate.js";
import upload from "../middleware/cloudinaryUpload.js";

const router = express.Router();

router.post("/", protect, upload.single("logo"), createVendor);

export default router;
