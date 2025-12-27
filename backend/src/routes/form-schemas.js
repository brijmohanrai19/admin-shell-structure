const pool = require('../config/database');
const authenticate = require('../middleware/authenticate');

async function formSchemasRoutes(fastify, options) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticate);

  // GET /api/admin/form-schemas - List all form schemas
  fastify.get('/', async (request, reply) => {
    try {
      const result = await pool.query(
        'SELECT * FROM form_schemas ORDER BY slug, version DESC'
      );
      return result.rows;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch form schemas' });
    }
  });

  // GET /api/admin/form-schemas/:id - Get single form schema
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'SELECT * FROM form_schemas WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Form schema not found' });
      }

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch form schema' });
    }
  });

  // POST /api/admin/form-schemas - Create form schema
  fastify.post('/', async (request, reply) => {
    try {
      const { name, slug, fields, status, is_system_default } = request.body;

      // Validation
      if (!name || !slug || !fields || !Array.isArray(fields)) {
        return reply.status(400).send({
          error: 'Name, slug, and fields array are required'
        });
      }

      if (fields.length === 0) {
        return reply.status(400).send({
          error: 'At least one field is required'
        });
      }

      const result = await pool.query(
        `INSERT INTO form_schemas (name, slug, version, fields, status, is_system_default)
         VALUES ($1, $2, 1, $3, $4, $5) RETURNING *`,
        [
          name,
          slug,
          JSON.stringify(fields),
          status || 'draft',
          is_system_default || false
        ]
      );

      return reply.status(201).send(result.rows[0]);
    } catch (error) {
      fastify.log.error(error);

      // Handle unique constraint violation
      if (error.code === '23505') {
        return reply.status(409).send({
          error: 'Form schema version already exists'
        });
      }

      return reply.status(500).send({ error: 'Failed to create form schema' });
    }
  });

  // PATCH /api/admin/form-schemas/:id - Update form schema
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, fields, status, is_system_default } = request.body;

      // Check if form schema is published (version locked)
      const check = await pool.query(
        'SELECT status FROM form_schemas WHERE id = $1',
        [id]
      );

      if (check.rows.length === 0) {
        return reply.status(404).send({ error: 'Form schema not found' });
      }

      if (check.rows[0].status === 'published') {
        return reply.status(400).send({
          error: 'Cannot edit published schema. Create new version instead.'
        });
      }

      // Validate fields if provided
      if (fields && (!Array.isArray(fields) || fields.length === 0)) {
        return reply.status(400).send({
          error: 'Fields must be non-empty array'
        });
      }

      const result = await pool.query(
        `UPDATE form_schemas SET
          name = COALESCE($1, name),
          fields = COALESCE($2, fields),
          status = COALESCE($3, status),
          is_system_default = COALESCE($4, is_system_default),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
        [
          name,
          fields ? JSON.stringify(fields) : null,
          status,
          is_system_default,
          id
        ]
      );

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update form schema' });
    }
  });

  // DELETE /api/admin/form-schemas/:id - Delete form schema
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'DELETE FROM form_schemas WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Form schema not found' });
      }

      return { success: true, id: result.rows[0].id };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete form schema' });
    }
  });
}

module.exports = formSchemasRoutes;
