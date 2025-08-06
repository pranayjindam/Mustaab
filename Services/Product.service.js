import Product from "../models/Product.model.js";

// 🟢 Create a new product (Admin only)
export const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

// 📋 Get all products (Public)
export const getAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

// 🔍 Get a single product by ID
export const getProductById = async (productId) => {
  return await Product.findById(productId);
};

// 📦 Get products by category (men, women, etc.)
export const getProductsByCategory = async (category) => {
  const validCategories = [
    "mens-shirts",
    "mens-tshirts",
    "womens-dresses",
    "womens-jewellery",
    "womens-sarees",
    "ornaments",
    "beauty-items",
    "kids-wear",
    "shoes",
    "bags",
    "accessories",
    "mens-shoes"
  ];
  if (!validCategories.includes(category)) {
    throw new Error("Invalid category");
  }
  return await Product.find({ category }).sort({ createdAt: -1 });
};

// ✏️ Update a product (Admin only)
export const updateProduct = async (productId, updateData) => {
  updateData["meta.updatedAt"] = new Date(); // update timestamp
  const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedProduct) throw new Error("Product not found or update failed");
  return updatedProduct;
};

// ❌ Delete a product (Admin only)
export const deleteProduct = async (productId) => {
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) throw new Error("Product not found or delete failed");
  return deletedProduct;
};

// 🔎 Search products by title (NOT name)
export const searchProducts = async (keyword) => {
  return await Product.find({
    title: { $regex: keyword, $options: "i" },
  });
};

// 🌟 Get featured products
export const getFeaturedProducts = async () => {
  return await Product.find({ isFeatured: true });
};

// 💬 Add a review
export const addReview = async (productId, review) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.reviews.push({
    rating: review.rating,
    comment: review.comment,
    reviewerName: review.reviewerName,
    reviewerEmail: review.reviewerEmail,
    date: new Date(),
  });

  // Update average rating
  const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = parseFloat((totalRating / product.reviews.length).toFixed(2));

  return await product.save();
};


// 🟢 Add multiple products at once
export const createMultipleProducts = async (productsArray) => {
  if (!Array.isArray(productsArray) || productsArray.length === 0) {
    throw new Error("Invalid or empty products array");
  }

  const insertedProducts = await Product.insertMany(productsArray, { ordered: false });
  return insertedProducts;
};
