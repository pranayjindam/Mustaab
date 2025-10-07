import express from "express";
import { orderController } from "../Controllers/Order.controller.js";
import { AuthenticateUser, AuthenticateAdmin } from "../Middlewares/auth.js";

const orderRouter = express.Router();

// ------------------------------
// User Routes
// ------------------------------
orderRouter.post("/", AuthenticateUser, orderController.createOrder);

// Razorpay payment routes
orderRouter.post("/razorpay/create", AuthenticateUser, orderController.createRazorpayOrder);
orderRouter.post("/razorpay/verify", AuthenticateUser, orderController.verifyRazorpayPayment);

// User order management
orderRouter.get("/myorders", AuthenticateUser, orderController.getUserOrders);
orderRouter.get("/returns", AuthenticateUser, orderController.getUserReturnRequests);
orderRouter.get("/:id", AuthenticateUser, orderController.getOrderById);
orderRouter.put("/:id/cancel", AuthenticateUser, orderController.cancelOrder);
orderRouter.put("/:id/return", AuthenticateUser, orderController.returnOrder);
orderRouter.put("/:id/exchange", AuthenticateUser, orderController.exchangeOrder);
// Routes/order.routes.js
orderRouter.get("/:id/track", AuthenticateUser, orderController.trackShipment);

// ------------------------------
// Admin Routes
// ------------------------------
orderRouter.get("/", AuthenticateAdmin, orderController.getAllOrders);
orderRouter.put("/:id/status", AuthenticateAdmin, orderController.updateOrderStatus);
orderRouter.post("/cod/request-otp", orderController.codRequestOtp);
orderRouter.post("/cod/verify-otp", AuthenticateUser, orderController.codVerifyOtp);
// Handle return requests
orderRouter.put("/return/:id", AuthenticateAdmin, orderController.handleReturnRequest);

export default orderRouter;
