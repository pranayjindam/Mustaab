import express from "express";
import {
  createRazorpayOrder,
  placeOrder,
  getAllOrders,
<<<<<<< HEAD
} from "../Controllers/Order.controller.js"
=======
} from "../Controllers/Order.controller.js";
>>>>>>> ae01988fa703a8c36b02c0c607b0af575faa7afd

const orderRouter = express.Router();
orderRouter.post("/create-razorpay-order", createRazorpayOrder);
orderRouter.post("/place-order", placeOrder);
orderRouter.get("/all", getAllOrders);

export default orderRouter;
