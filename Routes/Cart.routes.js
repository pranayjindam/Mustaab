import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { AuthenticateUser } from "../middlewares/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", AuthenticateUser, addToCart);
cartRouter.get("/", AuthenticateUser, getCart);
cartRouter.put("/update", AuthenticateUser, updateCartItem);
cartRouter.delete("/remove", AuthenticateUser, removeCartItem);
cartRouter.delete("/clear", AuthenticateUser, clearCart);

export default cartRouter;
