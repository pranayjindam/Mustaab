import jwt from "jsonwebtoken";

const SECRET_KEY = "9186ddcd-c0c6-4323-833a-3f1f3d7d97b7"; // 🔐 Keep this in an .env file
const EXPIRATION = "7d"; // Validity

// Generate token with optional role
const generateToken = (userId, role = "USER") => {
  try {
    const token = jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: EXPIRATION });
    console.log("Generated Token:", token);
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Token generation failed");
  }
};

// Extract userId from token
const getUserIdFromToken = (token) => {
  try {
    console.log("Token received for decoding:", token);
    const decodedToken = jwt.verify(token, SECRET_KEY);
    console.log("Decoded Token:", decodedToken);
    return decodedToken.userId;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    throw new Error("Invalid token");
  }
};

// Middleware to validate token and attach user
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // userId & role available
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

// Optional: Middleware to restrict access to admin users only
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Admin access denied" });
  }
  next();
};

export default {
  generateToken,
  getUserIdFromToken,
  authenticateJWT,
  isAdmin,
};
