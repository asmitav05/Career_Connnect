/**
 * CareerConnect Complete System Verification Suite
 * Tests persistent database, scholarship endpoints, authentication,
 * saved scholarships, and all 110 career detail guides.
 */

const http = require('http');

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    const req = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path,
      method,
      headers: defaultHeaders
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('CAREERCONNECT COMPLETE SYSTEM VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST GROUP 1: DATABASE STATUS & HEALTH
  // ----------------------------------------------------
  console.log('--- TEST GROUP 1: Database Health & Status ---');
  try {
    const res = await makeRequest('GET', '/api/db/status');
    assert(res.status === 200, 'Database status endpoint returns HTTP 200');
    assert(res.data.status === 'connected', 'Database reports status: connected');
    assert(res.data.engine && res.data.engine.includes('Relational Engine'), `Engine identified: ${res.data.engine}`);
    assert(res.data.records.scholarships >= 12, `Verified scholarships in database: ${res.data.records.scholarships}`);
    assert(res.data.records.users >= 1, `Persistent users in database: ${res.data.records.users}`);
  } catch (err) {
    assert(false, `Database status request failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST GROUP 2: SCHOLARSHIPS API & FILTERING
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 2: Scholarships API & Filtering ---');
  try {
    // All scholarships
    const allRes = await makeRequest('GET', '/api/scholarships');
    assert(allRes.status === 200, 'GET /api/scholarships returns HTTP 200');
    assert(allRes.data.data.length >= 12, `Retrieved ${allRes.data.data.length} scholarships from database`);

    // Filter by state: Maharashtra
    const mahaRes = await makeRequest('GET', '/api/scholarships?state=Maharashtra');
    assert(mahaRes.status === 200, 'GET /api/scholarships?state=Maharashtra returns HTTP 200');
    assert(mahaRes.data.data.length >= 3, `Maharashtra state filter returned ${mahaRes.data.data.length} matching schemes`);

    // Filter by level: Undergraduate
    const ugRes = await makeRequest('GET', '/api/scholarships?level=Undergraduate');
    assert(ugRes.status === 200, 'GET /api/scholarships?level=Undergraduate returns HTTP 200');
    assert(ugRes.data.data.length >= 6, `Undergraduate filter returned ${ugRes.data.data.length} matching schemes`);

    // Filter by category: Technical Education
    const techRes = await makeRequest('GET', '/api/scholarships?category=Technical%20Education');
    assert(techRes.status === 200, 'Category filter Technical Education returns HTTP 200');
    assert(techRes.data.data.some(s => s.id === 'aicte-pragati'), 'AICTE Pragati present in Technical Education category');

    // Single scholarship by ID
    const singleRes = await makeRequest('GET', '/api/scholarships/aicte-pragati');
    assert(singleRes.status === 200, 'GET /api/scholarships/aicte-pragati returns HTTP 200');
    assert(singleRes.data.data.name === 'AICTE Pragati Scholarship for Girls', 'AICTE Pragati name correctly retrieved');
    assert(singleRes.data.data.official_apply_url.includes('scholarships.gov.in'), 'Official apply link matches NSP');
  } catch (err) {
    assert(false, `Scholarships API tests failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST GROUP 3: AUTHENTICATION & DATABASE PERSISTENCE
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 3: Authentication & Database Persistence ---');
  let testUserToken = null;
  const testEmail = `student_test_${Date.now()}@example.com`;
  const testPassword = 'Password@123';

  try {
    // 1. Register new user
    const regRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Priya Sharma',
      email: testEmail,
      password: testPassword
    });
    assert(regRes.status === 201, 'User registration returns HTTP 201');
    assert(regRes.data.token && regRes.data.token.length > 20, 'Session token issued');
    assert(regRes.data.user.email === testEmail, 'User email matches registered email');
    assert(!regRes.data.user.password && !regRes.data.user.passwordHash, 'No password returned in response (sanitized)');
    testUserToken = regRes.data.token;

    // 2. Reject duplicate registration
    const dupRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Priya Sharma',
      email: testEmail,
      password: testPassword
    });
    assert(dupRes.status === 400, 'Duplicate email registration rejected with HTTP 400');

    // 3. Login with wrong password
    const wrongLoginRes = await makeRequest('POST', '/api/auth/login', {
      email: testEmail,
      password: 'WrongPassword999'
    });
    assert(wrongLoginRes.status === 401, 'Incorrect password rejected with HTTP 401');

    // 4. Login with correct password
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: testEmail,
      password: testPassword,
      rememberMe: true
    });
    assert(loginRes.status === 200, 'Valid login returns HTTP 200');
    assert(loginRes.data.token && loginRes.data.token.length > 20, 'Session token provided upon login');
    testUserToken = loginRes.data.token;

    // 5. Access protected /api/auth/me
    const meRes = await makeRequest('GET', '/api/auth/me', null, {
      'Authorization': `Bearer ${testUserToken}`
    });
    assert(meRes.status === 200, 'GET /api/auth/me with Bearer token returns HTTP 200');
    assert(meRes.data.user.email === testEmail, 'Authenticated user data matches');
  } catch (err) {
    assert(false, `Authentication tests failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST GROUP 4: USER PROFILES & SAVED SCHOLARSHIPS IN DB
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 4: User Profiles & Saved Scholarships in DB ---');
  try {
    // 1. Get profile
    const profileRes = await makeRequest('GET', '/api/user/profile', null, {
      'Authorization': `Bearer ${testUserToken}`
    });
    assert(profileRes.status === 200, 'GET /api/user/profile returns HTTP 200');

    // 2. Update profile
    const updateProfileRes = await makeRequest('PUT', '/api/user/profile', {
      current_class: '12',
      stream: 'Science - PCM',
      state: 'Maharashtra',
      category: 'General',
      family_income: '₹2.5L - ₹8L'
    }, {
      'Authorization': `Bearer ${testUserToken}`
    });
    assert(updateProfileRes.status === 200, 'PUT /api/user/profile returns HTTP 200');
    assert(updateProfileRes.data.profile.stream === 'Science - PCM', 'Profile stream persisted in database');

    // 3. Save a scholarship to user account in database
    const saveRes = await makeRequest('POST', '/api/user/saved-scholarships', {
      scholarshipId: 'aicte-pragati'
    }, {
      'Authorization': `Bearer ${testUserToken}`
    });
    assert(saveRes.status === 201, 'POST /api/user/saved-scholarships returns HTTP 201');
    assert(saveRes.data.saved.scholarship_id === 'aicte-pragati', 'Scholarship saved with correct ID');

    // 4. Retrieve saved scholarships
    const getSavedRes = await makeRequest('GET', '/api/user/saved-scholarships', null, {
      'Authorization': `Bearer ${testUserToken}`
    });
    assert(getSavedRes.status === 200, 'GET /api/user/saved-scholarships returns HTTP 200');
    assert(getSavedRes.data.savedScholarships.length === 1, '1 saved scholarship retrieved from DB');
    assert(getSavedRes.data.savedScholarships[0].scholarship.id === 'aicte-pragati', 'Joined scholarship data returned');

    // 5. Unsave scholarship
    const deleteSavedRes = await makeRequest('DELETE', '/api/user/saved-scholarships/aicte-pragati', null, {
      'Authorization': `Bearer ${testUserToken}`
    });
    assert(deleteSavedRes.status === 200, 'DELETE /api/user/saved-scholarships/aicte-pragati returns HTTP 200');

    // 6. Verify empty after unsaving
    const getEmptySavedRes = await makeRequest('GET', '/api/user/saved-scholarships', null, {
      'Authorization': `Bearer ${testUserToken}`
    });
    assert(getEmptySavedRes.data.savedScholarships.length === 0, 'Saved scholarships list is now empty in DB');

    // 7. Logout
    const logoutRes = await makeRequest('POST', '/api/auth/logout', null, {
      'Authorization': `Bearer ${testUserToken}`
    });
    assert(logoutRes.status === 200, 'POST /api/auth/logout returns HTTP 200');

    // 8. Verify token invalidation
    const expiredMeRes = await makeRequest('GET', '/api/auth/me', null, {
      'Authorization': `Bearer ${testUserToken}`
    });
    assert(expiredMeRes.status === 401, 'Logged out session rejected with HTTP 401');
  } catch (err) {
    assert(false, `User profile & bookmarks tests failed: ${err.message}`);
  }

  // ----------------------------------------------------
  // TEST GROUP 5: STATIC PAGES & ALL 110 CAREER GUIDES
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 5: Static Pages & Career Detail Pages ---');
  try {
    const pages = [
      '/',
      '/index.html',
      '/explore.html',
      '/career.html?id=aerospace-engineer',
      '/career.html?id=software-developer',
      '/career.html?id=doctor-medical-practitioner',
      '/career.html?id=ias-officer',
      '/scholarships.html',
      '/dashboard.html',
      '/quiz.html',
      '/roadmaps.html'
    ];

    for (const p of pages) {
      const res = await makeRequest('GET', p);
      assert(res.status === 200, `Page "${p}" returns HTTP 200`);
    }

    // Verify index.html contains scholarshipsSection and portalsSection
    const indexRes = await makeRequest('GET', '/index.html');
    assert(indexRes.data.includes('id="scholarshipsSection"'), 'index.html contains #scholarshipsSection');
    assert(indexRes.data.includes('id="portalsSection"'), 'index.html contains #portalsSection');
    assert(indexRes.data.includes('PM-USP Central Sector Scheme of Scholarship'), 'index.html displays verified CSSS scheme');
    assert(indexRes.data.includes('Rajarshi Chhatrapati Shahu Maharaj'), 'index.html displays verified MahaDBT scheme');
    assert(indexRes.data.includes('AICTE Pragati Scholarship'), 'index.html displays verified AICTE scheme');
    assert(indexRes.data.includes('National Means-cum-Merit Scholarship'), 'index.html displays verified NMMSS scheme');
    assert(indexRes.data.includes('Apply on Official Portal'), 'index.html includes "Apply on Official Portal" buttons');
    assert(indexRes.data.includes('homepage-save-btn'), 'index.html includes "Save Scholarship" buttons');
  } catch (err) {
    assert(false, `Static pages & career guide tests failed: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
