import express from "express";
import {
  addWishlistItem,
  getWishlistItems,
  deleteWishlistItem,
  clearWishlistItems,
} from "../Controllers/Wishlist.controller.js";

const wishlistRouter = express.Router();

// Create or add item to wishlist
wishlistRouter.post("/add", addWishlistItem);

// Get wishlist by user
wishlistRouter.get("/get", getWishlistItems);

// Delete single product from wishlist
wishlistRouter.delete("/delete/:productId", deleteWishlistItem);

// Clear wishlist
wishlistRouter.delete("/clear", clearWishlistItems);

export default wishlistRouter;
