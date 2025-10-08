import ReturnRequest from "../Models/ReturnRequest.model.js";

export const createReturnRequest = async (data) => {
  const request = new ReturnRequest(data);
  return await request.save();
};

// ✅ User: Get their own requests (fully populated)
export const getUserRequests = async (userId) => {
  return await ReturnRequest.find({ userId })
    .populate("userId", "email name") // 👈 include user info too
    .populate({
      path: "orderId",
      select: "_id orderItems totalPrice",
      populate: {
        path: "orderItems.product",
        select: "name images price",
      },
    })
    .populate("productId", "name price images")
    .sort({ createdAt: -1 });
};

// ✅ Admin: Get all return/exchange requests (fully populated)
export const getAllRequests = async () => {
  return await ReturnRequest.find()
    .populate("userId", "email name")
    .populate({
      path: "orderId",
      select: "_id orderItems totalPrice",
      populate: {
        path: "orderItems.product",
        select: "name images price",
      },
    })
    .populate("productId", "name price images")
    .sort({ createdAt: -1 });
};

// ✅ Admin: Update request status
export const updateRequestStatus = async (id, status, adminNote) => {
  return await ReturnRequest.findByIdAndUpdate(
    id,
    { status, adminNote, updatedAt: Date.now() },
    { new: true }
  )
    .populate("userId", "email name")
    .populate("productId", "name price images")
    .populate("orderId", "_id totalPrice");
};
