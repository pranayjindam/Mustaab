import Product from "../Models/Product.model.js";
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
    const { productId, qty, color, size } = req.body;

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
  const { productId } = req.params;
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  await cart.save();
  res.json(cart);
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
