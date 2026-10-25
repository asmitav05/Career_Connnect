-- CareerConnect Production Database Schema (PostgreSQL & Supabase Compatible)
-- Supports Row Level Security (RLS), Foreign Keys, Unique Indexes, and Cascading Deletes

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    salt TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'student',
    auth_provider TEXT DEFAULT 'local', -- 'local' | 'google'
    google_sub TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_class TEXT, -- '10', '11', '12', 'Diploma', 'Undergraduate', 'Postgraduate'
    preferred_careers JSONB DEFAULT '[]'::jsonb,
    stream TEXT, -- 'Science - PCM', 'Science - PCB', 'Commerce', 'Arts/Humanities', 'Vocational'
    state TEXT DEFAULT 'Maharashtra',
    category TEXT DEFAULT 'General', -- 'General', 'OBC', 'SC', 'ST', 'EWS', 'Minority', 'PwD'
    gender TEXT DEFAULT 'All', -- 'Female', 'Male', 'Other', 'All'
    family_income TEXT, -- '< ₹1.5L', '₹1.5L - ₹2.5L', '₹2.5L - ₹8L', '> ₹8L'
    academic_score TEXT, -- '<60%', '60-75%', '75-90%', '>90%'
    scholarship_preferences JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying profiles by class and state
CREATE INDEX IF NOT EXISTS idx_profiles_state ON user_profiles(state);
CREATE INDEX IF NOT EXISTS idx_profiles_class ON user_profiles(current_class);

-- 3. SCHOLARSHIPS TABLE
CREATE TABLE IF NOT EXISTS scholarships (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    provider TEXT NOT NULL,
    portal_name TEXT,
    official_apply_url TEXT NOT NULL,
    official_info_url TEXT NOT NULL,
    education_levels JSONB NOT NULL DEFAULT '[]'::jsonb, -- ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Diploma', 'Undergraduate', 'Postgraduate']
    courses JSONB NOT NULL DEFAULT '[]'::jsonb,
    eligibility_criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    amount_details TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Merit-cum-Means', 'Technical Education', 'State Welfare', 'Higher Education', 'Special Needs'
    academic_year TEXT NOT NULL DEFAULT '2025-2026',
    opening_date TEXT,
    deadline TEXT,
    last_verified_date DATE NOT NULL,
    source_url TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'verified', -- 'verified' | 'unverified' | 'announced'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for scholarship filtering
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON scholarships(category);
CREATE INDEX IF NOT EXISTS idx_scholarships_verification ON scholarships(verification_status);

-- 4. SAVED SCHOLARSHIPS TABLE (Bookmarks)
CREATE TABLE IF NOT EXISTS saved_scholarships (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scholarship_id TEXT NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_scholarship UNIQUE (user_id, scholarship_id)
);

-- Indexes for fast retrieval by user
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_scholarships(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_scholarship ON saved_scholarships(scholarship_id);

-- 5. SESSIONS TABLE (Persistent Authentication Sessions)
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- 6. PASSWORD RESET TOKENS TABLE
CREATE TABLE IF NOT EXISTS reset_tokens (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Public scholarship read access: anyone can view scholarships
CREATE POLICY "Public scholarships read access" ON scholarships
    FOR SELECT USING (true);

-- Users can only read and update their own user record
CREATE POLICY "Users can access own record" ON users
    FOR ALL USING (auth.uid()::text = id);

-- Users can only read and modify their own profile
CREATE POLICY "Users manage own profile" ON user_profiles
    FOR ALL USING (auth.uid()::text = user_id);

-- Users can only view and manage their own saved scholarships
CREATE POLICY "Users manage own saved scholarships" ON saved_scholarships
    FOR ALL USING (auth.uid()::text = user_id);
