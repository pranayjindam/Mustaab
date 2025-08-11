import { Cart } from "../Models/Cart.model.js";

// Create or Update Cart
export const upsertCartItem = async (userId, newItem) => {
  let cart = await Cart.findOne({ userId });

  const index = cart?.items.findIndex(
    item =>
      item.productId.toString() === newItem.productId &&
      item.size === newItem.size &&
      item.color === newItem.color
  );

  if (cart) {
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

// Get Cart by User
export const getCartByUser = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate("items.productId");
  return cart;
};


export const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(userId) });
  if (!cart) return null;

  cart.items = cart.items.filter(item =>
    !(
      item.product.toString() === productId)
  );

  cart.amount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  await cart.save();
  return cart;
};



// Clear Cart
export const clearCart = async (userId) => {
  return await Cart.findOneAndUpdate({ userId }, { items: [], amount: 0 }, { new: true });
};


const calculateAmount = (items) => {
  return items.reduce((acc, item) => {
    const discountedPrice = item.price - (item.price * item.discount / 100);
    return acc + discountedPrice * item.qty;
  }, 0);
};


export const updateCartItemQty = async (userId, productId, qty, size, color) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.productId.toString() === productId &&
      item.size === size &&
      item.color === color
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



