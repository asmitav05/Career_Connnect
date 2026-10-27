/**
 * Vercel Serverless Function: Database Status
 * GET /api/db/status
 */
const { handleRequest } = require('../../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
