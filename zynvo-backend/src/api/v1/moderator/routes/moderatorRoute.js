import express from "express";
import { createVendor } from "../controllers/moderator.Controller.js";
import {  authenticateUser} from "../../auth/middleware/authenticate.js";
import { getVendorProfile } from "../controllers/moderator.Controller.js";
const router = express.Router();

router.post("/request", authenticateUser, createVendor);
router.get("/profile/:userId", authenticateUser, getVendorProfile);


export default router;
