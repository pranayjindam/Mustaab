import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./Routes/User.routes.js";
import ProductRouter from "./Routes/Product.routes.js";
import cartRouter from "./Routes/Cart.routes.js";
import addressRouter from "./Routes/Address.routes.js";
import adminRouter from "./Routes/Admin.routes.js";
import authRouter from "./Routes/Auth.routes.js";
import { AuthenticateAdmin, AuthenticateUser } from "./Middlewares/auth.js";
import reviewRouter from "./Routes/Review.routes.js";
import { swaggerSpec, swaggerUiExpress } from './swagger.js';
import carouselRouter from "./Routes/Carousel.routes.js";
import recentRouter from "./Routes/Recent.routes.js";
import categoryRouter from "./Routes/Category.routes.js";
import orderRouter from "./Routes/Order.routes.js";
import paymentRouter from "./Routes/Payment.routes.js";
import wishlistRouter from "./Routes/Wishlist.routes.js";
import returnRequestRouter from "./Routes/ReturnRequests.routes.js";
dotenv.config();
const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

const allowedOrigins = [
  "http://localhost:1000",
  "https://mustaab-frontend.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed."));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parses URL-encoded payloads
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to ecommerce API - node" });
});

// common routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", AuthenticateUser, cartRouter);
app.use("/api/address", AuthenticateUser, addressRouter);
app.use("/api/review",reviewRouter);
app.use("/api/recent",recentRouter);
app.use("/api/orders",orderRouter);
app.use("/api/payment",paymentRouter);
app.use("/api/wishlist", AuthenticateUser, wishlistRouter);
app.use("/api/return-requests",returnRequestRouter)
//admin routes
app.use("/api/product", ProductRouter);
app.use("/api/carousel",carouselRouter)
app.use("/api/category",categoryRouter);
app.use("/api/admin", adminRouter);
export { app };
