// controllers/orderController.js
import { orderService } from "../Services/Order.service.js";

export const orderController = {
  createOrder: async (req, res) => {
    try {
      const order = await orderService.createOrder({
        ...req.body,
        user: req.user._id,
      });
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getUserOrders: async (req, res) => {
    try {
      const orders = await orderService.getUserOrders(req.user._id);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const order = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status
      );
      res.json(order);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const order = await orderService.cancelOrder(
        req.params.id,
        req.user._id
      );
      res.json(order);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  returnOrder: async (req, res) => {
    try {
      const order = await orderService.returnOrder(
        req.params.id,
        req.user._id
      );
      res.json(order);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
