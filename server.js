import dotenv from "dotenv";
dotenv.config();

import http from "http"; // 👈 new
import { Server } from "socket.io"; // 👈 new

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

    console.log(`🌐 Starting Express + Socket.IO on port ${PORT}...`);

    // ✅ Create HTTP server from Express app
    const server = http.createServer(app);

    // ✅ Attach Socket.IO
    const io = new Server(server, {
      cors: {
        origin: "*", // allow frontend (you can restrict later)
        methods: ["GET", "POST"],
      },
    });

    // ✅ Handle socket connections
    io.on("connection", (socket) => {
      console.log("⚡ Client connected:", socket.id);

      // Example: when an order is created in backend, broadcast
      socket.on("createOrder", (order) => {
        io.emit("newOrder", order);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });

    // ✅ Start server
    server.listen(PORT, () => {
      console.log(`✅ Server is live at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
