import * as returnService from "../Services/ReturnRequest.service.js";

// User: Create request
export const createRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, productId, type, reason, pickupAddress, newColor, newSize } = req.body;

    if (!orderId || !productId || !type || !reason) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const images = req.files?.map(file => file.path); // handle uploaded images
    const newVariant = type === "exchange" ? { size: newSize, color: newColor } : undefined;

    const request = await returnService.createReturnRequest({
      userId,
      orderId,
      productId,
      type: type.toLowerCase(),  // ensure lowercase
      reason,
      pickupAddress,
      images,
      newVariant,
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




// User: Get own requests
export const getMyRequests = async (req, res) => {
  try {
    const requests = await returnService.getUserRequests(req.user._id);
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await returnService.getAllRequests();
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Approve/Reject request
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const updated = await returnService.updateRequestStatus(id, status, adminNote);

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
