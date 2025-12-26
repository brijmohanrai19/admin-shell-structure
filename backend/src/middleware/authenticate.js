const { verifyToken } = require('../utils/jwt');

async function authenticate(request, reply) {
  try {
    // Get token from cookie
    const token = request.cookies.auth_token;

    if (!token) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return reply.status(401).send({ error: 'Invalid token' });
    }

    // Attach user to request
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({ error: 'Authentication failed' });
  }
}

module.exports = authenticate;
