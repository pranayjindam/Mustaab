import mongoose from "mongoose";
import Cart from "../Models/Cart.model.js";

// Utility: calculate amount with discount
const calculateAmount = (items) => {
  return items.reduce((acc, item) => {
    const discountedPrice = item.price - (item.price * (item.discount || 0) / 100);
    return acc + discountedPrice * item.qty;
  }, 0);
};

// Add or update an item in the cart
export const upsertCartItem = async (userId, newItem) => {
  let cart = await Cart.findOne({ userId });

  if (cart) {
    const index = cart.items.findIndex(
      (item) => item.productId.toString() === newItem.productId
    );
    if (index !== -1) {
      cart.items[index].qty += newItem.qty;
    } else {
      cart.items.push(newItem);
    }
    cart.amount = calculateAmount(cart.items);
    await cart.save();
  } else {
    const amount = calculateAmount([newItem]);
    cart = await Cart.create({ userId, items: [newItem], amount });
  }

  return cart;
};

// Get user cart
export const getCartByUser = async (userId) => {
  return await Cart.findOne({ userId }).populate("items.productId");
};

// Remove item from cart
export const removeCartItemById = async (userId, productId) => {
  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  if (!cart) return null;

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  cart.amount = calculateAmount(cart.items);
  await cart.save();
  return cart;
};

// Update quantity
export const updateCartItemQty = async (userId, productId, qty) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) throw new Error("Item not found in cart");

  if (qty === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].qty = qty;
  }

  cart.amount = calculateAmount(cart.items);
  await cart.save();
  return cart;
};

// Clear cart
export const clearCartByUser = async (userId) => {
  return await Cart.findOneAndUpdate(
    { userId },
    { items: [], amount: 0 },
    { new: true }
  );
};
