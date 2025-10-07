import express from "express";
const authRouter = express.Router();
import { handleAdminRegister } from "../Controllers/Admin.controller.js";
import { AuthenticateAdmin } from "../Middlewares/auth.js";
import { loginRequestOtp,loginVerifyOtp,registerRequestOtp,registerVerifyOtp } from "../Controllers/Auth.controller.js";
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new client user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobile
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error (e.g., user already exists)
 */

authRouter.post("/register/request-otp", registerRequestOtp);
authRouter.post("/register/verify-otp",registerVerifyOtp);

/**
 * @swagger
 * /api/auth/admin-register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Auth]
 *     security:
 *       - adminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - mobile
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mobile:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Admin already exists or invalid input
 */
authRouter.post("/admin-register", AuthenticateAdmin,handleAdminRegister);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in (login) as a user or admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
// authRouter.post("/signin", login);
// ✅ Login OTP
authRouter.post("/login/request-otp", loginRequestOtp);
authRouter.post("/login/verify-otp", loginVerifyOtp);
export default authRouter;
