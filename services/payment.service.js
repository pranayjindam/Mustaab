// services/payment.service.js
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (amount) => {
  return await razorpay.orders.create({
    amount: Math.round(amount),
    currency: "INR",
    payment_capture: 1,
  });
};

export const verifyOrderPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const signatureData = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(signatureData)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};
