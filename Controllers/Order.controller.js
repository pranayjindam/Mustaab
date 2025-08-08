import {
  createOrderService,
  verifyAndPlaceOrderService,
  getOrderByIdService,
  getAllOrdersService,
} from "../Services/Order.service.js";

// Create Razorpay order endpoint
export const createRazorpayOrder = async (req, res) => {
  try {
    const result = await createOrderService(req.body, req.user._id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("createRazorpayOrder error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// This route is just a placeholder for frontend to call verification after payment
export const placeOrder = async (req, res) => {
  return res.status(200).json({ success: true, message: "Frontend should call verify after payment" });
};

// Get order by id endpoint
export const getOrderById = async (req, res) => {
  try {
    const result = await getOrderByIdService(req.params.orderId);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("getOrderById error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all orders endpoint
export const getAllOrders = async (req, res) => {
  try {
    const result = await getAllOrdersService();
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("getAllOrders error:", error.message);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Verify payment and place order endpoint
export const verifyAndPlaceOrder = async (req, res) => {
  try {
    const result = await verifyAndPlaceOrderService(req.body, req.user._id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("verifyAndPlaceOrder error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
