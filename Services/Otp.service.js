import twilio from "twilio";
import nodemailer from "nodemailer";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verifySid = process.env.TWILIO_VERIFY_SID;

// In-memory email OTP store (use Redis in production)
const emailOtps = {};

// ----------------------------
// Send OTP (Mobile or Email)
// ----------------------------
export const sendOTP = async (identifier) => {
  if (!identifier) throw new Error("Identifier required");

  // Email OTP
  if (/\S+@\S+\.\S+/.test(identifier)) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    emailOtps[identifier] = otp;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App password
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: identifier,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    return { success: true, message: "OTP sent to email" };
  }

  // Mobile OTP via Twilio
  const cleanMobile = identifier.replace(/\D/g, "");
  const toNumber = `+91${cleanMobile}`;

  try {
    await client.verify.v2.services(verifySid).verifications.create({
      to: toNumber,
      channel: "sms",
    });
    return { success: true, message: "OTP sent to mobile" };
  } catch (err) {
    console.error("Twilio OTP error:", err.message);
    return { success: false, message: "Failed to send OTP to mobile" };
  }
};

// ----------------------------
// Verify OTP (Mobile or Email)
// ----------------------------
export const verifyOTP = async (identifier, otp) => {
  if (!identifier || !otp) return false;

  // Email verification
  if (/\S+@\S+\.\S+/.test(identifier)) {
    const valid = emailOtps[identifier] === otp;
    if (valid) delete emailOtps[identifier];
    return valid;
  }

  // Mobile verification
  const cleanMobile = identifier.replace(/\D/g, "");
  const toNumber = `+91${cleanMobile}`;

  try {
    const verificationCheck = await client.verify.v2.services(verifySid).verificationChecks.create({
      to: toNumber,
      code: otp,
    });
    return verificationCheck.status === "approved";
  } catch (err) {
    console.error("Twilio verification error:", err.message);
    return false;
  }
};
