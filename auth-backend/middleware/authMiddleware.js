// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token. Unauthorized." });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info (e.g. id/email) to request
    req.user = decoded;

    next(); // Move to the next middleware or route
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
