import express from "express";
import { orderController } from "../Controllers/Order.controller.js";
import { AuthenticateUser, AuthenticateAdmin } from "../Middlewares/auth.js";

const orderRouter = express.Router();

// User routes
orderRouter.post("/", AuthenticateUser, orderController.createOrder);
orderRouter.post("/razorpay/create", AuthenticateUser, orderController.createRazorpayOrder);
orderRouter.post("/razorpay/verify", AuthenticateUser, orderController.verifyRazorpayPayment);
orderRouter.get("/myorders", AuthenticateUser, orderController.getUserOrders);
orderRouter.get("/:id", AuthenticateUser, orderController.getOrderById);
orderRouter.put("/:id/cancel", AuthenticateUser, orderController.cancelOrder);
orderRouter.put("/:id/return", AuthenticateUser, orderController.returnOrder);
orderRouter.put("/:id/exchange", AuthenticateUser, orderController.exchangeOrder);

// Admin routes
orderRouter.get("/", AuthenticateAdmin, orderController.getAllOrders);
orderRouter.put("/:id/status", AuthenticateAdmin, orderController.updateOrderStatus);

export default orderRouter;
