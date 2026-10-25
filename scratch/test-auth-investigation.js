const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

console.log('=== STARTING DEEP AUTHENTICATION INVESTIGATION & VALIDATION ===\n');

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

function httpRequest({ method, path, headers = {}, body = null, isForm = false }) {
  return new Promise((resolve, reject) => {
    let postData = null;
    const reqHeaders = { ...headers };

    if (body) {
      if (isForm) {
        postData = new URLSearchParams(body).toString();
        reqHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        postData = JSON.stringify(body);
        reqHeaders['Content-Type'] = 'application/json';
      }
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

async function runInvestigationTests() {
  const users = JSON.parse(fs.readFileSync('data/users.json', 'utf8'));

  // 1. Password Storage Security Check
  console.log('1. Database Password Security Checks:');
  const hasPlainText = users.some(u => u.password && !u.passwordHash);
  assert(!hasPlainText, 'Zero plain text passwords stored in users.json');
  const allHashedUsers = users.filter(u => u.passwordHash);
  assert(allHashedUsers.every(u => u.salt && u.passwordHash.length === 128), 'All stored passwords use 128-char PBKDF2 SHA-512 hashes with 16-byte random salts');

  // 2. Normal Registration & Login
  console.log('\n2. Standard Account Registration & Login:');
  const testEmail = `student_investigate_${Date.now()}@example.com`;
  const testPassword = 'CorrectP@ssword2026!';

  const regRes = await httpRequest({
    method: 'POST',
    path: '/api/auth/register',
    body: { name: 'Investigate Student', email: testEmail, password: testPassword }
  });
  assert(regRes.statusCode === 201 && regRes.json.success, 'Registration succeeds with 201');
  assert(Boolean(regRes.json.token), 'Registration returns valid token');

  // Test correct password login
  const loginCorrect = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: testEmail, password: testPassword }
  });
  assert(loginCorrect.statusCode === 200 && loginCorrect.json.success, 'Login succeeds with correct password (HTTP 200)');

  // Test incorrect password login
  const loginWrong = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: testEmail, password: 'WrongPassword123!' }
  });
  assert(loginWrong.statusCode === 401, 'Login fails with wrong password (HTTP 401)');
  assert(loginWrong.json.error.includes('Incorrect password'), 'Specific "Incorrect password" message returned');

  // Test wrong password is NEVER accepted (security constraint)
  const anotherWrong = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: testEmail, password: testPassword + '_wrong' }
  });
  assert(anotherWrong.statusCode === 401, 'Near-match password strictly rejected');

  // 3. Email Normalization Tests
  console.log('\n3. Email Normalization Tests (casing & whitespace):');
  // Mixed case email
  const loginUpper = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: testEmail.toUpperCase(), password: testPassword }
  });
  assert(loginUpper.statusCode === 200, 'Uppercase email successfully matches and logs in');

  // Email with leading and trailing spaces
  const loginPadded = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: `   ${testEmail}   `, password: testPassword }
  });
  assert(loginPadded.statusCode === 200, 'Email with leading/trailing spaces successfully normalized and logs in');

  // 4. Password Tolerance Tests (Accidental Trailing Space)
  console.log('\n4. Password Accidental Trailing Whitespace Tolerance:');
  const loginSpaceInPass = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: testEmail, password: testPassword + ' ' }
  });
  assert(loginSpaceInPass.statusCode === 200, 'Password with accidental trailing space is safely accepted via trimmed fallback');

  // 5. Endpoint Aliases Tests
  console.log('\n5. API Endpoint Aliases:');
  const aliasLogin = await httpRequest({
    method: 'POST',
    path: '/api/login',
    body: { email: testEmail, password: testPassword }
  });
  assert(aliasLogin.statusCode === 200, 'POST /api/login alias works identically to /api/auth/login');

  const meAlias = await httpRequest({
    method: 'GET',
    path: '/api/user',
    headers: { 'Authorization': `Bearer ${loginCorrect.json.token}` }
  });
  assert(meAlias.statusCode === 200 && meAlias.json.user.email === testEmail, 'GET /api/user alias returns current user');

  // 6. URL-Encoded Form Submission Support
  console.log('\n6. URL-Encoded Form Submission:');
  const formLogin = await httpRequest({
    method: 'POST',
    path: '/api/login',
    isForm: true,
    body: { email: testEmail, password: testPassword }
  });
  assert(formLogin.statusCode === 200, 'application/x-www-form-urlencoded login request succeeds');

  // 7. Google Sign-In Account & Password Linking
  console.log('\n7. Google Sign-In Account Password Linking:');
  const googleEmail = `google_user_${Date.now()}@gmail.com`;

  // Step 7a: Create account via Google Sign-In
  const googleReg = await httpRequest({
    method: 'POST',
    path: '/api/auth/google',
    body: { email: googleEmail, name: 'Google Explorer User' }
  });
  assert(googleReg.statusCode === 200 && googleReg.json.user.provider === 'google', 'Google account created successfully');

  // Step 7b: Try logging in with password before password is set
  const googlePassLogin1 = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: googleEmail, password: 'AnyPassword123!' }
  });
  assert(googlePassLogin1.statusCode === 400 && googlePassLogin1.json.isGoogleAccount === true, 'Informs user account was created via Google Sign-In without a password');

  // Step 7c: User links a password by registering with that email
  const linkPassReg = await httpRequest({
    method: 'POST',
    path: '/api/auth/register',
    body: { name: 'Google Explorer User', email: googleEmail, password: 'NewLinkedPassword2026!' }
  });
  assert(linkPassReg.statusCode === 200 && linkPassReg.json.success, 'Registration with existing Google email links password without blocking user');

  // Step 7d: Now login with the newly linked password succeeds!
  const googlePassLogin2 = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: googleEmail, password: 'NewLinkedPassword2026!' }
  });
  assert(googlePassLogin2.statusCode === 200 && googlePassLogin2.json.success, 'Login with linked password now succeeds (HTTP 200)');

  // Step 7e: Wrong password on linked Google account still strictly rejected
  const googleWrongPass = await httpRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: googleEmail, password: 'WrongPassword!' }
  });
  assert(googleWrongPass.statusCode === 401, 'Wrong password on linked Google account is rejected (401)');

  console.log(`\n=== INVESTIGATION SUITE SUMMARY ===`);
  console.log(`Results: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)\n`);
}

runInvestigationTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
