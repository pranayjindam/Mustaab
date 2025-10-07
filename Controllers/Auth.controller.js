import jwt from "jsonwebtoken";
import * as userService from "../Services/User.service.js";
import { sendOTP, verifyOTP } from "../Services/Otp.service.js";

// 🔹 1️⃣ Request OTP for registration (mobile + optional email)
export const registerRequestOtp = async (req, res) => {
  try {
    const { name, mobile, email } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: "Mobile required" });
    if (!name) return res.status(400).json({ success: false, message: "Name required" });

    console.log("📩 Sending OTPs to:", mobile, email); // 👈 Add this

    const mobileResult = await sendOTP(mobile);
    console.log("📱 Mobile OTP result:", mobileResult); // 👈 Add this

    let emailResult = null;
    if (email) {
      emailResult = await sendOTP(email);
      console.log("📧 Email OTP result:", emailResult); // 👈 Add this
    }

    res.status(200).json({
      success: true,
      mobileOtpSent: mobileResult?.success,
      emailOtpSent: !!emailResult?.success,
    });
  } catch (err) {
    console.error("❌ registerRequestOtp Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 🔹 2️⃣ Verify OTP and register user
export const registerVerifyOtp = async (req, res) => {
  try {
    const { mobile, email, mobileOtp, emailOtp, name } = req.body;

    if (!mobileOtp) return res.status(400).json({ success: false, message: "Mobile OTP required" });

    // Verify mobile OTP
    const isMobileValid = await verifyOTP(mobile, mobileOtp);
    if (!isMobileValid) return res.status(400).json({ success: false, message: "Invalid mobile OTP" });

    // Verify email OTP if email provided
    if (email && emailOtp) {
      const isEmailValid = await verifyOTP(email, emailOtp);
      if (!isEmailValid) return res.status(400).json({ success: false, message: "Invalid email OTP" });
    }

    // Create or get user
    const user = await userService.createOrGetUser({ name, mobile, email });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 3️⃣ Request OTP for login (mobile or email)
export const loginRequestOtp = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ success: false, message: "Identifier required" });

    const user = await userService.getUserByIdentifier(identifier);
    console.log(identifier);
    console.log(user);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const result = await sendOTP(identifier);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 4️⃣ Verify OTP for login and generate JWT
export const loginVerifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!otp) return res.status(400).json({ success: false, message: "OTP required" });

    const isValid = await verifyOTP(identifier, otp);
    if (!isValid) return res.status(400).json({ success: false, message: "Invalid OTP" });

    const user = await userService.getUserByIdentifier(identifier);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
