import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
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
    paymentMethod: {
      type: String, // "Razorpay" | "COD"
      required: true,
    },
    paymentResult: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Dispatched",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

 const Order = mongoose.model("Order", orderSchema);
 export default Order;
