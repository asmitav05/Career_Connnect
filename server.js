const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { StringDecoder } = require('string_decoder');

// Import Persistent Database Engine
const Database = require('./db/database.js');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// Password Hashing with PBKDF2 (SHA-512, 100,000 iterations)
function hashPassword(password, salt, iterations = 100000) {
  return crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
}

// Safe password verification with constant-time equality and whitespace tolerance
function verifyPassword(password, salt, storedHash) {
  try {
    if (!password || !salt || !storedHash) return false;

    // 1. Primary check: standard 100,000 iterations
    const computedHash = hashPassword(password, salt, 100000);
    const bufComputed = Buffer.from(computedHash, 'hex');
    const bufStored = Buffer.from(storedHash, 'hex');
    if (bufComputed.length === bufStored.length && crypto.timingSafeEqual(bufComputed, bufStored)) {
      return true;
    }

    // 2. Tolerance for accidental leading/trailing whitespace (e.g. mobile keyboard autofill space)
    if (typeof password === 'string') {
      const trimmed = password.trim();
      if (trimmed !== password) {
        const computedTrimmed = hashPassword(trimmed, salt, 100000);
        const bufTrimmed = Buffer.from(computedTrimmed, 'hex');
        if (bufTrimmed.length === bufStored.length && crypto.timingSafeEqual(bufTrimmed, bufStored)) {
          return true;
        }
      }
    }

    // 3. Fallback: check 10,000 iterations in case of legacy hash
    const legacyHash = hashPassword(password, salt, 10000);
    const bufLegacy = Buffer.from(legacyHash, 'hex');
    if (bufLegacy.length === bufStored.length && crypto.timingSafeEqual(bufLegacy, bufStored)) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Parse request body supporting JSON and URL-encoded forms with multi-byte UTF-8
function parseBody(req) {
  return new Promise((resolve, reject) => {
    const decoder = new StringDecoder('utf8');
    let body = '';
    req.on('data', chunk => {
      body += decoder.write(chunk);
      if (body.length > 2e6) { // 2MB max
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      body += decoder.end();
      if (!body) return resolve({});

      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const parsed = {};
        const params = new URLSearchParams(body);
        for (const [key, value] of params.entries()) {
          parsed[key] = value;
        }
        return resolve(parsed);
      }

      try {
        resolve(JSON.parse(body));
      } catch (err) {
        try {
          const parsed = {};
          const params = new URLSearchParams(body);
          for (const [key, value] of params.entries()) {
            parsed[key] = value;
          }
          if (Object.keys(parsed).length > 0) return resolve(parsed);
        } catch (e) {}
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Send standard JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-session-token'
  });
  res.end(JSON.stringify(data));
}

// Extract bearer token from request
function extractToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (req.headers['x-session-token']) {
    return req.headers['x-session-token'].trim();
  }
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  return urlObj.searchParams.get('token');
}

// Helper to authenticate request
async function authenticateUser(req) {
  const token = extractToken(req);
  if (!token) return null;
  const session = await Database.sessions.get(token);
  if (!session) return null;
  const user = await Database.users.findById(session.user_id);
  if (!user) return null;
  return { user, session };
}

// Helper to decode JWT payload (GIS Google token)
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

// Clean sanitized user representation (no passwords or salts)
function sanitizeUser(user) {
  const fullName = user.full_name || user.name || 'Student';
  return {
    id: user.id,
    name: fullName,
    email: user.email,
    avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=4f46e5`,
    role: user.role || 'student',
    provider: user.auth_provider || user.provider || 'local',
    hasPassword: Boolean((user.password_hash || user.passwordHash) && user.salt),
    createdAt: user.created_at || user.createdAt,
    updatedAt: user.updated_at || user.updatedAt
  };
}

// Normalize email helper
function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

// MIME Types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURI(urlObj.pathname);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-session-token'
    });
    res.end();
    return;
  }

  // ==========================================
  // DATABASE HEALTH & STATUS ENDPOINT
  // ==========================================
  if (pathname === '/api/db/status' && req.method === 'GET') {
    const usersCount = await Database.users.count();
    const scholarshipsCount = await Database.scholarships.count();
    return sendJson(res, 200, {
      status: 'connected',
      engine: Database.getEngine(),
      records: {
        users: usersCount,
        scholarships: scholarshipsCount
      },
      timestamp: new Date().toISOString()
    });
  }

  // ==========================================
  // AUTHENTICATION API ROUTES (Persistent DB)
  // ==========================================

  // 1. REGISTER (/api/auth/register or /api/register)
  if ((pathname === '/api/auth/register' || pathname === '/api/register') && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const name = body.name || body.fullName || body.userName;
      const email = body.email || body.userEmail || body.username || body.emailAddress;
      const password = body.password || body.pass || body.userPassword;

      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return sendJson(res, 400, { error: 'Please enter a valid full name (at least 2 characters).' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const normalizedEmail = normalizeEmail(email);
      if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
        return sendJson(res, 400, { error: 'Please provide a valid email address.' });
      }

      if (!password || typeof password !== 'string' || password.length < 8) {
        return sendJson(res, 400, { error: 'Password must be at least 8 characters long.' });
      }

      const existing = await Database.users.findByEmail(normalizedEmail);

      // If user exists: check if it was created through Google without a password
      if (existing) {
        if (!existing.password_hash || !existing.salt) {
          // Add password to the existing Google account
          const salt = generateSalt();
          const password_hash = hashPassword(password, salt);
          const updates = { salt, password_hash };
          if (name && (!existing.full_name || existing.full_name.startsWith('Demo'))) {
            updates.full_name = name.trim();
          }
          const updatedUser = await Database.users.update(existing.id, updates);

          // Create session
          const token = generateToken();
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          await Database.sessions.create(token, existing.id, expiresAt);

          return sendJson(res, 200, {
            success: true,
            message: 'Password successfully linked to your existing account! Logged in.',
            token,
            user: sanitizeUser(updatedUser)
          });
        }

        return sendJson(res, 400, { error: 'An account with this email address already exists. Please log in.' });
      }

      const salt = generateSalt();
      const password_hash = hashPassword(password, salt);

      const newUser = await Database.users.create({
        full_name: name.trim(),
        email: normalizedEmail,
        password_hash,
        salt,
        role: 'student',
        auth_provider: 'local'
      });

      // Create initial profile in user_profiles table
      await Database.profiles.upsert(newUser.id, {
        state: 'Maharashtra',
        category: 'General'
      });

      // Create session (30 days)
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await Database.sessions.create(token, newUser.id, expiresAt);

      return sendJson(res, 201, {
        success: true,
        message: 'Account created successfully in database!',
        token,
        user: sanitizeUser(newUser)
      });
    } catch (err) {
      console.error('Register error:', err);
      return sendJson(res, 500, { error: 'Server error during account registration. Please try again.' });
    }
  }

  // 2. LOGIN (/api/auth/login or /api/login)
  if ((pathname === '/api/auth/login' || pathname === '/api/login') && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const email = body.email || body.username || body.userEmail || body.emailAddress;
      const password = body.password || body.pass || body.userPassword;
      const rememberMe = Boolean(body.rememberMe === true || body.rememberMe === 'true' || body.remember === 'on');

      if (!email || !password) {
        return sendJson(res, 400, { error: 'Please enter both your email address and password.' });
      }

      const normalizedEmail = normalizeEmail(email);
      const user = await Database.users.findByEmail(normalizedEmail);

      // Case 1: Account does not exist
      if (!user) {
        return sendJson(res, 401, { 
          error: 'No account found with this email address. Please check your email or click "Sign Up Free" to create an account.' 
        });
      }

      // Case 2: Account was created via Google Sign-In and has no password set yet
      if (!user.password_hash || !user.salt) {
        if (user.auth_provider === 'google') {
          return sendJson(res, 400, { 
            error: 'This account was created with Google Sign-In and does not have a password set yet. Please click "Continue with Google" below, or click "Forgot password?" to set a password for your account.',
            isGoogleAccount: true 
          });
        }
        return sendJson(res, 401, { error: 'Incorrect password. Please verify your password or use "Forgot password?" to reset it.' });
      }

      // Case 3: Verify password using secure PBKDF2 algorithm
      const isMatch = verifyPassword(password, user.salt, user.password_hash);
      if (!isMatch) {
        return sendJson(res, 401, { 
          error: 'Incorrect password. Please verify your password or use "Forgot password?" to reset it.' 
        });
      }

      // Create session token
      const token = generateToken();
      const durationMs = rememberMe ? (30 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000); // 30 days vs 24 hours
      const expiresAt = new Date(Date.now() + durationMs).toISOString();

      await Database.sessions.create(token, user.id, expiresAt);

      return sendJson(res, 200, {
        success: true,
        message: 'Logged in successfully!',
        token,
        user: sanitizeUser(user)
      });
    } catch (err) {
      console.error('Login error:', err);
      return sendJson(res, 500, { error: 'Server error during login. Please try again.' });
    }
  }

  // 3. GOOGLE SIGN-IN (/api/auth/google or /api/google)
  if ((pathname === '/api/auth/google' || pathname === '/api/google') && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      let googleUser = null;

      if (body.credential) {
        const payload = decodeJwtPayload(body.credential);
        if (payload && payload.email) {
          googleUser = {
            email: normalizeEmail(payload.email),
            name: payload.name || payload.given_name || payload.email.split('@')[0],
            avatar: payload.picture || null,
            googleSub: payload.sub
          };
        }
      } else if (body.email && body.name) {
        googleUser = {
          email: normalizeEmail(body.email),
          name: body.name,
          avatar: body.avatar || null,
          googleSub: body.googleSub || 'google_' + crypto.randomBytes(6).toString('hex')
        };
      }

      if (!googleUser || !googleUser.email) {
        return sendJson(res, 400, { error: 'Invalid Google credential provided.' });
      }

      let user = await Database.users.findByEmail(googleUser.email);

      if (user) {
        const updates = {};
        if (googleUser.avatar) updates.avatar = googleUser.avatar;
        if (googleUser.name && (!user.full_name || user.full_name.startsWith('Demo'))) updates.full_name = googleUser.name;
        updates.google_sub = googleUser.googleSub;
        user = await Database.users.update(user.id, updates);
      } else {
        user = await Database.users.create({
          full_name: googleUser.name,
          email: googleUser.email,
          avatar: googleUser.avatar,
          role: 'student',
          auth_provider: 'google',
          google_sub: googleUser.googleSub
        });

        // Initialize user profile
        await Database.profiles.upsert(user.id, {
          state: 'Maharashtra',
          category: 'General'
        });
      }

      // Create session (30 days)
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await Database.sessions.create(token, user.id, expiresAt);

      return sendJson(res, 200, {
        success: true,
        message: 'Google authentication successful!',
        token,
        user: sanitizeUser(user)
      });
    } catch (err) {
      console.error('Google auth error:', err);
      return sendJson(res, 500, { error: 'Server error during Google authentication.' });
    }
  }

  // 4. FORGOT PASSWORD (/api/auth/forgot-password or /api/forgot-password)
  if ((pathname === '/api/auth/forgot-password' || pathname === '/api/forgot-password') && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const email = body.email || body.username || body.userEmail;
      if (!email) {
        return sendJson(res, 400, { error: 'Please enter your email address.' });
      }

      const normalizedEmail = normalizeEmail(email);
      const user = await Database.users.findByEmail(normalizedEmail);

      const resetToken = crypto.randomBytes(24).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      if (user) {
        await Database.resetTokens.create(resetToken, user.id, user.email, expiresAt);
      }

      return sendJson(res, 200, {
        success: true,
        message: 'If an account matches that email, a password reset token has been generated.',
        resetToken: user ? resetToken : null,
        userExists: Boolean(user)
      });
    } catch (err) {
      console.error('Forgot password error:', err);
      return sendJson(res, 500, { error: 'Server error processing password reset request.' });
    }
  }

  // 5. RESET PASSWORD (/api/auth/reset-password or /api/reset-password)
  if ((pathname === '/api/auth/reset-password' || pathname === '/api/reset-password') && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const token = body.token || body.resetToken;
      const newPassword = body.newPassword || body.password;

      if (!token || !newPassword) {
        return sendJson(res, 400, { error: 'Reset token and new password are required.' });
      }

      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return sendJson(res, 400, { error: 'New password must be at least 8 characters long.' });
      }

      const tokenEntry = await Database.resetTokens.get(token);
      if (!tokenEntry) {
        return sendJson(res, 400, { error: 'Invalid or expired password reset token. Please request a new one.' });
      }

      const user = await Database.users.findById(tokenEntry.user_id);
      if (!user) {
        return sendJson(res, 404, { error: 'User account not found.' });
      }

      const salt = generateSalt();
      const password_hash = hashPassword(newPassword, salt);
      await Database.users.update(user.id, { salt, password_hash });
      await Database.resetTokens.delete(token);

      return sendJson(res, 200, {
        success: true,
        message: 'Your password has been successfully reset. You can now log in.'
      });
    } catch (err) {
      console.error('Reset password error:', err);
      return sendJson(res, 500, { error: 'Server error resetting password.' });
    }
  }

  // 6. GET CURRENT USER (ME) (/api/auth/me or /api/me or /api/user)
  if ((pathname === '/api/auth/me' || pathname === '/api/me' || pathname === '/api/user') && req.method === 'GET') {
    const auth = await authenticateUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Authentication required. No session token provided or session expired.' });
    }
    return sendJson(res, 200, {
      success: true,
      user: sanitizeUser(auth.user)
    });
  }

  // 7. LOGOUT (/api/auth/logout or /api/logout)
  if ((pathname === '/api/auth/logout' || pathname === '/api/logout') && req.method === 'POST') {
    const token = extractToken(req);
    if (token) {
      await Database.sessions.delete(token);
    }
    return sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
  }

  // ==========================================
  // SCHOLARSHIPS API (Database Backed)
  // ==========================================

  // 8. LIST SCHOLARSHIPS WITH ADVANCED FILTERS (/api/scholarships)
  if (pathname === '/api/scholarships' && req.method === 'GET') {
    try {
      const filters = {
        level: urlObj.searchParams.get('level') || 'All',
        state: urlObj.searchParams.get('state') || 'All',
        category: urlObj.searchParams.get('category') || 'All',
        status: urlObj.searchParams.get('status') || 'All',
        search: urlObj.searchParams.get('search') || ''
      };

      const scholarships = await Database.scholarships.findAll(filters);
      return sendJson(res, 200, {
        success: true,
        count: scholarships.length,
        filters,
        data: scholarships
      });
    } catch (err) {
      console.error('Scholarships fetch error:', err);
      return sendJson(res, 500, { error: 'Server error fetching scholarships.' });
    }
  }

  // 9. GET SINGLE SCHOLARSHIP BY ID (/api/scholarships/:id)
  if (pathname.startsWith('/api/scholarships/') && req.method === 'GET') {
    const id = pathname.substring('/api/scholarships/'.length).trim();
    if (id) {
      const scholarship = await Database.scholarships.findById(id);
      if (scholarship) {
        return sendJson(res, 200, { success: true, data: scholarship });
      }
      return sendJson(res, 404, { error: `Scholarship with ID "${id}" not found.` });
    }
  }

  // ==========================================
  // USER SAVED SCHOLARSHIPS API (Bookmarks in DB)
  // ==========================================

  // 10. GET SAVED SCHOLARSHIPS FOR CURRENT USER (/api/user/saved-scholarships)
  if (pathname === '/api/user/saved-scholarships' && req.method === 'GET') {
    const auth = await authenticateUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Please log in to view your saved scholarships.' });
    }

    try {
      const savedList = await Database.savedScholarships.getByUserId(auth.user.id);
      return sendJson(res, 200, {
        success: true,
        count: savedList.length,
        savedScholarships: savedList
      });
    } catch (err) {
      console.error('Get saved scholarships error:', err);
      return sendJson(res, 500, { error: 'Error retrieving saved scholarships.' });
    }
  }

  // 11. SAVE A SCHOLARSHIP (/api/user/saved-scholarships)
  if (pathname === '/api/user/saved-scholarships' && req.method === 'POST') {
    const auth = await authenticateUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Please log in to save scholarships to your profile.' });
    }

    try {
      const body = await parseBody(req);
      const scholarshipId = body.scholarshipId || body.id;
      if (!scholarshipId) {
        return sendJson(res, 400, { error: 'scholarshipId is required.' });
      }

      const scholarship = await Database.scholarships.findById(scholarshipId);
      if (!scholarship) {
        return sendJson(res, 404, { error: 'Scholarship not found in database.' });
      }

      const savedRecord = await Database.savedScholarships.save(auth.user.id, scholarshipId);
      return sendJson(res, 201, {
        success: true,
        message: 'Scholarship saved to your account!',
        saved: savedRecord
      });
    } catch (err) {
      console.error('Save scholarship error:', err);
      return sendJson(res, 500, { error: 'Failed to save scholarship.' });
    }
  }

  // 12. UNSAVE A SCHOLARSHIP (/api/user/saved-scholarships/:id or DELETE /api/user/saved-scholarships)
  if ((pathname.startsWith('/api/user/saved-scholarships/') || pathname === '/api/user/saved-scholarships') && req.method === 'DELETE') {
    const auth = await authenticateUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Please log in to manage your saved scholarships.' });
    }

    try {
      let scholarshipId = '';
      if (pathname.startsWith('/api/user/saved-scholarships/')) {
        scholarshipId = pathname.substring('/api/user/saved-scholarships/'.length).trim();
      } else {
        const body = await parseBody(req);
        scholarshipId = body.scholarshipId || body.id || urlObj.searchParams.get('scholarshipId');
      }

      if (!scholarshipId) {
        return sendJson(res, 400, { error: 'scholarshipId is required to remove.' });
      }

      const removed = await Database.savedScholarships.remove(auth.user.id, scholarshipId);
      return sendJson(res, 200, {
        success: true,
        message: removed ? 'Scholarship removed from saved list.' : 'Scholarship was not saved.',
        removed
      });
    } catch (err) {
      console.error('Remove saved scholarship error:', err);
      return sendJson(res, 500, { error: 'Failed to remove saved scholarship.' });
    }
  }

  // ==========================================
  // USER PROFILES API (Persistent Profile Sync)
  // ==========================================

  // 13. GET USER PROFILE (/api/user/profile)
  if (pathname === '/api/user/profile' && req.method === 'GET') {
    const auth = await authenticateUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Please log in to access your profile.' });
    }

    const profile = await Database.profiles.getByUserId(auth.user.id);
    return sendJson(res, 200, {
      success: true,
      profile: profile || {
        user_id: auth.user.id,
        state: 'Maharashtra',
        category: 'General'
      }
    });
  }

  // 14. UPDATE USER PROFILE (/api/user/profile)
  if (pathname === '/api/user/profile' && (req.method === 'POST' || req.method === 'PUT')) {
    const auth = await authenticateUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Please log in to update your profile.' });
    }

    try {
      const body = await parseBody(req);
      const updatedProfile = await Database.profiles.upsert(auth.user.id, body);
      return sendJson(res, 200, {
        success: true,
        message: 'Student profile updated in database!',
        profile: updatedProfile
      });
    } catch (err) {
      console.error('Profile update error:', err);
      return sendJson(res, 500, { error: 'Failed to update student profile.' });
    }
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let reqPath = pathname;
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(ROOT, reqPath);

  // Security: Prevent directory traversal outside ROOT
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`CareerConnect Server with Persistent Database & Verified Scholarships running at http://127.0.0.1:${PORT}/ and http://localhost:${PORT}/`);
  console.log(`Database Engine: ${Database.getEngine()}`);
});
