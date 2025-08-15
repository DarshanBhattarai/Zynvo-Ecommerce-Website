import express from "express";
import asyncHandler from "../../../../utils/asyncHandler.js";
import { authenticateUser } from "../../auth/middleware/authenticate.js";
import { authorizeRoles } from "../../auth/middleware/authorize.js";

// Admin Controllers
import {
  getPendingVendors,
  getVendorById,
  approveVendor,
  rejectVendor,
} from "../controllers/vendorController.js";

const router = express.Router();

// ----------------------
// Middleware: Admin-only
// ----------------------
router.use(authenticateUser);
router.use(authorizeRoles("admin"));

// ----------------------
// Dashboard Route
// ----------------------
router.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Welcome to the admin dashboard!" });
  })
);

// ----------------------
// Vendor Routes
// ----------------------

// Get all pending vendor requests
router.get("/vendors", asyncHandler(getPendingVendors));

// Get a single vendor request by ID
router.get("/vendors/:id", asyncHandler(getVendorById));

// Approve a vendor request
router.post("/vendors/:id/approve", asyncHandler(approveVendor));

// Reject a vendor request
router.post("/vendors/:id/reject", asyncHandler(rejectVendor));

export default router;
