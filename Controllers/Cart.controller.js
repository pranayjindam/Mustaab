import {Product} from "../Models/Product.model.js";
import {
  upsertCartItem,
  getCartByUser,
  removeCartItemById,
  updateCartItemQty,
  clearCartByUser,
} from "../Services/Cart.service.js";



// ✅ Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let { productId, qty, color, size } = req.body;

    // Ensure qty is a number, default to 1
    qty = Number(qty) || 1;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await upsertCartItem(userId, {
      productId,
      name: product.name,
      price: product.price,
      discount: product.discount,
      qty,
      color,
      size,
      image: product.images[0] || "",
    });

    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ Get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getCartByUser(userId);
    res.status(200).json(cart || { items: [], amount: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;
    
    const cart = await updateCartItemQty(userId, productId, qty);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Remove cart item


export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user._id;

    const result = await removeCartItemById(userId, productId);

    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }

    return res.json({ success: true, message: result.message, cart: result.cart });
  } catch (err) {
    console.error("Remove from cart error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};



// ✅ Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await clearCartByUser(userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
