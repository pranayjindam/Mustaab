import jwt from "jsonwebtoken";
import * as userService from "../Services/User.service.js";
import { sendOTP, verifyOTP } from "../Services/Otp.service.js";

// Helper to normalize mobile numbers
// Normalize mobile numbers to 10-digit standard (Indian numbers as example)
const normalizeMobile = (mobile) => {
  if (!mobile) return "";
  
  // Remove all non-digit characters
  let num = mobile.replace(/\D/g, "");

  // Remove leading country code (assuming India +91)
  if (num.length > 10 && num.startsWith("91")) {
    num = num.slice(-10);
  }

  // Remove leading zeros
  num = num.replace(/^0+/, "");

  // Final 10-digit number
  return num;
};


// 🔹 1️⃣ Request OTP for registration (mobile + optional email)
export const registerRequestOtp = async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    if (!mobile) return res.status(400).json({ success: false, message: "Mobile is required" });

    const formattedMobile = normalizeMobile(mobile);

    // Check if user already exists by mobile
    const existingMobileUser = await userService.getUserByIdentifier(formattedMobile);
    if (existingMobileUser) {
      return res.status(400).json({ success: false, message: "User already exists with this mobile" });
    }

    // Check if user already exists by email (only if provided and not empty)
    if (email?.trim()) {
      const existingEmailUser = await userService.getUserByIdentifier(email.trim());
      if (existingEmailUser) {
        return res.status(400).json({ success: false, message: "User already exists with this email" });
      }
    }

    // Send OTP
    const mobileResult = await sendOTP(formattedMobile);
    let emailResult = null;
    if (email?.trim()) emailResult = await sendOTP(email.trim());

    if(mobileResult.success)
    {
    res.status(200).json({
      success: true,
      message: "OTP sent. Please verify to complete registration.",
      mobileOtpSent: mobileResult?.success,
      emailOtpSent: !!emailResult?.success,
    });
  }
  else{
    res.json({success:false,
      message:"Error Sending in OTP"
    })
  }

  } catch (err) {
    console.error("❌ registerRequestOtp Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 2️⃣ Verify OTP and register user
export const registerVerifyOtp = async (req, res) => {
  try {
    const { name, mobile, email, mobileOtp, emailOtp } = req.body;

    if (!mobileOtp) return res.status(400).json({ success: false, message: "Mobile OTP required" });

    const formattedMobile = normalizeMobile(mobile);

    // Verify mobile OTP
    const isMobileValid = await verifyOTP(formattedMobile, mobileOtp);
    if (!isMobileValid) return res.status(400).json({ success: false, message: "Invalid mobile OTP" });

    // Verify email OTP if provided
    if (email?.trim() && emailOtp) {
      const isEmailValid = await verifyOTP(email.trim(), emailOtp);
      if (!isEmailValid) return res.status(400).json({ success: false, message: "Invalid email OTP" });
    }

    // Check if user exists before creating
    let user = await userService.getUserByIdentifier(formattedMobile);
    if (!user && email?.trim()) user = await userService.getUserByIdentifier(email.trim());

    if (user) {
      return res.status(400).json({ success: false, message: "User already exists. Cannot register again." });
    }

    // Create new user (email only if not empty)
    user = await userService.createOrGetUser({ 
      name, 
      mobile: formattedMobile, 
      email: email?.trim() || undefined 
    });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ success: true, message: "Registration successful", user, token });
  } catch (err) {
    console.error("❌ registerVerifyOtp Error:", err);
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
