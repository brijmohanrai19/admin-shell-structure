const pool = require('../config/database');
const authenticate = require('../middleware/authenticate');

async function collegesRoutes(fastify, options) {
  // All routes require authentication
  fastify.addHook('preHandler', authenticate);

  // GET /api/admin/colleges - List all colleges
  fastify.get('/', async (request, reply) => {
    try {
      const result = await pool.query(
        'SELECT * FROM colleges ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      console.error('Get colleges error:', error);
      return reply.status(500).send({ error: 'Failed to fetch colleges' });
    }
  });

  // GET /api/admin/colleges/:id - Get single college
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const result = await pool.query(
        'SELECT * FROM colleges WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'College not found' });
      }

      return result.rows[0];
    } catch (error) {
      console.error('Get college error:', error);
      return reply.status(500).send({ error: 'Failed to fetch college' });
    }
  });

  // POST /api/admin/colleges - Create college
  fastify.post('/', async (request, reply) => {
    const {
      name,
      slug,
      city,
      state,
      country,
      courses,
      fee_range,
      intake,
      approvals,
      description,
      admission_process,
      seo,
      crawl_policy,
      form_schema_id,
      status,
    } = request.body;

    // Validation
    if (!name || !slug || !city || !state) {
      return reply.status(400).send({
        error: 'Name, slug, city, and state are required'
      });
    }

    // Validate courses array (at least 1 course required for publish)
    if (status === 'live' && (!courses || courses.length === 0)) {
      return reply.status(400).send({
        error: 'At least one course is required to publish'
      });
    }

    // Validate fee_range if provided
    if (fee_range && fee_range.min > fee_range.max) {
      return reply.status(400).send({
        error: 'Minimum fee cannot be greater than maximum fee'
      });
    }

    try {
      const result = await pool.query(
        `INSERT INTO colleges (
          name, slug, city, state, country, courses, fee_range, intake,
          approvals, description, admission_process, seo, crawl_policy,
          form_schema_id, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          name, slug, city, state, country || 'India',
          JSON.stringify(courses || []),
          fee_range ? JSON.stringify(fee_range) : null,
          intake,
          approvals || [],
          description,
          admission_process,
          JSON.stringify(seo || {}),
          JSON.stringify(crawl_policy || {}),
          form_schema_id,
          status || 'draft'
        ]
      );

      return reply.status(201).send(result.rows[0]);
    } catch (error) {
      console.error('Create college error:', error);

      if (error.code === '23505') {
        return reply.status(409).send({ error: 'Slug already exists' });
      }

      return reply.status(500).send({ error: 'Failed to create college' });
    }
  });

  // PATCH /api/admin/colleges/:id - Update college
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params;
    const {
      name,
      slug,
      city,
      state,
      country,
      courses,
      fee_range,
      intake,
      approvals,
      description,
      admission_process,
      seo,
      crawl_policy,
      form_schema_id,
      status,
    } = request.body;

    // Validate courses if updating to live
    if (status === 'live' && courses && courses.length === 0) {
      return reply.status(400).send({
        error: 'At least one course is required to publish'
      });
    }

    // Validate fee_range if provided
    if (fee_range && fee_range.min && fee_range.max && fee_range.min > fee_range.max) {
      return reply.status(400).send({
        error: 'Minimum fee cannot be greater than maximum fee'
      });
    }

    try {
      const result = await pool.query(
        `UPDATE colleges SET
          name = COALESCE($1, name),
          slug = COALESCE($2, slug),
          city = COALESCE($3, city),
          state = COALESCE($4, state),
          country = COALESCE($5, country),
          courses = COALESCE($6, courses),
          fee_range = COALESCE($7, fee_range),
          intake = COALESCE($8, intake),
          approvals = COALESCE($9, approvals),
          description = COALESCE($10, description),
          admission_process = COALESCE($11, admission_process),
          seo = COALESCE($12, seo),
          crawl_policy = COALESCE($13, crawl_policy),
          form_schema_id = COALESCE($14, form_schema_id),
          status = COALESCE($15, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $16
        RETURNING *`,
        [
          name, slug, city, state, country,
          courses ? JSON.stringify(courses) : null,
          fee_range ? JSON.stringify(fee_range) : null,
          intake,
          approvals,
          description,
          admission_process,
          seo ? JSON.stringify(seo) : null,
          crawl_policy ? JSON.stringify(crawl_policy) : null,
          form_schema_id,
          status,
          id
        ]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'College not found' });
      }

      return result.rows[0];
    } catch (error) {
      console.error('Update college error:', error);

      if (error.code === '23505') {
        return reply.status(409).send({ error: 'Slug already exists' });
      }

      return reply.status(500).send({ error: 'Failed to update college' });
    }
  });

  // DELETE /api/admin/colleges/:id - Delete college
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const result = await pool.query(
        'DELETE FROM colleges WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'College not found' });
      }

      return { success: true, id: result.rows[0].id };
    } catch (error) {
      console.error('Delete college error:', error);
      return reply.status(500).send({ error: 'Failed to delete college' });
    }
  });
}

module.exports = collegesRoutes;
