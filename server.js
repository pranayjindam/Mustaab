import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import express from "express";
import { connectDb } from "./Config/db.js";
import { initializeAdminUser } from "./Services/Admin.service.js";
import { app } from "./index.js";

const PORT = process.env.PORT || 2000;

const startServer = async () => {
  try {
    console.log("🚀 Starting server...");

    // Connect to MongoDB
    await connectDb();

    console.log("👤 Initializing admin user...");
    await initializeAdminUser();

    // -----------------------------
    // ✅ Express Middleware
    // -----------------------------
    // Enable JSON parsing
    app.use(express.json());

    // Enable CORS for frontend (replace with your frontend URL in production)
    app.use(
      cors(
     {
        origin: "https://mustaab-frontend.vercel.app", // frontend origin
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
  );

    // -----------------------------
    // ✅ Create HTTP server from Express app
    // -----------------------------
    const server = http.createServer(app);

    // -----------------------------
    // ✅ Attach Socket.IO
    // -----------------------------
    const io = new Server(server, {
      cors: {
        origin: "*", // allow frontend (you can restrict later)
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("⚡ Client connected:", socket.id);

      // Example: broadcast new orders
      socket.on("createOrder", (order) => {
        io.emit("newOrder", order);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });

    // -----------------------------
    // ✅ Start server
    // -----------------------------
    server.listen(PORT, () => {
      console.log(`🌐 Server live at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
