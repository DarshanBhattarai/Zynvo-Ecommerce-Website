import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      required: false,
    }, // ✅ Role for RBAC
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },

    // ✅ Auth Provider (email, google, github)
    provider: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
      verified: { type: Boolean, default: false },
      type: {
        type: String,
        enum: ["signup", "forgot-password", "2fa"],
        default: "signup",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
