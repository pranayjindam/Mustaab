import * as paymentService from "../Services/Payment.service.js";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await paymentService.createRazorpayOrder(amount);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const captureOrder = async (req, res) => {
  try {
    const order = await paymentService.captureOrder(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
