'use strict';

/**
 * Ocean Professional Products Service
 * Encapsulates business logic for managing products and delegates persistence
 * to the data access layer in src/db.
 */

const db = require('../db');

// PUBLIC_INTERFACE
async function list() {
  /** Returns all products. */
  return db.listProducts();
}

// PUBLIC_INTERFACE
async function get(id) {
  /** Returns a product by id or null if not found. */
  return db.getProductById(id);
}

// PUBLIC_INTERFACE
async function create({ name, price, quantity }) {
  /** Creates a new product. */
  return db.createProduct({ name, price, quantity });
}

// PUBLIC_INTERFACE
async function update(id, changes) {
  /** Updates a product and returns updated object or null if not found. */
  return db.updateProduct(id, changes);
}

// PUBLIC_INTERFACE
async function remove(id) {
  /** Deletes a product and returns true if existed; false otherwise. */
  return db.deleteProduct(id);
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
