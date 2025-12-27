const pool = require('../config/database');
const authenticate = require('../middleware/authenticate');

async function examsRoutes(fastify, options) {
  // All routes require authentication
  fastify.addHook('preHandler', authenticate);

  // GET /api/admin/exams - List all exams
  fastify.get('/', async (request, reply) => {
    try {
      const result = await pool.query(
        'SELECT * FROM exams ORDER BY priority DESC, name ASC'
      );
      return result.rows;
    } catch (error) {
      console.error('Get exams error:', error);
      return reply.status(500).send({ error: 'Failed to fetch exams' });
    }
  });

  // GET /api/admin/exams/:id - Get single exam
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const result = await pool.query(
        'SELECT * FROM exams WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Exam not found' });
      }

      return result.rows[0];
    } catch (error) {
      console.error('Get exam error:', error);
      return reply.status(500).send({ error: 'Failed to fetch exam' });
    }
  });

  // POST /api/admin/exams - Create exam
  fastify.post('/', async (request, reply) => {
    const {
      name,
      slug,
      conducting_body,
      application_start_date,
      application_end_date,
      exam_date,
      description,
      eligibility,
      exam_pattern,
      important_links,
      priority,
      seo,
      crawl_policy,
      status,
    } = request.body;

    // Validation
    if (!name || !slug || !conducting_body) {
      return reply.status(400).send({
        error: 'Name, slug, and conducting_body are required'
      });
    }

    try {
      const result = await pool.query(
        `INSERT INTO exams (
          name, slug, conducting_body, application_start_date,
          application_end_date, exam_date, description, eligibility,
          exam_pattern, important_links, priority, seo, crawl_policy, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
          name, slug, conducting_body, application_start_date,
          application_end_date, exam_date, description, eligibility,
          exam_pattern, JSON.stringify(important_links || {}),
          priority || 0, JSON.stringify(seo || {}),
          JSON.stringify(crawl_policy || {}), status || 'draft'
        ]
      );

      return reply.status(201).send(result.rows[0]);
    } catch (error) {
      console.error('Create exam error:', error);

      if (error.code === '23505') { // Unique constraint violation
        return reply.status(409).send({ error: 'Slug already exists' });
      }

      return reply.status(500).send({ error: 'Failed to create exam' });
    }
  });

  // PATCH /api/admin/exams/:id - Update exam
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params;
    const {
      name,
      slug,
      conducting_body,
      application_start_date,
      application_end_date,
      exam_date,
      description,
      eligibility,
      exam_pattern,
      important_links,
      priority,
      seo,
      crawl_policy,
      status,
    } = request.body;

    try {
      const result = await pool.query(
        `UPDATE exams SET
          name = COALESCE($1, name),
          slug = COALESCE($2, slug),
          conducting_body = COALESCE($3, conducting_body),
          application_start_date = COALESCE($4, application_start_date),
          application_end_date = COALESCE($5, application_end_date),
          exam_date = COALESCE($6, exam_date),
          description = COALESCE($7, description),
          eligibility = COALESCE($8, eligibility),
          exam_pattern = COALESCE($9, exam_pattern),
          important_links = COALESCE($10, important_links),
          priority = COALESCE($11, priority),
          seo = COALESCE($12, seo),
          crawl_policy = COALESCE($13, crawl_policy),
          status = COALESCE($14, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $15
        RETURNING *`,
        [
          name, slug, conducting_body, application_start_date,
          application_end_date, exam_date, description, eligibility,
          exam_pattern, important_links ? JSON.stringify(important_links) : null,
          priority, seo ? JSON.stringify(seo) : null,
          crawl_policy ? JSON.stringify(crawl_policy) : null,
          status, id
        ]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Exam not found' });
      }

      return result.rows[0];
    } catch (error) {
      console.error('Update exam error:', error);

      if (error.code === '23505') {
        return reply.status(409).send({ error: 'Slug already exists' });
      }

      return reply.status(500).send({ error: 'Failed to update exam' });
    }
  });

  // DELETE /api/admin/exams/:id - Delete exam (optional)
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const result = await pool.query(
        'DELETE FROM exams WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Exam not found' });
      }

      return { success: true, id: result.rows[0].id };
    } catch (error) {
      console.error('Delete exam error:', error);
      return reply.status(500).send({ error: 'Failed to delete exam' });
    }
  });
}

module.exports = examsRoutes;
