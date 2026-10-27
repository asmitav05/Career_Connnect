/**
 * Vercel Serverless Function: Student Profile
 * GET / POST / PUT /api/user/profile
 */
const { handleRequest } = require('../../server.js');

module.exports = async (req, res) => {
  return handleRequest(req, res);
};
