const pool = require('../config/database');
const authenticate = require('../middleware/authenticate');

async function redirectsRoutes(fastify, options) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticate);

  // GET /api/admin/redirects - List all redirects
  fastify.get('/', async (request, reply) => {
    try {
      const result = await pool.query(
        'SELECT * FROM redirects ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch redirects' });
    }
  });

  // GET /api/admin/redirects/:id - Get single redirect
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'SELECT * FROM redirects WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Redirect not found' });
      }

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch redirect' });
    }
  });

  // POST /api/admin/redirects - Create redirect
  fastify.post('/', async (request, reply) => {
    try {
      const { source_path, target_path, redirect_type, is_active, notes } = request.body;

      // Validation
      if (!source_path || !target_path) {
        return reply.status(400).send({
          error: 'Source path and target path are required'
        });
      }

      if (!source_path.startsWith('/') || !target_path.startsWith('/')) {
        return reply.status(400).send({
          error: 'Paths must start with /'
        });
      }

      if (source_path === target_path) {
        return reply.status(400).send({
          error: 'Source and target cannot be the same'
        });
      }

      const result = await pool.query(
        `INSERT INTO redirects (source_path, target_path, redirect_type, is_active, notes)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [source_path, target_path, redirect_type || '301', is_active !== false, notes]
      );

      return reply.status(201).send(result.rows[0]);
    } catch (error) {
      fastify.log.error(error);

      // Handle unique constraint violation
      if (error.code === '23505') {
        return reply.status(409).send({
          error: 'Source path already exists'
        });
      }

      return reply.status(500).send({ error: 'Failed to create redirect' });
    }
  });

  // PATCH /api/admin/redirects/:id - Update redirect
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { source_path, target_path, redirect_type, is_active, notes } = request.body;

      // Validation
      if (source_path && !source_path.startsWith('/')) {
        return reply.status(400).send({
          error: 'Source path must start with /'
        });
      }

      if (target_path && !target_path.startsWith('/')) {
        return reply.status(400).send({
          error: 'Target path must start with /'
        });
      }

      const result = await pool.query(
        `UPDATE redirects SET
          source_path = COALESCE($1, source_path),
          target_path = COALESCE($2, target_path),
          redirect_type = COALESCE($3, redirect_type),
          is_active = COALESCE($4, is_active),
          notes = COALESCE($5, notes),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [source_path, target_path, redirect_type, is_active, notes, id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Redirect not found' });
      }

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);

      // Handle unique constraint violation
      if (error.code === '23505') {
        return reply.status(409).send({
          error: 'Source path already exists'
        });
      }

      return reply.status(500).send({ error: 'Failed to update redirect' });
    }
  });

  // DELETE /api/admin/redirects/:id - Delete redirect
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'DELETE FROM redirects WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Redirect not found' });
      }

      return { success: true, id: result.rows[0].id };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete redirect' });
    }
  });
}

module.exports = redirectsRoutes;
