import crypto from "crypto";
import Razorpay from "razorpay";

import Order from "../Models/Order.model.js";
import { orderService } from "../Services/Order.service.js";
import { shipRocketService } from "../Services/ShipRocket.service.js";
import { notificationService } from "../Services/Notification.service.js";

/* ================= RAZORPAY INIT ================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= CONTROLLER ================= */

const orderController = {
  /* ---------- COD / NORMAL ORDER ---------- */
  createOrder: async (req, res) => {
    try {
      const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

      if (!orderItems?.length) {
        return res.status(400).json({ message: "No order items" });
      }

      const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });

      // 🔔 Notify user (non-blocking)
      notificationService
        .notifyUser(
          req.user,
          "Order Placed Successfully",
          notificationService.templates.ORDER_PLACED(order._id)
        )
        .catch(() => {});

      // 🚚 Shiprocket
      try {
        const shipRes = await shipRocketService.createOrder(order);

        order.shipping = {
          provider: "shiprocket",
          shiprocketOrderId: shipRes.order_id,
          awb: shipRes.awb_code,
          courier: shipRes.courier_name,
        };
        order.awbCode = shipRes.awb_code;

        await order.save();
      } catch (e) {
        console.error("❌ Shiprocket error:", e.response?.data || e.message);
      }

      return res.status(201).json(order);
    } catch (err) {
      console.error("Create order error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  /* ---------- CREATE RAZORPAY ORDER ---------- */
  createRazorpayOrder: async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const order = await razorpay.orders.create({
        amount: Number(amount),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  /* ---------- VERIFY RAZORPAY PAYMENT ---------- */
  verifyRazorpayPayment: async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        items,
        shippingAddress,
      } = req.body;

      const body = `${razorpay_order_id}|${razorpay_payment_id}`;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Payment verification failed" });
      }

      const totalPrice = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      const order = await orderService.createOrder({
        orderItems: items,
        shippingAddress,
        paymentMethod: "Razorpay",
        totalPrice,
        user: req.user._id,
        isPaid: true,
        paidAt: new Date(),
      });

      // 🚚 Shiprocket async
      setTimeout(async () => {
        try {
          const shipRes = await shipRocketService.createOrder(order);

          order.shipping = {
            provider: "shiprocket",
            shiprocketOrderId: shipRes.order_id,
            awb: shipRes.awb_code,
            courier: shipRes.courier_name,
          };
          order.awbCode = shipRes.awb_code;

          await order.save();
        } catch (e) {
          console.error("❌ Shiprocket async error:", e.message);
        }
      }, 0);

      res.json({ success: true, order });
    } catch (err) {
      res.status(500).json({ message: "Payment verification failed" });
    }
  },

  /* ---------- TRACK SHIPMENT ---------- */
  trackShipment: async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order?.awbCode) {
      return res.status(404).json({ message: "AWB not found" });
    }

    const tracking = await shipRocketService.trackOrder(order.awbCode);
    res.json(tracking);
  },

  /* ---------- OTHERS ---------- */
  getUserOrders: async (req, res) =>
    res.json(await orderService.getUserOrders(req.user._id)),

  getOrderById: async (req, res) =>
    res.json(await orderService.getOrderById(req.params.id)),

  getAllOrders: async (req, res) =>
    res.json(await orderService.getAllOrders()),

  cancelOrder: async (req, res) =>
    res.json(await orderService.cancelOrder(req.params.id, req.user._id)),

  updateOrderStatus: async (req, res) =>
    res.json(
      await orderService.updateOrderStatus(req.params.id, req.body.status)
    ),
};

export default orderController;
