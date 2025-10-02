'use strict';

/**
 * Ocean Professional Controller: Products
 * Handles HTTP requests for product resources, including validation, delegating
 * to services, and formatting responses.
 */

const productsService = require('../services/products');
const { validateCreateProductPayload, validateUpdateProductPayload } = require('../utils/validators');
const { success, error } = require('../utils/apiResponse');

class ProductsController {
  // PUBLIC_INTERFACE
  async list(req, res) {
    /** Lists all products. */
    try {
      const items = await productsService.list();
      return success(res, items, 200);
    } catch (err) {
      console.error('[ProductsController:list] Error:', err);
      return error(res, 'Failed to fetch products', err.status || 500);
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    /** Gets a product by id. */
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return error(res, 'Invalid id parameter', 400);
      }
      const item = await productsService.get(id);
      if (!item) {
        return error(res, 'Product not found', 404);
      }
      return success(res, item, 200);
    } catch (err) {
      console.error('[ProductsController:get] Error:', err);
      return error(res, 'Failed to fetch product', err.status || 500);
    }
  }

  // PUBLIC_INTERFACE
  async create(req, res) {
    /** Creates a new product. */
    try {
      const payload = validateCreateProductPayload(req.body);
      const created = await productsService.create(payload);
      return success(res, created, 201);
    } catch (err) {
      console.error('[ProductsController:create] Error:', err);
      const status = err.status || 500;
      return error(res, err.message || 'Failed to create product', status);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res) {
    /** Updates an existing product. Supports partial updates via PUT for simplicity here. */
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return error(res, 'Invalid id parameter', 400);
      }
      const changes = validateUpdateProductPayload(req.body);
      const updated = await productsService.update(id, changes);
      if (!updated) {
        return error(res, 'Product not found', 404);
      }
      return success(res, updated, 200);
    } catch (err) {
      console.error('[ProductsController:update] Error:', err);
      const status = err.status || 500;
      return error(res, err.message || 'Failed to update product', status);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res) {
    /** Deletes a product by id. */
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return error(res, 'Invalid id parameter', 400);
      }
      const deleted = await productsService.remove(id);
      if (!deleted) {
        return error(res, 'Product not found', 404);
      }
      return success(res, { id }, 200);
    } catch (err) {
      console.error('[ProductsController:remove] Error:', err);
      return error(res, 'Failed to delete product', err.status || 500);
    }
  }
}

module.exports = new ProductsController();
