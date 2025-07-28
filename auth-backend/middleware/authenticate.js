// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateUser = (req, res, next) => {
  try {
    // ✅ Get token from HTTP-only cookie
    const token = req.cookies?.token;

    if (!token) {
      console.log("No token");

      return res.status(401).json({ message: "No token. Unauthorized." });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // Attach user info
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
