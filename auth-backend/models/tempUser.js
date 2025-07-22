// models/TempUser.js
import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
      type: {
        type: String,
        enum: ["signup", "forgot-password", "2fa"],
        default: "signup",
      },
    },
  },
  { timestamps: true }
);

const TempUserModel = mongoose.model("TempUser", tempUserSchema);

export default TempUserModel;
