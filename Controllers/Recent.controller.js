import * as recentService from "../Services/Recent.service.js";

// POST /api/recent/add
export const addRecentProduct = async (req, res) => {
  try {
    const userId = req.user.id; // from AuthenticateUser middleware
    const { productId } = req.body;
    const doc = await recentService.addRecentProduct(userId, productId);
    res.json({ success: true, recent: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/recent
export const getRecentProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await recentService.getRecentProducts(userId, 10);
    res.json({ success: true, recent: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/recent/clear
export const clearRecentProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    await recentService.clearRecentProducts(userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
