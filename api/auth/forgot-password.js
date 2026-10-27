/**
 * Vercel Serverless Function: Forgot Password
 * POST /api/auth/forgot-password
 */
const { handleRequest } = require('../../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
