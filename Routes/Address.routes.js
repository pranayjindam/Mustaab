import express from "express";
import {createAddress,getAddressById,updateAddress,deleteAddress,setDefaultAddress,getAddresses} from "../Controllers/Address.controller.js";

const router= express.Router();
/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address management
 */
/**
 * @swagger
 * /address/add:
 *   post:
 *     summary: Create a new address
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - state
 *               - zip
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Address created successfully
 *       500:
 *         description: Server error
 */
router.post("/add", createAddress);

/**
 * @swagger
 * /address/getall:
 *   get:
 *     summary: Get all addresses for the user
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: List of addresses
 *       500:
 *         description: Server error
 */
router.get("/getall", getAddresses);

/**
 * @swagger
 * /address/{addressId}:
 *   get:
 *     summary: Get a specific address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the address
 *     responses:
 *       200:
 *         description: Address found
 *       404:
 *         description: Address not found
 */
router.get("/:addressId", getAddressById);
/**
 * @swagger
 * /address/{addressId}:
 *   put:
 *     summary: Update an address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated
 *       404:
 *         description: Address not found
 */
router.put("/:addressId", updateAddress);

/**
 * @swagger
 * /address/{addressId}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted
 *       404:
 *         description: Address not found
 */
router.delete("/:addressId", deleteAddress);
/**
 * @swagger
 * /address/set-default:
 *   patch:
 *     summary: Set an address as the default
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Default address set
 *       404:
 *         description: Address not found
 */
router.patch("/set-default", setDefaultAddress);



export default router;