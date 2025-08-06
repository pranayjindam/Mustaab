/**
 * @swagger
 * tags:
 *   name: Admin Orders
 *   description: Admin side order management
 */

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (Admin)
 *     tags: [Admin Orders]
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, adminOrderController.getAllOrders);

/**
 * @swagger
 * /api/admin/orders/{orderId}/confirmed:
 *   put:
 *     summary: Confirm an order
 *     tags: [Admin Orders]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Order confirmed
 */
router.put("/:orderId/confirmed", authenticate, adminOrderController.confirmedOrder);

/**
 * @swagger
 * /api/admin/orders/{orderId}/ship:
 *   put:
 *     summary: Mark order as shipped
 *     tags: [Admin Orders]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Order shipped
 */
router.put("/:orderId/ship", authenticate, adminOrderController.shippOrder);

/**
 * @swagger
 * /api/admin/orders/{orderId}/deliver:
 *   put:
 *     summary: Mark order as delivered
 *     tags: [Admin Orders]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Order delivered
 */
router.put("/:orderId/deliver", authenticate, adminOrderController.deliverOrder);

/**
 * @swagger
 * /api/admin/orders/{orderId}/cancel:
 *   put:
 *     summary: Cancel an order
 *     tags: [Admin Orders]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Order cancelled
 */
router.put("/:orderId/cancel", authenticate, adminOrderController.cancelledOrder);

/**
 * @swagger
 * /api/admin/orders/{orderId}/delete:
 *   delete:
 *     summary: Delete an order
 *     tags: [Admin Orders]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Order deleted
 */
router.delete("/:orderId/delete", authenticate, adminOrderController.deleteOrder);
