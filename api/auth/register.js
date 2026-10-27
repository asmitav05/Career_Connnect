/**
 * Vercel Serverless Function: Student Registration Endpoint
 * POST /api/auth/register
 */
const { handleRequest } = require('../../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
