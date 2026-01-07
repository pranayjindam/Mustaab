// Controllers/Product.controller.js
import * as productService from "../Services/Product.service.js";
import cloudinary from "../Config/cloudinary.js";
import { Product } from "../Models/Product.model.js";
import mongoose from "mongoose";
import bwipjs from "bwip-js";

/* ================= CLOUDINARY ================= */

const uploadToCloudinary = async (buffer, folder, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename, resource_type: "image" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

/* ================= CREATE ================= */

export const createProduct = async (req, res) => {
  try {
    const data = {
      ...req.body,
      category: JSON.parse(req.body.category || "{}"),
      tags: JSON.parse(req.body.tags || "[]"),
      sizes: JSON.parse(req.body.sizes || "[]"),
      colors: JSON.parse(req.body.colors || "[]"),
    };

    const colorImageMap = {};
    if (req.files?.colorImages?.length) {
      let ids = req.body.colorImageIds || [];
      if (!Array.isArray(ids)) ids = [ids];
      ids.forEach((id, i) => {
        if (id && req.files.colorImages[i]) {
          colorImageMap[id] = req.files.colorImages[i];
        }
      });
    }

    data.colors = await Promise.all(
      data.colors.map(async (c) => ({
        name: c.name,
        image:
          c._id && colorImageMap[c._id]
            ? await uploadToCloudinary(
                colorImageMap[c._id].buffer,
                "products/colors",
                colorImageMap[c._id].originalname
              )
            : c.image || "",
      }))
    );

    if (req.files?.thumbnail?.[0]) {
      data.thumbnail = await uploadToCloudinary(
        req.files.thumbnail[0].buffer,
        "products/thumbnails",
        req.files.thumbnail[0].originalname
      );
    }

    if (req.files?.images?.length) {
      data.images = await Promise.all(
        req.files.images.map((f) =>
          uploadToCloudinary(f.buffer, "products/images", f.originalname)
        )
      );
    }

    const product = await Product.create({
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      discount: Number(data.discount || 0),
      isFeatured: data.isFeatured === "true",
      isReturnable: data.isReturnable === "true",
      isExchangeable: data.isExchangeable === "true",
      isCancelable: data.isCancelable !== "false",
      barcode: data.barcode ? Number(data.barcode) : Number(Date.now()),
      category: {
        main: data.category.main,
        sub: data.category.sub || null,
        type: data.category.type || null,
      },
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE (FIXED) ================= */

export const updateProduct = async (req, res) => {
  try {
    ["category", "tags", "sizes", "colors"].forEach((k) => {
      if (typeof req.body[k] === "string") {
        req.body[k] = JSON.parse(req.body[k]);
      }
    });

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    /* ---------- THUMBNAIL ---------- */
    if (req.files?.thumbnail?.[0]) {
      product.thumbnail = await uploadToCloudinary(
        req.files.thumbnail[0].buffer,
        "products/thumbnails",
        req.files.thumbnail[0].originalname
      );
    }

    /* ---------- PRODUCT IMAGES (APPEND) ---------- */
    if (req.files?.images?.length) {
      const uploaded = await Promise.all(
        req.files.images.map((file) =>
          uploadToCloudinary(file.buffer, "products/images", file.originalname)
        )
      );
      product.images = [...(product.images || []), ...uploaded];
    }

    /* ---------- COLOR IMAGE MAP ---------- */
    const colorImageMap = {};
    let ids = req.body.colorImageIds || [];
    if (!Array.isArray(ids)) ids = [ids];

    if (req.files?.colorImages?.length) {
      ids.forEach((id, i) => {
        if (id && req.files.colorImages[i]) {
          colorImageMap[id] = req.files.colorImages[i];
        }
      });
    }

    /* ---------- COLORS ---------- */
    if (Array.isArray(req.body.colors)) {
      product.colors = await Promise.all(
        req.body.colors.map(async (c) => {
          const existing = c._id
            ? product.colors.find((pc) => pc._id.toString() === c._id)
            : null;

          let image = existing?.image || c.image || "";

          if (c._id && colorImageMap[c._id]) {
            image = await uploadToCloudinary(
              colorImageMap[c._id].buffer,
              "products/colors",
              colorImageMap[c._id].originalname
            );
          }

          return {
            _id: c._id ? new mongoose.Types.ObjectId(c._id) : new mongoose.Types.ObjectId(),
            name: c.name,
            image,
          };
        })
      );
    }

    /* ---------- BASIC FIELDS ---------- */
    if (req.body.title !== undefined) product.title = req.body.title;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.tags !== undefined) product.tags = req.body.tags;
    if (req.body.sizes !== undefined) product.sizes = req.body.sizes;

    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.body.stock !== undefined) product.stock = Number(req.body.stock);
    if (req.body.discount !== undefined) product.discount = Number(req.body.discount);
    if (req.body.barcode !== undefined) product.barcode = Number(req.body.barcode);

    if (req.body.isFeatured !== undefined)
      product.isFeatured = req.body.isFeatured === "true";
    if (req.body.isReturnable !== undefined)
      product.isReturnable = req.body.isReturnable === "true";
    if (req.body.isExchangeable !== undefined)
      product.isExchangeable = req.body.isExchangeable === "true";
    if (req.body.isCancelable !== undefined)
      product.isCancelable = req.body.isCancelable === "true";

    /* ---------- CATEGORY ---------- */
    if (req.body.category) {
      if (req.body.category.main)
        product.category.main = req.body.category.main;

      if ("sub" in req.body.category)
        product.category.sub = req.body.category.sub || null;

      if ("type" in req.body.category)
        product.category.type = req.body.category.type || null;
    }

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= OTHERS (UNCHANGED, SAFE) ================= */

export const addmultipleProducts = async (req, res) => {
  try {
    const products = await productService.addMultipleProducts(req.body);
    res.status(201).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts();
  res.json({ success: true, products });
};

export const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json({ success: true, product });
};

export const getProductsByCategory = async (req, res) => {
  const products = await productService.getProductsByCategory(req.params.category);
  res.json({ success: true, products });
};

export const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.json({ success: true });
};

export const searchProducts = async (req, res) => {
  const products = await productService.searchProducts(req.params.keyword);
  res.json({ success: true, products });
};

export const getSearchSuggestions = async (req, res) => {
  const q = req.query.query;
  if (!q) return res.json({ success: true, products: [] });

  const products = await Product.find(
    { title: { $regex: q, $options: "i" } },
    { title: 1 }
  ).limit(10);

  res.json({ success: true, products });
};

export const getFeaturedProducts = async (req, res) => {
  const products = await productService.getFeaturedProducts();
  res.json({ success: true, products });
};

export const getBarCode = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");

  bwipjs.toBuffer(
    {
      bcid: "ean13",
      text: String(product.barcode).padStart(12, "0"),
      scale: 3,
      height: 10,
      includetext: true,
    },
    (err, png) => {
      if (err) res.status(500).send("Barcode error");
      else res.type("image/png").send(png);
    }
  );
};

export const getProductByBarcode = async (req, res) => {
  const product = await Product.findOne({ barcode: Number(req.params.barcode) });
  if (!product) return res.status(404).json({ success: false });
  res.json({ success: true, product });
};
