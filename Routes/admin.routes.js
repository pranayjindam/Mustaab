import express from "express";
import {
  handleAdminRegister,
  handleAdminUpdate,
  handleAdminDetails,
  handleAdminDelete,
} from "../Controllers/Admin.controller.js";
import { AuthenticateAdmin } from "../Middlewares/auth.js";

const adminRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin account management
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
*/
// Register a new admin
/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminRegisterRequest'
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Bad request or admin creation failed
 */

adminRouter.post("/register", handleAdminRegister);


// Get admin details (requires authentication)
/**
 * @swagger
 * /api/admin/me:
 *   get:
 *     summary: Get current admin profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized
 */

adminRouter.get("/me", AuthenticateAdmin,handleAdminDetails);

// Update admin profile (requires authentication)
/**
 * @swagger
 * /api/admin/update:
 *   put:
 *     summary: Update current admin profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUpdateRequest'
 *     responses:
 *       200:
 *         description: Admin profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Bad request or update failed
 *       401:
 *         description: Unauthorized
 */

adminRouter.put("/update",AuthenticateAdmin,handleAdminUpdate);


/**
 * @swagger
 * /api/admin/delete:
 *   delete:
 *     summary: Delete the currently logged-in admin
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 admin:
 *                   type: object
 *                   description: The deleted admin object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: Admin not found or error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Admin not found
 */
adminRouter.delete("/delete",AuthenticateAdmin,handleAdminDelete);
export default adminRouter;
