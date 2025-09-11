import Product from "../Models/Product.model.js";
import { Category } from "../Models/Category.model.js";

// 🟢 Create a new product with dynamic category validation
export const createProduct = async (productData) => {
  // Validate category exists
  const categoryExists = await Category.findOne({ name: productData.category });
  if (!categoryExists) {
    throw new Error(`Category "${productData.category}" does not exist.`);
  }

  const product = new Product(productData);
  return await product.save();
};

// 📋 Get all products with pagination
export const getAllProducts = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const products = await Product.find()
    .select("title price images category brand")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments();
  return { products, total, page, pages: Math.ceil(total / limit) };
};

// 🔍 Get a single product by ID
export const getProductById = async (productId) => {
  return await Product.findById(productId);
};

// 📦 Get products by category dynamically
export const getProductsByCategory = async (category) => {
  return await Product.find({ category }).sort({ createdAt: -1 });
};

// ✅ Update product with dynamic category validation
export const updateProductById = async (id, updateData) => {
  if (updateData.category) {
    const categoryExists = await Category.findOne({ name: updateData.category });
    if (!categoryExists) {
      throw new Error(`Category "${updateData.category}" does not exist.`);
    }
  }

  return await Product.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// ❌ Delete product
export const deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};

// 🔎 Search

export const searchProducts = async (keyword) => {
  return await Product.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
      { brand: { $regex: keyword, $options: "i" } },
      { tags: { $regex: keyword, $options: "i" } },
    ],
  });
};


// 🌟 Featured
export const getFeaturedProducts = async () => {
  return await Product.find({ isFeatured: true });
};

// 💬 Add Review
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

  // Recalculate average rating
  const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = parseFloat((totalRating / product.reviews.length).toFixed(2));

  return await product.save();
};

// 🟢 Add multiple products with category validation
export const createMultipleProducts = async (productsArray) => {
  for (const product of productsArray) {
    const categoryExists = await Category.findOne({ name: product.category });
    if (!categoryExists) {
      throw new Error(`Category "${product.category}" does not exist.`);
    }
  }
  return await Product.insertMany(productsArray, { ordered: false });
};

// 📋 Get all unique categories dynamically
export const getAllCategories = async () => {
  return await Category.find().select("name -_id"); // returns only names
};
