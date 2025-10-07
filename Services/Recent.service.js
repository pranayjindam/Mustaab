import Recent from "../Models/Recent.model.js";
import {Product} from "../Models/Product.model.js"; // Your Product model

export const addRecentProduct = async (userId, productId) => {
  if (!productId) throw new Error("ProductId is required");

  let recent = await Recent.findOne({ user: userId });

  if (!recent) {
    recent = new Recent({ user: userId, products: [productId] });
  } else {
    // remove if already exists
    recent.products = recent.products.filter(
      (p) => p.toString() !== productId
    );
    // add to start
    recent.products.unshift(productId);

    if (recent.products.length > 10) {
      recent.products = recent.products.slice(0, 10);
    }
  }

  await recent.save();
  return recent.products;
};

// Recent.service.js

export const getRecentProducts = async (userId, limit = 10) => {
  const recent = await Recent.findOne({ user: userId }).lean();

  if (!recent) return [];

  // Fetch full product objects
  const products = await Product.find({ _id: { $in: recent.products } })
    .select("title price images category rating") // select only needed fields
    .lean();

  // Sort products in the order of recent.products
  const sortedProducts = recent.products
    .map((id) => products.find((p) => p._id.toString() === id.toString()))
    .filter(Boolean);

  return sortedProducts.slice(0, limit);
};


export const clearRecentProducts = async (userId) => {
  await Recent.findOneAndUpdate(
    { user: userId },
    { $set: { products: [] } }
  );
  return true;
};
