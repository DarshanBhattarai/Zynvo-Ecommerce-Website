import express from "express";
import { authenticateUser } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";

const router = express.Router();

// Apply auth & admin role middleware to all admin routes
router.use(authenticateUser);
router.use(authorizeRoles("admin"));

// Now you can just define your routes without repeating middleware:
router.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome to the admin dashboard!" });
});

// other admin routes...

export default router;
