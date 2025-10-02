const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const db = require('./db');
const { error } = require('./utils/apiResponse');

// Initialize express app
const app = express();

// Initialize DB on startup (non-blocking for request handler registration)
db.init().catch((e) => {
  console.warn('[App] DB initialization encountered an issue. Service will continue with fallback if available.', e.message);
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');           // may or may not include port
  let protocol = req.protocol;            // http or https

  const actualPort = req.socket?.localPort;
  const hasPort = host.includes(':');
  
  const needsPort =
    !hasPort &&
    actualPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);

// Not found handler
app.use((req, res) => {
  return error(res, 'Route not found', 404);
});

// Error handling middleware
// PUBLIC_INTERFACE
app.use((err, req, res, next) => {
  /** Global error handler: returns uniform error response. */
  console.error(err.stack || err);
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message || 'Request failed';
  return error(res, message, status);
});

module.exports = app;
