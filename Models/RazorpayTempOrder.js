// models/RazorpayTempOrder.js
import mongoose from "mongoose";

const RazorpayTempOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RazorpayTempOrder", RazorpayTempOrderSchema);
