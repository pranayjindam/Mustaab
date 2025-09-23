import Wishlist from "../Models/Wishlist.model.js";

// ➕ Add product to wishlist
export const addToWishlist = async (userId, product) => {
  if (!product || !product.productId) {
    throw new Error("Invalid product data");
  }

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    // ✅ push whole product object, not product._id
    wishlist = new Wishlist({ userId, products: [product] });
  } else {
    if (!wishlist.products) wishlist.products = [];

    // Check if product already exists
    const exists = wishlist.products.some(
      (p) => p?.productId?.toString() === product.productId.toString()
    );

    if (exists) throw new Error("Product already in wishlist");

    wishlist.products.push(product);
  }

  await wishlist.save();
  return wishlist;
};

// 📥 Get wishlist
export const getWishlistByUser = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId })
    .populate("products.productId", "title price thumbnail");

  if (!wishlist) return { userId, products: [] };

  const formatted = wishlist.products
    .filter((p) => p && p.productId) // avoid nulls
    .map((p) => ({
      _id: p._id,
      productId: p.productId._id,
      name: p.productId.title || p.name,
      price: p.productId.price || p.price,
      image: p.productId.thumbnail || p.image,
    }));

  return { userId: wishlist.userId, products: formatted };
};

// ❌ Remove product

export const removeWishlistItem = async (userId, productId) => {
  const wishlist = await Wishlist.findOne( userId );

  if (!wishlist) throw new Error("Wishlist not found");
  if (!wishlist.products || wishlist.products.length === 0) {
    throw new Error("No products in wishlist");
  }

  wishlist.products = wishlist.products.filter(
    (p) => p?.productId?.toString() !== productId.toString()
  );

  await wishlist.save();
  return wishlist;
};

// 🧹 Clear all wishlist items
export const clearWishlistByUser = async (userId) => {
  const wishlist = await Wishlist.findOne( userId );
  if (!wishlist) throw new Error("Wishlist not found");

  wishlist.products = [];
  await wishlist.save();
  return wishlist;
};
