import Wishlist from "../Models/Wishlist.model.js";

// ➕ Add product to wishlist
export const addToWishlist = async (userId, product) => {
  if (!product || !product.productId) throw new Error("Invalid product data");

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = new Wishlist({ userId, products: [product] });
  } else {
    if (!wishlist.products) wishlist.products = [];

    const exists = wishlist.products.some(
      (p) => p.productId.toString() === product.productId.toString()
    );

    if (exists) throw new Error("Product already in wishlist");

    wishlist.products.push(product);
  }

  await wishlist.save();
  return wishlist;
};

// 📥 Get wishlist
export const getWishlistByUser = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId }).populate(
    "products.productId",
    "title price thumbnail"
  );

  if (!wishlist) return { userId, products: [] };

  const formatted = wishlist.products
    .filter((p) => p && p.productId)
    .map((p) => ({
      _id: p._id,
      productId: p.productId._id,
      name: p.productId.title || p.name,
      price: p.productId.price || p.price,
      image: p.productId.thumbnail || p.image,
    }));

  return { userId: wishlist.userId, products: formatted };
};

export const removeWishlistItem = async (userId, productId) => {
  if (!userId || !productId) throw new Error("Invalid userId or productId");

  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) throw new Error("Wishlist not found");

  // Remove product safely
  wishlist.products = wishlist.products.filter((p) => {
    const pid = p.productId?._id?.toString() || p.productId?.toString();
    return pid !== productId.toString();
  });

  await wishlist.save();

  // Return formatted response
  return {
    userId: wishlist.userId,
    products: wishlist.products.map((p) => ({
      _id: p._id,
      productId: p.productId._id || p.productId,
      name: p.name,
      price: p.price,
      image: p.image,
    })),
  };
};

// 🧹 Clear wishlist
export const clearWishlistByUser = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) throw new Error("Wishlist not found");

  wishlist.products = [];
  await wishlist.save();
  return wishlist;
};
