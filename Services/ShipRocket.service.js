// Services/shiprocketService.js
import axios from "axios";

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

let token = null;

// ------------------------------
// Login to Shiprocket
// ------------------------------
const login = async () => {
  if (token) return token; // reuse token if already logged in

  try {
    console.log("Creating Shiprocket token...");
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      },
     
    );
    console.log("✅ Shiprocket token created");
    token = response.data.token;
    return token;
  } catch (err) {
    console.error("❌ Shiprocket login failed:", err.response?.data || err.message);
    throw err; // rethrow so caller knows
  }
};


// ------------------------------
// Create Shiprocket Order (returns shipment IDs)
// ------------------------------
const createOrder = async (order) => {
  if (!token) await login();
  console.log("hello");
const payload = {
  order_id: order._id.toString(),
  order_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  pickup_location: "PRIMARY", // must match exactly your Shiprocket panel
  billing_customer_name: order.shippingAddress.fullName,
  billing_address: order.shippingAddress.address,
  billing_city: order.shippingAddress.city,
  billing_pincode: order.shippingAddress.pincode,
  billing_state: order.shippingAddress.state,
  billing_country: "India",
  billing_phone: order.shippingAddress.phoneNumber,
  order_items: order.orderItems.map((item) => ({
    name: item.name,
    sku: item.product.toString(), // ✅ string
    units: item.quantity,
    selling_price: item.price,
  })),
  payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
  sub_total: order.totalPrice,
  length: 10,
  breadth: 10,
  height: 10,
  weight: 1,
};
console.log("payyload is",payload);
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data; // contains shiprocket_order_id, shipment_id, awb_code, etc.
};

// ------------------------------
// Track Shipment by AWB
// ------------------------------
const trackOrder = async (awbCode) => {
  if (!token) await login();

  const response = await axios.get(
    `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
}
// ------------------------------
// Cancel Shiprocket Order
// ------------------------------
const cancelOrder = async (shiprocketOrderId) => {
  if (!token) await login();

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/cancel",
    { ids: [shiprocketOrderId] }, // Shiprocket expects array of order_ids
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};

export const shipRocketService = {
  createOrder,
  trackOrder,
  cancelOrder, // ✅ new
};
