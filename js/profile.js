/**
 * Student Profile Manager (Phase 1)
 * Collects strictly necessary student context with clear justification per field.
 * Saved in browser localStorage; ready to sync with Supabase in Phase 2.
 * State selection: Maharashtra active, other states clearly marked "Coming Soon".
 */

import { StorageService } from './storage.js';
import { Icons } from './icons.js';

export const ProfileModal = {
  init() {
    this.createModalMarkup();
    this.bindEvents();
    this.updateHeaderPill();
  },

  createModalMarkup() {
    if (document.getElementById('profileModalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'profileModalOverlay';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'profileModalTitle');

    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h3 id="profileModalTitle" class="modal-title">Student Profile</h3>
              <span class="badge" style="background: #fef3c7; color: #92400e; font-size: 0.7rem; font-weight: 700;">Local Demo</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-subtle); margin-top: 0.2rem;">
              Personalizes career fit, roadmaps & scholarship eligibility
            </p>
          </div>
          <button id="closeProfileModal" class="modal-close" aria-label="Close Profile Modal">
            ${Icons.get('close')}
          </button>
        </div>

        <div class="modal-body">
          <form id="studentProfileForm">
            <!-- Privacy notice -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.825rem; color: #166534; margin-bottom: 1.25rem; display: flex; gap: 0.6rem; align-items: flex-start;">
              ${Icons.get('shieldCheck')}
              <div>
                <strong>Privacy-First Guarantee:</strong> Your profile is saved solely in your browser. We never ask for your phone number or sell your data.
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <!-- Stage -->
              <div class="form-group">
                <label class="form-label" for="profileStage">Current Stage *</label>
                <select id="profileStage" class="form-select" required>
                  <option value="">Select your stage</option>
                  <option value="Class 10">Class 10 (Secondary)</option>
                  <option value="Class 12">Class 12 (Higher Secondary)</option>
                  <option value="Diploma">Polytechnic / Diploma</option>
                  <option value="Undergraduate">Undergraduate (Degree)</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
                <div class="form-hint">Shows paths starting from where you are right now.</div>
              </div>

              <!-- Stream -->
              <div class="form-group">
                <label class="form-label" for="profileStream">Academic Stream *</label>
                <select id="profileStream" class="form-select" required>
                  <option value="">Select your stream</option>
                  <option value="Science - PCM">Science (Physics, Chem, Maths)</option>
                  <option value="Science - PCB">Science (Physics, Chem, Biology)</option>
                  <option value="Science - PCMB">Science (PCMB combined)</option>
                  <option value="Commerce">Commerce / Economics</option>
                  <option value="Arts / Humanities">Arts & Humanities</option>
                  <option value="Vocational / Tech">Vocational / Computer Tech</option>
                  <option value="Not Decided Yet">Not Decided (after 10th)</option>
                </select>
                <div class="form-hint">Filters subject eligibility for exams and courses.</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <!-- Marks Range -->
              <div class="form-group">
                <label class="form-label" for="profileMarks">Marks / CGPA Range *</label>
                <select id="profileMarks" class="form-select" required>
                  <option value="">Select range</option>
                  <option value="Above 90%">Top Tier (> 90% or top 10%)</option>
                  <option value="75% - 90%">Strong (75% - 90%)</option>
                  <option value="60% - 75%">First Class (60% - 75%)</option>
                  <option value="Below 60%">Passing (< 60%)</option>
                </select>
                <div class="form-hint">Used to evaluate merit cutoffs and INSPIRE/CSSS quotas.</div>
              </div>

              <!-- State Domicile (Maharashtra Active, others Coming Soon) -->
              <div class="form-group">
                <label class="form-label" for="profileState">State of Domicile *</label>
                <select id="profileState" class="form-select" required>
                  <option value="Maharashtra">Maharashtra (State Schemes Active)</option>
                  <option value="Delhi">Delhi (State Schemes Coming Soon)</option>
                  <option value="Karnataka">Karnataka (State Schemes Coming Soon)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (State Schemes Coming Soon)</option>
                  <option value="All India / Other">Other State (Central NSP/AICTE Active)</option>
                </select>
                <div class="form-hint">State schemes currently live for Maharashtra; central schemes open to all.</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <!-- Category / Reservation -->
              <div class="form-group">
                <label class="form-label" for="profileCategory">Category (Optional)</label>
                <select id="profileCategory" class="form-select">
                  <option value="General">General / Open</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="Minority">Religious Minority Community</option>
                  <option value="PwD">Specially Abled / PwD (>= 40%)</option>
                </select>
                <div class="form-hint">Matches category-specific affirmative action schemes.</div>
              </div>

              <!-- Annual Family Income -->
              <div class="form-group">
                <label class="form-label" for="profileIncome">Annual Family Income (Optional)</label>
                <select id="profileIncome" class="form-select">
                  <option value="">Prefer not to state</option>
                  <option value="< 1.5 Lakhs">Below ₹1.5 Lakhs / year</option>
                  <option value="1.5L - 2.5L">₹1.5 Lakhs - ₹2.5 Lakhs / year</option>
                  <option value="2.5L - 8L">₹2.5 Lakhs - ₹8 Lakhs / year</option>
                  <option value="> 8 Lakhs">Above ₹8 Lakhs / year</option>
                </select>
                <div class="form-hint">Crucial for means-tested fee waivers (e.g. EBC / Pragati).</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <!-- Gender -->
              <div class="form-group">
                <label class="form-label" for="profileGender">Gender (Optional)</label>
                <select id="profileGender" class="form-select">
                  <option value="All">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                <div class="form-hint">Unlocks female-exclusive schemes (e.g. AICTE Pragati).</div>
              </div>

              <!-- Budget Expectation -->
              <div class="form-group">
                <label class="form-label" for="profileBudget">Higher Education Budget</label>
                <select id="profileBudget" class="form-select">
                  <option value="Low/Free">Low / Government Subsidized (< ₹1L total)</option>
                  <option value="Moderate">Moderate (₹1L - ₹5L total)</option>
                  <option value="High">Flexible / Private Institution (₹5L+)</option>
                </select>
                <div class="form-hint">Tailors college and course fee suggestions.</div>
              </div>
            </div>

            <!-- Profile Completion Progress -->
            <div style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.35rem;">
                <span>Profile Readiness</span>
                <span id="profileProgressText">0% Complete</span>
              </div>
              <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: var(--radius-full); overflow: hidden;">
                <div id="profileProgressBar" style="height: 100%; width: 0%; background: var(--primary); transition: width var(--transition-normal);"></div>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" id="cancelProfileBtn" class="btn btn-secondary btn-sm">Close</button>
          <button type="button" id="saveProfileBtn" class="btn btn-primary btn-sm">Save Profile</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
  },

  bindEvents() {
    const overlay = document.getElementById('profileModalOverlay');
    const closeBtn = document.getElementById('closeProfileModal');
    const cancelBtn = document.getElementById('cancelProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const form = document.getElementById('studentProfileForm');

    const closeModal = () => this.close();
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    form?.addEventListener('change', () => this.updateProgressBar());

    saveBtn?.addEventListener('click', () => {
      const stage = document.getElementById('profileStage').value;
      const stream = document.getElementById('profileStream').value;
      const marks = document.getElementById('profileMarks').value;
      const state = document.getElementById('profileState').value;

      if (!stage || !stream || !marks || !state) {
        alert('Please select your Current Stage, Stream, Marks Range, and State.');
        return;
      }

      const updated = {
        stage,
        stream,
        marks,
        state,
        category: document.getElementById('profileCategory').value,
        income: document.getElementById('profileIncome').value,
        gender: document.getElementById('profileGender').value,
        budget: document.getElementById('profileBudget').value
      };

      StorageService.saveProfile(updated);
      this.close();
      this.updateHeaderPill();
    });

    window.addEventListener('careerpath:profileUpdated', () => {
      this.updateHeaderPill();
    });
  },

  open() {
    this.createModalMarkup();
    const profile = StorageService.getProfile();
    document.getElementById('profileStage').value = profile.stage || '';
    document.getElementById('profileStream').value = profile.stream || '';
    document.getElementById('profileMarks').value = profile.marks || '';
    document.getElementById('profileState').value = profile.state || 'Maharashtra';
    document.getElementById('profileCategory').value = profile.category || 'General';
    document.getElementById('profileIncome').value = profile.income || '';
    document.getElementById('profileGender').value = profile.gender || 'All';
    document.getElementById('profileBudget').value = profile.budget || 'Moderate';

    this.updateProgressBar();
    const overlay = document.getElementById('profileModalOverlay');
    overlay.classList.add('open');
  },

  close() {
    const overlay = document.getElementById('profileModalOverlay');
    if (overlay) overlay.classList.remove('open');
  },

  updateProgressBar() {
    const stage = document.getElementById('profileStage')?.value;
    const stream = document.getElementById('profileStream')?.value;
    const marks = document.getElementById('profileMarks')?.value;
    const state = document.getElementById('profileState')?.value;
    const category = document.getElementById('profileCategory')?.value;
    const income = document.getElementById('profileIncome')?.value;

    const fields = [stage, stream, marks, state, category, income];
    const filled = fields.filter(Boolean);
    const pct = Math.round((filled.length / fields.length) * 100);

    const bar = document.getElementById('profileProgressBar');
    const txt = document.getElementById('profileProgressText');
    if (bar && txt) {
      bar.style.width = `${pct}%`;
      txt.textContent = `${pct}% Complete`;
      bar.style.backgroundColor = pct >= 80 ? '#10b981' : 'var(--primary)';
    }
  },

  updateHeaderPill() {
    const profile = StorageService.getProfile();
    const pill = document.getElementById('headerProfilePill');
    if (!pill) return;

    const isComplete = StorageService.isProfileComplete(profile);
    if (isComplete) {
      pill.innerHTML = `
        <span class="profile-indicator complete"></span>
        <span>${profile.stage} • ${profile.stream.split(' ')[0]}</span>
      `;
    } else {
      pill.innerHTML = `
        <span class="profile-indicator"></span>
        <span>Complete Profile</span>
      `;
    }
  }
};
