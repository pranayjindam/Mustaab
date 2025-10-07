import mongoose from "mongoose";
import { Product } from "../Models/Product.model.js";


export const createProduct = async (data) => {
  console.log("Received product data:", data);

  if (!data.category || !data.category.main) {
    throw new Error("Category main ID is required");
  }

  const productData = {
    ...data,
    category: {
      main: new mongoose.Types.ObjectId(data.category.main), // ✅ use 'new'
      sub: data.category.sub ? new mongoose.Types.ObjectId(data.category.sub) : null,
      type: data.category.type ? new mongoose.Types.ObjectId(data.category.type) : null,
    },
    price: Number(data.price),
    stock: Number(data.stock),
    discount: Number(data.discount || 0),
    
  };

  console.log("Converted product data for DB:", productData);

  const product = new Product(productData);
  const saved = await product.save();

  console.log("Saved product:", saved);
  return saved;
};
export const addMultipleProducts = async (productsArray) => {
  if (!Array.isArray(productsArray) || productsArray.length === 0) {
    throw new Error("Products array is required and cannot be empty");
  }

  const formattedProducts = productsArray.map((data) => {
    if (!data.category || !data.category.main) {
      throw new Error("Category main ID is required for each product");
    }

    return {
      ...data,
      category: {
        main: new mongoose.Types.ObjectId(data.category.main),
        sub: data.category.sub ? new mongoose.Types.ObjectId(data.category.sub) : null,
        type: data.category.type ? new mongoose.Types.ObjectId(data.category.type) : null,
      },
      price: Number(data.price),
      stock: Number(data.stock),
      discount: Number(data.discount || 0),
    };
  });

  const savedProducts = await Product.insertMany(formattedProducts);
  console.log(`${savedProducts.length} products added successfully`);
  return savedProducts;
};

export const getAllProducts = async () => {
  return Product.find()
    .populate("category.main category.sub category.type")
    .sort({ createdAt: -1 });
};

export const getProductById = async (id) => {
  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }

  // Fetch product
  const product = await Product.findById(id)
    .populate("category.main category.sub category.type");

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const getProductsByCategory = async (categoryId) => {
  return Product.find({
    $or: [
      { "category.main": categoryId },
      { "category.sub": categoryId },
      { "category.type": categoryId },
    ],
  }).populate("category.main category.sub category.type");
};

export const updateProduct = async (id, data) => {
  const productData = {};

  // Update price, stock, discount only if provided
  if (data.price !== undefined) productData.price = Number(data.price);
  if (data.stock !== undefined) productData.stock = Number(data.stock);
  if (data.discount !== undefined) productData.discount = Number(data.discount);

  // Merge other fields (like name, description, brand, etc.)
  for (const key of Object.keys(data)) {
    if (!['price', 'stock', 'discount', 'category'].includes(key)) {
      productData[key] = data[key];
    }
  }

  // Handle category separately
  if (data.category) {
    productData.category = {};
    if (data.category.main) productData.category.main = mongoose.Types.ObjectId(data.category.main);
    if (data.category.sub) productData.category.sub = mongoose.Types.ObjectId(data.category.sub);
    if (data.category.type) productData.category.type = mongoose.Types.ObjectId(data.category.type);
  }

  return Product.findByIdAndUpdate(id, productData, { new: true });
};


export const deleteProduct = async (id) => {
  return Product.findByIdAndDelete(id);
};

export const searchProducts = async (keyword) => {
  const regex = new RegExp(keyword, "i");
  return Product.find({ title: regex }).populate("category.main category.sub category.type");
};

export const getFeaturedProducts = async () => {
  return Product.find({ isFeatured: true }).populate("category.main category.sub category.type");
};
