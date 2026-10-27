/**
 * Vercel Serverless Function: Google Auth Endpoint
 * POST /api/auth/google
 */
const { handleRequest } = require('../../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
