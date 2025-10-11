
import * as productService from "../Services/Product.service.js";
import { Product } from "../Models/Product.model.js";

export const createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const addmultipleProducts=async(req,res)=>{
  try{
    const products=await productService.addMultipleProducts(req.body);
    res.status(201).json({success:true,products});
  }
  catch (err) {
    console.error("Error creating products:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await productService.getProductsByCategory(req.params.category);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const products = await productService.searchProducts(req.params.keyword);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.json({ success: true, products: [] });
    }

const products = await Product.aggregate([
  // Lookup categories
  {
    $lookup: {
      from: "categories",
      localField: "category.main",
      foreignField: "_id",
      as: "mainCategory",
    },
  },
  {
    $lookup: {
      from: "categories",
      localField: "category.sub",
      foreignField: "_id",
      as: "subCategory",
    },
  },
  {
    $lookup: {
      from: "categories",
      localField: "category.type",
      foreignField: "_id",
      as: "typeCategory",
    },
  },
  // Flatten arrays and handle missing values
  {
    $addFields: {
      category: {
        main: { $ifNull: [{ $arrayElemAt: ["$mainCategory.name", 0] }, ""] },
        sub: { $ifNull: [{ $arrayElemAt: ["$subCategory.name", 0] }, ""] },
        type: { $ifNull: [{ $arrayElemAt: ["$typeCategory.name", 0] }, ""] },
      },
    },
  },
  // Match any field with query (works for single letters too)
  {
    $match: {
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { description: { $regex: new RegExp(query, "i") } },
        { "colors.name": { $regex: new RegExp(query, "i") } },
        { tags: { $regex: new RegExp(query, "i") } },
        { "category.main": { $regex: new RegExp(query, "i") } },
        { "category.sub": { $regex: new RegExp(query, "i") } },
        { "category.type": { $regex: new RegExp(query, "i") } },
      ],
    },
  },
  // Only return needed fields
  {
    $project: {
      _id: 1,
      title: 1,
      price: 1,
      colors: "$colors.name",
      category: 1,
    },
  },
  { $limit: 10 },
]);


    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching products",
      error: error.message,
    });
  }
};





export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getBarCode=async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

    bwipjs.toBuffer({
      bcid: "code128",       // Barcode type
      text: product._id.toString(), // Use product ID
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    }, (err, png) => {
      if (err) return res.status(500).send("Error generating barcode");
      res.type("image/png");
      res.send(png);
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
