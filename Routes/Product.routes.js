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
  addmultipleProducts
} from "../controllers/product.controller.js";
import { AuthenticateAdmin } from "../middlewares/auth.js";

const productRouter = express.Router();

productRouter.post("/add", AuthenticateAdmin, createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/featured", getFeaturedProducts);
productRouter.get("/search/:keyword", searchProducts);
productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", AuthenticateAdmin, updateProduct);
productRouter.delete("/:id", AuthenticateAdmin, deleteProduct);
productRouter.post("/addmultipleproducts",AuthenticateAdmin,addmultipleProducts)
export default productRouter;
