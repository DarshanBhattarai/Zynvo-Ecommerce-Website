import dotenv from "dotenv";
import mongoose from "mongoose";
import { createAdminUser } from "../api/v1/auth/controllers/auth.Controller.js"; // Adjust the path as needed

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
      await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 20000, // 20s instead of 10s default
      });
    } catch (err) {
      console.error("Error creating admin user:", err);
    }
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

connectDB();

export default mongoose;
