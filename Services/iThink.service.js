import fetch from "node-fetch";

const BASE_URL = "https://api.ithinklogistics.com/api_v3";

export const iThinkService = {
  createOrder: async ({ shipments }) => {
    const payload = {
      data: {
        access_token: process.env.ITHINK_ACCESS_TOKEN,
        secret_key: process.env.ITHINK_SECRET_KEY,
        pickup_address_id: process.env.ITHINK_PICKUP_ADDRESS_ID,
        logistics: "delhivery",
        s_type: "1",

        shipments: shipments.map(s => ({
          ...s,
          store_id: process.env.ITHINK_STORE_ID,
          weight: "800" // grams, integer
        }))
      }
    };

    console.log("🔥 iThink FINAL PAYLOAD:", JSON.stringify(payload, null, 2));

    const response = await fetch(`${BASE_URL}/order/add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();

    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  },
};
