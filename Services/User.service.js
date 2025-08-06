import User from "../Models/User.model.js";
import { Cart } from "../models/Cart.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async ({ name, email, mobile, password }) => {
  const existingUser = await User.findOne({ mobile });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, mobile, password: hashedPassword });
  await Cart.create({ userId: newUser._id, items: [] });

  const token = jwt.sign(
    { userId: newUser._id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    success: true,
    message: "User registered and logged in successfully",
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      role: newUser.role
    }
  };
};

// Update
export const updateUser = async (userId, { name, email, mobile, password }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (name) user.name = name;
  if (email) user.email = email;
  if (mobile) user.mobile = mobile;
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
  }

  await user.save();

  return {
    success: true,
    message: "User updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role
    }
  };
};

// Delete
export const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  await User.findByIdAndDelete(userId);
  await Cart.deleteOne({ userId });

  return {
    success: true,
    message: "User account deleted successfully"
  };
};
