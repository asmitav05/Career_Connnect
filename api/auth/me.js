/**
 * Vercel Serverless Function: Current User Session
 * GET /api/auth/me
 */
const { handleRequest } = require('../../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
