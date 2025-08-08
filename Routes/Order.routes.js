import express from "express";
import {
  createOrder,
  verifyAndPlaceOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} from "../controllers/Order.controller.js";

import { AuthenticateUser, AuthenticateAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Client routes - must be authenticated user
router.post("/", AuthenticateUser, createOrder);               // Create order
router.post("/verify", AuthenticateUser, verifyAndPlaceOrder); // Verify payment & place order
router.get("/:orderId", AuthenticateUser, getOrderById);       // Get order details
router.get("/", AuthenticateUser, getAllOrders);               // Get user's orders

router.patch("/:orderId/cancel", AuthenticateUser, cancelOrder); // Cancel own order
router.delete("/:orderId", AuthenticateUser, deleteOrder);       // Delete own order

// Admin routes - protected with admin middleware
router.get("/admin/all", AuthenticateAdmin, getAllOrders);         // Get all orders from all users
router.patch("/admin/:orderId/status", AuthenticateAdmin, updateOrderStatus); // Update order status by admin
router.delete("/admin/:orderId", AuthenticateAdmin, deleteOrder);  // Delete any order by admin

export default router;
