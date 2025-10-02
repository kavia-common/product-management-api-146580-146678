'use strict';

/**
 * Ocean Professional Config
 * Centralized configuration for the Products Backend service.
 * Uses environment variables for dynamic configuration and avoids hard-coded
 * values for portability across environments.
 */

require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT || '3000', 10),

  // Database dependency integration (products_database)
  // Expecting a PostgreSQL-style URL or any DB URL as provided by the environment.
  // Do not hard-code credentials; rely on env variables supplied by orchestrator.
  databaseUrl: process.env.PRODUCTS_DATABASE_URL || process.env.DATABASE_URL || '',
};

module.exports = config;
