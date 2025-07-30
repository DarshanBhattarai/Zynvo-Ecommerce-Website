import express from "express";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser, // <-- import this
} from "../controllers/user.Controller.js";
import { authenticateUser } from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";

const router = express.Router();

// GET /api/users - Only accessible by admins
router.get("/", authenticateUser, authorizeRoles("admin"), fetchAllUsers);

// PATCH /api/users/update-role - Only accessible by admins
router.patch(
  "/update-role",
  authenticateUser,
  authorizeRoles("admin"),
  updateUserRole
);

// DELETE /api/users/:userId - Only accessible by admins
router.delete(
  "/:userId",
  authenticateUser,
  authorizeRoles("admin"),
  deleteUser
);

export default router;
