import express from "express";
import * as reviewController from "../Controllers/Review.controller.js";
import { AuthenticateUser, AuthenticateAdmin } from "../Middlewares/auth.js";

const reviewRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product review management
 */

/**
 * @swagger
 * /api/reviews/create:
 *   post:
 *     summary: Create a product review
 *     tags: [Reviews]
 *     security:
 *       - userAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *               - review
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error
 */
reviewRouter.post("/create", AuthenticateUser, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, rating]
 *           default: date
 *         description: Sort reviews by date or rating
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of reviews for the product
 */
reviewRouter.get("/product/:productId", reviewController.getAllReview);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   put:
 *     summary: Update a review by its author
 *     tags: [Reviews]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *       403:
 *         description: Review not found or not owned by the user
 */
reviewRouter.put("/:reviewId", AuthenticateUser, reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   delete:
 *     summary: Delete your review
 *     tags: [Reviews]
 *     security:
 *       - userAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Review not found or not owned by user
 */
reviewRouter.delete("/:reviewId", AuthenticateUser, reviewController.deleteReview);

/**
 * @swagger
 * /api/reviews/{reviewId}/hide:
 *   patch:
 *     summary: Hide a review (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review to hide
 *     responses:
 *       200:
 *         description: Review hidden successfully
 *       400:
 *         description: Review not found
 */
reviewRouter.patch("/:reviewId/hide", AuthenticateAdmin, reviewController.hideReview);

export default reviewRouter;
