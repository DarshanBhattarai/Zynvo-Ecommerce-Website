import dotenv from "dotenv";
import mongoose from "mongoose";
import { createAdminUser } from "../controllers/auth.Controller.js";

dotenv.config();

const DB_URL = process.env.DB_URL;

console.log("Connecting to database:", DB_URL);

async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database connected successfully");

    try {
      await createAdminUser();
      console.log("Admin user checked/created successfully");
    } catch (err) {
      console.error("Error creating admin user:", err);
    }
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

connectDB();

export default mongoose;
