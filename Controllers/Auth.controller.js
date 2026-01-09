import jwt from "jsonwebtoken";
import * as userService from "../Services/User.service.js";
import { sendOTP, verifyOTP } from "../Services/Otp.service.js";

// ---------------- MOBILE NORMALIZER ----------------
const normalizeMobile = (mobile) => {
  if (!mobile) return "";
  let num = mobile.replace(/\D/g, "");

  if (num.length > 10 && num.startsWith("91")) {
    num = num.slice(-10);
  }

  num = num.replace(/^0+/, "");
  return num;
};

// ==================================================
// 🔹 REGISTER – REQUEST OTP (MOBILE ONLY)
// ==================================================
export const registerRequestOtp = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    if (!name)
      return res.status(400).json({ success: false, message: "Name is required" });

    if (!mobile)
      return res.status(400).json({ success: false, message: "Mobile is required" });

    const formattedMobile = normalizeMobile(mobile);

    // Check if user already exists
    const existingUser = await userService.getUserByMobile(formattedMobile);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists with this mobile" });
    }

    const result = await sendOTP(formattedMobile);

    if (!result.success) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP" });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to mobile number",
    });
  } catch (err) {
    console.error("❌ registerRequestOtp:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==================================================
// 🔹 REGISTER – VERIFY OTP
// ==================================================
export const registerVerifyOtp = async (req, res) => {
  try {
    const { name, mobile, otp } = req.body;

    if (!otp)
      return res.status(400).json({ success: false, message: "OTP required" });

    const formattedMobile = normalizeMobile(mobile);

    const isValid = await verifyOTP(formattedMobile, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Double check user
    const existingUser = await userService.getUserByMobile(formattedMobile);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await userService.createUser({
      name,
      mobile: formattedMobile,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
      token,
    });
  } catch (err) {
    console.error("❌ registerVerifyOtp:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==================================================
// 🔹 LOGIN – REQUEST OTP (MOBILE ONLY)
// ==================================================
export const loginRequestOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile)
      return res.status(400).json({ success: false, message: "Mobile required" });

    const formattedMobile = normalizeMobile(mobile);

    const user = await userService.getUserByMobile(formattedMobile);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const result = await sendOTP(formattedMobile);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ loginRequestOtp:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==================================================
// 🔹 LOGIN – VERIFY OTP
// ==================================================
export const loginVerifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!otp)
      return res.status(400).json({ success: false, message: "OTP required" });

    const formattedMobile = normalizeMobile(mobile);

    const isValid = await verifyOTP(formattedMobile, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const user = await userService.getUserByMobile(formattedMobile);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ success: true, user, token });
  } catch (err) {
    console.error("❌ loginVerifyOtp:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
