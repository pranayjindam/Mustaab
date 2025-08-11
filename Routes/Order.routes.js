import express from "express";
import {
  createOrder,
  verifyAndPlaceOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} from "../Controllers/Order.controller.js";

import { AuthenticateUser, AuthenticateAdmin } from "../Middlewares/auth.js";

const router = express.Router();

// Admin routes first
router.get("/admin/all", AuthenticateAdmin, getAllOrders);
router.patch("/admin/:orderId/status", AuthenticateAdmin, updateOrderStatus);
router.delete("/admin/:orderId", AuthenticateAdmin, deleteOrder);

// Client routes after fixed admin routes
router.get("/", AuthenticateUser, getAllOrders);
router.get("/:orderId", AuthenticateUser, getOrderById);
router.post("/", AuthenticateUser, createOrder);
router.post("/verify", AuthenticateUser, verifyAndPlaceOrder);
router.patch("/:orderId/cancel", AuthenticateUser, cancelOrder);
router.delete("/:orderId", AuthenticateUser, deleteOrder);

export default router;
