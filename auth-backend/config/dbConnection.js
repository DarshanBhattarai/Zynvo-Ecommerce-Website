import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import { createAdminUser } from "../controllers/auth.Controller.js";
configDotenv();

const DB_URL = process.env.DB_URL;

console.log("Connecting to database:", DB_URL);

mongoose
  .connect(DB_URL)
  .then(async () => {
    console.log("Database connected successfully");
    await createAdminUser();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

export default mongoose;
