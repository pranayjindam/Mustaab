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
import {swaggerUi, swaggerSpec }  from './swagger.js';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Allow CORS for React frontend on port 1000
app.use(cors({
  origin: "*", // Allow requests from any origin
}));


// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to ecommerce API - node" });
});

// ✅ Authenticated and public routes
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/auth",authRouter);
app.use("/api/cart", AuthenticateUser, cartRouter);
app.use("/api/address", AuthenticateUser, addressRouter);
app.use("/api/order", AuthenticateUser, orderRouter);
app.use("/api/product", ProductRouter);
app.use("/api/payment",AuthenticateUser,paymentRouter)
export { app };
