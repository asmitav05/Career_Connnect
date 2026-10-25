const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('=== STARTING CAREERCONNECT AUTHENTICATION SYSTEM TESTS ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// Helper to make HTTP requests
function httpRequest({ method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const reqHeaders = { ...headers };
    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          json
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  // ============================================
  // 1. FILE & CRYPTOGRAPHY INTEGRITY CHECKS
  // ============================================
  console.log('1. Testing File & Crypto Primitives:');
  
  assert(fs.existsSync('login.html'), 'login.html exists');
  assert(fs.existsSync('signup.html'), 'signup.html exists');
  assert(fs.existsSync('js/auth.js'), 'js/auth.js exists');
  assert(fs.existsSync('server.js'), 'server.js exists');

  const loginHtml = fs.readFileSync('login.html', 'utf8');
  assert(loginHtml.includes('id="loginEmail"'), 'login.html has email input');
  assert(loginHtml.includes('id="loginPassword"'), 'login.html has password input');
  assert(loginHtml.includes('id="togglePasswordBtn"'), 'login.html has password visibility toggle');
  assert(loginHtml.includes('id="rememberMeCheckbox"'), 'login.html has Remember Me checkbox');
  assert(loginHtml.includes('id="openForgotModalBtn"'), 'login.html has Forgot Password link/modal');
  assert(loginHtml.includes('googleCustomBtn') || loginHtml.includes('googleBtnContainer'), 'login.html has Continue with Google button');
  assert(loginHtml.includes('href="signup.html"'), 'login.html links to signup.html');

  const signupHtml = fs.readFileSync('signup.html', 'utf8');
  assert(signupHtml.includes('id="signupName"'), 'signup.html has full name input');
  assert(signupHtml.includes('id="signupEmail"'), 'signup.html has email input');
  assert(signupHtml.includes('id="signupPassword"'), 'signup.html has password input');
  assert(signupHtml.includes('id="signupConfirmPassword"'), 'signup.html has confirm password input');
  assert(signupHtml.includes('id="togglePasswordBtn1"') && signupHtml.includes('id="togglePasswordBtn2"'), 'signup.html has show/hide toggles');
  assert(signupHtml.includes('id="termsCheckbox"'), 'signup.html has Terms of Service checkbox');
  assert(signupHtml.includes('href="login.html"'), 'signup.html links to login.html');

  const componentsJs = fs.readFileSync('js/components.js', 'utf8');
  assert(componentsJs.includes('AuthService'), 'js/components.js imports AuthService');
  assert(componentsJs.includes('headerUserMenuBtn') || componentsJs.includes('headerLogoutBtn'), 'js/components.js renders authenticated user menu and logout');

  const dashboardJs = fs.readFileSync('js/dashboard.js', 'utf8');
  assert(dashboardJs.includes('AuthService'), 'js/dashboard.js imports AuthService');
  assert(dashboardJs.includes('dashboardLogoutBtn'), 'js/dashboard.js binds working logout button');

  // Test PBKDF2 hashing security
  const testSalt = crypto.randomBytes(16).toString('hex');
  const hash1 = crypto.pbkdf2Sync('SecureP@ssw0rd2026', testSalt, 100000, 64, 'sha512').toString('hex');
  const hash2 = crypto.pbkdf2Sync('SecureP@ssw0rd2026', testSalt, 100000, 64, 'sha512').toString('hex');
  const hashDiff = crypto.pbkdf2Sync('WrongPassword', testSalt, 100000, 64, 'sha512').toString('hex');

  assert(hash1 === hash2, 'PBKDF2 SHA-512 hashing is deterministic with constant salt');
  assert(hash1 !== hashDiff, 'Different passwords yield strictly non-matching cryptographic hashes');
  assert(hash1.length === 128, 'SHA-512 with 64 byte output produces 128-character hex hash');

  // ============================================
  // 2. HTTP ENDPOINTS & AUTHENTICATION TESTS
  // ============================================
  console.log('\n2. Testing HTTP Endpoints & Authentication API:');

  // Static files check
  const resLogin = await httpRequest({ method: 'GET', path: '/login.html' });
  assert(resLogin.statusCode === 200, 'GET /login.html returns HTTP 200');

  const resSignup = await httpRequest({ method: 'GET', path: '/signup.html' });
  assert(resSignup.statusCode === 200, 'GET /signup.html returns HTTP 200');

  // Endpoint 1: Input Validation on Registration
  const testEmail = `student_${Date.now()}@example.com`;
  const badReg1 = await httpRequest({
    method: 'POST',
    path: '/api/auth/register',
    body: { name: '', email: testEmail, password: 'Password123' }
  });
  assert(badReg1.statusCode === 400 && badReg1.json.error, 'Rejects registration with empty name');

  const badReg2 = await httpRequest({
    method: 'POST',
    path: '/api/auth/register',
    body: { name: 'Asmita', email: 'notanemail', password: 'Password123' }
  });
  assert(badReg2.statusCode === 400 && badReg2.json.error, 'Rejects registration with invalid email');

  const badReg3 = await httpRequest({
    method: 'POST',
    path: '/api/auth/register',
    body: { name: 'Asmita', email: testEmail, password: 'short' }
  });
  assert(badReg3.statusCode === 400 && badReg3.json.error, 'Rejects registration with password shorter than 8 chars');

  // Endpoint 2: Successful Registration
  const regRes = await httpRequest({
    method: 'POST',
    path: '/api/auth/register',
    body: { name: 'Asmita Verma', email: testEmail, password: 'ValidPassword123' }
  });
  assert(regRes.statusCode === 201 && regRes.json.success === true, 'Successful registration returns HTTP 201');
  assert(Boolean(regRes.json.token), 'Registration response contains session token');
  assert(regRes.json.user && regRes.json.user.email === testEmail, 'User email returned correctly');
  assert(regRes.json.user.passwordHash === undefined, 'Zero plaintext password or hash leaked in response');

  const initialToken = regRes.json.token;

  // Endpoint 3: Duplicate Email Prevention
  const dupReg = await httpRequest({
    method: 'POST',
    path: '/api/auth/register',
    body: { name: 'Asmita Duplicate', email: testEmail, password: 'ValidPassword123' }
  });
  assert(dupReg.statusCode === 400 && dupReg.json.error.includes('already exists'), 'Duplicate registration is rejected with 400');

  // Endpoint 4: Failed Login (Wrong Password)
  const failLogin = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: testEmail, password: 'WrongPassword' }
  });
  assert(failLogin.statusCode === 401 && failLogin.json.error, 'Failed login with incorrect password returns 401');

  // Endpoint 5: Successful Login
  const loginRes = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: testEmail, password: 'ValidPassword123', rememberMe: true }
  });
  assert(loginRes.statusCode === 200 && loginRes.json.success === true, 'Successful login returns HTTP 200');
  assert(Boolean(loginRes.json.token), 'Login returns active session token');
  assert(loginRes.json.user.name === 'Asmita Verma', 'Login returns sanitized user profile');

  const loginToken = loginRes.json.token;

  // Endpoint 6: GET /api/auth/me with Bearer token
  const meRes = await httpRequest({
    method: 'GET',
    path: '/api/auth/me',
    headers: { 'Authorization': `Bearer ${loginToken}` }
  });
  assert(meRes.statusCode === 200 && meRes.json.success === true, 'GET /api/auth/me with valid Bearer token returns 200');
  assert(meRes.json.user.email === testEmail, 'GET /api/auth/me returns matching user email');

  // Endpoint 7: GET /api/auth/me with invalid token
  const badMeRes = await httpRequest({
    method: 'GET',
    path: '/api/auth/me',
    headers: { 'Authorization': 'Bearer invalid_fake_token_12345' }
  });
  assert(badMeRes.statusCode === 401, 'GET /api/auth/me with invalid token returns 401 Unauthorized');

  // Endpoint 8: Google Authentication endpoint
  const googleRes = await httpRequest({
    method: 'POST',
    path: '/api/auth/google',
    body: {
      email: 'student.google@gmail.com',
      name: 'Google Student',
      avatar: 'https://lh3.googleusercontent.com/test-avatar'
    }
  });
  assert(googleRes.statusCode === 200 && googleRes.json.success === true, 'POST /api/auth/google returns 200');
  assert(googleRes.json.user.provider === 'google', 'User provider identified as google');
  assert(Boolean(googleRes.json.token), 'Google login returns valid session token');

  // Endpoint 9: Forgot Password & Reset Password Workflow
  const forgotRes = await httpRequest({
    method: 'POST',
    path: '/api/auth/forgot-password',
    body: { email: testEmail }
  });
  assert(forgotRes.statusCode === 200 && Boolean(forgotRes.json.resetToken), 'POST /api/auth/forgot-password generates reset token');
  
  const resetToken = forgotRes.json.resetToken;

  const resetRes = await httpRequest({
    method: 'POST',
    path: '/api/auth/reset-password',
    body: { token: resetToken, newPassword: 'BrandNewPassword2026' }
  });
  assert(resetRes.statusCode === 200 && resetRes.json.success === true, 'POST /api/auth/reset-password succeeds');

  // Verify login with new password works
  const newLoginRes = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: testEmail, password: 'BrandNewPassword2026' }
  });
  assert(newLoginRes.statusCode === 200, 'Login with updated password succeeds');

  // Endpoint 10: Logout & Session Invalidation
  const logoutRes = await httpRequest({
    method: 'POST',
    path: '/api/auth/logout',
    headers: { 'Authorization': `Bearer ${newLoginRes.json.token}` }
  });
  assert(logoutRes.statusCode === 200 && logoutRes.json.success === true, 'POST /api/auth/logout returns 200');

  const afterLogoutMe = await httpRequest({
    method: 'GET',
    path: '/api/auth/me',
    headers: { 'Authorization': `Bearer ${newLoginRes.json.token}` }
  });
  assert(afterLogoutMe.statusCode === 401, 'Logged out session token is immediately invalidated');

  console.log(`\n=== AUTHENTICATION TEST SUITE SUMMARY ===`);
  console.log(`Results: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests/totalTests)*100)}%)\n`);

  if (passedTests === totalTests) {
    console.log('ALL AUTHENTICATION TESTS PASSED PERFECTLY!\n');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
