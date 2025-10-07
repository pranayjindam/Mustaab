import express from "express";
import {
  addWishlistItem,
  getWishlistItems,
  deleteWishlistItem,
  clearWishlistItems,
} from "../Controllers/Wishlist.controller.js";
import { AuthenticateUser } from "../Middlewares/auth.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", AuthenticateUser, addWishlistItem);
wishlistRouter.get("/get", AuthenticateUser, getWishlistItems);
wishlistRouter.delete("/delete/:productId", AuthenticateUser, deleteWishlistItem);
wishlistRouter.delete("/clear", AuthenticateUser, clearWishlistItems);

export default wishlistRouter;
