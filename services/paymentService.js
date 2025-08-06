// services/paymentService.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (amount, currency = 'INR', receipt = `receipt_${Date.now()}`) => {
  if (!amount || typeof amount !== 'number') {
    throw new Error('Invalid amount provided for Razorpay order');
  }

  const options = {
    amount: Math.round(amount), // must be in paise
    currency,
    receipt,
  };

  return await razorpayInstance.orders.create(options);
};

export const verifyOrderPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const sign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  return sign === razorpay_signature;
};
