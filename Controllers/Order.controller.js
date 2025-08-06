import {
  createOrderService,
  verifyAndPlaceOrderService,
  getOrderByIdService
} from "../services/Order.service.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    const result = await createOrderService(req.body, req.user._id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("createRazorpayOrder error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const placeOrder = async (req, res) => {
  return res.status(200).json({ success: true, message: "Frontend should call verify after payment" });
};


export const getOrderById = async (req, res) => {
  try {
    const result = await getOrderByIdService(req.params.orderId);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("getOrderById error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const result = await getAllOrdersService();
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("getAllOrders error:", error.message);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

