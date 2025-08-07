import dotenv from "dotenv";
dotenv.config();

import { connectDb } from "./config/db.js";
import { initializeAdminUser } from "./Services/Admin.service.js";
import { app } from "./index.js";

const PORT = process.env.PORT || 2000;

const startServer = async () => {
  try {
    console.log("🚀 Starting server...");
    await connectDb();

    console.log("👤 Initializing admin user...");
    await initializeAdminUser();

    console.log(`🌐 Starting Express on port ${PORT}...`);
    app.listen(PORT, () => {
      console.log(`✅ Server is live at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
