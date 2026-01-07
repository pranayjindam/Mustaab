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
const upload = multer({ storage });

const productRouter = express.Router();

/* ---------- CREATE ---------- */
productRouter.post(
  "/add",
  AuthenticateAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "colorImages", maxCount: 10 }
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
    { name: "images", maxCount: 10 },
    { name: "colorImages", maxCount: 10 }
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
