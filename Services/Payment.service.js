// services/paymentService.js
import Razorpay from "razorpay";
import crypto from "crypto";
import { orderService } from "./Order.service.js";
import Payment from "../Models/Payment.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const paymentService = {
  async createRazorpayOrder(amount) {
    return await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
  },

  async verifyRazorpayPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    return generated_signature === razorpay_signature;
  },

  async recordPayment(orderId, paymentResult, items, userId, shippingAddress, totalPrice) {
    const order = await orderService.createOrder({
      user: userId,
      orderItems: items.map((i) => ({
        product: i._id || i.product,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
      })),
      shippingAddress,
      paymentMethod: "Razorpay",
      paymentResult,
      totalPrice,
    });

    await Payment.create({
      orderId: order._id,
      ...paymentResult,
      amount: totalPrice,
      paymentStatus: "success",
    });

    return order;
  },
};
