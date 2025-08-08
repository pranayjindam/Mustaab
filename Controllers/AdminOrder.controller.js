
import { getAllOrders as _getAllOrders, confirmedOrder as _confirmedOrder, shipOrder, deliveredOrder, cancelledOrder as _cancelledOrder, deleteOrder as _deleteOrder } from "../Services/Order.service.js";

const getAllOrders = async (req, res) => {
  try {
    const orders = await _getAllOrders();
    return res.status(202).send(orders);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
};

const confirmedOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = _confirmedOrder(orderId);
    res.status(202).json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const shippOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = shipOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const deliverOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = deliveredOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const cancelledOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = _cancelledOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteOrder = (req, res) => {
  try {
    const orderId = req.params.orderId;
    _deleteOrder(orderId);
    res
      .status(202)
      .json({ message: "Order Deleted Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};



export default {
  getAllOrders,
  confirmedOrder,
  shippOrder,
  deliverOrder,
  cancelledOrder,
  deleteOrder,
};
