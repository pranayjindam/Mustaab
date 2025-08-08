import {
  createOrderService,
  verifyAndPlaceOrderService,
  getOrderByIdService,
  getAllOrdersService,
  updateOrderStatusService,
  cancelOrderService,
  deleteOrderService,
} from "../Services/Order.service.js";

// Create order (client)
export const createOrder = async (req, res) => {
  try {
    const result = await createOrderService(req.body, req.user._id);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify payment and place order (client)
export const verifyAndPlaceOrder = async (req, res) => {
  try {
    const result = await verifyAndPlaceOrderService(req.body, req.user._id);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("verifyAndPlaceOrder error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single order (user/admin)
export const getOrderById = async (req, res) => {
  try {
    // Check if user is admin by role
    const isAdmin = req.user.role === "ADMIN";
    const result = await getOrderByIdService(req.params.orderId, req.user._id, isAdmin);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all orders (user: own orders, admin: all orders)
export const getAllOrders = async (req, res) => {
  try {
    const isAdmin = req.user.role === "ADMIN";
    const result = await getAllOrdersService(req.user._id, isAdmin);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admins only" });
    }

    const { status } = req.body;
    const orderId = req.params.orderId;
    const result = await updateOrderStatusService(orderId, status);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cancel order (user or admin)
export const cancelOrder = async (req, res) => {
  try {
    const isAdmin = req.user.role === "ADMIN";
    const result = await cancelOrderService(req.params.orderId, req.user._id, isAdmin);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("cancelOrder error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete order (user or admin)
export const deleteOrder = async (req, res) => {
  try {
    const isAdmin = req.user.role === "ADMIN";
    const result = await deleteOrderService(req.params.orderId, req.user._id, isAdmin);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("deleteOrder error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
