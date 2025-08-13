import express from "express";
import {
  clearUserCart,
  updateCartQuantity,
  getUserCart,
  removeItemFromCart,
  addToCart
} from "../Controllers/Cart.controller.js";
import { AuthenticateUser } from "../Middlewares/auth.js";

console.log("🛒 Cart router mounted at /api/cart");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: User cart management
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the user's cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - qty
 *             properties:
 *               productId:
 *                 type: string
 *               qty:
 *                 type: number
 *               size:
 *                 type: string
 *               color:
 *                 type: string
 *               price:
 *                 type: number
 *               discount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item added or updated in cart
 *       500:
 *         description: Server error
 */
router.post("/add", addToCart);

/**
 * @swagger
 * /cart/cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: The user's cart
 *       500:
 *         description: Server error
 */
router.get("/cart", getUserCart);

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remove an item from the user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: Missing productId
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.delete("/remove", removeItemFromCart);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear the user's entire cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared
 *       500:
 *         description: Server error
 */
router.delete("/clear", clearUserCart);

/**
 * @swagger
 * /cart/updateqty:
 *   put:
 *     summary: Update the quantity of a product in the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - qty
 *             properties:
 *               productId:
 *                 type: string
 *               qty:
 *                 type: number
 *               size:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart updated
 *       500:
 *         description: Server error
 */
router.put("/updateqty", updateCartQuantity);

export default router;
