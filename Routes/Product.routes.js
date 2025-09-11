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
  addMultipleProducts,
} from "../Controllers/Product.controller.js";
import { AuthenticateAdmin, AuthenticateUser } from "../Middlewares/auth.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and browsing
 */

/**
 * @swagger
 * /api/product/add:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - adminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               maxQuantity:
 *                 type: number
 *               discount:
 *                 type: number
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["S", "M", "L", "XL"]
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Red", "Blue", "Green"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               isFeatured:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/add", AuthenticateAdmin, createProduct);


/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/product/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Featured product list
 */
router.get("/featured", getFeaturedProducts);

/**
 * @swagger
 * /api/product/search:
 *   get:
 *     summary: Search products by keyword
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search
 *     responses:
 *       200:
 *         description: Matching products
 */
router.get("/search/:keyword", searchProducts);



/**
 * @swagger
 * /api/product/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Category name
 *     responses:
 *       200:
 *         description: Products in the given category
 *       400:
 *         description: Invalid category
 */
router.get("/category/:category", getProductsByCategory);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.put("/:id", AuthenticateAdmin, updateProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete("/:id", AuthenticateAdmin, deleteProduct);

/**
 * @swagger
 * /api/product/addmultipleproducts:
 *   post:
 *     summary: Add multiple products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     price:
 *                       type: number
 *                     category:
 *                       type: string
 *     responses:
 *       201:
 *         description: Products added successfully
 *       400:
 *         description: Invalid input
 */
router.post("/addmultipleproducts", AuthenticateAdmin, addMultipleProducts);
export default router;
