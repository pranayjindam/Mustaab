import Razorpay from "razorpay";
import Order from "../Models/Order.model.js";
import Cart from "../Models/Cart.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createRazorpayOrder = async (amount) => {
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
  });
  return order;
};

export const captureOrder = async ({ orderId, paymentId, userId, cartItems, addressId }) => {
  const newOrder = await Order.create({
    user: userId,
    orderItems: cartItems,
    address: addressId,
    paymentInfo: { orderId, paymentId, status: "Paid" },
    status: "Placed",
  });

  await Cart.deleteOne({ user: userId });
  return newOrder;
};
