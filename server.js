import dotenv from "dotenv";
dotenv.config();

import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { connectDb } from "./Config/db.js";
import { initializeAdminUser } from "./Services/Admin.service.js";
import { app } from "./index.js";

// Import chatbot options
import { chatbotOptions } from "./chatbotOptions.js";

const PORT = process.env.PORT || 2000;

const startServer = async () => {
  try {
    console.log("🚀 Starting server...");

    // Connect MongoDB
    await connectDb();
    await initializeAdminUser();

    // Middleware
    app.use(express.json());
    app.use(cors({
      origin: [
        "http://localhost:1000",
        "https://mustaab-frontend.vercel.app"
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }));

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:1000",
          "https://mustaab-frontend.vercel.app"
        ],
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // General realtime connections (for orders, etc.)
    io.on("connection", (socket) => {
      console.log("⚡ Client connected to main namespace:", socket.id);
      
      socket.on("createOrder", (order) => {
        io.emit("newOrder", order);
        console.log("📦 New order broadcast:", order);
      });
      
      socket.on("disconnect", () => {
        console.log("❌ Client disconnected from main namespace:", socket.id);
      });
    });

    // ============= CHATBOT NAMESPACE =============
    const chatNamespace = io.of("/chatbot");

    chatNamespace.on("connection", (socket) => {
      console.log("💬 Chatbot client connected:", socket.id);

      // Send welcome message after a short delay
      setTimeout(() => {
        socket.emit("botMessage", chatbotOptions.welcome);
      }, 100);

      // Handle user messages
      socket.on("userMessage", (message) => {
        console.log(`📨 Message from ${socket.id}:`, message);
        
        // Convert message to lowercase and trim for matching
        const key = message.toLowerCase().trim();
        
        // Get response from chatbotOptions
        let response = chatbotOptions[key];
        
        // If no match found, use default
        if (!response) {
          console.log(`⚠️  No match found for: "${key}", using default response`);
          response = chatbotOptions.default;
        }

        // Final safety check - ensure response exists and has required properties
        if (!response || !response.text || !response.buttons) {
          console.error(`❌ Invalid response for key: "${key}"`);
          response = {
            text: "Sorry, I didn't understand that. Please select an option below:",
            buttons: ["Orders", "Support", "Offers", "Account", "Products", "Shipping"]
          };
        }
        
        // Send bot response
        socket.emit("botMessage", { 
          text: response.text, 
          buttons: response.buttons 
        });
        
        console.log(`🤖 Bot response sent to ${socket.id}`);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("💤 Chatbot client disconnected:", socket.id);
      });

      // Error handling
      socket.on("error", (error) => {
        console.error("❌ Chatbot socket error:", error);
      });
    });

    // Start server
    server.listen(PORT, () => {
      console.log(`
  ╔═══════════════════════════════════════╗
  ║   🚀 Mustaab Server Running          ║
  ║   📡 Port: ${PORT}                        ║
  ║   🌍 Environment: ${process.env.NODE_ENV || 'development'}       ║
  ║   💬 Chatbot: /chatbot namespace     ║
  ║   📦 Orders: main namespace          ║
  ╚═══════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('👋 SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();