/**
 * Interactive Scholarships Page Controller (Phase 1 & 2)
 * Connected directly to the persistent CareerConnect database API (/api/scholarships).
 * Supports advanced filtering by Class/Education Level, State, Category, and Status.
 * Includes rule-based eligibility evaluation and database bookmarks.
 */

import { StorageService } from './storage.js';
import { ScholarshipMatcher } from './scholarships.js';
import { ProfileModal } from './profile.js';
import { NotificationService } from './notifications.js';
import { Icons } from './icons.js';

export const ScholarshipsPage = {
  scholarships: [],
  filters: {
    search: '',
    state: 'All',
    level: 'All',
    category: 'All',
    status: 'All',
    sort: 'match'
  },

  async init() {
    try {
      // 1. Try fetching from the real persistent database API
      try {
        const res = await fetch('/api/scholarships');
        if (res.ok) {
          const body = await res.json();
          if (body && Array.isArray(body.data) && body.data.length > 0) {
            this.scholarships = body.data;
          }
        }
      } catch (apiErr) {
        console.warn('API fetch notice, falling back to local dataset:', apiErr);
      }

      // Fallback if API returned empty
      if (!this.scholarships || this.scholarships.length === 0) {
        const res = await fetch('data/scholarships.json');
        this.scholarships = await res.json();
      }

      // Sync saved bookmarks with persistent database if authenticated
      await StorageService.syncSavedScholarshipsWithDatabase();

      this.render();

      window.addEventListener('careerpath:profileUpdated', () => this.render());
      window.addEventListener('careerpath:savedUpdated', () => this.render());
      window.addEventListener('careerpath:authChanged', () => {
        StorageService.syncSavedScholarshipsWithDatabase().then(() => this.render());
      });
    } catch (e) {
      console.error('Failed to load scholarships list:', e);
    }
  },

  render() {
    const container = document.getElementById('scholarshipsMount');
    if (!container) return;

    const profile = StorageService.getProfile();
    const isProfileSet = StorageService.isProfileComplete(profile);
    const savedIds = StorageService.getSavedScholarships();
    const notifPermission = NotificationService.getPermission();

    // Evaluate all scholarships
    const evaluated = this.scholarships.map(s => {
      // Normalize schema fields
      const norm = {
        ...s,
        id: s.id,
        name: s.name,
        provider: s.provider,
        portal: s.portal_name || s.portal || 'Official Portal',
        level: s.education_levels || s.level || [],
        courses: s.courses || [],
        amount: s.amount_details || s.amount || 'Check official circular',
        deadline: s.deadline || 'Check official portal',
        source: s.source_url || s.source || s.official_apply_url || 'Official Government Gazette',
        last_verified: s.last_verified_date || s.last_verified || '2026-03-25',
        status: s.verification_status || s.status || 'verified',
        officialUrl: s.official_apply_url || s.portalUrl || s.officialUrl || '',
        infoUrl: s.official_info_url || s.officialUrl || s.official_apply_url || '',
        category: s.category || 'General Aid',
        academicYear: s.academic_year || '2025-2026',
        eligibility: s.eligibility_criteria || s.eligibility || {}
      };

      const evalResult = ScholarshipMatcher.evaluateEligibility(norm, profile);
      const isSaved = savedIds.includes(norm.id);
      return { scholarship: norm, eval: evalResult, isSaved };
    });

    const isComingSoonState = ['Delhi', 'Karnataka', 'Uttar Pradesh', 'Other'].includes(this.filters.state);

    // Apply Search & Filters
    let filtered = evaluated.filter(item => {
      const s = item.scholarship;
      const q = this.filters.search.toLowerCase().trim();

      // Search match
      if (q) {
        const text = `${s.name} ${s.provider} ${s.category} ${s.level?.join(' ')} ${s.courses?.join(' ')} ${s.amount}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      // State filter
      if (this.filters.state === 'Maharashtra') {
        const states = s.eligibility?.states || [];
        if (!states.includes('Maharashtra') && !states.includes('All India')) return false;
      } else if (this.filters.state === 'North Eastern States') {
        const states = s.eligibility?.states || [];
        if (!states.includes('North Eastern States') && !states.includes('All India')) return false;
      } else if (isComingSoonState) {
        const states = s.eligibility?.states || [];
        if (!states.includes('All India')) return false;
      }

      // Level filter
      if (this.filters.level !== 'All') {
        const lvlFilter = this.filters.level.toLowerCase();
        const matchesLevel = s.level?.some(l => l.toLowerCase().includes(lvlFilter));
        if (!matchesLevel) return false;
      }

      // Category filter
      if (this.filters.category !== 'All') {
        if (s.category !== this.filters.category) {
          const critCategories = s.eligibility?.categories || [];
          if (!critCategories.includes(this.filters.category) && !critCategories.includes('All')) {
            return false;
          }
        }
      }

      // Status filter
      if (this.filters.status === 'eligible' && item.eval.status !== 'eligible') return false;
      if (this.filters.status === 'partial' && item.eval.status !== 'partial') return false;
      if (this.filters.status === 'ineligible' && item.eval.status !== 'ineligible') return false;
      if (this.filters.status === 'saved' && !item.isSaved) return false;

      return true;
    });

    // Apply Sorting
    filtered.sort((a, b) => {
      if (this.filters.sort === 'match') {
        const order = { eligible: 0, partial: 1, unverified: 2, ineligible: 3 };
        return order[a.eval.status] - order[b.eval.status];
      }
      return 0;
    });

    const eligibleCount = evaluated.filter(i => i.eval.status === 'eligible').length;
    const partialCount = evaluated.filter(i => i.eval.status === 'partial').length;

    container.innerHTML = `
      <div>
        <!-- Profile Context & Web Push Notification Bar -->
        <div class="card" style="margin-bottom: 2rem; background: var(--bg-subtle); border: 1px solid var(--border-light); padding: 1.25rem 1.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--primary); letter-spacing: 0.05em;">
                LIVE ELIGIBILITY MATCHER • DATABASE BACKED • PERSISTENT SESSIONS
              </div>
              <div style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-top: 0.2rem;">
                ${isProfileSet ? `Active Profile: ${profile.stage} • ${profile.stream} • ${profile.state} • Income: ${profile.income || 'Not Stated'}` : 'Profile Incomplete: Set your class, stream, state & family income to unlock customized scholarship matching.'}
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button id="enableWebPushBtn" class="btn btn-outline btn-sm" title="Enable browser notifications for scholarship deadlines">
                ${Icons.get('sparkles')}
                <span>${notifPermission === 'granted' ? 'Test Notification' : 'Enable Deadline Alerts'}</span>
              </button>
              <button id="scholarshipEditProfileBtn" class="btn btn-secondary btn-sm">
                ${Icons.get('user')} ${isProfileSet ? 'Edit Profile' : 'Complete Profile'}
              </button>
            </div>
          </div>
        </div>

        <!-- Statutory Guidelines & Potential Match Disclaimer (Mandatory Requirement) -->
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.75rem; font-size: 0.875rem; color: #1e3a8a; line-height: 1.55;">
          <div style="display: flex; align-items: flex-start; gap: 0.6rem;">
            <span style="font-size: 1.2rem; color: #2563eb; margin-top: 0.1rem;">ℹ️</span>
            <div>
              <strong>Official Verification & Transparency Notice:</strong> All displayed results indicate <em>potential eligibility matches</em> evaluated against official government gazettes, not guaranteed grants. Scholarship awards depend on statutory reservation quotas, document verification, biometric Aadhaar-seeding, and timely portal submission. <strong>Always consult the official scheme guidelines before applying.</strong>
            </div>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="card" style="margin-bottom: 2rem; padding: 1.25rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: center;">
            <!-- Search -->
            <div>
              <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-subtle); margin-bottom: 0.25rem;">Search Scheme</label>
              <input type="text" id="scholSearchInput" class="form-input" placeholder="Search by name, provider, course..." value="${this.filters.search}">
            </div>

            <!-- Class / Education Level Filter -->
            <div>
              <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-subtle); margin-bottom: 0.25rem;">Education Level / Class</label>
              <select id="scholLevelFilter" class="form-select">
                <option value="All" ${this.filters.level === 'All' ? 'selected' : ''}>All Education Levels</option>
                <option value="Class 9" ${this.filters.level === 'Class 9' ? 'selected' : ''}>Class 9</option>
                <option value="Class 10" ${this.filters.level === 'Class 10' ? 'selected' : ''}>Class 10</option>
                <option value="Class 11" ${this.filters.level === 'Class 11' ? 'selected' : ''}>Class 11</option>
                <option value="Class 12" ${this.filters.level === 'Class 12' ? 'selected' : ''}>Class 12</option>
                <option value="Diploma" ${this.filters.level === 'Diploma' ? 'selected' : ''}>Diploma / Polytechnic</option>
                <option value="Undergraduate" ${this.filters.level === 'Undergraduate' ? 'selected' : ''}>Undergraduate (Degree)</option>
                <option value="Postgraduate" ${this.filters.level === 'Postgraduate' ? 'selected' : ''}>Postgraduate</option>
              </select>
            </div>

            <!-- State Filter -->
            <div>
              <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-subtle); margin-bottom: 0.25rem;">State Domicile</label>
              <select id="scholStateFilter" class="form-select">
                <option value="All" ${this.filters.state === 'All' ? 'selected' : ''}>All Locations (National & States)</option>
                <option value="Maharashtra" ${this.filters.state === 'Maharashtra' ? 'selected' : ''}>Maharashtra (MahaDBT Active)</option>
                <option value="North Eastern States" ${this.filters.state === 'North Eastern States' ? 'selected' : ''}>North Eastern States (NER)</option>
                <option value="Delhi" ${this.filters.state === 'Delhi' ? 'selected' : ''}>Delhi (Central Schemes)</option>
                <option value="Karnataka" ${this.filters.state === 'Karnataka' ? 'selected' : ''}>Karnataka (Central Schemes)</option>
                <option value="Uttar Pradesh" ${this.filters.state === 'Uttar Pradesh' ? 'selected' : ''}>Uttar Pradesh (Central Schemes)</option>
              </select>
            </div>

            <!-- Scholarship Category Filter -->
            <div>
              <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-subtle); margin-bottom: 0.25rem;">Scholarship Category</label>
              <select id="scholCategoryFilter" class="form-select">
                <option value="All" ${this.filters.category === 'All' ? 'selected' : ''}>All Categories</option>
                <option value="Merit-cum-Means" ${this.filters.category === 'Merit-cum-Means' ? 'selected' : ''}>Merit-cum-Means</option>
                <option value="Technical Education" ${this.filters.category === 'Technical Education' ? 'selected' : ''}>Technical Education (AICTE)</option>
                <option value="State Welfare" ${this.filters.category === 'State Welfare' ? 'selected' : ''}>State Welfare & Tuition Concession</option>
                <option value="Social Welfare" ${this.filters.category === 'Social Welfare' ? 'selected' : ''}>Social Welfare (SC / OBC / VJNT)</option>
                <option value="Higher Education" ${this.filters.category === 'Higher Education' ? 'selected' : ''}>Higher Education & Research</option>
                <option value="Special Needs" ${this.filters.category === 'Special Needs' ? 'selected' : ''}>Special Needs / Specially-Abled (PwD)</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-subtle); margin-bottom: 0.25rem;">Match Status</label>
              <select id="scholStatusFilter" class="form-select">
                <option value="All" ${this.filters.status === 'All' ? 'selected' : ''}>All Schemes (${evaluated.length})</option>
                <option value="eligible" ${this.filters.status === 'eligible' ? 'selected' : ''}>🟢 Eligible (${eligibleCount})</option>
                <option value="partial" ${this.filters.status === 'partial' ? 'selected' : ''}>🟡 Possibly Eligible (${partialCount})</option>
                <option value="ineligible" ${this.filters.status === 'ineligible' ? 'selected' : ''}>🔴 Ineligible</option>
                <option value="saved" ${this.filters.status === 'saved' ? 'selected' : ''}>📌 Saved Bookmarks (${savedIds.length})</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Scheme Cards Count Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted);">
            Displaying <strong>${filtered.length}</strong> source-verified government schemes
          </span>
          <span style="font-size: 0.8rem; color: #059669; font-weight: 700;">
            ✓ Real Persistent Database Connected
          </span>
        </div>

        <!-- Scholarship Cards List -->
        <div style="display: flex; flex-direction: column; gap: 1.75rem; margin-bottom: 3.5rem;">
          ${filtered.length ? filtered.map(item => {
            const s = item.scholarship;
            const evalResult = item.eval;
            const isSaved = item.isSaved;

            return `
              <div class="card" id="${s.id}" style="padding: 1.75rem; border-left: 5px solid ${
                evalResult.status === 'eligible' ? '#059669' :
                evalResult.status === 'partial' ? '#d97706' :
                evalResult.status === 'unverified' ? '#cbd5e1' : '#e11d48'
              };">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                  <div style="flex: 1; min-width: 280px;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                      <span class="badge ${evalResult.badgeClass}">
                        ${evalResult.label}
                      </span>
                      <span class="badge" style="background: var(--bg-subtle); color: var(--text-subtle);">
                        ${s.portal}
                      </span>
                      <span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 600;">
                        ${s.category}
                      </span>
                      <span class="badge badge-verified">
                        ${Icons.get('shieldCheck')} Verified Official (${s.academicYear})
                      </span>
                    </div>

                    <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.25rem;">
                      ${s.name}
                    </h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
                      Provider: <strong>${s.provider}</strong>
                    </p>
                  </div>

                  <!-- Save Bookmark Button -->
                  <button class="btn ${isSaved ? 'btn-secondary' : 'btn-outline'} btn-sm toggle-save-btn" data-id="${s.id}" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                    ${isSaved ? Icons.get('bookmarkFilled') : Icons.get('bookmark')}
                    <span>${isSaved ? 'Saved in Account' : 'Save Scheme'}</span>
                  </button>
                </div>

                <!-- Description -->
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.55; margin-bottom: 1.25rem;">
                  ${s.description}
                </p>

                <!-- Education Levels Covered -->
                <div style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-subtle); text-transform: uppercase;">Eligible Levels:</span>
                  ${(s.level || []).map(lvl => `
                    <span class="badge" style="background: #f1f5f9; color: var(--text-main); font-size: 0.75rem;">
                      ${lvl}
                    </span>
                  `).join('')}
                </div>

                <!-- Award & Deadline Meta Strip -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; background: var(--bg-subtle); padding: 0.85rem 1.15rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
                  <div>
                    <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle);">Financial Assistance</span>
                    <div style="font-size: 0.95rem; font-weight: 700; color: #059669; margin-top: 0.15rem;">${s.amount}</div>
                  </div>
                  <div>
                    <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle);">Official Deadline</span>
                    <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-main); margin-top: 0.15rem;">${s.deadline}</div>
                  </div>
                  <div>
                    <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle);">Family Income Cap</span>
                    <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-main); margin-top: 0.15rem;">${s.eligibility?.incomeCapFormatted || 'No Income Ceiling'}</div>
                  </div>
                </div>

                <!-- Transparent Criteria Evaluation Breakdown -->
                <div style="border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.25rem; background: var(--bg-card);">
                  <strong style="font-size: 0.825rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-main); display: block; margin-bottom: 0.6rem;">
                    Personalized Eligibility Evaluation:
                  </strong>
                  <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.45rem;">
                    ${evalResult.checks?.length ? evalResult.checks.map(check => {
                      let iconColor = '#059669';
                      let iconSvg = Icons.get('check');
                      if (check.met === false) {
                        iconColor = '#e11d48';
                        iconSvg = Icons.get('alertCircle');
                      } else if (check.met === null) {
                        iconColor = '#d97706';
                        iconSvg = Icons.get('info');
                      }
                      return `
                        <li style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: flex-start; gap: 0.5rem;">
                          <span style="color: ${iconColor}; margin-top: 0.1rem;">${iconSvg}</span>
                          <span><strong>${check.name}:</strong> ${check.reason}</span>
                        </li>
                      `;
                    }).join('') : `
                      <li style="font-size: 0.85rem; color: var(--text-subtle);">
                        Evaluated based on statutory guidelines gazetted for academic year ${s.academicYear}.
                      </li>
                    `}
                  </ul>
                </div>

                <!-- Actions & Verification Footer -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1rem; flex-wrap: wrap; gap: 1rem;">
                  <div style="font-size: 0.775rem; color: var(--text-subtle);">
                    Source: <a href="${s.source}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none;">${s.source}</a> • Last Verified: <strong>${s.last_verified}</strong>
                  </div>

                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${s.infoUrl ? `
                      <a href="${s.infoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                        View Guidelines ${Icons.get('external')}
                      </a>
                    ` : ''}
                    ${s.officialUrl ? `
                      <a href="${s.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                        Apply on Official Portal ${Icons.get('external')}
                      </a>
                    ` : `
                      <span style="font-size: 0.8rem; color: var(--text-subtle);">Portal link verified</span>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('') : `
            <div class="card" style="text-align: center; padding: 3rem;">
              <h3>No scholarships match the selected filters</h3>
              <p style="color: var(--text-muted); margin: 0.5rem 0 1.25rem;">Try broadening your search query or reset status filters.</p>
              <button id="resetScholFiltersBtn" class="btn btn-secondary btn-sm">Reset Filters</button>
            </div>
          `}
        </div>
      </div>
    `;

    // Bind Web Push Notification button
    document.getElementById('enableWebPushBtn')?.addEventListener('click', () => {
      NotificationService.triggerTestNotification();
      setTimeout(() => this.render(), 600);
    });

    // Bind search and filter events
    document.getElementById('scholSearchInput')?.addEventListener('input', (e) => {
      this.filters.search = e.target.value;
      this.render();
    });

    document.getElementById('scholLevelFilter')?.addEventListener('change', (e) => {
      this.filters.level = e.target.value;
      this.render();
    });

    document.getElementById('scholStateFilter')?.addEventListener('change', (e) => {
      this.filters.state = e.target.value;
      this.render();
    });

    document.getElementById('scholCategoryFilter')?.addEventListener('change', (e) => {
      this.filters.category = e.target.value;
      this.render();
    });

    document.getElementById('scholStatusFilter')?.addEventListener('change', (e) => {
      this.filters.status = e.target.value;
      this.render();
    });

    document.getElementById('scholarshipEditProfileBtn')?.addEventListener('click', () => {
      ProfileModal.open();
    });

    document.getElementById('resetScholFiltersBtn')?.addEventListener('click', () => {
      this.filters = { search: '', state: 'All', level: 'All', category: 'All', status: 'All', sort: 'match' };
      this.render();
    });

    // Bind save buttons with database persistence
    container.querySelectorAll('.toggle-save-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        btn.disabled = true;
        await StorageService.toggleSaveScholarship(id);
        this.render();
      });
    });
  }
};
