'use strict';

/**
 * Ocean Professional API Response Helpers
 * Ensures consistent response shapes across endpoints.
 */

// PUBLIC_INTERFACE
function success(res, data, status = 200) {
  /** Sends a consistent success response with provided status and data. */
  return res.status(status).json({
    status: 'success',
    data,
  });
}

// PUBLIC_INTERFACE
function error(res, message, status = 500, details) {
  /** Sends a consistent error response with provided status and message. */
  const body = {
    status: 'error',
    message,
  };
  if (details !== undefined) body.details = details;
  return res.status(status).json(body);
}

module.exports = {
  success,
  error,
};
