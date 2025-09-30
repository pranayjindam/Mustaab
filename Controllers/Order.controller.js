import Order from "../Models/Order.model.js";
import ReturnRequest from "../Models/ReturnRequest.model.js";
import { orderService } from "../Services/Order.service.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const orderController = {
  // ------------------------------
  // Create normal order
  // ------------------------------
  createOrder: async (req, res) => {
    try {
      console.log("📦 Incoming order body:", req.body);

      const order = await orderService.createOrder({
        ...req.body,
        user: req.user._id,
      });

      res.status(201).json(order);
    } catch (err) {
      console.error("❌ Order creation error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Create Razorpay Order
  // ------------------------------
createRazorpayOrder: async (req, res) => {
  try {
    let { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    amount = Number(amount); // ensure number
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay create order error:", err);
    res.status(500).json({ message: err.message });
  }
},
  // ------------------------------
  // Verify Razorpay Payment
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
        return res
          .status(400)
          .json({ success: false, message: "Missing payment details" });
      }

      // Create order in database
      const order = await orderService.createOrder({
        orderItems: items,
        shippingAddress,
        paymentMethod: "Razorpay",
        paymentResult: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        user: req.user._id,
      });

      res.json({ success: true, order });
    } catch (err) {
      console.error("❌ Razorpay verify error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // ------------------------------
  // Get user orders
  // ------------------------------
  getUserOrders: async (req, res) => {
    try {
      const orders = await orderService.getUserOrders(req.user._id);
      res.json(orders);
    } catch (err) {
      console.error("❌ Get user orders error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // ------------------------------
  // Return requests
  // ------------------------------
  getUserReturnRequests: async (req, res) => {
    try {
      const requests = await ReturnRequest.find({ user: req.user._id }).populate("order");
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

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

  cancelOrder: async (req, res) => {
    try {
      const order = await orderService.cancelOrder(req.params.id, req.user._id);
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  returnOrder: async (req, res) => {
    try {
      const order = await orderService.returnOrder(req.params.id, req.user._id);
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  exchangeOrder: async (req, res) => {
    try {
      const order = await orderService.exchangeOrder(req.params.id, req.user._id);
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getOrderById:async(req,res)=>{
    try{
      const id=req.params.id||req.params.orderId;
      const order=await orderService.getOrderById(id);
      res.json(order);
    }
    catch(err){
      res.status(500).json({ message: err.message });

    }
  }
};
