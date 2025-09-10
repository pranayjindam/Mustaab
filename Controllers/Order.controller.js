import { orderService } from "../services/order.service.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const orderController = {
createOrder: async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, paymentResult } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: "No items provided" });

    if (!shippingAddress) return res.status(400).json({ message: "Address missing" });

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderData = {
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentResult: paymentMethod === "COD" ? {} : paymentResult || {},
    };

    const order = await orderService.createOrder(orderData);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
,

  verifyPayment: async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, addressId } =
        req.body;

      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generated_signature !== razorpay_signature)
        return res.status(400).json({ message: "Payment verification failed" });

      const order = await orderService.createOrder({
        user: req.user._id,
        orderItems: items,
        shippingAddress: addressId,
        paymentMethod: "Razorpay",
        paymentResult: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      });

      res.json({ order });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getUserOrders: async (req, res) => {
    const orders = await orderService.getUserOrders(req.user._id);
    res.json({ orders });
  },

  getOrderById: async (req, res) => {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  },

  cancelOrder: async (req, res) => {
    const order = await orderService.cancelOrder(req.params.id, req.user._id);
    res.json({ order });
  },

  returnOrder: async (req, res) => {
    const order = await orderService.returnOrder(req.params.id, req.user._id);
    res.json({ order });
  },

  getAllOrders: async (req, res) => {
    const orders = await orderService.getAllOrders();
    res.json({ orders });
  },

  updateOrderStatus: async (req, res) => {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.json({ order });
  },
};
