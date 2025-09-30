import {ReturnRequest}  from "../Models/ReturnRequest.model.js";

export const orderController = {
  // ... existing methods

  createReturnRequest: async (req, res) => {
    try {
      const {
        type,
        reason,
        pickupAddress,
        newSize,
        newColor,
        selectedItemId,
        images,
      } = req.body;

      const newRequest = await ReturnRequest.create({
        order: req.params.id,
        user: req.user._id,
        item: selectedItemId,
        type,
        reason,
        pickupAddress,
        newSize,
        newColor,
        images,
      });

      res.status(201).json({ success: true, request: newRequest });
    } catch (err) {
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
