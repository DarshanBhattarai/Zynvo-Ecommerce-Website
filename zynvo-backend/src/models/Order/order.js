import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String }, // URL of product image
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Moderator",
      required: true, // Track which vendor is fulfilling this item
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Credit Card", "Debit Card", "PayPal", "Stripe", "Other"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",      // Order placed, awaiting confirmation
        "processing",   // Vendor preparing items
        "shipped",      // Items shipped
        "delivered",    // Order completed
        "cancelled",    // Order cancelled
        "refunded",     // Refund issued
      ],
      default: "pending",
    },

    subtotal: { type: Number, required: true }, // sum of all item prices * qty
    tax: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }, // subtotal + tax + shipping

    trackingNumber: { type: String }, // For shipped orders
    deliveryDate: { type: Date },

    notes: { type: String }, // Optional order notes by customer

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
