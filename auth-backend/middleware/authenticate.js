// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv(); 

const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);

export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token. Unauthorized." });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "


    const decoded = jwt.verify(token, JWT_SECRET);
    

    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
