
import * as productService from "../Services/Product.service.js";
import cloudinary from "../config/cloudinary.js";
import { Product } from "../Models/Product.model.js";
import mongoose from "mongoose";

// Helper to upload a file buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

export const createProduct = async (req, res) => {
  try {
    console.log("🧾 Received FormData fields:", req.body);
    console.log("📸 Received files:", req.files);

    // Parse JSON fields
    const parsedData = {
      ...req.body,
      category: JSON.parse(req.body.category || "{}"),
      tags: JSON.parse(req.body.tags || "[]"),
      sizes: JSON.parse(req.body.sizes || "[]"),
      colors: JSON.parse(req.body.colors || "[]"),
    };

    // Upload thumbnail
    if (req.files?.thumbnail?.[0]) {
      parsedData.thumbnail = await uploadToCloudinary(
        req.files.thumbnail[0].buffer,
        "products/thumbnails",
        req.files.thumbnail[0].originalname
      );
    }

    // Upload product images
    if (req.files?.images?.length) {
      parsedData.images = [];
      for (const file of req.files.images) {
        const url = await uploadToCloudinary(
          file.buffer,
          "products/images",
          file.originalname
        );
        parsedData.images.push(url);
      }
    }

    // Upload color variant images
    if (req.files?.colorImages?.length) {
      for (let i = 0; i < parsedData.colors.length; i++) {
        if (req.files.colorImages[i]) {
          parsedData.colors[i].image = await uploadToCloudinary(
            req.files.colorImages[i].buffer,
            "products/colors",
            req.files.colorImages[i].originalname
          );
        }
      }
    }

    // Convert numeric and boolean fields
    const productData = {
      ...parsedData,
      price: Number(parsedData.price),
      stock: Number(parsedData.stock),
      discount: Number(parsedData.discount || 0),
      isFeatured: parsedData.isFeatured === "true",
      isReturnable: parsedData.isReturnable === "true",
      isExchangeable: parsedData.isExchangeable === "true",
      category: {
        main: new mongoose.Types.ObjectId(parsedData.category.main),
        sub: parsedData.category.sub
          ? new mongoose.Types.ObjectId(parsedData.category.sub)
          : null,
        type: parsedData.category.type
          ? new mongoose.Types.ObjectId(parsedData.category.type)
          : null,
      },
    };

    const product = new Product(productData);
    const saved = await product.save();
    console.log("✅ Saved product:", saved);

    res.status(201).json({ success: true, product: saved });
  } catch (err) {
    console.error("❌ Error creating product:", err);
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
