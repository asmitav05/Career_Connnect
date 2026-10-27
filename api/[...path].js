/**
 * Vercel Serverless Function Catch-All Handler
 * Handles dynamic sub-routes under /api/
 */
const { handleRequest } = require('../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
