import axios from "axios";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const REDIRECT_URI = "http://localhost:5000/api/auth/github/callback";

// 🔁 GitHub Redirect
export const githubAuthRedirect = (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user&prompt=consent`;
  res.redirect(githubAuthUrl);
};

// ✅ GitHub Callback Handler (with asyncHandler)
export const githubCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

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
    res.status(400).json({ message: "Unable to retrieve GitHub email." });
    return;
  }

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
  }

  // Step 5: Generate JWT
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_TIMEOUT || "7d",
    }
  );

  // Step 6: Redirect to frontend
  res.redirect(
    `http://localhost:5173/login?token=${token}&name=${encodeURIComponent(
      user.name
    )}&email=${encodeURIComponent(user.email)}&image=${encodeURIComponent(user.image)}&isVerified=${user.isVerified}&role=${user.role}`
  );
});
