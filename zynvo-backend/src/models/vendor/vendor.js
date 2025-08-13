// models/Vendor.js
import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true, trim: true },
    storeTagline: { type: String, trim: true },
    storeType: { type: String, required: true, enum: ["online", "physical", "both"] },
    logo: { type: String, required: true }, // Will store file URL or path
    description: { type: String, required: true },
    category: { type: String, required: true },

    contactEmail: { type: String, required: true, lowercase: true },
    phoneNumber: { type: String, required: true },

    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },

    website: { type: String },
    taxId: { type: String, required: true },
    businessRegistrationNumber: { type: String, required: true },
    yearsInBusiness: { type: Number },
    paymentMethod: { type: String, required: true },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
