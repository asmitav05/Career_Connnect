/**
 * CareerPath Local Storage Engine
 * Manages student profile, quiz results, saved bookmarks, and roadmap milestones.
 * Privacy-friendly: All personal data stays in the student's browser.
 */

const STORAGE_KEYS = {
  PROFILE: 'careerpath_student_profile',
  SAVED_CAREERS: 'careerpath_saved_careers',
  SAVED_SCHOLARSHIPS: 'careerpath_saved_scholarships',
  ROADMAP_MILESTONES: 'careerpath_roadmap_milestones',
  QUIZ_RESULTS: 'careerpath_quiz_results'
};

// Default empty profile structure
const DEFAULT_PROFILE = {
  stage: '', // Class 10, Class 12, Diploma, Undergraduate, Postgraduate
  stream: '', // Science - PCM, Science - PCB, Commerce, Arts/Humanities, Vocational
  marks: '', // <60%, 60-75%, 75-90%, >90%
  state: 'Maharashtra', // Maharashtra, Delhi, Karnataka, Uttar Pradesh, etc.
  category: 'General', // General, OBC, SC, ST, EWS, Minority, PwD
  income: '', // < ₹1.5L, ₹1.5L - ₹2.5L, ₹2.5L - ₹8L, > ₹8L
  gender: 'All', // Female, Male, Other
  interests: [],
  budget: 'Moderate', // Low/Free, Moderate, High
  updatedAt: null
};

export const StorageService = {
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : { ...DEFAULT_PROFILE };
    } catch (e) {
      console.error('Failed to read profile from localStorage:', e);
      return { ...DEFAULT_PROFILE };
    }
  },

  saveProfile(profile) {
    try {
      const updated = { ...profile, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('careerpath:profileUpdated', { detail: updated }));
      return updated;
    } catch (e) {
      console.error('Failed to save profile:', e);
      return profile;
    }
  },

  isProfileComplete(profile) {
    // Stage, Stream, Marks and State are the core required fields
    return Boolean(profile.stage && profile.stream && profile.marks && profile.state);
  },

  getProfileCompletionPercentage(profile) {
    const fields = ['stage', 'stream', 'marks', 'state', 'category', 'income', 'budget'];
    const filled = fields.filter(f => Boolean(profile[f] && profile[f].trim && profile[f].trim() !== ''));
    return Math.round((filled.length / fields.length) * 100);
  },

  // Saved Careers Bookmarks
  getSavedCareers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_CAREERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleSaveCareer(careerId) {
    const list = this.getSavedCareers();
    const index = list.indexOf(careerId);
    let updated;
    if (index > -1) {
      updated = list.filter(id => id !== careerId);
    } else {
      updated = [...list, careerId];
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_CAREERS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('careerpath:savedUpdated', { detail: { type: 'careers', list: updated } }));
    return updated.includes(careerId);
  },

  isCareerSaved(careerId) {
    return this.getSavedCareers().includes(careerId);
  },

  // Saved Scholarships Bookmarks
  getSavedScholarships() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async toggleSaveScholarship(scholarshipId) {
    const list = this.getSavedScholarships();
    const index = list.indexOf(scholarshipId);
    let updated;
    const isAdding = (index === -1);
    if (!isAdding) {
      updated = list.filter(id => id !== scholarshipId);
    } else {
      updated = [...list, scholarshipId];
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('careerpath:savedUpdated', { detail: { type: 'scholarships', list: updated } }));

    // Persist to database if authenticated
    try {
      const token = localStorage.getItem('careerconnect_auth_token') || sessionStorage.getItem('careerconnect_auth_token');
      if (token) {
        if (isAdding) {
          await fetch('/api/user/saved-scholarships', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ scholarshipId })
          });
        } else {
          await fetch(`/api/user/saved-scholarships/${encodeURIComponent(scholarshipId)}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
      }
    } catch (err) {
      console.warn('Could not sync bookmark to database:', err);
    }

    return updated.includes(scholarshipId);
  },

  async syncSavedScholarshipsWithDatabase() {
    try {
      const token = localStorage.getItem('careerconnect_auth_token') || sessionStorage.getItem('careerconnect_auth_token');
      if (!token) return;
      const res = await fetch('/api/user/saved-scholarships', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const body = await res.json();
        if (body.savedScholarships && Array.isArray(body.savedScholarships)) {
          const dbIds = body.savedScholarships.map(s => s.scholarship_id);
          const current = this.getSavedScholarships();
          const combined = Array.from(new Set([...current, ...dbIds]));
          localStorage.setItem(STORAGE_KEYS.SAVED_SCHOLARSHIPS, JSON.stringify(combined));
          window.dispatchEvent(new CustomEvent('careerpath:savedUpdated', { detail: { type: 'scholarships', list: combined } }));
        }
      }
    } catch (e) {
      console.warn('Failed to sync saved scholarships with database:', e);
    }
  },

  isScholarshipSaved(scholarshipId) {
    return this.getSavedScholarships().includes(scholarshipId);
  },

  // Quiz Results
  getQuizResults() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveQuizResults(results) {
    try {
      const payload = { ...results, completedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent('careerpath:quizCompleted', { detail: payload }));
      return payload;
    } catch (e) {
      console.error('Failed to save quiz results:', e);
      return null;
    }
  },

  // Roadmap Milestones Tracker
  getMilestones(careerId) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROADMAP_MILESTONES);
      const all = data ? JSON.parse(data) : {};
      return all[careerId] || {};
    } catch {
      return {};
    }
  },

  setMilestoneStatus(careerId, milestoneIndex, status) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROADMAP_MILESTONES);
      const all = data ? JSON.parse(data) : {};
      if (!all[careerId]) all[careerId] = {};
      all[careerId][milestoneIndex] = status; // 'not-started', 'in-progress', 'completed'
      localStorage.setItem(STORAGE_KEYS.ROADMAP_MILESTONES, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('careerpath:milestonesUpdated', { detail: { careerId, milestones: all[careerId] } }));
      return all[careerId];
    } catch (e) {
      console.error('Failed to save milestone:', e);
      return {};
    }
  }
};
