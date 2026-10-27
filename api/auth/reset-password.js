/**
 * Vercel Serverless Function: Reset Password
 * POST /api/auth/reset-password
 */
const { handleRequest } = require('../../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
