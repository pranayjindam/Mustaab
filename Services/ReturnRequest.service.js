import ReturnRequest from "../Models/ReturnRequest.model.js";

export const createReturnRequest = async (data) => {
  const request = new ReturnRequest(data);
  return await request.save();
};

export const getUserRequests = async (userId) => {
  return await ReturnRequest.find({ userId }).populate("productId orderId");
};

export const getAllRequests = async () => {
  return await ReturnRequest.find().populate("userId productId orderId");
};

export const updateRequestStatus = async (id, status, adminNote) => {
  return await ReturnRequest.findByIdAndUpdate(
    id,
    { status, adminNote, updatedAt: Date.now() },
    { new: true }
  );
};
