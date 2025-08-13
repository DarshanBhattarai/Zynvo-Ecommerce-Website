// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import User from "../../../../models/Users/User.js"; // adjust path if needed

configDotenv();
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateUser = async (req, res, next) => {
  try {
    // 1️⃣ Get token from HTTP-only cookie
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "No token. Unauthorized." });
    }

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3️⃣ Fetch full user document from MongoDB
    const user = await User.findById(decoded.userId || decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4️⃣ Attach user to req
    req.user = user;                  // full Mongoose document
    req.user.id = user._id.toString(); // string version for old code
    req.user.userId = user._id;        // legacy support if old code used `userId`

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};
