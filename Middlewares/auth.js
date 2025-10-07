import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/User.model.js";

dotenv.config(); 

// Utility: Extract & verify token
const extractUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// ---------------------
// USER AUTHENTICATION
// ---------------------
export const AuthenticateUser = async (req, res, next) => {
  try {
    const user = await extractUserFromToken(req);
    req.user = user;

    if (process.env.NODE_ENV === "development") {
      console.log("🟡 JWT Verified User:", {
        id: user._id,
        role: user.role,
        email: user.email,
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

// ---------------------
// ADMIN AUTHENTICATION
// ---------------------
export const AuthenticateAdmin = async (req, res, next) => {
  try {
    const user = await extractUserFromToken(req);

    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admins only" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

// ---------------------
// ROLE BASED ACCESS
// ---------------------
export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Forbidden: insufficient privileges" });
  }

  next();
};
