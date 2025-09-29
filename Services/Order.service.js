import Order from "../Models/Order.model.js";

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

  cancelOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found or unauthorized");
    order.status = "Cancelled";
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
