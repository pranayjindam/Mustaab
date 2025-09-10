// services/orderService.js
import  Order  from "../Models/Order.model.js";

export const orderService = {
  async createOrder(orderData) {
    const order = new Order(orderData);
    return await order.save();
  },

  async getUserOrders(userId) {
    return await Order.find({ user: userId }).populate("orderItems.product");
  },

  async getOrderById(id) {
    return await Order.findById(id).populate("orderItems.product user");
  },

  async getAllOrders() {
    return await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.product");
  },

  async updateOrderStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.orderStatus = status;
    return await order.save();
  },

  async cancelOrder(orderId, userId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.user.toString() !== userId.toString()) {
      throw new Error("Unauthorized");
    }

    order.orderStatus = "cancelled";
    return await order.save();
  },

  async returnOrder(orderId, userId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.user.toString() !== userId.toString()) {
      throw new Error("Unauthorized");
    }

    order.orderStatus = "returned";
    return await order.save();
  },
};
