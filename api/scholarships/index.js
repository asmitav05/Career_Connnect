/**
 * Vercel Serverless Function: Scholarships Endpoint
 * GET /api/scholarships
 */
const { handleRequest } = require('../../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
