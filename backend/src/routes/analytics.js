const pool = require('../config/database');
const authenticate = require('../middleware/authenticate');

async function analyticsRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/admin/analytics/overview - Dashboard overview metrics
  fastify.get('/overview', async (request, reply) => {
    try {
      // Total campaigns
      const campaignsCount = await pool.query(
        'SELECT COUNT(*) as total, status FROM campaigns GROUP BY status'
      );

      // Total entities
      const examsCount = await pool.query('SELECT COUNT(*) as total FROM exams WHERE status = $1', ['live']);
      const collegesCount = await pool.query('SELECT COUNT(*) as total FROM colleges WHERE status = $1', ['live']);
      const scholarshipsCount = await pool.query('SELECT COUNT(*) as total FROM scholarships WHERE status = $1', ['live']);

      // Recent campaigns (last 30 days)
      const recentCampaigns = await pool.query(
        `SELECT COUNT(*) as total FROM campaigns
         WHERE created_at >= NOW() - INTERVAL '30 days'`
      );

      // Campaign status distribution
      const statusDistribution = {};
      campaignsCount.rows.forEach(row => {
        statusDistribution[row.status] = parseInt(row.total);
      });

      return {
        totalCampaigns: campaignsCount.rows.reduce((sum, row) => sum + parseInt(row.total), 0),
        activeCampaigns: statusDistribution.live || 0,
        draftCampaigns: statusDistribution.draft || 0,
        pausedCampaigns: statusDistribution.paused || 0,
        totalExams: parseInt(examsCount.rows[0]?.total || 0),
        totalColleges: parseInt(collegesCount.rows[0]?.total || 0),
        totalScholarships: parseInt(scholarshipsCount.rows[0]?.total || 0),
        recentCampaigns: parseInt(recentCampaigns.rows[0]?.total || 0),
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch analytics overview' });
    }
  });

  // GET /api/admin/analytics/campaigns - Campaign performance
  fastify.get('/campaigns', async (request, reply) => {
    try {
      // Top campaigns by entity type
      const campaignsByEntity = await pool.query(
        `SELECT entity_type, COUNT(*) as count, status
         FROM campaigns
         WHERE entity_type IS NOT NULL
         GROUP BY entity_type, status
         ORDER BY count DESC`
      );

      // Campaigns created over time (last 6 months)
      const campaignsTrend = await pool.query(
        `SELECT
           DATE_TRUNC('month', created_at) as month,
           COUNT(*) as count
         FROM campaigns
         WHERE created_at >= NOW() - INTERVAL '6 months'
         GROUP BY month
         ORDER BY month ASC`
      );

      // Format trends data
      const trends = campaignsTrend.rows.map(row => ({
        month: new Date(row.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: parseInt(row.count)
      }));

      // Group by entity type
      const byEntity = {};
      campaignsByEntity.rows.forEach(row => {
        if (!byEntity[row.entity_type]) {
          byEntity[row.entity_type] = { total: 0, live: 0, draft: 0 };
        }
        const count = parseInt(row.count);
        byEntity[row.entity_type].total += count;
        if (row.status === 'live') byEntity[row.entity_type].live = count;
        if (row.status === 'draft') byEntity[row.entity_type].draft = count;
      });

      return {
        byEntityType: byEntity,
        trends: trends,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch campaign analytics' });
    }
  });

  // GET /api/admin/analytics/entities - Entity statistics
  fastify.get('/entities', async (request, reply) => {
    try {
      // Exams by level
      const examsByLevel = await pool.query(
        `SELECT exam_level, COUNT(*) as count
         FROM exams
         WHERE exam_level IS NOT NULL AND status = 'live'
         GROUP BY exam_level
         ORDER BY count DESC`
      );

      // Colleges by type
      const collegesByType = await pool.query(
        `SELECT college_type, COUNT(*) as count
         FROM colleges
         WHERE college_type IS NOT NULL AND status = 'live'
         GROUP BY college_type
         ORDER BY count DESC`
      );

      // Scholarships by type
      const scholarshipsByType = await pool.query(
        `SELECT scholarship_type, COUNT(*) as count
         FROM scholarships
         WHERE scholarship_type IS NOT NULL AND status IN ('live', 'draft')
         GROUP BY scholarship_type
         ORDER BY count DESC`
      );

      // Top colleges by ranking
      const topColleges = await pool.query(
        `SELECT name, nirf_rank, placement_percentage
         FROM colleges
         WHERE nirf_rank IS NOT NULL AND status = 'live'
         ORDER BY nirf_rank ASC
         LIMIT 10`
      );

      return {
        exams: {
          byLevel: examsByLevel.rows.map(r => ({ level: r.exam_level, count: parseInt(r.count) }))
        },
        colleges: {
          byType: collegesByType.rows.map(r => ({ type: r.college_type, count: parseInt(r.count) })),
          topRanked: topColleges.rows
        },
        scholarships: {
          byType: scholarshipsByType.rows.map(r => ({ type: r.scholarship_type, count: parseInt(r.count) }))
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch entity analytics' });
    }
  });

  // GET /api/admin/analytics/recent-activity - Recent activity feed
  fastify.get('/recent-activity', async (request, reply) => {
    try {
      // Recent campaigns
      const recentCampaigns = await pool.query(
        `SELECT id, name, entity_type, status, created_at, updated_at
         FROM campaigns
         ORDER BY updated_at DESC
         LIMIT 10`
      );

      // Recent exams
      const recentExams = await pool.query(
        `SELECT id, name, status, created_at
         FROM exams
         ORDER BY created_at DESC
         LIMIT 5`
      );

      // Recent colleges
      const recentColleges = await pool.query(
        `SELECT id, name, status, created_at
         FROM colleges
         ORDER BY created_at DESC
         LIMIT 5`
      );

      const activities = [
        ...recentCampaigns.rows.map(c => ({
          type: 'campaign',
          id: c.id,
          name: c.name,
          status: c.status,
          entityType: c.entity_type,
          timestamp: c.updated_at
        })),
        ...recentExams.rows.map(e => ({
          type: 'exam',
          id: e.id,
          name: e.name,
          status: e.status,
          timestamp: e.created_at
        })),
        ...recentColleges.rows.map(c => ({
          type: 'college',
          id: c.id,
          name: c.name,
          status: c.status,
          timestamp: c.created_at
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);

      return activities;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch recent activity' });
    }
  });
}

module.exports = analyticsRoutes;
