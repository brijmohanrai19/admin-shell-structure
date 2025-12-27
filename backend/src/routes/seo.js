const pool = require('../config/database');
const authenticate = require('../middleware/authenticate');

async function seoRoutes(fastify, options) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticate);

  // GET /api/admin/seo - List all SEO entries from all entities
  fastify.get('/', async (request, reply) => {
    try {
      // Fetch from all entity tables in parallel
      const examsQuery = pool.query(`
        SELECT
          id,
          slug as url,
          name as title,
          description,
          seo,
          'exam' as source_type,
          status,
          created_at
        FROM exams
      `);

      const collegesQuery = pool.query(`
        SELECT
          id,
          slug as url,
          name as title,
          description,
          seo,
          'college' as source_type,
          status,
          created_at
        FROM colleges
      `);

      const scholarshipsQuery = pool.query(`
        SELECT
          id,
          slug as url,
          name as title,
          description,
          seo,
          'scholarship' as source_type,
          status,
          created_at
        FROM scholarships
      `);

      const campaignsQuery = pool.query(`
        SELECT
          id,
          slug as url,
          name as title,
          content_data->>'headline' as description,
          seo,
          'campaign' as source_type,
          status,
          created_at
        FROM campaigns
      `);

      const [exams, colleges, scholarships, campaigns] = await Promise.all([
        examsQuery,
        collegesQuery,
        scholarshipsQuery,
        campaignsQuery
      ]);

      // Combine all results
      const allSeoEntries = [
        ...exams.rows,
        ...colleges.rows,
        ...scholarships.rows,
        ...campaigns.rows
      ].map(entry => ({
        id: `${entry.source_type}-${entry.id}`,
        entity_id: entry.id,
        url: `/${entry.source_type}/${entry.url}`,
        title: entry.seo?.title || entry.title,
        description: entry.seo?.description || entry.description || '',
        keywords: entry.seo?.keywords || '',
        index_status: entry.status === 'live' ? 'indexed' : 'not-indexed',
        source_type: entry.source_type,
        created_at: entry.created_at
      }));

      // Sort by created_at DESC
      allSeoEntries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return allSeoEntries;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch SEO data' });
    }
  });
}

module.exports = seoRoutes;
