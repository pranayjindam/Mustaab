import * as productService from "../Services/Product.service.js";

// ✅ Create a new product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, message: "Product created", product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all products (Public)
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const products = await productService.getAllProducts(page, limit);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single product by ID (Public)
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get products by category (Public)
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await productService.getProductsByCategory(req.params.category);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Update Product Controller
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProductById(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete a product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted", product: deletedProduct });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// 🔎 Search products by keyword
export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q?.trim();
    if (!keyword) return res.status(400).json({ success: false, message: "Search keyword is required" });

    const products = await productService.searchProducts(keyword);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🌟 Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 Add multiple products (Admin only)
export const addMultipleProducts = async (req, res) => {
  try {
    const productsArray = req.body.products;
    if (!Array.isArray(productsArray) || productsArray.length === 0) {
      return res.status(400).json({ success: false, message: "Provide a non-empty array of products" });
    }

    const insertedProducts = await productService.createMultipleProducts(productsArray);
    res.status(201).json({ success: true, message: `${insertedProducts.length} products added`, products: insertedProducts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all dynamic categories
export const getProductCategories = async (req, res) => {
  try {
    const categories = await productService.getAllCategories();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
