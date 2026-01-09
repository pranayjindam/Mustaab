import User from "../Models/User.model.js";
import Cart from "../Models/Cart.model.js";
import { verifyOTP } from "./Otp.service.js";

// ==================================================
// 🔹 CREATE USER (AFTER OTP VERIFIED)
// ==================================================
export const createUser = async ({ name, mobile }) => {
  let user = await User.findOne({ mobile });

  if (!user) {
    user = await User.create({
      name,
      mobile,
    });

    // Create empty cart for new user
    await Cart.create({
      userId: user._id,
      items: [],
    });
  }

  return user;
};

// ==================================================
// 🔹 GET USER BY MOBILE ONLY
// ==================================================
export const getUserByMobile = async (mobile) => {
  return await User.findOne({ mobile });
};

// ==================================================
// 🔹 UPDATE USER (MOBILE + NAME ONLY)
// ==================================================
export const updateUser = async (userId, { name, mobile, otp }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Verify OTP if mobile is changed
  if (mobile && mobile !== user.mobile) {
    const isValid = await verifyOTP(mobile, otp);
    if (!isValid) {
      throw new Error("Mobile OTP verification failed");
    }
    user.mobile = mobile;
  }

  if (name) {
    user.name = name;
  }

  await user.save();

  return {
    success: true,
    message: "User updated successfully",
    user: {
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
    },
  };
};

// ==================================================
// 🔹 DELETE USER
// ==================================================
export const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  await User.findByIdAndDelete(userId);
  await Cart.deleteOne({ userId });

  return {
    success: true,
    message: "User deleted successfully",
  };
};
