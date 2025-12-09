// server/Services/Order.service.js
import Order from "../Models/Order.model.js";
import { iThinkService } from "./iThink.service.js"; // <--- fixed import (server-side)

export const orderService = {
  createOrder: async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
  },

  getUserOrders: async (userId) => {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  },

  getOrderById: async (orderId) => {
    return await Order.findById(orderId);
  },

  /**
   * Cancel order (service-level)
   * - Updates DB status to "Cancelled"
   * - Attempts to cancel shipment on iThink (if present)
   * - Clears iThink-related fields on success (best-effort)
   */
  cancelOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found or unauthorized");

    // Update status in MongoDB
    order.status = "Cancelled";

    // Attempt to cancel shipment on iThink if we have iThink info
    const ithinkOrderId = order.shipping?.ithinkOrderId || null;
    const awb = order.shipping?.awb || order.awbCode || null;

    if (ithinkOrderId || awb) {
      try {
        // iThink v3 expects { order_id, awb_no } in body
        const resp = await iThinkService.cancelOrder({
          order_id: ithinkOrderId || order._id.toString(),
          awb_no: awb,
        });

        // Log response for debugging
        console.log("iThink cancel response:", resp);

        // If iThink responded ok (resp.success may be true or resp.status 200)
        // clear shipment fields (best-effort)
        order.shipmentId = undefined;
        if (order.shipping) {
          order.shipping.ithinkOrderId = undefined;
          order.shipping.awb = undefined;
          order.shipping.labelUrl = undefined;
          order.shipping.provider = undefined;
          order.shipping.courier = undefined;
        }
        order.awbCode = undefined;
      } catch (err) {
        console.error("⚠️ Failed to cancel iThink order:", err?.message || err);
        // do not throw — keep cancellation local even if external cancel fails
      }
    }

    return await order.save();
  },

  returnOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found or unauthorized");
    order.status = "Returned";
    return await order.save();
  },

  exchangeOrder: async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found or unauthorized");
    order.status = "Exchanged";
    return await order.save();
  },

  updateOrderStatus: async (orderId, status) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    order.status = status;
    return await order.save();
  },

  getAllOrders: async () => {
    return await Order.find().sort({ createdAt: -1 });
  },
};

export default orderService;
