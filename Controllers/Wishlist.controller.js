import * as wishlistService from "../Services/Wishlist.service.js";

// Add
export const addWishlistItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { productId, name, price, image } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const product = { productId, name, price, image };
    const wishlist = await wishlistService.addToWishlist(userId, product);

    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get
export const getWishlistItems = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    const wishlist = await wishlistService.getWishlistByUser(userId);
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove
export const deleteWishlistItem = async (req, res) => {
  try {
    const { userId } = req.user || req.body;
    const { productId } = req.params;

    const result = await wishlistService.removeWishlistItem(userId, productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear
export const clearWishlistItems = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const wishlist = await wishlistService.clearWishlistByUser({userId});
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
