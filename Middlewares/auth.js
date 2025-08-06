import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/User.model.js";

dotenv.config(); // Load .env config

// USER AUTH MIDDLEWARE
export const AuthenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if header exists and is Bearer type
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Login required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    console.log("🟡 Token:", token);
console.log("🟢 Decoded JWT:", decoded);
console.log("🔵 Fetched user from DB:", user);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ADMIN AUTH MIDDLEWARE
export const AuthenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
