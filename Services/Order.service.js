import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/Order.model.js";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order & save order in DB
export const createOrderService = async (data, userId) => {
  try {
    const options = {
      amount: data.totalPrice, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newOrder = new Order({
      user: userId,
      orderItems: data.orderItems,
      shippingAddress: data.shippingAddress,
      paymentDetails: {
        paymentMethod: data.paymentMethod,
        paymentStatus: "pending",
      },
      totalPrice: data.totalPrice,
      orderStatus: "pending",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    return {
      status: 200,
      data: {
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order: newOrder,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        success: false,
        message: "Failed to create Razorpay order",
        error: error.message,
      },
    };
  }
};

// Verify Razorpay payment signature & update order
export const verifyAndPlaceOrderService = async (paymentData, userId) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

  if (!order) {
    return {
      status: 404,
      data: { success: false, message: "Order not found" },
    };
  }

  if (order.user.toString() !== userId.toString()) {
    return {
      status: 403,
      data: { success: false, message: "Unauthorized" },
    };
  }

  if (!isAuthentic) {
    order.paymentDetails.paymentStatus = "failed";
    order.orderStatus = "failed";
    await order.save();

    return {
      status: 400,
      data: { success: false, message: "Invalid payment signature" },
    };
  }

  // Successful payment update
  order.paymentDetails.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  await order.save();

  return {
    status: 200,
    data: {
      success: true,
      message: "Payment verified & order placed successfully",
      order,
    },
  };
};

// Get order by ID (user/admin)
export const getOrderByIdService = async (orderId, userId, isAdmin = false) => {
  const order = await Order.findById(orderId).populate("user", "name email");

  if (!order) {
    return { status: 404, data: { success: false, message: "Order not found" } };
  }

  if (!isAdmin && order.user.toString() !== userId.toString()) {
    return { status: 403, data: { success: false, message: "Unauthorized" } };
  }

  return { status: 200, data: { success: true, order } };
};

// Get all orders (admin: all, user: own orders)
export const getAllOrdersService = async (userId, isAdmin = false) => {
  try {
    let orders;
    if (isAdmin) {
      orders = await Order.find().populate("user", "name email");
    } else {
      orders = await Order.find({ user: userId }).populate("user", "name email");
    }

    return { status: 200, data: { success: true, orders } };
  } catch (error) {
    return { status: 500, data: { success: false, message: error.message } };
  }
};

// Update order status (admin only)
export const updateOrderStatusService = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return { status: 404, data: { success: false, message: "Order not found" } };
  }

  // Validate allowed status values
  const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled", "failed"];
  if (!allowedStatuses.includes(status)) {
    return { status: 400, data: { success: false, message: "Invalid status value" } };
  }

  order.orderStatus = status;
  await order.save();

  return { status: 200, data: { success: true, message: `Order status updated to ${status}`, order } };
};

// Cancel order (user/admin)
export const cancelOrderService = async (orderId, userId, isAdmin = false) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return { status: 404, data: { success: false, message: "Order not found" } };
  }

  if (!isAdmin && order.user.toString() !== userId.toString()) {
    return { status: 403, data: { success: false, message: "Unauthorized" } };
  }

  // Can only cancel pending or confirmed orders
  if (!["pending", "confirmed"].includes(order.orderStatus)) {
    return { status: 400, data: { success: false, message: "Order cannot be cancelled now" } };
  }

  order.orderStatus = "cancelled";
  await order.save();

  return { status: 200, data: { success: true, message: "Order cancelled successfully", order } };
};

// Delete order (user/admin)
export const deleteOrderService = async (orderId, userId, isAdmin = false) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return { status: 404, data: { success: false, message: "Order not found" } };
  }

  if (!isAdmin && order.user.toString() !== userId.toString()) {
    return { status: 403, data: { success: false, message: "Unauthorized" } };
  }

  await Order.deleteOne({ _id: orderId });

  return { status: 200, data: { success: true, message: "Order deleted successfully" } };
};
