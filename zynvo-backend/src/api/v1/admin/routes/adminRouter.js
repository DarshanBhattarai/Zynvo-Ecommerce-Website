import express from "express";
import { authenticateUser } from "../../auth/middleware/authenticate.js";
import { authorizeRoles } from "../../auth/middleware/authorize.js";
import asyncHandler from "../../../../utils/asyncHandler.js"; // Assuming you have an asyncHandler utility
const router = express.Router();

// Apply auth & admin role middleware to all admin routes
router.use(authenticateUser);
router.use(authorizeRoles("admin"));

// Now you can just define your routes without repeating middleware:
router.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    res.json({ message: "Welcome to the admin dashboard!" });
  })
);

// other admin routes...

export default router;
