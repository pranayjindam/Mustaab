import Order from "../Models/Order.model.js";
import ReturnRequest from "../Models/ReturnRequest.model.js";
import { orderService } from "../Services/Order.service.js";
import { shipRocketService } from "../Services/ShipRocket.service.js";
import { sendOTP, verifyOTP } from "../Services/Otp.service.js";  // ✅ Twilio OTP service
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const orderController = {
  // ------------------------------
  // Create Normal Order (COD / Prepaid)
  // ------------------------------
  createOrder: async (req, res) => {
    try {
      const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
      console.log("Create Order request received");

      if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: "No order items provided" });
      }

      const order = await orderService.createOrder({
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        user: req.user._id,
      });

      console.log("✅ Order created:", order._id);

      // 2️⃣ Create shipment in Shiprocket
      try {
        const shipment = await shipRocketService.createOrder(order);
        console.log("✅ Shiprocket response:", shipment);

        order.shipmentId = shipment.shipment_id;
        order.shiprocketOrderId = shipment.order_id;
        order.awbCode = shipment.awb_code;
        await order.save();

        console.log("Order updated with Shiprocket info:", {
          shipmentId: order.shipmentId,
          shiprocketOrderId: order.shiprocketOrderId,
          awbCode: order.awbCode,
        });
      } catch (err) {
        console.error("⚠️ Shiprocket order creation failed:", err.message);
      }

      res.status(201).json(order);
    } catch (err) {
      console.error("❌ Create order error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Create Razorpay Order
  // ------------------------------
  createRazorpayOrder: async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const options = {
        amount: Number(amount),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (err) {
      console.error("❌ Razorpay create order error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Verify Razorpay Payment + Create DB Order + Shiprocket
  // ------------------------------
  verifyRazorpayPayment: async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        items,
        shippingAddress,
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: "Missing payment details" });
      }

      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      const order = await orderService.createOrder({
        orderItems: items,
        shippingAddress,
        paymentMethod: "Razorpay",
        paymentResult: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        totalPrice,
        user: req.user._id,
      });

      console.log("✅ Order created with Razorpay payment:", order._id);

      // Shiprocket integration
      try {
        const shiprocketRes = await shipRocketService.createOrder(order);
        order.shipmentId = shiprocketRes.shipment_id;
        order.shiprocketOrderId = shiprocketRes.order_id;
        order.awbCode = shiprocketRes.awb_code;
        await order.save();
      } catch (err) {
        console.error("⚠️ Shiprocket creation failed:", err.message);
      }

      res.json({ success: true, order });
    } catch (err) {
      console.error("❌ Razorpay verify error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // ------------------------------
  // 🔹 COD OTP Request
  // ------------------------------
  codRequestOtp: async (req, res) => {
    try {
      const { mobile } = req.body;
      if (!mobile) return res.status(400).json({ success: false, message: "Mobile number required" });

      const result = await sendOTP(mobile);
      res.status(200).json(result);
    } catch (err) {
      console.error("❌ COD OTP send error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // ------------------------------
  // 🔹 COD OTP Verification + Place Order
  // ------------------------------
  codVerifyOtp: async (req, res) => {
    try {
      const { mobile, otp, orderItems, shippingAddress, totalPrice } = req.body;
      if (!mobile || !otp) return res.status(400).json({ message: "Missing OTP or mobile" });

      const verified = await verifyOTP(mobile, otp);
      if (!verified.success)
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

      // ✅ OTP verified — create order
      const order = await orderService.createOrder({
        orderItems,
        shippingAddress,
        paymentMethod: "COD",
        totalPrice,
        user: req.user._id,
      });

      // ✅ Create Shiprocket order
      try {
        const shipment = await shipRocketService.createOrder(order);
        order.shipmentId = shipment.shipment_id;
        order.shiprocketOrderId = shipment.order_id;
        order.awbCode = shipment.awb_code;
        await order.save();
      } catch (err) {
        console.error("⚠️ Shiprocket COD creation failed:", err.message);
      }

      res.status(201).json({ success: true, message: "COD order placed", order });
    } catch (err) {
      console.error("❌ COD Verify error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // ------------------------------
  // Track Shipment
  // ------------------------------
  trackShipment: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order || !order.awbCode) {
        return res.status(404).json({ message: "Order or AWB not found" });
      }

      const trackingData = await shipRocketService.trackOrder(order.awbCode);
      let currentStatus = "Pending";
      const history = trackingData.data?.shipment_track || [];
      if (history.some(h => h.status === "Out for delivery")) currentStatus = "Dispatched";
      if (history.some(h => h.status === "Delivered")) currentStatus = "Delivered";
      if (order.status === "Cancelled") currentStatus = "Cancelled";

      res.json({ trackingData, currentStatus });
    } catch (err) {
      console.error("❌ Shiprocket tracking error:", err.message);
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Cancel Order
  // ------------------------------
  cancelOrder: async (req, res) => {
    try {
      const order = await orderService.cancelOrder(req.params.id, req.user._id);
      res.json({ success: true, order });
    } catch (err) {
      console.error("❌ Cancel order error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Return Order
  // ------------------------------
  returnOrder: async (req, res) => {
    try {
      const order = await orderService.returnOrder(req.params.id, req.user._id);
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Exchange Order
  // ------------------------------
  exchangeOrder: async (req, res) => {
    try {
      const order = await orderService.exchangeOrder(req.params.id, req.user._id);
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Update Order Status (Admin)
  // ------------------------------
  updateOrderStatus: async (req, res) => {
    try {
      const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Get User Orders
  // ------------------------------
  getUserOrders: async (req, res) => {
    try {
      const orders = await orderService.getUserOrders(req.user._id);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Get Single Order by ID
  // ------------------------------
  getOrderById: async (req, res) => {
    try {
      const order = await orderService.getOrderById(req.params.id || req.params.orderId);
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Get All Orders (Admin)
  // ------------------------------
  getAllOrders: async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Get All Return Requests (User)
  // ------------------------------
  getUserReturnRequests: async (req, res) => {
    try {
      const requests = await ReturnRequest.find({ user: req.user._id }).populate("order");
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Handle Return Request (Admin)
  // ------------------------------
  handleReturnRequest: async (req, res) => {
    try {
      const { status, adminResponse } = req.body;
      const request = await ReturnRequest.findByIdAndUpdate(
        req.params.id,
        { status, adminResponse },
        { new: true }
      );
      res.json(request);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
