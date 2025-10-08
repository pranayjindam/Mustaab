import ReturnRequest from "../Models/ReturnRequest.model.js";

export const createReturnRequest = async (data) => {
  const request = new ReturnRequest(data);
  return await request.save();
};

// ✅ User: Get their own requests (with populated product + order)
export const getUserRequests = async (userId) => {
  return await ReturnRequest.find({ userId })
    .populate("productId", "name price images") // fetch product details
    .populate("orderId", "_id totalPrice orderItems") // fetch order details
    .sort({ createdAt: -1 });
};

// ✅ Admin: Get all return/exchange requests (with full populated data)
export const getAllRequests = async () => {
  return await ReturnRequest.find()
    .populate("userId", "email name") // get user info
    .populate("productId", "name price images") // get product info
    .populate("orderId", "_id totalPrice orderItems") // get order info
    .sort({ createdAt: -1 });
};

// ✅ Update request status
export const updateRequestStatus = async (id, status, adminNote) => {
  return await ReturnRequest.findByIdAndUpdate(
    id,
    { status, adminNote, updatedAt: Date.now() },
    { new: true }
  )
    .populate("userId", "email name")
    .populate("productId", "name")
    .populate("orderId", "_id");
};
