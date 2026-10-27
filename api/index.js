/**
 * Vercel Serverless Function Handler
 * Routes all /api/* requests to CareerConnect API Handler
 */
const { handleRequest } = require('../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
