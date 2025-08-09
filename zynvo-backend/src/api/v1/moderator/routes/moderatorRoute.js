import express from "express";
import { createVendor } from "../controllers/moderator.Controller.js";
import {  authenticateUser} from "../../auth/middleware/authenticate.js";
import upload from "../../cloudinary/middleware/cloudinaryUpload.js";

const router = express.Router();

router.post("/", authenticateUser, upload.single("logo"), createVendor);

export default router;
