import express from "express";
import {
  createRazorpayOrder,
  placeOrder,
  getAllOrders,
} from "../Controllers/Order.controller.js"

const orderRouter = express.Router();
orderRouter.post("/create-razorpay-order", createRazorpayOrder);
orderRouter.post("/place-order", placeOrder);
orderRouter.get("/all", getAllOrders);

export default orderRouter;
