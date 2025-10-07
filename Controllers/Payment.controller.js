// controllers/payment.controller.js
import { paymentService } from "../Services/Payment.service.js";

export const paymentController = {
  createOrder: async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount) return res.status(400).json({ message: "Amount is required" });

      const order = await paymentService.createRazorpayOrder(amount);
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, shippingAddress } = req.body;

      const valid = await paymentService.verifyRazorpayPayment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      if (!valid) return res.status(400).json({ message: "Payment verification failed" });

      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      const order = await paymentService.recordPayment(
        null,
        { razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
        items,
        req.user._id,
        shippingAddress,
        totalPrice
      );

      res.json({ success: true, order });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
};
