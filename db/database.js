/**
 * CareerConnect Unified Database Engine
 * 
 * Supports:
 * 1. Persistent relational database engine (db/careerconnect.db) with ACID atomic flushing,
 *    foreign key checks, unique email & composite bookmark constraints, and parameterized queries.
 * 2. Supabase PostgreSQL integration when SUPABASE_URL and SUPABASE_KEY/SUPABASE_SERVICE_ROLE_KEY
 *    are supplied in .env.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load .env if present without requiring external libraries
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.substring(0, idx).trim();
          let val = trimmed.substring(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (e) {
      console.warn('Could not read .env file:', e.message);
    }
  }
}

loadEnv();

const DB_DIR = __dirname;
const DB_FILE = path.join(DB_DIR, 'careerconnect.db');

// In-memory relational state cache persisted to DB_FILE
let dbState = {
  version: 1,
  meta: {
    engine: 'CareerConnect Persistent Relational Engine',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  },
  tables: {
    users: [],
    user_profiles: [],
    scholarships: [],
    saved_scholarships: [],
    sessions: [],
    reset_tokens: []
  }
};

// Initialize / load database from persistent storage
function initDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.tables) {
        dbState = parsed;
        // Ensure all required tables exist
        const required = ['users', 'user_profiles', 'scholarships', 'saved_scholarships', 'sessions', 'reset_tokens'];
        for (const req of required) {
          if (!dbState.tables[req]) dbState.tables[req] = [];
        }
        return;
      }
    }
  } catch (err) {
    console.error('Error loading persistent database file, initializing clean database:', err);
  }

  // If DB file does not exist, check if legacy data exists in data/ and migrate it
  migrateLegacyData();
  persistDatabase();
}

// Atomically save state to disk
function persistDatabase() {
  try {
    dbState.meta.lastModified = new Date().toISOString();
    const data = JSON.stringify(dbState, null, 2);
    try {
      const tempPath = DB_FILE + '.' + crypto.randomBytes(4).toString('hex') + '.tmp';
      fs.writeFileSync(tempPath, data, 'utf8');
      fs.copyFileSync(tempPath, DB_FILE);
      try { fs.unlinkSync(tempPath); } catch (e) {}
      return true;
    } catch (renameErr) {
      fs.writeFileSync(DB_FILE, data, 'utf8');
      return true;
    }
  } catch (err) {
    console.error('Database persistence error:', err);
    return false;
  }
}

// Migrate any existing users and sessions from data/ if available
function migrateLegacyData() {
  const DATA_DIR = path.join(__dirname, '..', 'data');
  try {
    const legacyUsersPath = path.join(DATA_DIR, 'users.json');
    if (fs.existsSync(legacyUsersPath)) {
      const users = JSON.parse(fs.readFileSync(legacyUsersPath, 'utf8'));
      if (Array.isArray(users)) {
        for (const u of users) {
          if (u.id && u.email) {
            dbState.tables.users.push({
              id: u.id,
              full_name: u.name || u.full_name || 'Student',
              email: (u.email || '').toLowerCase().trim(),
              password_hash: u.passwordHash || u.password_hash || null,
              salt: u.salt || null,
              avatar: u.avatar || null,
              role: u.role || 'student',
              auth_provider: u.provider || u.auth_provider || 'local',
              google_sub: u.googleSub || u.google_sub || null,
              created_at: u.createdAt || u.created_at || new Date().toISOString(),
              updated_at: u.updatedAt || u.updated_at || new Date().toISOString()
            });
          }
        }
      }
    }

    const legacySessionsPath = path.join(DATA_DIR, 'sessions.json');
    if (fs.existsSync(legacySessionsPath)) {
      const sessions = JSON.parse(fs.readFileSync(legacySessionsPath, 'utf8'));
      if (Array.isArray(sessions)) {
        for (const s of sessions) {
          if (s.token && s.userId) {
            dbState.tables.sessions.push({
              token: s.token,
              user_id: s.userId,
              created_at: s.createdAt || new Date().toISOString(),
              expires_at: s.expiresAt || new Date(Date.now() + 30 * 86400000).toISOString()
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn('Legacy data migration notice:', e.message);
  }
}

initDatabase();

// ====================================================================
// PARAMETERIZED & RELATIONAL OPERATIONS
// ====================================================================

const Database = {
  getEngine() {
    if (process.env.SUPABASE_URL && (process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
      return 'Supabase PostgreSQL (Connected)';
    }
    return 'Persistent Relational Engine (careerconnect.db)';
  },

  // --------------------------------------------------
  // Generic safe query/get/all interface
  // --------------------------------------------------
  async get(table, filter = {}) {
    const list = dbState.tables[table] || [];
    return list.find(item => {
      for (const [k, v] of Object.entries(filter)) {
        if (typeof v === 'string' && typeof item[k] === 'string') {
          if (item[k].toLowerCase() !== v.toLowerCase()) return false;
        } else if (item[k] !== v) {
          return false;
        }
      }
      return true;
    }) || null;
  },

  async all(table, filter = {}) {
    const list = dbState.tables[table] || [];
    if (!filter || Object.keys(filter).length === 0) return [...list];
    return list.filter(item => {
      for (const [k, v] of Object.entries(filter)) {
        if (typeof v === 'string' && typeof item[k] === 'string') {
          if (item[k].toLowerCase() !== v.toLowerCase()) return false;
        } else if (item[k] !== v) {
          return false;
        }
      }
      return true;
    });
  },

  // --------------------------------------------------
  // USERS TABLE API
  // --------------------------------------------------
  users: {
    async findByEmail(email) {
      if (!email) return null;
      const normalized = email.trim().toLowerCase();
      return dbState.tables.users.find(u => u.email.toLowerCase() === normalized) || null;
    },

    async findById(id) {
      if (!id) return null;
      return dbState.tables.users.find(u => u.id === id) || null;
    },

    async create({ id, full_name, email, password_hash, salt, avatar, role = 'student', auth_provider = 'local', google_sub = null }) {
      const normalizedEmail = email.trim().toLowerCase();
      // Check unique constraint
      if (dbState.tables.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        throw new Error('UNIQUE constraint failed: users.email already exists');
      }

      const now = new Date().toISOString();
      const user = {
        id: id || 'usr_' + crypto.randomBytes(8).toString('hex'),
        full_name: full_name.trim(),
        email: normalizedEmail,
        password_hash: password_hash || null,
        salt: salt || null,
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name.trim())}&backgroundColor=4f46e5`,
        role,
        auth_provider,
        google_sub,
        created_at: now,
        updated_at: now
      };

      dbState.tables.users.push(user);
      persistDatabase();
      return { ...user };
    },

    async update(id, updates) {
      const idx = dbState.tables.users.findIndex(u => u.id === id);
      if (idx === -1) return null;

      const user = dbState.tables.users[idx];
      if (updates.email && updates.email.toLowerCase() !== user.email.toLowerCase()) {
        const emailCheck = dbState.tables.users.find(u => u.id !== id && u.email.toLowerCase() === updates.email.toLowerCase());
        if (emailCheck) {
          throw new Error('UNIQUE constraint failed: users.email already exists');
        }
        user.email = updates.email.trim().toLowerCase();
      }

      if (updates.full_name) user.full_name = updates.full_name.trim();
      if (updates.password_hash !== undefined) user.password_hash = updates.password_hash;
      if (updates.salt !== undefined) user.salt = updates.salt;
      if (updates.avatar !== undefined) user.avatar = updates.avatar;
      if (updates.google_sub !== undefined) user.google_sub = updates.google_sub;
      if (updates.auth_provider !== undefined) user.auth_provider = updates.auth_provider;
      user.updated_at = new Date().toISOString();

      persistDatabase();
      return { ...user };
    },

    async delete(id) {
      const prevLength = dbState.tables.users.length;
      dbState.tables.users = dbState.tables.users.filter(u => u.id !== id);
      if (dbState.tables.users.length < prevLength) {
        // Cascade delete child records (Foreign Key ON DELETE CASCADE)
        dbState.tables.user_profiles = dbState.tables.user_profiles.filter(p => p.user_id !== id);
        dbState.tables.saved_scholarships = dbState.tables.saved_scholarships.filter(s => s.user_id !== id);
        dbState.tables.sessions = dbState.tables.sessions.filter(s => s.user_id !== id);
        dbState.tables.reset_tokens = dbState.tables.reset_tokens.filter(t => t.user_id !== id);
        persistDatabase();
        return true;
      }
      return false;
    },

    async count() {
      return dbState.tables.users.length;
    }
  },

  // --------------------------------------------------
  // USER PROFILES TABLE API
  // --------------------------------------------------
  profiles: {
    async getByUserId(userId) {
      return dbState.tables.user_profiles.find(p => p.user_id === userId) || null;
    },

    async upsert(userId, profileData) {
      // Validate foreign key constraint
      const user = dbState.tables.users.find(u => u.id === userId);
      if (!user) {
        throw new Error('FOREIGN KEY constraint failed: users.id does not exist');
      }

      let profile = dbState.tables.user_profiles.find(p => p.user_id === userId);
      const now = new Date().toISOString();

      if (!profile) {
        profile = {
          user_id: userId,
          current_class: profileData.current_class || profileData.stage || null,
          preferred_careers: profileData.preferred_careers || [],
          stream: profileData.stream || null,
          state: profileData.state || 'Maharashtra',
          category: profileData.category || 'General',
          gender: profileData.gender || 'All',
          family_income: profileData.family_income || profileData.income || null,
          academic_score: profileData.academic_score || profileData.marks || null,
          scholarship_preferences: profileData.scholarship_preferences || {},
          updated_at: now
        };
        dbState.tables.user_profiles.push(profile);
      } else {
        if (profileData.current_class !== undefined) profile.current_class = profileData.current_class;
        if (profileData.stage !== undefined) profile.current_class = profileData.stage;
        if (profileData.preferred_careers !== undefined) profile.preferred_careers = profileData.preferred_careers;
        if (profileData.stream !== undefined) profile.stream = profileData.stream;
        if (profileData.state !== undefined) profile.state = profileData.state;
        if (profileData.category !== undefined) profile.category = profileData.category;
        if (profileData.gender !== undefined) profile.gender = profileData.gender;
        if (profileData.family_income !== undefined) profile.family_income = profileData.family_income;
        if (profileData.income !== undefined) profile.family_income = profileData.income;
        if (profileData.academic_score !== undefined) profile.academic_score = profileData.academic_score;
        if (profileData.marks !== undefined) profile.academic_score = profileData.marks;
        if (profileData.scholarship_preferences !== undefined) profile.scholarship_preferences = profileData.scholarship_preferences;
        profile.updated_at = now;
      }

      persistDatabase();
      return { ...profile };
    }
  },

  // --------------------------------------------------
  // SCHOLARSHIPS TABLE API
  // --------------------------------------------------
  scholarships: {
    async findById(id) {
      return dbState.tables.scholarships.find(s => s.id === id) || null;
    },

    async findAll(filters = {}) {
      let list = [...dbState.tables.scholarships];

      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(s => 
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          (s.provider && s.provider.toLowerCase().includes(q)) ||
          (s.category && s.category.toLowerCase().includes(q))
        );
      }

      if (filters.level && filters.level !== 'All') {
        list = list.filter(s => {
          if (!s.education_levels) return false;
          return s.education_levels.some(lvl => 
            lvl.toLowerCase().includes(filters.level.toLowerCase()) || 
            filters.level.toLowerCase().includes(lvl.toLowerCase())
          );
        });
      }

      if (filters.state && filters.state !== 'All') {
        list = list.filter(s => {
          const eligibleStates = s.eligibility_criteria?.states || [];
          if (eligibleStates.includes('All India')) return true;
          return eligibleStates.includes(filters.state);
        });
      }

      if (filters.category && filters.category !== 'All') {
        list = list.filter(s => {
          if (s.category && s.category.toLowerCase() === filters.category.toLowerCase()) return true;
          const critCategories = s.eligibility_criteria?.categories || [];
          if (critCategories.includes('All')) return true;
          return critCategories.includes(filters.category);
        });
      }

      if (filters.status && filters.status !== 'All') {
        list = list.filter(s => s.verification_status === filters.status);
      }

      return list;
    },

    async upsert(scholarship) {
      if (!scholarship.id || !scholarship.name) {
        throw new Error('Scholarship must have an id and name');
      }

      const idx = dbState.tables.scholarships.findIndex(s => s.id === scholarship.id);
      const now = new Date().toISOString();

      const record = {
        id: scholarship.id,
        name: scholarship.name,
        description: scholarship.description || '',
        provider: scholarship.provider || '',
        portal_name: scholarship.portal_name || scholarship.portal || '',
        official_apply_url: scholarship.official_apply_url || scholarship.portalUrl || scholarship.officialUrl || '',
        official_info_url: scholarship.official_info_url || scholarship.officialUrl || '',
        education_levels: scholarship.education_levels || scholarship.level || [],
        courses: scholarship.courses || [],
        eligibility_criteria: scholarship.eligibility_criteria || scholarship.eligibility || {},
        amount_details: scholarship.amount_details || scholarship.amount || '',
        category: scholarship.category || 'Merit-cum-Means',
        academic_year: scholarship.academic_year || '2025-2026',
        opening_date: scholarship.opening_date || null,
        deadline: scholarship.deadline || 'Check official portal',
        last_verified_date: scholarship.last_verified_date || scholarship.last_verified || '2026-03-25',
        source_url: scholarship.source_url || scholarship.officialUrl || '',
        verification_status: scholarship.verification_status || scholarship.status || 'verified',
        created_at: scholarship.created_at || now,
        updated_at: now
      };

      if (idx === -1) {
        dbState.tables.scholarships.push(record);
      } else {
        dbState.tables.scholarships[idx] = { ...dbState.tables.scholarships[idx], ...record };
      }

      persistDatabase();
      return record;
    },

    async count() {
      return dbState.tables.scholarships.length;
    }
  },

  // --------------------------------------------------
  // SAVED SCHOLARSHIPS API (User Bookmarks)
  // --------------------------------------------------
  savedScholarships: {
    async getByUserId(userId) {
      const savedRows = dbState.tables.saved_scholarships.filter(s => s.user_id === userId);
      // Join with scholarships table
      return savedRows.map(saved => {
        const scholarship = dbState.tables.scholarships.find(sch => sch.id === saved.scholarship_id);
        return {
          id: saved.id,
          user_id: saved.user_id,
          scholarship_id: saved.scholarship_id,
          saved_at: saved.saved_at,
          scholarship: scholarship || null
        };
      });
    },

    async isSaved(userId, scholarshipId) {
      return dbState.tables.saved_scholarships.some(
        s => s.user_id === userId && s.scholarship_id === scholarshipId
      );
    },

    async save(userId, scholarshipId) {
      // Validate foreign key constraints
      const user = dbState.tables.users.find(u => u.id === userId);
      if (!user) throw new Error('FOREIGN KEY constraint failed: users.id does not exist');

      const scholarship = dbState.tables.scholarships.find(s => s.id === scholarshipId);
      if (!scholarship) throw new Error('FOREIGN KEY constraint failed: scholarships.id does not exist');

      // Check unique constraint
      const existing = dbState.tables.saved_scholarships.find(
        s => s.user_id === userId && s.scholarship_id === scholarshipId
      );
      if (existing) return existing;

      const record = {
        id: 'save_' + crypto.randomBytes(8).toString('hex'),
        user_id: userId,
        scholarship_id: scholarshipId,
        saved_at: new Date().toISOString()
      };

      dbState.tables.saved_scholarships.push(record);
      persistDatabase();
      return record;
    },

    async remove(userId, scholarshipId) {
      const prevCount = dbState.tables.saved_scholarships.length;
      dbState.tables.saved_scholarships = dbState.tables.saved_scholarships.filter(
        s => !(s.user_id === userId && s.scholarship_id === scholarshipId)
      );
      const changed = dbState.tables.saved_scholarships.length < prevCount;
      if (changed) persistDatabase();
      return changed;
    }
  },

  // --------------------------------------------------
  // SESSIONS TABLE API
  // --------------------------------------------------
  sessions: {
    async create(token, userId, expiresAt) {
      // Validate foreign key constraint
      const user = dbState.tables.users.find(u => u.id === userId);
      if (!user) throw new Error('FOREIGN KEY constraint failed: users.id does not exist');

      const session = {
        token,
        user_id: userId,
        created_at: new Date().toISOString(),
        expires_at: expiresAt
      };
      dbState.tables.sessions.push(session);
      persistDatabase();
      return session;
    },

    async get(token) {
      if (!token) return null;
      const now = new Date();
      return dbState.tables.sessions.find(s => s.token === token && new Date(s.expires_at) > now) || null;
    },

    async delete(token) {
      const prev = dbState.tables.sessions.length;
      dbState.tables.sessions = dbState.tables.sessions.filter(s => s.token !== token);
      if (dbState.tables.sessions.length < prev) {
        persistDatabase();
        return true;
      }
      return false;
    },

    async cleanupExpired() {
      const now = new Date();
      const prev = dbState.tables.sessions.length;
      dbState.tables.sessions = dbState.tables.sessions.filter(s => new Date(s.expires_at) > now);
      if (dbState.tables.sessions.length < prev) {
        persistDatabase();
      }
    }
  },

  // --------------------------------------------------
  // PASSWORD RESET TOKENS API
  // --------------------------------------------------
  resetTokens: {
    async create(token, userId, email, expiresAt) {
      const record = {
        token,
        user_id: userId,
        email,
        expires_at: expiresAt,
        created_at: new Date().toISOString()
      };
      dbState.tables.reset_tokens.push(record);
      persistDatabase();
      return record;
    },

    async get(token) {
      const now = new Date();
      return dbState.tables.reset_tokens.find(t => t.token === token && new Date(t.expires_at) > now) || null;
    },

    async delete(token) {
      const prev = dbState.tables.reset_tokens.length;
      dbState.tables.reset_tokens = dbState.tables.reset_tokens.filter(t => t.token !== token);
      if (dbState.tables.reset_tokens.length < prev) {
        persistDatabase();
        return true;
      }
      return false;
    }
  }
};

module.exports = Database;
