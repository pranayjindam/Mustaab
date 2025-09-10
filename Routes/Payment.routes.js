// routes/payment.routes.js
import express from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { AuthenticateUser } from "../middlewares/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", AuthenticateUser, paymentController.createOrder);
paymentRouter.post("/verify", AuthenticateUser, paymentController.verifyPayment);

export default paymentRouter;
