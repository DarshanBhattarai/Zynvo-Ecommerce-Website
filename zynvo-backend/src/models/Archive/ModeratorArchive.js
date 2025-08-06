import mongoose from "mongoose";

const moderatorArchiveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  storeName: { type: String, default: "" },
  storeAddress: { type: String, default: "" },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  archivedAt: { type: Date, default: Date.now },
  archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who archived (optional)
});

const ModeratorArchive = mongoose.model("ModeratorArchive", moderatorArchiveSchema);
export default ModeratorArchive;
