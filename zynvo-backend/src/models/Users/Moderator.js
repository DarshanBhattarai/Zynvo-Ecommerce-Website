// Moderator.js
import mongoose from "mongoose";

const moderatorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  storeName: { type: String, default: "" },
  storeAddress: { type: String, default: "" },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Moderator = mongoose.model("Moderator", moderatorSchema);
export default Moderator;
