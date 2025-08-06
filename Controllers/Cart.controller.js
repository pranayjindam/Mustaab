// controllers/cartController.js
import {
  updateCartItemQty,
  getCartByUser,
  removeCartItem,
  clearCart,
  upsertCartItem,
} from "../Services/Cart.service.js";

export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { productId, qty, size, color } = req.body;
    const cart = await updateCartItemQty(userId, productId, qty, size, color);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const cart = await getCartByUser(req.user.id);
    res.json({
      success: true,
      cart: cart || { items: [], amount: 0 }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


export const clearUserCart = async (req, res) => {
  try {
    const cart = await clearCart(req.user.id);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const newItem = req.body;
 console.log("Authenticated user:", req.user); // for debugging


    const cart = await upsertCartItem(userId, newItem);
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const removeItemFromCart = async (req, res) => {
  try {
    const { productId, size, color } = req.query;

    // Validate token (assuming you use Bearer token in header)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Missing productId" });
    }

    const cart = await removeCartItem(userId, productId, size, color);

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("❌ Error removing item from cart:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

