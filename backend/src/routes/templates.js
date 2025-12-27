const pool = require('../config/database');
const authenticate = require('../middleware/authenticate');

async function templatesRoutes(fastify, options) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticate);

  // GET /api/admin/templates - List all templates
  fastify.get('/', async (request, reply) => {
    try {
      const result = await pool.query(
        'SELECT * FROM templates ORDER BY slug, version DESC'
      );
      return result.rows;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch templates' });
    }
  });

  // GET /api/admin/templates/:id - Get single template
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'SELECT * FROM templates WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Template not found' });
      }

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch template' });
    }
  });

  // POST /api/admin/templates - Create template
  fastify.post('/', async (request, reply) => {
    try {
      const { name, slug, component_definition, sections, status } = request.body;

      // Validation
      if (!name || !slug || !component_definition) {
        return reply.status(400).send({
          error: 'Name, slug, and component_definition are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO templates (name, slug, version, component_definition, sections, status)
         VALUES ($1, $2, 1, $3, $4, $5) RETURNING *`,
        [
          name,
          slug,
          JSON.stringify(component_definition),
          JSON.stringify(sections || []),
          status || 'draft'
        ]
      );

      return reply.status(201).send(result.rows[0]);
    } catch (error) {
      fastify.log.error(error);

      // Handle unique constraint violation
      if (error.code === '23505') {
        return reply.status(409).send({
          error: 'Template version already exists'
        });
      }

      return reply.status(500).send({ error: 'Failed to create template' });
    }
  });

  // PATCH /api/admin/templates/:id - Update template
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, component_definition, sections, status } = request.body;

      // Check if template is published (version locked)
      const check = await pool.query(
        'SELECT status FROM templates WHERE id = $1',
        [id]
      );

      if (check.rows.length === 0) {
        return reply.status(404).send({ error: 'Template not found' });
      }

      if (check.rows[0].status === 'published') {
        return reply.status(400).send({
          error: 'Cannot edit published template. Create new version instead.'
        });
      }

      const result = await pool.query(
        `UPDATE templates SET
          name = COALESCE($1, name),
          component_definition = COALESCE($2, component_definition),
          sections = COALESCE($3, sections),
          status = COALESCE($4, status),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
        [
          name,
          component_definition ? JSON.stringify(component_definition) : null,
          sections ? JSON.stringify(sections) : null,
          status,
          id
        ]
      );

      return result.rows[0];
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update template' });
    }
  });

  // DELETE /api/admin/templates/:id - Delete template
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query(
        'DELETE FROM templates WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Template not found' });
      }

      return { success: true, id: result.rows[0].id };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete template' });
    }
  });
}

module.exports = templatesRoutes;
