import * as wishlistService from "../Services/Wishlist.service.js";

// Add item
export const addWishlistItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, name, price, image } = req.body;
    if (!userId || !productId)
      return res.status(400).json({ message: "userId and productId are required" });

    const product = { productId, name, price, image };
    const wishlist = await wishlistService.addToWishlist(userId, product);
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wishlist
export const getWishlistItems = async (req, res) => {
  try {
    const userId = req.user?.id;
    const wishlist = await wishlistService.getWishlistByUser(userId);
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove product
export const deleteWishlistItem = async (req, res) => {
  try {
    const userId = req.user?._id; // Make sure this is `_id` from Mongo
    const { productId } = req.params;

    if (!userId || !productId)
      return res.status(400).json({ message: "userId and productId are required" });

    const wishlist = await wishlistService.removeWishlistItem(userId, productId);
    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Wishlist delete error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// Clear all
export const clearWishlistItems = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const wishlist = await wishlistService.clearWishlistByUser(userId);
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
