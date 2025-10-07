import User from "../Models/User.model.js";
import Cart from "../Models/Cart.model.js";
import jwt from "jsonwebtoken";
import { verifyOTP } from "./Otp.service.js";

// 🔹 Create or get user (used in registration after OTP verified)
export const createOrGetUser = async ({ name, email, mobile }) => {
  let user = await User.findOne({ mobile });
  if (!user) {
    user = await User.create({ name, email, mobile });
    // Create empty cart for new user
    await Cart.create({ userId: user._id, items: [] });
  }
  return user;
};

// 🔹 Get user by identifier (mobile or email)
export const getUserByIdentifier = async (identifier) => {
  return await User.findOne({
    $or: [{ mobile: identifier }, { email: identifier }],
  });
};

// 🔹 Update user (with mobile/email OTP verification if changed)
export const updateUser = async (userId, { name, email, mobile, otp }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Verify mobile OTP if mobile changed
  if (mobile && mobile !== user.mobile) {
    const isValid = await verifyOTP(mobile, otp);
    if (!isValid) throw new Error("Mobile OTP verification failed");
    user.mobile = mobile;
  }

  // Verify email OTP if email changed
  if (email && email !== user.email) {
    const isValid = await verifyOTP(email, otp);
    if (!isValid) throw new Error("Email OTP verification failed");
    user.email = email;
  }

  if (name) user.name = name;

  await user.save();

  return {
    success: true,
    message: "User updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  };
};

// 🔹 Delete user
export const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  await User.findByIdAndDelete(userId);
  await Cart.deleteOne({ userId });

  return { success: true, message: "User deleted successfully" };
};
