const http = require('http');
const path = require('path');
const fs = require('fs');

console.log('====================================================');
console.log('RUNNING CAREERCONNECT VERCEL & AUTH TEST SUITE');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// Mock Response object for testing serverless functions in-memory
function createMockRes() {
  const headers = {};
  let statusCode = 200;
  let body = '';
  let ended = false;

  const res = {
    statusCode,
    headers,
    headersSent: false,
    setHeader(key, value) {
      headers[key.toLowerCase()] = value;
    },
    writeHead(code, incomingHeaders = {}) {
      statusCode = code;
      res.statusCode = code;
      res.headersSent = true;
      for (const [k, v] of Object.entries(incomingHeaders)) {
        headers[k.toLowerCase()] = v;
      }
    },
    status(code) {
      statusCode = code;
      res.statusCode = code;
      return res;
    },
    json(data) {
      res.setHeader('content-type', 'application/json; charset=UTF-8');
      body = JSON.stringify(data);
      ended = true;
      return res;
    },
    end(chunk = '') {
      body += chunk;
      ended = true;
      res.headersSent = true;
    },
    getBody() {
      return body;
    },
    getJson() {
      try {
        return JSON.parse(body);
      } catch (e) {
        return null;
      }
    },
    getStatusCode() {
      return statusCode;
    },
    getHeaders() {
      return headers;
    }
  };

  return res;
}

// Recursively find all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

