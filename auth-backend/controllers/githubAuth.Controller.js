import axios from "axios";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../utils/logger.js"; // import your logger

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const REDIRECT_URI = "http://localhost:5000/api/auth/github/callback";

// 🔁 GitHub Redirect
export const githubAuthRedirect = (req, res) => {
  logger.info("Redirecting to GitHub OAuth login");
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user&prompt=consent`;
  res.redirect(githubAuthUrl);
};

// ✅ GitHub Callback Handler (with asyncHandler)
export const githubCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  logger.info("Received GitHub OAuth callback with code");

  // Step 1: Exchange code for access token
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    },
    {
      headers: { Accept: "application/json" },
    }
  );

  const accessToken = tokenRes.data.access_token;
  logger.info("Obtained GitHub access token");

  // Step 2: Fetch user profile
  const userRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { login, avatar_url, email, name } = userRes.data;

  // Step 3: Get primary email if not present
  let userEmail = email;
  if (!userEmail) {
    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    userEmail = emailRes.data.find((e) => e.primary && e.verified)?.email;
  }

  if (!userEmail) {
    logger.warn("GitHub email not found or verified");
    res.status(400).json({ message: "Unable to retrieve GitHub email." });
    return;
  }

  logger.info(`GitHub email retrieved: ${userEmail}`);

  // Step 4: Find or create user
  let user = await UserModel.findOne({ email: userEmail });
  if (!user) {
    user = await UserModel.create({
      name: name || login,
      email: userEmail,
      image: avatar_url,
      isVerified: true,
      provider: "github",
      role: "user", // Default role
    });
    logger.info(`Created new user from GitHub login: ${userEmail}`);
  } else {
    logger.info(`Existing user logged in via GitHub: ${userEmail}`);
  }

  // Step 5: Generate JWT
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_TIMEOUT || "7d",
    }
  );

  logger.info(`JWT generated for user: ${userEmail}`);

  // Step 6: Redirect to frontend
  res.redirect(
    `http://localhost:5173/login?token=${token}&name=${encodeURIComponent(
      user.name
    )}&email=${encodeURIComponent(user.email)}&image=${encodeURIComponent(user.image)}&isVerified=${user.isVerified}&role=${user.role}`
  );
  logger.info(`Redirected user ${userEmail} to frontend login with token`);
});
