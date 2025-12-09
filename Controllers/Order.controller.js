// server/controllers/Order.controller.js
import Order from "../Models/Order.model.js";
// import ReturnRequest from "../Models/ReturnRequest.model.js"; // Uncomment if you have this model
import { orderService } from "../Services/Order.service.js";
import { iThinkService } from "../Services/iThink.service.js";
import { sendOTP, verifyOTP } from "../Services/Otp.service.js";
import Razorpay from "razorpay";
import { notificationService } from "../Services/Notification.service.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* Helper utilities */

const toNumberIfNumeric = (v) => {
  if (v === undefined || v === null) return v;
  if (typeof v === "number") return v;
  if (typeof v === "string" && /^\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
};

const normalizeOrderItemsForIThink = (orderItems = []) =>
  (orderItems || []).map((it) => {
    const name = it.name || it.productName || "Item";
    const sku = it.product?.toString?.() || it.sku || "-";
    const qty = it.quantity || it.qty || 1;
    const price = it.price || it.selling_price || 0;
    return {
      product_name: name,
      product_sku: sku,
      product_quantity: String(qty),
      product_price: String(price),
      // include alternates some accounts accept
      name,
      sku,
      qty,
      price,
    };
  });

/* iThink payload builders */

// Primary (v3 compact)
const buildIThinkV3PayloadPrimary = (order, override = {}) => {
  const addr = order.shippingAddress || {};
  const products = normalizeOrderItemsForIThink(order.orderItems || []);

  const payment_mode = (order.paymentMethod === "COD" || order.paymentMode === "COD") ? "COD" : "Prepaid";
  const cod_amount = payment_mode === "COD" ? toNumberIfNumeric(order.totalPrice || 0) : 0;

  const shipment = {
    orderid: order._id?.toString?.() || (order.orderId || `order_${Date.now()}`),
    order_date: new Date().toISOString().split("T")[0],
    consignee: {
      name: addr.fullName || addr.name || "Customer",
      address: addr.address || "",
      address_2: addr.address2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      phone: addr.phoneNumber || addr.phone || "",
      email: order.userEmail || "",
    },
    products: (products || []).map(p => ({
      name: p.product_name || p.name,
      sku: p.product_sku || p.sku,
      units: toNumberIfNumeric(p.product_quantity || p.qty || 1),
      selling_price: toNumberIfNumeric(p.product_price || p.price || 0),
    })),
    total_amount: toNumberIfNumeric(order.totalPrice || 0),
    payment_mode,
    cod_amount,
    weight: toNumberIfNumeric(order.weight || 1),
    ...override,
  };

  return { shipments: [shipment] };
};

// Alternate (form-style full)
const buildIThinkV3PayloadAlternate = (order, override = {}) => {
  const addr = order.shippingAddress || {};
  const name = addr.fullName || addr.name || "Customer";
  const products = normalizeOrderItemsForIThink(order.orderItems || []);

  const payment_mode = (order.paymentMethod === "COD" || order.paymentMode === "COD") ? "COD" : "Prepaid";
  const cod_amount = payment_mode === "COD" ? String(order.totalPrice || 0) : "0";

  const shipment = {
    waybill: "",
    order: order._id?.toString?.() || (order.orderId || `order_${Date.now()}`),
    sub_order: "",
    order_date: new Date().toISOString().split("T")[0],
    total_amount: String(order.totalPrice || 0),
    name,
    company_name: "",
    add: addr.address || "",
    add2: addr.address2 || "",
    add3: "",
    pin: addr.pincode || "",
    city: addr.city || "",
    state: addr.state || "",
    country: addr.country || "India",
    phone: addr.phoneNumber || addr.phone || "",
    alt_phone: "",
    email: order.userEmail || "",
    is_billing_same_as_shipping: "yes",
    billing_name: name,
    billing_add: addr.address || "",
    billing_add2: addr.address2 || "",
    billing_pin: addr.pincode || "",
    billing_city: addr.city || "",
    billing_state: addr.state || "",
    billing_country: addr.country || "India",
    billing_phone: addr.phoneNumber || addr.phone || "",
    billing_email: order.userEmail || "",
    products: products.map(p => ({
      product_name: p.product_name || p.name,
      product_sku: p.product_sku || p.sku,
      product_quantity: String(p.product_quantity || p.qty || 1),
      product_price: String(p.product_price || p.price || 0),
    })),
    shipment_length: String(order.shipment_length || "10"),
    shipment_width: String(order.shipment_width || "10"),
    shipment_height: String(order.shipment_height || "5"),
    weight: String(order.weight || 1),
    shipping_charges: String(order.shippingCharges || 0),
    giftwrap_charges: "0",
    transaction_charges: "0",
    total_discount: String(order.totalDiscount || 0),
    first_attemp_discount: "0",
    cod_charges: "0",
    advance_amount: "0",
    payment_mode,
    cod_amount,
    reseller_name: "",
    eway_bill_number: "",
    gst_number: "",
    return_address_id: "",
    ...override,
  };

  return {
    shipments: [shipment],
    pickup_address_id: process.env.ITHINK_PICKUP_ADDRESS_ID || override.pickup_address_id || "",
    access_token: process.env.ITHINK_ACCESS_TOKEN || override.access_token || "",
    secret_key: process.env.ITHINK_SECRET_KEY || override.secret_key || "",
  };
};

/* Try sending: primary -> alternate (best-effort) */
const tryIThinkCreateOrder = async (order, opts = {}) => {
  try {
    const primary = buildIThinkV3PayloadPrimary(order, opts.override || {});
    const primaryResp = await iThinkService.createOrder(primary);

    // Check business-level status
    const bodyStatusPrimary = primaryResp?.data?.status ?? (primaryResp.success ? "ok" : "error");
    const isPrimaryError = primaryResp?.success === false || (typeof bodyStatusPrimary === "string" && bodyStatusPrimary.toLowerCase() === "error");

    if (!isPrimaryError) return primaryResp;

    // Try alternate
    const alternate = buildIThinkV3PayloadAlternate(order, opts.override || {});
    const altResp = await iThinkService.createOrderForm ? iThinkService.createOrderForm(alternate) : iThinkService.createOrder(alternate);

    const bodyStatusAlt = altResp?.data?.status ?? (altResp.success ? "ok" : "error");
    const isAltError = altResp?.success === false || (typeof bodyStatusAlt === "string" && bodyStatusAlt.toLowerCase() === "error");

    if (!isAltError) return altResp;

    // neither succeeded
    return altResp || primaryResp;
  } catch (err) {
    return { success: false, status: 0, error: err?.message || String(err) };
  }
};

/* Controller endpoints */

export const orderController = {
createOrder: async (req, res) => {
    try {
      const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
      if (!orderItems || orderItems.length === 0)
        return res.status(400).json({ message: "No order items" });

      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });

      await order.save();

      // notify (best-effort)
      try {
        await notificationService.notifyUser(
          req.user,
          "Order Placed Successfully",
          notificationService.templates.ORDER_PLACED(order._id)
        );
      } catch (nErr) {
        // silent
      }

      // create shipment on iThink (best-effort)
      try {
        const ithResp = await tryIThinkCreateOrder(order);

        if (ithResp && (ithResp.success || ithResp.status === 200) && Array.isArray(ithResp.data) && ithResp.data.length > 0) {
          const d = ithResp.data[0];
          order.shipping = order.shipping || {};
          order.shipping.provider = "ITHINK";
          order.shipping.ithinkOrderId = d.order_id || d.ithink_order_id || null;
          order.shipping.awb = d.awb_no || d.awb || d.awb_code || null;
          order.shipping.courier = d.courier || d.courier_name || null;
          order.shipping.labelUrl = d.label_url || d.pdf_label || d.label || null;
          order.awbCode = order.shipping.awb || order.awbCode;
          await order.save();
        }
      } catch (err) {
        // ignore external failure
      }

      res.status(201).json(order);
    } catch (err) {
      console.error("Create order error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Create Razorpay Order
  createRazorpayOrder: async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

      const options = { amount: Number(amount), currency: "INR", receipt: `receipt_${Date.now()}` };
      const rOrder = await razorpay.orders.create(options);
      res.json(rOrder);
    } catch (err) {
      console.error("Razorpay create order error:", err);
      res.status(500).json({ message: err?.message || "Razorpay error" });
    }
  },

  // Verify Razorpay Payment + Create DB Order + Create iThink shipment
  verifyRazorpayPayment: async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, shippingAddress } = req.body;
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
        return res.status(400).json({ message: "Missing payment details" });

      const totalPrice = Array.isArray(items) ? items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0) : 0;

      // Create DB order (service does save)
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

      // notify user (best-effort)
      try {
        await notificationService.notifyUser(
          req.user,
          "Payment Successful & Order Confirmed",
          notificationService.templates.ORDER_PLACED(order._id)
        );
      } catch (nErr) { /* ignore */ }

      // Create shipment on iThink (best-effort)
      try {
        const ithResp = await tryIThinkCreateOrder(order);
        if (ithResp && (ithResp.success || ithResp.status === 200) && Array.isArray(ithResp.data) && ithResp.data.length > 0) {
          const d = ithResp.data[0];
          order.shipping = order.shipping || {};
          order.shipping.provider = "ITHINK";
          order.shipping.ithinkOrderId = d.order_id || null;
          order.shipping.awb = d.awb_no || d.awb || d.awb_code || null;
          order.shipping.labelUrl = d.label_url || d.pdf_label || d.label || null;
          order.awbCode = order.shipping.awb || order.awbCode;
          await order.save();
        }
      } catch (err) {
        // ignore
      }

      res.json({ success: true, order });
    } catch (err) {
      console.error("Razorpay verify error:", err);
      res.status(500).json({ success: false, message: err?.message || "Verification error" });
    }
  },




  // Verify Razorpay Payment + Create DB Order + Create iThink shipment
  verifyRazorpayPayment: async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, shippingAddress } = req.body;
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
        return res.status(400).json({ message: "Missing payment details" });

      const totalPrice = Array.isArray(items) ? items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0) : 0;

      // Create DB order (service does save)
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

      // notify user (best-effort)
      try {
        await notificationService.notifyUser(
          req.user,
          "Payment Successful & Order Confirmed",
          notificationService.templates.ORDER_PLACED(order._id)
        );
      } catch (nErr) { /* ignore */ }

      // Create shipment on iThink (best-effort)
      try {
        const ithResp = await tryIThinkCreateOrder(order);
        if (ithResp && (ithResp.success || ithResp.status === 200) && Array.isArray(ithResp.data) && ithResp.data.length > 0) {
          const d = ithResp.data[0];
          order.shipping = order.shipping || {};
          order.shipping.provider = "ITHINK";
          order.shipping.ithinkOrderId = d.order_id || null;
          order.shipping.awb = d.awb_no || d.awb || d.awb_code || null;
          order.shipping.labelUrl = d.label_url || d.pdf_label || d.label || null;
          order.awbCode = order.shipping.awb || order.awbCode;
          await order.save();
        }
      } catch (err) {
        // ignore
      }

      res.json({ success: true, order });
    } catch (err) {
      console.error("Razorpay verify error:", err);
      res.status(500).json({ success: false, message: err?.message || "Verification error" });
    }
  },


  // Track shipment
  trackShipment: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order || !order.awbCode) return res.status(404).json({ message: "Order or AWB not found" });

      const trackingData = await iThinkService.trackOrder({ awb_number: order.awbCode });
      const history =
        trackingData?.data?.[0]?.tracking_events ||
        trackingData?.data?.[0]?.shipment_track ||
        trackingData?.tracking ||
        [];

      let currentStatus = "Pending";
      if (Array.isArray(history) && history.some((h) => /out for delivery/i.test(h.status || h.event || h.description || "")))
        currentStatus = "Dispatched";
      if (Array.isArray(history) && history.some((h) => /delivered/i.test(h.status || h.event || h.description || "")))
        currentStatus = "Delivered";
      if (order.status === "Cancelled") currentStatus = "Cancelled";

      res.json({ trackingData, currentStatus });
    } catch (err) {
      console.error("iThink tracking error:", err);
      res.status(500).json({ message: err?.message || err });
    }
  },

  // Cancel Order
  cancelOrder: async (req, res) => {
    try {
      const userId = req.user._id;
      const orderId = req.params.id;
      const canceled = await orderService.cancelOrder(orderId, userId);
      res.json({ success: true, canceled });
    } catch (err) {
      console.error("Cancel order handler error:", err);
      res.status(500).json({ message: err?.message || err });
    }
  },

  // Return order (user)
  returnOrder: async (req, res) => {
    try {
      const order = await orderService.returnOrder(req.params.id, req.user._id);
      try {
        await notificationService.notifyUser(req.user, "Return Request Submitted", notificationService.templates.ORDER_RETURNED(order._id));
      } catch (nErr) { /* ignore */ }
      res.json(order);
    } catch (err) {
      console.error("Return order error:", err);
      res.status(500).json({ message: err?.message || err });
    }
  },

  // Exchange order (user)
  exchangeOrder: async (req, res) => {
    try {
      const order = await orderService.exchangeOrder(req.params.id, req.user._id);
      res.json(order);
    } catch (err) {
      console.error("Exchange order error:", err);
      res.status(500).json({ message: err?.message || err });
    }
  },

  // Admin: update order status
  updateOrderStatus: async (req, res) => {
    try {
      const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (err) {
      console.error("Update order status error:", err);
      res.status(500).json({ message: err?.message || err });
    }
  },

  // Get orders for user
  getUserOrders: async (req, res) => {
    try {
      const orders = await orderService.getUserOrders(req.user._id);
      res.json(orders);
    } catch (err) {
      console.error("Get user orders error:", err);
      res.status(500).json({ message: err?.message || err });
    }
  },

  // Get one order
  getOrderById: async (req, res) => {
    try {
      const order = await orderService.getOrderById(req.params.id || req.params.orderId);
      res.json(order);
    } catch (err) {
      console.error("Get order by id error:", err);
      res.status(500).json({ message: err?.message || err });
    }
  },

  // Admin: get all orders
  getAllOrders: async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (err) {
      console.error("Get all orders error:", err);
      res.status(500).json({ message: err?.message || err });
    }
  },

  // Get user return requests (if model exists)
  getUserReturnRequests: async (req, res) => {
    try {
      const requests = (typeof ReturnRequest !== "undefined" && ReturnRequest) ? await ReturnRequest.find({ user: req.user._id }).populate("order") : [];
      res.json(requests);
    } catch (err) {
      console.error("Get user return requests error:", err);
      res.status(500).json({ message: err?.message || err });
    }
  },

  // Handle return request (admin)
  handleReturnRequest: async (req, res) => {
    try {
      const { status, adminResponse } = req.body;
      const request = (typeof ReturnRequest !== "undefined" && ReturnRequest)
        ? await ReturnRequest.findByIdAndUpdate(req.params.id, { status, adminResponse }, { new: true })
        : null;
      res.json(request);
    } catch (err) {
      console.error("Handle return request error:", err);
      res.status(500).json({ message: err?.message || err });
    }
  },
};

export default orderController;
