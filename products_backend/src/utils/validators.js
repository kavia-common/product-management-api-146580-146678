'use strict';

/**
 * Ocean Professional Validation Utilities
 * Provides input validation helpers for product payloads.
 */

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isFiniteNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

function isNonNegativeInteger(v) {
  return Number.isInteger(v) && v >= 0;
}

// PUBLIC_INTERFACE
function validateCreateProductPayload(payload) {
  /** Validates payload for creating a product. Throws Error on invalid input. */
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload: expected JSON object');
  }
  const { name, price, quantity } = payload;

  if (!isNonEmptyString(name)) errors.push('name must be a non-empty string');
  if (!isFiniteNumber(price) || price < 0) errors.push('price must be a non-negative number');
  if (!Number.isInteger(quantity) || quantity < 0) errors.push('quantity must be a non-negative integer');

  if (errors.length) {
    const err = new Error(`Invalid request body: ${errors.join(', ')}`);
    err.status = 400;
    throw err;
  }
  return { name: name.trim(), price, quantity };
}

// PUBLIC_INTERFACE
function validateUpdateProductPayload(payload) {
  /** Validates payload for updating a product. At least one updatable field must be present. Throws Error on invalid input. */
  if (!payload || typeof payload !== 'object') {
    const err = new Error('Invalid payload: expected JSON object');
    err.status = 400;
    throw err;
  }

  const allowed = ['name', 'price', 'quantity'];
  const keys = Object.keys(payload).filter((k) => allowed.includes(k));

  if (keys.length === 0) {
    const err = new Error('No valid fields provided to update. Allowed: name, price, quantity');
    err.status = 400;
    throw err;
  }

  const out = {};
  if ('name' in payload) {
    if (!isNonEmptyString(payload.name)) {
      const err = new Error('name must be a non-empty string');
      err.status = 400;
      throw err;
    }
    out.name = payload.name.trim();
  }

  if ('price' in payload) {
    const p = payload.price;
    if (!isFiniteNumber(p) || p < 0) {
      const err = new Error('price must be a non-negative number');
      err.status = 400;
      throw err;
    }
    out.price = p;
  }

  if ('quantity' in payload) {
    const q = payload.quantity;
    if (!isNonNegativeInteger(q)) {
      const err = new Error('quantity must be a non-negative integer');
      err.status = 400;
      throw err;
    }
    out.quantity = q;
  }

  return out;
}

module.exports = {
  validateCreateProductPayload,
  validateUpdateProductPayload,
};
