const pool = require('../config/database');
const authenticate = require('../middleware/authenticate');

async function campaignsRoutes(fastify, options) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticate);

  // GET /api/admin/campaigns - List all campaigns
  fastify.get('/', async (request, reply) => {
    try {
      const result = await pool.query(
        'SELECT * FROM campaigns ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch campaigns' });
    }
  });

  // GET /api/admin/campaigns/:id - Get single campaign
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'SELECT * FROM campaigns WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Campaign not found' });
      }

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch campaign' });
    }
  });

  // POST /api/admin/campaigns - Create campaign
  fastify.post('/', async (request, reply) => {
    try {
      const {
        name, slug, url_prefix, entity_type, entity_id, template_id, template_version,
        content_data, seo, crawl_policy, form_schema_id, trackers, status
      } = request.body;

      // Validation
      if (!name || !slug) {
        return reply.status(400).send({
          error: 'Name and slug are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO campaigns (
          name, slug, url_prefix, entity_type, entity_id, template_id, template_version,
          content_data, seo, crawl_policy, form_schema_id, trackers, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          name,
          slug,
          url_prefix || 'ad',
          entity_type,
          entity_id,
          template_id,
          template_version,
          JSON.stringify(content_data || {}),
          JSON.stringify(seo || {}),
          JSON.stringify(crawl_policy || {}),
          form_schema_id,
          JSON.stringify(trackers || []),
          status || 'draft'
        ]
      );

      return reply.status(201).send(result.rows[0]);
    } catch (error) {
      fastify.log.error(error);

      // Handle unique constraint violation
      if (error.code === '23505') {
        return reply.status(409).send({
          error: 'Slug already exists'
        });
      }

      return reply.status(500).send({ error: 'Failed to create campaign' });
    }
  });

  // PATCH /api/admin/campaigns/:id - Update campaign
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const {
        name, slug, url_prefix, entity_type, entity_id, template_id, template_version,
        content_data, seo, crawl_policy, form_schema_id, trackers, status
      } = request.body;

      // Check if template is locked (campaign is published)
      const check = await pool.query(
        'SELECT status FROM campaigns WHERE id = $1',
        [id]
      );

      if (check.rows.length === 0) {
        return reply.status(404).send({ error: 'Campaign not found' });
      }

      const isPublished = check.rows[0].status === 'live';
      if (isPublished && (template_id !== undefined || template_version !== undefined)) {
        return reply.status(400).send({
          error: 'Cannot change template after campaign is published'
        });
      }

      const result = await pool.query(
        `UPDATE campaigns SET
          name = COALESCE($1, name),
          slug = COALESCE($2, slug),
          url_prefix = COALESCE($3, url_prefix),
          entity_type = COALESCE($4, entity_type),
          entity_id = COALESCE($5, entity_id),
          template_id = COALESCE($6, template_id),
          template_version = COALESCE($7, template_version),
          content_data = COALESCE($8, content_data),
          seo = COALESCE($9, seo),
          crawl_policy = COALESCE($10, crawl_policy),
          form_schema_id = COALESCE($11, form_schema_id),
          trackers = COALESCE($12, trackers),
          status = COALESCE($13, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $14 RETURNING *`,
        [
          name,
          slug,
          url_prefix,
          entity_type,
          entity_id,
          template_id,
          template_version,
          content_data ? JSON.stringify(content_data) : null,
          seo ? JSON.stringify(seo) : null,
          crawl_policy ? JSON.stringify(crawl_policy) : null,
          form_schema_id,
          trackers ? JSON.stringify(trackers) : null,
          status,
          id
        ]
      );

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);

      // Handle unique constraint violation
      if (error.code === '23505') {
        return reply.status(409).send({
          error: 'Slug already exists'
        });
      }

      return reply.status(500).send({ error: 'Failed to update campaign' });
    }
  });

  // DELETE /api/admin/campaigns/:id - Delete campaign
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'DELETE FROM campaigns WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Campaign not found' });
      }

      return { success: true, id: result.rows[0].id };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete campaign' });
    }
  });
}

module.exports = campaignsRoutes;
