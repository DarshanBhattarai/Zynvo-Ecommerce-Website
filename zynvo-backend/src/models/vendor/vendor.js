// models/Vendor.js
import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Moderator", // link to who reviewed the vendor
      default: null,
    },
    profile: {
      description: { type: String, trim: true },
      logoUrl: { type: String, trim: true },
      website: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
