// Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shippingAddress: { type: String, default: "" },
  wishlist: [{ type: String }],
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
