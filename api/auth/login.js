/**
 * Vercel Serverless Function: Student Login Endpoint
 * POST /api/auth/login
 */
const { handleRequest } = require('../../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
