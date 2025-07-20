// routes/userRoutes.js
import express from "express";
import { fetchAllUsers } from "../controllers/user.Controller.js";
import { authenticateUser} from "../middleware/authenticate.js";
import { authorizeRoles } from "../middleware/authorize.js";

const router = express.Router();

// GET /api/users - Only accessible by admins
router.get("/", authenticateUser, authorizeRoles("admin"), fetchAllUsers);

export default router;
