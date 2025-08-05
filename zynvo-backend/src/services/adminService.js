import bcrypt from "bcrypt";
import User from "../models/Users/User.js";

export const createAdminUserService = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Admin email and password must be set in environment variables"
    );
  }

  const adminExists = await User.findOne({ role: "admin" });
  if (adminExists) return;

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: "Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
    isVerified: true,
    provider: "email",
  });

  return "Admin user created";
};
