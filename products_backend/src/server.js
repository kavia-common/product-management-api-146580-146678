const app = require('./app');
const config = require('./config');
const db = require('./db');

const PORT = config.port;
const HOST = config.host;

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

// Graceful shutdown
async function shutdown(signal) {
  try {
    console.log(`${signal} signal received: closing HTTP server`);
    server.close(async () => {
      console.log('HTTP server closed');
      try {
        await db.close();
        console.log('Database connection closed');
      } catch (e) {
        console.warn('Failed closing DB connection:', e.message);
      }
      process.exit(0);
    });
  } catch (e) {
    console.error('Error during shutdown', e);
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
