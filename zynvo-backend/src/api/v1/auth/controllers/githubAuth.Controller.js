// githubController.js (or wherever your GitHub handlers are)

import axios from "axios";
import jwt from "jsonwebtoken";
import UserModel from "../../../../models/Users/User.js";
import asyncHandler from "../../../../utils/asyncHandler.js";
import logger from "../../../../utils/logger.js";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI =
  process.env.REDIRECT_URI || "http://localhost:5000/api/auth/github/callback";

export const githubAuthRedirect = (req, res) => {
  logger.info("Redirecting to GitHub OAuth login");
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user&prompt=consent`;
  res.redirect(githubAuthUrl);
};

export const githubCallback = asyncHandler(async (req, res) => {
  try {
    const { code } = req.query;
    logger.info("Received GitHub OAuth callback with code");

    // Exchange code for access token
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

    // Fetch user profile
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let { login, avatar_url, email, name } = userRes.data;

    // If email not provided, fetch primary verified email
    if (!email) {
      const emailRes = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      email = emailRes.data.find((e) => e.primary && e.verified)?.email;
    }

    if (!email) {
      logger.warn("GitHub email not found or verified");
      return res
        .status(400)
        .json({ message: "Unable to retrieve GitHub email." });
    }

    logger.info(`GitHub email retrieved: ${email}`);

    // Find or create user
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        name: name || login,
        email,
        image: avatar_url,
        isVerified: true,
        provider: "github",
        role: "user",
      });
      logger.info(`Created new user from GitHub login: ${email}`);
    } else {
      logger.info(`Existing user logged in via GitHub: ${email}`);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIMEOUT || "7d" }
    );

    logger.info(`JWT generated for user: ${email}`);

    // Set token in HTTP-only cookie (like Google login)
    const cookieExpiry = 30 * 24 * 60 * 60 * 1000; // 30 days
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: cookieExpiry,
      sameSite: "lax",
      path: "/",
    });

    // Redirect frontend WITHOUT token/user info in URL
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173/login");
    logger.info(`Redirected user ${email} to frontend login page`);
  } catch (error) {
    logger.error("GitHub OAuth error:", error.message);
    res.status(500).json({ message: "GitHub authentication failed." });
  }
});
