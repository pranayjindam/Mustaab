import express from "express";
import {createOrder,captureOrder} from "../controllers/payment.controller.js";
import { AuthenticateUser } from "../middlewares/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", AuthenticateUser, createOrder);
paymentRouter.post("/capture-order", AuthenticateUser, captureOrder);

export default paymentRouter;
