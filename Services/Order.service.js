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


 cancelOrder : async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new Error("Order not found or unauthorized");

  // Update status in MongoDB
  order.status = "Cancelled";

  // Dynamically cancel shipment in Shiprocket if exists
  if (order.shiprocketOrderId) {
    try {
      await shipRocketService.cancelOrder(order.shiprocketOrderId);
      console.log("🚫 Shiprocket order cancelled successfully");
      // Clear Shiprocket fields
      order.shipmentId = undefined;
      order.shiprocketOrderId = undefined;
      order.awbCode = undefined;
    } catch (err) {
      console.error("⚠️ Failed to cancel Shiprocket order:", err.message);
      // You can choose to continue or throw error depending on your flow
    }
  }

  return await order.save();
},

  returnOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found or unauthorized");
    order.status = "Returned";
    return await order.save();
  },

  exchangeOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found or unauthorized");
    order.status = "Exchanged";
    return await order.save();
  },

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
