import * as productService from "../Services/Product.service.js";
import  Product  from "../Models/Product.model.js";
// ✅ Create a new product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, message: "Product created", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all products (Public)
export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
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
    const { id } = req.params; // product id from URL
    const updateData = req.body; // updated fields from request body

    // Call service to update
    const updatedProduct = await productService.updateProductById(id, updateData);

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
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

// ✅ Search products by title
export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q?.trim();
    if (!keyword) {
      return res.status(400).json({ success: false, message: "Search keyword is required" });
    }

    const products = await productService.searchProducts(keyword);
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
};

// ✅ Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Add multiple products (Admin only)
export const addMultipleProducts = async (req, res) => {
  try {
    const products = req.body.products;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a non-empty array of products",
      });
    }

    const insertedProducts = await productService.createMultipleProducts(products);
    res.status(201).json({
      success: true,
      message: `${insertedProducts.length} products added successfully`,
      products: insertedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding products",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category"); // 🔥 unique categories
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (err) {
    console.error("Category fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};



