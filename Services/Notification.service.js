import sgMail from "@sendgrid/mail";
import twilio from "twilio";

// =========================
// INIT SENDGRID
// =========================
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// =========================
// INIT TWILIO
// =========================
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const notificationService = {

  // -------------------------
  // Send Email
  // -------------------------
  sendEmail: async (to, subject, message) => {
    if (!to) return;

    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_SENDER_EMAIL,
        name: "Laxmi Saree House",
      },
      subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    try {
      await sgMail.send(msg);
      console.log("📧 Email sent to", to);
    } catch (err) {
      console.error("❌ Email Error:", err.response?.body || err.message);
    }
  },

  // -------------------------
  // Send SMS (Twilio)
  // -------------------------
  sendSMS: async (mobile, message) => {
    if (!mobile) return;

    const cleanMobile = mobile.replace(/\D/g, "");
    const to = `+91${cleanMobile}`;

    try {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE, // your twilio number
        to,
      });

      console.log("📱 SMS sent to", to);
    } catch (err) {
      console.error("❌ SMS Error:", err.message);
    }
  },

  // -------------------------
  // Combined: SMS + Email
  // -------------------------
  notifyUser: async (user, subject, message) => {
    await notificationService.sendEmail(user.email, subject, message);
    await notificationService.sendSMS(user.mobile, message);
  },

  // -------------------------
  // Templates
  // -------------------------
  templates: {
    ORDER_PLACED: (id) =>
      `Your order #${id} has been placed successfully.`,
    ORDER_SHIPPED: (id) =>
      `Your order #${id} has been shipped.`,
    ORDER_DELIVERED: (id) =>
      `Your order #${id} has been delivered. Thank you for shopping with us!`,
    ORDER_CANCELLED: (id) =>
      `Your order #${id} has been cancelled.`,
    ORDER_RETURNED: (id) =>
      `Your return request for order #${id} has been received.`,
    ORDER_EXCHANGED: (id) =>
      `Your exchange request for order #${id} has been received.`,
  },

};
