import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
      phoneNumber: String,
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled", "Returned", "Exchanged"],
      default: "Pending",
    },

    // ✅ Extra fields inside schema
    shipmentId: { type: String }, 
    shiprocketOrderId: { type: String }, 
    awbCode: { type: String },
  },
  { timestamps: true } // ✅ second argument only options
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
