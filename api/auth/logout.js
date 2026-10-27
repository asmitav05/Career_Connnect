/**
 * Vercel Serverless Function: Logout Endpoint
 * POST /api/auth/logout
 */
const { handleRequest } = require('../../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
