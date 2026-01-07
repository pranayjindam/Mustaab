// Services/shiprocket.service.js
import axios from "axios";

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

let token = null;

/* ------------------------------
   LOGIN
------------------------------ */
const login = async () => {
  try {
    console.log("🔐 Shiprocket login...");
    const res = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      }
    );

    token = res.data.token;
    console.log("✅ Shiprocket token received");
    return token;
  } catch (err) {
    console.error("❌ Shiprocket login failed:", err.response?.data || err.message);
    throw err;
  }
};

/* ------------------------------
   AXIOS INSTANCE
------------------------------ */
const shiprocketAxios = axios.create();

shiprocketAxios.interceptors.request.use(async (config) => {
  if (!token) await login();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

shiprocketAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Shiprocket token expired. Re-login...");
      token = null;
      await login();
      error.config.headers.Authorization = `Bearer ${token}`;
      return shiprocketAxios(error.config);
    }
    return Promise.reject(error);
  }
);

/* ------------------------------
   CREATE ORDER
------------------------------ */
const createOrder = async (order) => {
  const [firstName, ...lastNameParts] =
    order.shippingAddress.fullName.split(" ");
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

    shipping_is_billing: true,

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

  console.log("📦 Shiprocket Payload:", payload);

  const res = await shiprocketAxios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    payload
  );

  console.log("🚀 Shiprocket Response:", res.data);
  return res.data;
};

/* ------------------------------
   TRACK ORDER
------------------------------ */
const trackOrder = async (awbCode) => {
  const res = await shiprocketAxios.get(
    `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`
  );
  return res.data;
};

/* ------------------------------
   CANCEL ORDER
------------------------------ */
const cancelOrder = async (shiprocketOrderId) => {
  const res = await shiprocketAxios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/cancel",
    { ids: [shiprocketOrderId] }
  );
  return res.data;
};

export const shipRocketService = {
  createOrder,
  trackOrder,
  cancelOrder,
};
