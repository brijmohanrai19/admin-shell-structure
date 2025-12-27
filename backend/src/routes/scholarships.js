const pool = require('../config/database');
const authenticate = require('../middleware/authenticate');

async function scholarshipsRoutes(fastify, options) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticate);

  // GET /api/admin/scholarships - List all scholarships
  fastify.get('/', async (request, reply) => {
    try {
      const result = await pool.query(
        'SELECT * FROM scholarships ORDER BY priority DESC, name ASC'
      );
      return result.rows;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch scholarships' });
    }
  });

  // GET /api/admin/scholarships/:id - Get single scholarship
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'SELECT * FROM scholarships WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Scholarship not found' });
      }

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch scholarship' });
    }
  });

  // POST /api/admin/scholarships - Create scholarship
  fastify.post('/', async (request, reply) => {
    try {
      const {
        name,
        slug,
        provider_name,
        provider_type,
        amount_min,
        amount_max,
        currency,
        eligibility_criteria,
        application_process,
        deadline,
        description,
        seo,
        crawl_policy,
        form_schema_id,
        status
      } = request.body;

      // Validation
      if (!name || !slug || !provider_name || !provider_type) {
        return reply.status(400).send({
          error: 'Name, slug, provider name, and provider type are required'
        });
      }

      // Validate amount range if both are provided
      if (amount_min !== null && amount_min !== undefined &&
          amount_max !== null && amount_max !== undefined &&
          amount_min > amount_max) {
        return reply.status(400).send({
          error: 'Minimum amount cannot be greater than maximum amount'
        });
      }

      const result = await pool.query(
        `INSERT INTO scholarships (
          name, slug, provider_name, provider_type, amount_min, amount_max,
          currency, eligibility_criteria, application_process, deadline,
          description, seo, crawl_policy, form_schema_id, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          name, slug, provider_name, provider_type, amount_min, amount_max,
          currency || 'INR', eligibility_criteria, application_process, deadline,
          description, seo ? JSON.stringify(seo) : null,
          crawl_policy ? JSON.stringify(crawl_policy) : null,
          form_schema_id, status || 'draft'
        ]
      );

      return reply.status(201).send(result.rows[0]);
    } catch (error) {
      fastify.log.error(error);

      // Handle unique constraint violation for slug
      if (error.code === '23505' && error.constraint === 'scholarships_slug_key') {
        return reply.status(409).send({
          error: 'A scholarship with this slug already exists'
        });
      }

      return reply.status(500).send({ error: 'Failed to create scholarship' });
    }
  });

  // PATCH /api/admin/scholarships/:id - Update scholarship
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const {
        name,
        slug,
        provider_name,
        provider_type,
        amount_min,
        amount_max,
        currency,
        eligibility_criteria,
        application_process,
        deadline,
        description,
        seo,
        crawl_policy,
        form_schema_id,
        status
      } = request.body;

      // Validate amount range if both are provided
      if (amount_min !== null && amount_min !== undefined &&
          amount_max !== null && amount_max !== undefined &&
          amount_min > amount_max) {
        return reply.status(400).send({
          error: 'Minimum amount cannot be greater than maximum amount'
        });
      }

      const result = await pool.query(
        `UPDATE scholarships SET
          name = COALESCE($1, name),
          slug = COALESCE($2, slug),
          provider_name = COALESCE($3, provider_name),
          provider_type = COALESCE($4, provider_type),
          amount_min = COALESCE($5, amount_min),
          amount_max = COALESCE($6, amount_max),
          currency = COALESCE($7, currency),
          eligibility_criteria = COALESCE($8, eligibility_criteria),
          application_process = COALESCE($9, application_process),
          deadline = COALESCE($10, deadline),
          description = COALESCE($11, description),
          seo = COALESCE($12, seo),
          crawl_policy = COALESCE($13, crawl_policy),
          form_schema_id = COALESCE($14, form_schema_id),
          status = COALESCE($15, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $16
        RETURNING *`,
        [
          name, slug, provider_name, provider_type, amount_min, amount_max,
          currency, eligibility_criteria, application_process, deadline,
          description, seo ? JSON.stringify(seo) : null,
          crawl_policy ? JSON.stringify(crawl_policy) : null,
          form_schema_id, status, id
        ]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Scholarship not found' });
      }

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);

      // Handle unique constraint violation for slug
      if (error.code === '23505' && error.constraint === 'scholarships_slug_key') {
        return reply.status(409).send({
          error: 'A scholarship with this slug already exists'
        });
      }

      return reply.status(500).send({ error: 'Failed to update scholarship' });
    }
  });

  // DELETE /api/admin/scholarships/:id - Delete scholarship
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'DELETE FROM scholarships WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Scholarship not found' });
      }

      return { success: true, id: result.rows[0].id };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete scholarship' });
    }
  });
}

module.exports = scholarshipsRoutes;
