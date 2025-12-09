import twilio from "twilio";
import sgMail from "@sendgrid/mail";

// Twilio setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verifySid = process.env.TWILIO_VERIFY_SID;

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In-memory email OTP store (replace with Redis or DB in production)
const emailOtps = {};

// ----------------------------
// Send OTP (Email or Mobile)
// ----------------------------
export const sendOTP = async (identifier) => {
  if (!identifier) throw new Error("Identifier required");

  // ✅ EMAIL OTP (via SendGrid)
  if (/\S+@\S+\.\S+/.test(identifier)) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    emailOtps[identifier] = otp;

const msg = {
  to: identifier,
  from: { 
    email: process.env.SENDGRID_SENDER_EMAIL, 
    name: "Laxmi_Saree_House_Sircilla"
  },
  subject: "Your OTP Code",
  text: `Your OTP is ${otp}`,
  html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
};

    try {
      console.log("FROM EMAIL:", process.env.SENDGRID_SENDER_EMAIL);


      await sgMail.send(msg);
      console.log("✅ SendGrid OTP sent to", identifier);
      return { success: true, message: "OTP sent to email via SendGrid" };
    } catch (error) {
      console.error("❌ SendGrid Error Message:", error.message);
      console.error("❌ SendGrid Error Response:", error.response?.body);
      console.error("❌ SendGrid Error Stack:", error.stack);
      return { success: false, message: "Failed to send OTP via SendGrid" };
    }
  }

  // ✅ MOBILE OTP (via Twilio)
  const cleanMobile = identifier.replace(/\D/g, "");
  const toNumber = `+91${cleanMobile}`;

  try {
    console.log("Verify SID:", process.env.TWILIO_VERIFY_SID);
    await client.verify.v2.services(verifySid).verifications.create({
      to: toNumber,
      channel: "sms",
    });
    console.log("✅ Twilio OTP sent to", toNumber);
    return { success: true, message: "OTP sent to mobile" };
  } catch (err) {
    console.error("❌ Twilio OTP error:", err.message);
    return { success: false, message: "Failed to send OTP to mobile" };
  }
};


export const sendNotification = async ({ email, mobile, subject, message }) => {
  try {
    // ============================
    // 1️⃣ SEND EMAIL (if email exists)
    // ============================
    if (email && /\S+@\S+\.\S+/.test(email)) {
      const emailMsg = {
        to: email,
        from: {
          email: process.env.SENDGRID_SENDER_EMAIL,
          name: "Laxmi Saree House",
        },
        subject: subject,
        text: message,
        html: `<p>${message}</p>`,
      };

      await sgMail.send(emailMsg);
      console.log("📩 Email sent to", email);
    }

    // ============================
    // 2️⃣ SEND SMS (if mobile exists)
    // ============================
    if (mobile) {
      const cleanMobile = mobile.replace(/\D/g, "");
      const toNumber = `+91${cleanMobile}`;

      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER, // NOT VERIFY SID
        to: toNumber,
      });

      console.log("📱 SMS sent to", toNumber);
    }

    return { success: true, message: "Notification sent" };

  } catch (error) {
    console.error("❌ Notification Error:", error.message);
    return { success: false, error: error.message };
  }
};


// ----------------------------
// Verify OTP (Email or Mobile)
// ----------------------------
export const verifyOTP = async (identifier, otp) => {
  if (!identifier || !otp) return false;

  // ✅ EMAIL OTP verification
  if (/\S+@\S+\.\S+/.test(identifier)) {
    const valid = emailOtps[identifier] === otp;
    if (valid) delete emailOtps[identifier];
    return valid;
  }

  // ✅ MOBILE OTP verification
  const cleanMobile = identifier.replace(/\D/g, "");
  const toNumber = `+91${cleanMobile}`;

  try {
    const verificationCheck = await client.verify.v2.services(verifySid).verificationChecks.create({
      to: toNumber,
      code: otp,
    });
    return verificationCheck.status === "approved";
  } catch (err) {
    console.error("❌ Twilio verification error:", err.message);
    return false;
  }
};
