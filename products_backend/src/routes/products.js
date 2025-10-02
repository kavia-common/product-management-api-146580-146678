'use strict';

const express = require('express');
const productsController = require('../controllers/products');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Manage products inventory
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required: [id, name, price, quantity]
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier
 *           example: 1
 *         name:
 *           type: string
 *           description: Product name
 *           example: Ocean Breeze Keyboard
 *         price:
 *           type: number
 *           format: float
 *           description: Product price
 *           example: 99.99
 *         quantity:
 *           type: integer
 *           description: Available quantity
 *           example: 10
 *     CreateProductInput:
 *       type: object
 *       required: [name, price, quantity]
 *       properties:
 *         name:
 *           type: string
 *           example: Ocean Breeze Keyboard
 *         price:
 *           type: number
 *           example: 99.99
 *         quantity:
 *           type: integer
 *           example: 10
 *     UpdateProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Ocean Breeze Mechanical Keyboard
 *         price:
 *           type: number
 *           example: 109.99
 *         quantity:
 *           type: integer
 *           example: 12
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products
 *     description: Retrieve all products.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/', productsController.list.bind(productsController));

/**
 * @swagger
 * /products/balance:
 *   get:
 *     summary: Get total inventory balance
 *     description: Calculate the sum of price × quantity across all products.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Total balance value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                       example: 1249.5
 */
router.get('/balance', productsController.balance.bind(productsController));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product
 *     description: Retrieve a single product by id.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product id
 *     responses:
 *       200:
 *         description: Found product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', productsController.get.bind(productsController));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product
 *     description: Create a new product.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid request body
 */
router.post('/', productsController.create.bind(productsController));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     description: Update an existing product. Partial updates supported.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductInput'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Product not found
 */
router.put('/:id', productsController.update.bind(productsController));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Remove a product by id.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product id
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', productsController.remove.bind(productsController));

module.exports = router;
