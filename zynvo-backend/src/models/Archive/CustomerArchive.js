import mongoose from "mongoose";

const customerArchiveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shippingAddress: { type: String, default: "" },
  wishlist: [{ type: String }],
  archivedAt: { type: Date, default: Date.now },
  archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who archived (optional)
});

const CustomerArchive = mongoose.model("CustomerArchive", customerArchiveSchema);
export default CustomerArchive;
