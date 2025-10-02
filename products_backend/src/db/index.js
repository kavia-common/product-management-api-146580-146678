'use strict';

/**
 * Ocean Professional Data Access Layer
 * Provides a minimal abstraction for product storage.
 * - If PRODUCTS_DATABASE_URL (or DATABASE_URL) is defined, connects to PostgreSQL using pg.
 * - Otherwise falls back to an in-memory store to keep API functional for local/dev without DB.
 *
 * PUBLIC_INTERFACE: Exposes a consistent CRUD interface used by services:
 *   - init()
 *   - close()
 *   - listProducts()
 *   - getProductById(id)
 *   - createProduct({ name, price, quantity })
 *   - updateProduct(id, { name, price, quantity })
 *   - deleteProduct(id)
 */

const config = require('../config');

let usingDb = false;
let dbClient = null;

// In-memory fallback
const memoryStore = {
  seq: 1,
  products: new Map(), // id -> { id, name, price, quantity }
};

async function init() {
  if (config.databaseUrl) {
    try {
      // Lazy load pg to avoid dependency cost when not needed
      const { Client } = require('pg');
      dbClient = new Client({
        connectionString: config.databaseUrl,
      });
      await dbClient.connect();
      usingDb = true;

      // Ensure table exists (id is serial, name text not null, price numeric not null, quantity int not null)
      await dbClient.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price NUMERIC NOT NULL,
          quantity INTEGER NOT NULL
        )
      `);
      return;
    } catch (err) {
      // Fall back to memory with a warning, but keep service alive
      console.warn('[DB] Failed to connect to database. Falling back to in-memory store.', err.message);
      usingDb = false;
      dbClient = null;
    }
  }
}

async function close() {
  if (usingDb && dbClient) {
    await dbClient.end();
  }
}

// Map DB row to product object with proper number conversions
function mapRow(row) {
  return {
    id: Number(row.id),
    name: row.name,
    price: Number(row.price),
    quantity: Number(row.quantity),
  };
}

// PUBLIC_INTERFACE
async function listProducts() {
  /** Returns an array of all products. */
  if (usingDb) {
    const res = await dbClient.query('SELECT id, name, price, quantity FROM products ORDER BY id ASC');
    return res.rows.map(mapRow);
  }
  return Array.from(memoryStore.products.values());
}

// PUBLIC_INTERFACE
async function getProductById(id) {
  /** Returns a product by id or null if not found. */
  if (usingDb) {
    const res = await dbClient.query('SELECT id, name, price, quantity FROM products WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return mapRow(res.rows[0]);
  }
  return memoryStore.products.get(Number(id)) || null;
}

// PUBLIC_INTERFACE
async function createProduct({ name, price, quantity }) {
  /** Creates a new product and returns it. */
  if (usingDb) {
    const res = await dbClient.query(
      'INSERT INTO products (name, price, quantity) VALUES ($1, $2, $3) RETURNING id, name, price, quantity',
      [name, price, quantity]
    );
    return mapRow(res.rows[0]);
  }
  const id = memoryStore.seq++;
  const product = { id, name, price, quantity };
  memoryStore.products.set(id, product);
  return product;
}

// PUBLIC_INTERFACE
async function updateProduct(id, { name, price, quantity }) {
  /** Updates an existing product by id and returns the updated product or null if not found. */
  if (usingDb) {
    // Fetch current
    const current = await getProductById(id);
    if (!current) return null;

    const next = {
      name: name !== undefined ? name : current.name,
      price: price !== undefined ? price : current.price,
      quantity: quantity !== undefined ? quantity : current.quantity,
    };

    const res = await dbClient.query(
      'UPDATE products SET name = $1, price = $2, quantity = $3 WHERE id = $4 RETURNING id, name, price, quantity',
      [next.name, next.price, next.quantity, id]
    );
    return res.rows.length ? mapRow(res.rows[0]) : null;
  }

  id = Number(id);
  const current = memoryStore.products.get(id);
  if (!current) return null;
  const updated = {
    ...current,
    ...(name !== undefined ? { name } : {}),
    ...(price !== undefined ? { price } : {}),
    ...(quantity !== undefined ? { quantity } : {}),
  };
  memoryStore.products.set(id, updated);
  return updated;
}

// PUBLIC_INTERFACE
async function deleteProduct(id) {
  /** Deletes a product by id and returns true if deleted, false if not found. */
  if (usingDb) {
    const res = await dbClient.query('DELETE FROM products WHERE id = $1', [id]);
    // rowCount indicates number of rows affected
    return res.rowCount > 0;
  }
  id = Number(id);
  const existed = memoryStore.products.has(id);
  memoryStore.products.delete(id);
  return existed;
}

module.exports = {
  init,
  close,
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
