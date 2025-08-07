// controllers/paymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../Models/order.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, userId, orderItems, shippingAddress, paymentDetails, orderStatus } = req.body;

    if (!amount || !userId || !orderItems || !shippingAddress) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const payment_capture = 1;
    const currency = "INR";

    const options = {
      amount: amount, // in paisa
      currency,
      receipt: `receipt_order_${Date.now()}`,
      payment_capture,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
      totalPrice: amount / 100, // convert paisa to rupee
      paymentDetails,
      orderStatus,
      createdAt: new Date(),
      razorpay_order_id: razorpayOrder.id, // important
    });

    res.status(201).json({ success: true, razorpayOrder, order: newOrder });

  } catch (err) {
    console.error("CREATE_ORDER_ERROR:", err); // log full error
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

import dotenv from "dotenv";

dotenv.config(); // load environment variables

export const verifyPayment = async (req, res) => {
  try {
    console.log("🔍 Received payment verification request");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Step 1: Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.warn("⚠️ Missing one or more required fields", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Step 2: Load secret from env
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("❌ Razorpay secret key is not set in environment variables.");
      return res.status(500).json({ message: "Razorpay secret key is missing" });
    }

    // Step 3: Construct signature string
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    console.log("🔐 Constructed sign string:", sign);

    // Step 4: Generate expected signature using HMAC SHA256
    let expectedSignature;
    try {
      expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(sign)
        .digest("hex");
      console.log("✅ Expected Signature:", expectedSignature);
    } catch (cryptoError) {
      console.error("❌ Error while generating HMAC signature:", cryptoError);
      return res.status(500).json({ message: "HMAC generation failed", error: cryptoError.message });
    }

    // Step 5: Compare signatures
    const isValid = expectedSignature === razorpay_signature;
    console.log("🔍 Signature Match:", isValid);

    if (isValid) {
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      console.warn("❌ Signature mismatch", {
        received: razorpay_signature,
        expected: expectedSignature,
      });
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("💥 Error in verifyPayment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


