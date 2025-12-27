const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const cookie = require('@fastify/cookie');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const examsRoutes = require('./routes/exams');
const collegesRoutes = require('./routes/colleges');
const scholarshipsRoutes = require('./routes/scholarships');
const templatesRoutes = require('./routes/templates');
const formSchemasRoutes = require('./routes/form-schemas');
const trackersRoutes = require('./routes/trackers');
const redirectsRoutes = require('./routes/redirects');
const campaignsRoutes = require('./routes/campaigns');
const seoRoutes = require('./routes/seo');
const analyticsRoutes = require('./routes/analytics');

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
    await fastify.register(collegesRoutes, { prefix: '/api/admin/colleges' });
    await fastify.register(scholarshipsRoutes, { prefix: '/api/admin/scholarships' });
    await fastify.register(templatesRoutes, { prefix: '/api/admin/templates' });
    await fastify.register(formSchemasRoutes, { prefix: '/api/admin/form-schemas' });
    await fastify.register(trackersRoutes, { prefix: '/api/admin/trackers' });
    await fastify.register(redirectsRoutes, { prefix: '/api/admin/redirects' });
    await fastify.register(campaignsRoutes, { prefix: '/api/admin/campaigns' });
    await fastify.register(seoRoutes, { prefix: '/api/admin/seo' });
    await fastify.register(analyticsRoutes, { prefix: '/api/admin/analytics' });

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
║   Colleges: /api/admin/colleges        ║
║   Scholarships: /api/admin/scholarships║
║   Templates: /api/admin/templates      ║
║   Form Schemas: /api/admin/form-schemas║
║   Trackers: /api/admin/trackers        ║
║   Redirects: /api/admin/redirects      ║
║   Campaigns: /api/admin/campaigns      ║
║   SEO: /api/admin/seo                  ║
║   Analytics: /api/admin/analytics      ║
╚════════════════════════════════════════╝
    `);
  } catch (error) {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
}

start();
