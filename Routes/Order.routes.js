import express from "express";
import { orderController } from "../Controllers/Order.controller.js";
import { AuthenticateUser, AuthenticateAdmin } from "../middlewares/auth.js";

const orderRouter = express.Router();

orderRouter.post("/", AuthenticateUser, orderController.createOrder);
orderRouter.post("/verify", AuthenticateUser, orderController.verifyPayment);
orderRouter.get("/myorders", AuthenticateUser, orderController.getUserOrders);
orderRouter.get("/:id", AuthenticateUser, orderController.getOrderById);
orderRouter.put("/:id/cancel", AuthenticateUser, orderController.cancelOrder);
orderRouter.put("/:id/return", AuthenticateUser, orderController.returnOrder);
orderRouter.get("/", AuthenticateAdmin, orderController.getAllOrders);
orderRouter.put("/:id/status", AuthenticateAdmin, orderController.updateOrderStatus);

export default orderRouter;
