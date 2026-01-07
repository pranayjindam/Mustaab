// server/Services/Order.service.js
import Order from "../Models/Order.model.js";
import { shipRocketService } from "./ShipRocket.service.js";

export const orderService = {
  createOrder: async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
  },

  getUserOrders: async (userId) => {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  },

  getOrderById: async (orderId) => {
    return await Order.findById(orderId);
  },

  /* ---------- CANCEL ORDER ---------- */
  cancelOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found or unauthorized");

    order.status = "Cancelled";

    const shiprocketOrderId = order.shipping?.shiprocketOrderId || null;

    if (shiprocketOrderId) {
      try {
        const resp = await shipRocketService.cancelOrder(shiprocketOrderId);
        console.log("🚫 Shiprocket cancel response:", resp);

        // Clear shipping data
        order.shipping = undefined;
        order.awbCode = undefined;
      } catch (err) {
        console.error(
          "⚠️ Failed to cancel Shiprocket order:",
          err.response?.data || err.message
        );
      }
    }

    return await order.save();
  },

  /* ---------- RETURN ORDER ---------- */
  returnOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found or unauthorized");
    order.status = "Returned";
    return await order.save();
  },

  /* ---------- EXCHANGE ORDER ---------- */
  exchangeOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found or unauthorized");
    order.status = "Exchanged";
    return await order.save();
  },

  /* ---------- ADMIN STATUS UPDATE ---------- */
  updateOrderStatus: async (orderId, status) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    order.status = status;
    return await order.save();
  },

  getAllOrders: async () => {
    return await Order.find().sort({ createdAt: -1 });
  },
};

export default orderService;
