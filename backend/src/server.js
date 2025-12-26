const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const cookie = require('@fastify/cookie');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const examsRoutes = require('./routes/exams');

async function start() {
  try {
    // CORS
await fastify.register(cors, {
  origin: [
    'http://localhost:8080',
    'http://192.168.1.4:8080',
    'http://192.168.1.11:8080',
    'http://127.0.0.1:8080',
  ],
  credentials: true,
});

    // Cookie support
    await fastify.register(cookie);

    // Routes
    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(examsRoutes, { prefix: '/api/admin/exams' });

    // Health check
    fastify.get('/health', async (request, reply) => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // Start
    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });

    console.log(`
╔════════════════════════════════════════╗
║   🚀 Backend Server Running           ║
╠════════════════════════════════════════╣
║   URL: http://localhost:${port}        ║
║   Health: /health                      ║
║   Auth: /api/auth/*                    ║
║   Exams: /api/admin/exams              ║
╚════════════════════════════════════════╝
    `);
  } catch (error) {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
}

start();
