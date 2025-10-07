import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

  type: { type: String, enum: ["return", "exchange"], required: true }, // ✅ single model
  reason: { type: String, required: true },
  images: [{ type: String }], // optional, for defect/wrong item proof

  // Only used if it's an exchange
  newVariant: {
    size: { type: String },
    color: { type: String },
  },

  pickupAddress: { type: String }, // ✅ added pickup address

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  adminNote: { type: String }, // optional feedback from admin

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("ReturnRequest", returnRequestSchema);
