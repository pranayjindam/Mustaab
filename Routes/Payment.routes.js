// routes/payment.routes.js
import express from "express";
import { paymentController } from "../Controllers/Payment.controller.js";
import { AuthenticateUser } from "../Middlewares/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", AuthenticateUser, paymentController.createOrder);
paymentRouter.post("/verify", AuthenticateUser, paymentController.verifyPayment);

export default paymentRouter;
