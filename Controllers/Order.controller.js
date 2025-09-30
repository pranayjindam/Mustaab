import {ReturnRequest}  from "../Models/ReturnRequest.model.js";

export const orderController = {
createOrder: async (req, res) => {
  try {
    console.log("📦 Incoming order body:", req.body); // debug log

    const order = await orderService.createOrder({
      ...req.body,   // ✅ take data directly
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
  verifyPayment: async (req, res) => {
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

      const order = await orderService.createOrder({
        orderItems: items,
        shippingAddress,
        paymentMethod: "Razorpay",
        paymentResult: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        totalPrice: items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
        user: req.user._id,
        item: selectedItemId,
        type,
        reason,
        pickupAddress,
        newSize,
        newColor,
        images,
      });

      res.json({ success: true, order });
    } catch (err) {
      console.error("❌ Razorpay verify error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getUserReturnRequests: async (req, res) => {
    try {
      const requests = await ReturnRequest.find({
        user: req.user._id,
      }).populate("order");
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  handleReturnRequest: async (req, res) => {
    try {
      // admin endpoint
      const { status, adminResponse } = req.body; // "Accepted" or "Rejected"
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
