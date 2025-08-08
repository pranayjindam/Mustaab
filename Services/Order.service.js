import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../Models/Order.model.js";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Creates a Razorpay order from request data and saves in DB
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, userId, items } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount, // amount should be in paise (number)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Save order in DB with razorpayOrderId and status 'created'
    const newOrder = new Order({
      user: userId,
      razorpayOrderId: razorpayOrder.id,  // fixed variable here
      amount: amount,
      currency: options.currency,
      status: "created",
      items: items || [], // if you want to save items too
    });

    await newOrder.save();

    return res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err);
    res.status(500).json({ success: false, message: "Failed to create order", error: err.message });
  }
};

// Service version for server-side usage (e.g. from controller)
export const createOrderService = async (data, userId) => {
  try {
    const options = {
      amount: data.amount, // in paise
      currency: "INR",
      receipt: `rcptid_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    const newOrder = new Order({
      user: userId,
      razorpayOrderId: order.id,
      amount: data.amount,
      currency: order.currency,
      status: "created",
      items: data.items || [],
    });

    await newOrder.save();

    return {
      status: 200,
      data: {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { success: false, message: "Failed to create Razorpay order", error: error.message },
    };
  }
};

// Verifies Razorpay payment signature & updates order status
export const verifyAndPlaceOrderService = async (paymentData, userId) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  // Generate expected signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

  if (!order) {
    return {
      status: 404,
      data: { success: false, message: "Order not found in DB" },
    };
  }

  if (!isAuthentic) {
    order.status = "failed";
    await order.save();

    return {
      status: 400,
      data: { success: false, message: "Invalid signature, payment verification failed" },
    };
  }

  // Successful payment
  order.status = "completed";
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  await order.save();

  return {
    status: 200,
    data: {
      success: true,
      message: "Payment verified & order placed successfully",
      orderId: order._id,
    },
  };
};

// Fetch order by its DB id, with user info populated
export const getOrderByIdService = async (orderId) => {
  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) {
    return {
      status: 404,
      data: { success: false, message: "Order not found" },
    };
  }

  return {
    status: 200,
    data: { success: true, order },
  };
};


export const getAllOrdersService = async () => {
  try {
    const orders = await Order.find().populate("user", "name email");
    return {
      status: 200,
      data: { success: true, orders },
    };
  } catch (error) {
    return {
      status: 500,
      data: { success: false, message: "Failed to fetch orders", error: error.message },
    };
  }
};
