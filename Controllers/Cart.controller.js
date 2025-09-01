import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

// ✅ Create / Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { productId, qty, color, size } = req.body;

    // find product details
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // create new cart
      cart = new Cart({
        userId,
        items: [{
          productId,
          name: product.name,
          price: product.price,
          discount: product.discount,
          qty,
          color,
          size,
          image: product.images[0] || ""
        }]
      });
    } else {
      // check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // update quantity
        cart.items[itemIndex].qty += qty;
      } else {
        // push new item
        cart.items.push({
          productId,
          name: product.name,
          price: product.price,
          discount: product.discount,
          qty,
          color,
          size,
          image: product.images[0] || ""
        });
      }
    }

    // recalc total
    cart.amount = cart.items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    await cart.save();
    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(200).json({ items: [], amount: 0 });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update quantity of a cart item
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    cart.items[itemIndex].qty = qty;

    // recalc total
    cart.amount = cart.items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    await cart.save();
    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // recalc total
    cart.amount = cart.items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    await cart.save();
    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], amount: 0 } }
    );
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
