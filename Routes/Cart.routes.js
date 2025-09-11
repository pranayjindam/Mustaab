import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../Controllers/Cart.controller.js";
import { AuthenticateUser } from "../Middlewares/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", AuthenticateUser, addToCart);
cartRouter.get("/", AuthenticateUser, getCart);
cartRouter.put("/update", AuthenticateUser, updateCartItem);
cartRouter.delete("/remove/:productId", AuthenticateUser, removeFromCart);

cartRouter.delete("/clear", AuthenticateUser, clearCart);

export default cartRouter;
