// services/admin.service.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.model.js";
import dotenv from "dotenv";

dotenv.config(); // Make sure JWT_SECRET is available

const DEFAULT_ADMIN = {
  name: "Super Admin",
  email: "pranayjindam0708@gmail.com",
  password: "I4gotpassword.", // Plain password; will be hashed
  role: "ADMIN",
  mobile: "6300370683",
};

// 🟢 Auto-create admin if not exists (called on server start)
export const initializeAdminUser = async () => {
  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    await User.create({ ...DEFAULT_ADMIN, password: hashedPassword });
    console.log("✅ Default admin created");
  } else {
    console.log("ℹ️ Admin already exists");
  }
};

// 🟢 Register new admin manually (from UI or API)
export const registerAdmin = async ({ name, email, password, mobile }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await User.create({
    name,
    email,
    mobile,
    password: hashedPassword,
    role: "ADMIN",
  });
  return admin;
};

// ✏️ Update admin profile
export const updateAdmin = async (id, data) => {
  const updated = await User.findByIdAndUpdate(id, data, { new: true });
  return updated;
};

// 🔎 Get admin profile (without password)
export const getAdminDetails = async (id) => {
  return await User.findById(id).select("-password");
};

export const deleteAdmin = async (id) => {
  const deleted=await User.findByIdAndDelete(id);
  return deleted;
}
