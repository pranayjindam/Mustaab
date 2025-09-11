import mongoose from "mongoose";
import Cart from "../Models/Cart.model.js";



// ✅ Add or update an item in the cart
export const upsertCartItem = async (userId, newItem) => {
  let cart = await Cart.findOne({ userId });

  // Always store productId as ObjectId
  newItem.productId = new mongoose.Types.ObjectId(newItem.productId);

  // Default qty to 1 if not provided
  if (!newItem.qty || newItem.qty < 1) newItem.qty = 1;

  if (cart) {
    // Check if product already exists in cart
    const index = cart.items.findIndex(item =>
      item.productId.equals(newItem.productId)
    );

    if (index !== -1) {
      // Already in cart → increment qty by newItem.qty
      cart.items[index].qty += newItem.qty;
    } else {
      // Not in cart → add new item
      cart.items.push(newItem);
    }

    // Recalculate total
    cart.amount = calculateAmount(cart.items);
    await cart.save();
  } else {
    // Create new cart
    cart = await Cart.create({
      userId,
      items: [newItem],
      amount: calculateAmount([newItem])
    });
  }

  return await cart.populate("items.productId");
};



// ✅ Get user cart
export const getCartByUser = async (userId) => {
  return await Cart.findOne({ userId }).populate("items.productId");
};

// ✅ Remove item from cart

// Utility to calculate total cart amount
const calculateAmount = (items) => {
  return items.reduce((acc, item) => {
    const discountedPrice = item.price - (item.price * (item.discount || 0) / 100);
    return acc + discountedPrice * item.qty;
  }, 0);
};


export const removeCartItemById = async (userId, productId) => {
  const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  if (!cart) return { success: false, message: "Cart not found" };

  const productObjectId = new mongoose.Types.ObjectId(productId);

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(item => !item.productId.equals(productObjectId));

  if (cart.items.length === initialLength) {
    return { success: false, message: "Item not found in cart" };
  }

  // Optional: recalc total price
  // cart.totalPrice = calculateTotal(cart.items);

  await cart.save();

  // Populate product details if needed
  const populatedCart = await cart.populate("items.productId");

  return { success: true, message: "Item removed successfully", cart: populatedCart };
};


// ✅ Update quantity
export const updateCartItemQty = async (userId, productId, qty) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) throw new Error("Item not found in cart");

  if (qty === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].qty = qty;
  }

  cart.amount = calculateAmount(cart.items);
  await cart.save();

  return await cart.populate("items.productId");
};

// ✅ Clear cart
export const clearCartByUser = async (userId) => {
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { items: [], amount: 0 },
    { new: true }
  );
  return cart;
};