async function runTests() {
  // Test 1: Verify deployment files exist and function count is strictly <= 12
  console.log('--- 1. Vercel Hobby Plan & Deployment Configuration Checks ---');
  const apiDir = path.join(__dirname, '..', 'api');
  assert(fs.existsSync(apiDir), 'api/ directory exists');
  const apiFiles = getAllFiles(apiDir);
  console.log(`  -> Detected serverless function files in api/: ${apiFiles.length}`);
  assert(apiFiles.length <= 12, `Serverless function count (${apiFiles.length}) is within Vercel Hobby plan limit of 12`);
  assert(apiFiles.length === 1, `Consolidated to exactly 1 serverless handler (api/index.js)`);
  assert(fs.existsSync(path.join(__dirname, '..', 'vercel.json')), 'vercel.json exists in root');
  assert(fs.existsSync(path.join(__dirname, '..', 'package.json')), 'package.json exists in root');

  const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
  assert(Array.isArray(vercelConfig.rewrites) && vercelConfig.rewrites.some(r => r.destination && r.destination.includes('/api/index.js')), 'vercel.json rewrites correctly route /api/(.*) to /api/index.js');

  // Test 2: Single serverless function (api/index.js) handling registration via rewrite parameter
  console.log('\n--- 2. Serverless Registration via api/index.js (?__route=auth/register) ---');
  const indexHandler = require('../api/index.js');
  const testEmail = `student_${Date.now()}@example.com`;
  const testPassword = 'SecureP@ssword123!';
  const testName = 'Priya Sharma';

  const mockReq1 = {
    method: 'POST',
    url: '/api/index.js?__route=auth/register',
    headers: {
      'content-type': 'application/json',
      host: 'careerconnect.vercel.app'
    },
    body: {
      name: testName,
      email: testEmail,
      password: testPassword
    }
  };
  const mockRes1 = createMockRes();

  await indexHandler(mockReq1, mockRes1);
  const json1 = mockRes1.getJson();

  assert(mockRes1.getStatusCode() === 201, `Registration returns HTTP 201 (got ${mockRes1.getStatusCode()})`);
  assert(json1 && json1.success === true, 'Response contains success: true');
  assert(json1 && typeof json1.token === 'string' && json1.token.length > 20, 'Response returns valid session token');
  assert(json1 && json1.user && json1.user.email === testEmail, 'Response returns user object with correct email');
  assert(json1 && json1.user && !json1.user.password_hash && !json1.user.salt, 'Response sanitizes user (no password_hash or salt exposed)');
  assert(mockRes1.getHeaders()['content-type'].includes('application/json'), 'Content-Type header is application/json');

  // Test 3: Registration via x-matched-path header (Vercel Edge Rewrite)
  console.log('\n--- 3. Serverless Registration via x-matched-path Header ---');
  const testEmail2 = `student_matched_${Date.now()}@example.com`;
  const mockReq2 = {
    method: 'POST',
    url: '/api/index.js',
    headers: {
      'content-type': 'application/json',
      'x-matched-path': '/api/auth/register',
      host: 'careerconnect.vercel.app'
    },
    body: {
      name: 'Matched Student',
      email: testEmail2,
      password: testPassword
    }
  };
  const mockRes2 = createMockRes();
  await indexHandler(mockReq2, mockRes2);
  assert(mockRes2.getStatusCode() === 201, `x-matched-path registration returns HTTP 201`);
  assert(mockRes2.getJson()?.success === true, 'x-matched-path registration succeeds');

  // Test 4: Duplicate email registration
  console.log('\n--- 4. Duplicate Email Registration (Conflict Handling) ---');
  const mockReqDup = {
    method: 'POST',
    url: '/api/index.js?__route=auth/register',
    headers: {
      'content-type': 'application/json',
      host: 'careerconnect.vercel.app'
    },
    body: {
      name: 'Another Student',
      email: testEmail, // duplicate
      password: 'AnotherPassword999!'
    }
  };
  const mockResDup = createMockRes();

  await indexHandler(mockReqDup, mockResDup);
  const jsonDup = mockResDup.getJson();

  assert(mockResDup.getStatusCode() === 400, `Duplicate email registration returns HTTP 400 (got ${mockResDup.getStatusCode()})`);
  assert(jsonDup && jsonDup.error && jsonDup.error.includes('already exists'), `Error message clearly informs account already exists (got: "${jsonDup ? jsonDup.error : ''}")`);

  // Test 5: Validation Failures (Invalid email, short password, missing name)
  console.log('\n--- 5. Validation Failure Handling ---');
  // 5a. Short password
  const mockResShort = createMockRes();
  await indexHandler({
    method: 'POST',
    url: '/api/index.js?__route=auth/register',
    headers: { 'content-type': 'application/json' },
    body: { name: 'Valid Name', email: 'valid@example.com', password: 'short' }
  }, mockResShort);
  assert(mockResShort.getStatusCode() === 400, 'Password < 8 chars returns HTTP 400');
  assert(mockResShort.getJson()?.error?.includes('8 characters'), 'Short password error mentions 8 characters');

  // 5b. Invalid email
  const mockResBadEmail = createMockRes();
  await indexHandler({
    method: 'POST',
    url: '/api/index.js?__route=auth/register',
    headers: { 'content-type': 'application/json' },
    body: { name: 'Valid Name', email: 'notanemail', password: 'SecurePassword123!' }
  }, mockResBadEmail);
  assert(mockResBadEmail.getStatusCode() === 400, 'Invalid email format returns HTTP 400');
  assert(mockResBadEmail.getJson()?.error?.includes('email'), 'Invalid email error mentions email');

  // 5c. Missing name
  const mockResNoName = createMockRes();
  await indexHandler({
    method: 'POST',
    url: '/api/index.js?__route=auth/register',
    headers: { 'content-type': 'application/json' },
    body: { name: '', email: 'valid2@example.com', password: 'SecurePassword123!' }
  }, mockResNoName);
  assert(mockResNoName.getStatusCode() === 400, 'Missing name returns HTTP 400');

  // Test 6: Login with Newly Registered User
  console.log('\n--- 6. Login Verification via api/index.js ---');
  const mockResLogin = createMockRes();
  await indexHandler({
    method: 'POST',
    url: '/api/index.js?__route=auth/login',
    headers: { 'content-type': 'application/json' },
    body: { email: testEmail, password: testPassword }
  }, mockResLogin);
  assert(mockResLogin.getStatusCode() === 200, `Login returns HTTP 200 (got ${mockResLogin.getStatusCode()})`);
  assert(mockResLogin.getJson()?.token, 'Login returns valid token');

  // Test 7: Scholarships list via api/index.js
  console.log('\n--- 7. Scholarships API via api/index.js ---');
  const mockResSchol = createMockRes();
  await indexHandler({
    method: 'GET',
    url: '/api/index.js?__route=scholarships&state=Maharashtra',
    headers: { host: 'careerconnect.vercel.app' }
  }, mockResSchol);
  assert(mockResSchol.getStatusCode() === 200, `Scholarships list returns HTTP 200`);
  assert(Array.isArray(mockResSchol.getJson()?.data), 'Scholarships data is an array');

  // Test 8: Unrecognized API Route Returns Valid JSON 404
  console.log('\n--- 8. Non-Existent API Route Returns JSON 404 (Never HTML) ---');
  const mockRes404 = createMockRes();
  await indexHandler({
    method: 'GET',
    url: '/api/index.js?__route=non-existent-route',
    headers: { host: 'careerconnect.vercel.app' }
  }, mockRes404);
  assert(mockRes404.getStatusCode() === 404, 'Unknown API route returns 404');
  assert(mockRes404.getHeaders()['content-type']?.includes('application/json'), 'Unknown API route returns application/json Content-Type');
  const json404 = mockRes404.getJson();
  assert(json404 && json404.error && json404.error.includes('API route not found'), 'Unknown API route returns clean JSON error message');

  // Test 9: Frontend safeJson error handling simulation
  console.log('\n--- 9. Frontend safeJson Resilience Against HTML Error Pages ---');
  const vercel404Html = '<!DOCTYPE html><html><head><title>404: Not Found</title></head><body>The page could not be found</body></html>';
  const mockHtmlResponse = {
    ok: false,
    status: 404,
    headers: {
      get: (h) => (h.toLowerCase() === 'content-type' ? 'text/html; charset=utf-8' : null)
    },
    text: async () => vercel404Html,
    json: async () => {
      throw new SyntaxError(`Unexpected token 'T', "The page c"... is not valid JSON`);
    }
  };

  async function testSafeJson(response, defaultMsg) {
    const contentType = response.headers ? (response.headers.get('content-type') || '') : '';
    let data = null;
    if (contentType.includes('application/json')) {
      try { data = await response.json(); } catch (e) { data = null; }
    } else {
      try {
        const text = await response.text();
        try { data = JSON.parse(text); } catch (e) { data = null; }
      } catch (e) { data = null; }
    }
    if (!response.ok) {
      const errorMsg = (data && data.error)
        ? data.error
        : (data && data.message)
          ? data.message
          : (response.status === 404)
            ? 'The requested authentication service was not found (404). Please check the backend deployment.'
            : `${defaultMsg} (HTTP ${response.status})`;
      const err = new Error(errorMsg);
      err.status = response.status;
      throw err;
    }
    return data;
  }

  let caughtError = null;
  try {
    await testSafeJson(mockHtmlResponse, 'Failed to create account.');
  } catch (e) {
    caughtError = e;
  }

  assert(caughtError !== null, 'safeJson properly caught and threw an error on HTML response');
  assert(!caughtError.message.includes('Unexpected token'), `safeJson never throws JSON syntax error (got: "${caughtError.message}")`);
  assert(caughtError.message.includes('404'), `safeJson provides informative 404 message (got: "${caughtError.message}")`);

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Test suite failed with unhandled error:', err);
  process.exit(1);
});
