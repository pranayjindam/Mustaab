import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  searchProducts,
  getFeaturedProducts,
  addmultipleProducts,
  getBarCode,
  getSearchSuggestions,
  getProductByBarcode
} from "../Controllers/Product.controller.js";
import { AuthenticateAdmin } from "../Middlewares/auth.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    files: 30,              // ✅ allow up to 30 images
    fileSize: 5 * 1024 * 1024, // ✅ 5MB per image
  },
});

const productRouter = express.Router();

/* ---------- CREATE ---------- */
productRouter.post(
  "/add",
  AuthenticateAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 100 },
    { name: "colorImages", maxCount: 100 }
  ]),
  createProduct
);

/* ---------- READ ---------- */
productRouter.get("/", getAllProducts);
productRouter.get("/featured", getFeaturedProducts);
productRouter.get("/search/suggestions", getSearchSuggestions);
productRouter.get("/search/:keyword", searchProducts);
productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/barcode/:id", AuthenticateAdmin, getBarCode);
productRouter.get("/lookup/:barcode", getProductByBarcode);

/* ---------- UPDATE ---------- */
productRouter.put(
  "/:id",
  AuthenticateAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 100 },      // ✅ FIXED
    { name: "colorImages", maxCount: 100 }  // ✅ FIXED
  ]),
  updateProduct
);


/* ---------- DELETE ---------- */
productRouter.delete("/:id", AuthenticateAdmin, deleteProduct);

/* ---------- BULK ---------- */
productRouter.post(
  "/addmultipleproducts",
  AuthenticateAdmin,
  addmultipleProducts
);

/* ❗ KEEP THIS LAST */
productRouter.get("/:id", getProductById);

export default productRouter;
