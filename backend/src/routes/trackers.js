const pool = require('../config/database');
const authenticate = require('../middleware/authenticate');

async function trackersRoutes(fastify, options) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticate);

  // GET /api/admin/trackers - List all trackers
  fastify.get('/', async (request, reply) => {
    try {
      const result = await pool.query(
        'SELECT * FROM trackers ORDER BY priority DESC, created_at DESC'
      );
      return result.rows;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch trackers' });
    }
  });

  // GET /api/admin/trackers/:id - Get single tracker
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'SELECT * FROM trackers WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Tracker not found' });
      }

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch tracker' });
    }
  });

  // POST /api/admin/trackers - Create tracker
  fastify.post('/', async (request, reply) => {
    try {
      const { name, type, scope, script_code, priority, load_position, is_active } = request.body;

      // Validation
      if (!name || !type || !scope || !script_code) {
        return reply.status(400).send({
          error: 'Name, type, scope, and script_code are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO trackers (name, type, scope, script_code, priority, load_position, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name,
          type,
          scope,
          script_code,
          priority || 0,
          load_position || 'head',
          is_active !== false
        ]
      );

      return reply.status(201).send(result.rows[0]);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create tracker' });
    }
  });

  // PATCH /api/admin/trackers/:id - Update tracker
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, type, scope, script_code, priority, load_position, is_active } = request.body;

      const result = await pool.query(
        `UPDATE trackers SET
          name = COALESCE($1, name),
          type = COALESCE($2, type),
          scope = COALESCE($3, scope),
          script_code = COALESCE($4, script_code),
          priority = COALESCE($5, priority),
          load_position = COALESCE($6, load_position),
          is_active = COALESCE($7, is_active),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [name, type, scope, script_code, priority, load_position, is_active, id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Tracker not found' });
      }

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update tracker' });
    }
  });

  // DELETE /api/admin/trackers/:id - Delete tracker
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'DELETE FROM trackers WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Tracker not found' });
      }

      return { success: true, id: result.rows[0].id };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete tracker' });
    }
  });
}

module.exports = trackersRoutes;
