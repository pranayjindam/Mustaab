import express from "express";
import  orderController  from "../Controllers/Order.controller.js";
import { AuthenticateUser, AuthenticateAdmin } from "../Middlewares/auth.js";

const orderRouter = express.Router();

// -------- USER --------
orderRouter.post("/", AuthenticateUser, orderController.createOrder);

orderRouter.post("/razorpay/create", AuthenticateUser, orderController.createRazorpayOrder);
orderRouter.post("/razorpay/verify", AuthenticateUser, orderController.verifyRazorpayPayment);

orderRouter.get("/myorders", AuthenticateUser, orderController.getUserOrders);

// ⚠️ specific BEFORE generic
orderRouter.get("/:id/track", AuthenticateUser, orderController.trackShipment);

orderRouter.get("/:id", AuthenticateUser, orderController.getOrderById);
orderRouter.put("/:id/cancel", AuthenticateUser, orderController.cancelOrder);

// -------- ADMIN --------
orderRouter.get("/", AuthenticateAdmin, orderController.getAllOrders);
orderRouter.put("/:id/status", AuthenticateAdmin, orderController.updateOrderStatus);

export default orderRouter;
