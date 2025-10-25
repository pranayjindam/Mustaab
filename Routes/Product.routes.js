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
  getSearchSuggestions
} from "../Controllers/Product.controller.js";
import { AuthenticateAdmin } from "../Middlewares/auth.js";
import multer from "multer";
const storage = multer.memoryStorage(); // or diskStorage() if you want to store them on disk
const upload = multer({ storage });
const productRouter = express.Router();

productRouter.post(
  "/add",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "colorImages", maxCount: 10 }
  ]),
  createProduct
);
productRouter.get("/", getAllProducts);
productRouter.get("/featured", getFeaturedProducts);
productRouter.get('/search/suggestions', getSearchSuggestions);
productRouter.get("/search/:keyword", searchProducts);
productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", AuthenticateAdmin, updateProduct);
productRouter.delete("/:id", AuthenticateAdmin, deleteProduct);
productRouter.post("/addmultipleproducts",AuthenticateAdmin,addmultipleProducts);
productRouter.get("/barcode/:id", AuthenticateAdmin,getBarCode);
export default productRouter;
