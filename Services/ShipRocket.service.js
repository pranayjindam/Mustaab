// Services/ShipRocket.service.js
import axios from "axios";

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

let token = null;

// ------------------------------
// Login to Shiprocket
// ------------------------------
const login = async () => {
  if (token) return token;

  try {
    console.log("Creating Shiprocket token...");
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      }
    );
    console.log("✅ Shiprocket token created");
    token = response.data.token;
    return token;
  } catch (err) {
    console.error("❌ Shiprocket login failed:", err.response?.data || err.message);
    throw err;
  }
};

// ------------------------------
// Create Shiprocket Order
// ------------------------------
// Services/shiprocketService.js
const createOrder = async (order) => {
  if (!token) await login();

  // 🔹 Update payload here
  const [firstName, ...lastNameParts] = order.shippingAddress.fullName.split(" ");
  const lastName = lastNameParts.join(" ") || "-";

  const payload = {
    order_id: order._id.toString(),
    order_date: new Date().toISOString().split("T")[0],
    pickup_location: "home",
    billing_customer_name: order.shippingAddress.fullName,
    billing_first_name: firstName,      
    billing_last_name: lastName,        
    billing_address: order.shippingAddress.address,
    billing_city: order.shippingAddress.city,
    billing_pincode: order.shippingAddress.pincode,
    billing_state: order.shippingAddress.state,
    billing_country: "India",
    billing_phone: order.shippingAddress.phoneNumber,
    shipping_is_billing: true,          // ✅ new
    order_items: order.orderItems.map((item) => ({
      name: item.name,
      sku: item.product.toString(),
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
console.log(payload);
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
console.log(response);
  return response.data;
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
};

// ------------------------------
// Cancel Shiprocket Order
// ------------------------------
const cancelOrder = async (shiprocketOrderId) => {
  if (!token) await login();

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/cancel",
    { ids: [shiprocketOrderId] },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};

export const shipRocketService = {
  createOrder,
  trackOrder,
  cancelOrder,
};
