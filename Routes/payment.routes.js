// routes/paymentRoutes.js
import express from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyPayment);
export default router;
