// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./Routes/User.routes.js";
import ProductRouter from "./Routes/Product.routes.js";
import cartRouter from "./Routes/Cart.routes.js";
import addressRouter from "./Routes/Address.routes.js";
import orderRouter from "./Routes/Order.routes.js";
import adminRouter from "./Routes/Admin.routes.js";
import paymentRouter from "./Routes/Payment.routes.js";
import authRouter from "./Routes/Auth.routes.js";
import { AuthenticateAdmin, AuthenticateUser } from "./Middlewares/auth.js";

dotenv.config();

const app = express();
import { swaggerSpec, swaggerUiExpress } from './swagger.js';
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:1000",
  "https://mustaab-frontend.vercel.app"
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed."));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Enable pre-flight for all routes
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to ecommerce API - node" });
});

// Authenticated and public routes
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", AuthenticateUser, cartRouter);
app.use("/api/address", AuthenticateUser, addressRouter);
app.use("/api/order", AuthenticateUser, orderRouter);
app.use("/api/product", ProductRouter);
app.use("/api/payment", AuthenticateUser, paymentRouter);

export { app };
