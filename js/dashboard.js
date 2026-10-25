/**
 * Student Dashboard Engine (Phase 1)
 * Aggregates profile summary, demo session, quiz recommendations, roadmap milestones,
 * matching scholarships, browser push notifications, and weekly action list.
 */

import { StorageService } from './storage.js';
import { ScholarshipMatcher } from './scholarships.js';
import { ProfileModal } from './profile.js';
import { NotificationService } from './notifications.js';
import { Icons } from './icons.js';
import { AuthService } from './auth.js';

export const DashboardEngine = {
  careers: [],
  scholarships: [],

  async init() {
    try {
      let scholData = [];
      try {
        const scholRes = await fetch('/api/scholarships');
        if (scholRes.ok) {
          const body = await scholRes.json();
          if (body && Array.isArray(body.data)) scholData = body.data;
        }
      } catch (e) {}

      if (!scholData || scholData.length === 0) {
        const scholRes = await fetch('data/scholarships.json');
        scholData = await scholRes.json();
      }

      const careersRes = await fetch('data/careers.json');
      this.careers = await careersRes.json();
      this.scholarships = scholData;

      // Sync saved bookmarks with persistent database if user is logged in
      await StorageService.syncSavedScholarshipsWithDatabase();

      this.render();

      window.addEventListener('careerpath:profileUpdated', () => this.render());
      window.addEventListener('careerpath:savedUpdated', () => this.render());
      window.addEventListener('careerpath:milestonesUpdated', () => this.render());
      window.addEventListener('careerpath:demoSessionUpdated', () => this.render());
      window.addEventListener('careerpath:authChanged', () => {
        StorageService.syncSavedScholarshipsWithDatabase().then(() => this.render());
      });
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  },

  render() {
    const container = document.getElementById('dashboardMount');
    if (!container) return;

    const profile = StorageService.getProfile();
    const quizResults = StorageService.getQuizResults();
    const savedCareerIds = StorageService.getSavedCareers();
    const savedScholarshipIds = StorageService.getSavedScholarships();

    let demoSession = null;
    try {
      demoSession = JSON.parse(localStorage.getItem('careerpath_demo_session') || 'null');
    } catch (e) {}

    // Determine active career for roadmap
    let activeCareerId = savedCareerIds[0] || quizResults?.recommendations?.[0]?.id || 'software-developer';
    const activeCareer = this.careers.find(c => c.id === activeCareerId) || this.careers[0];

    // Evaluate milestones
    const milestonesState = StorageService.getMilestones(activeCareer.id);
    const completedMilestones = Object.values(milestonesState).filter(s => s === 'completed').length;
    const roadmapPct = Math.round((completedMilestones / 6) * 100);

    // Evaluate scholarships eligibility
    const evaluatedScholarships = this.scholarships.map(s => ({
      scholarship: s,
      eval: ScholarshipMatcher.evaluateEligibility(s, profile),
      isSaved: savedScholarshipIds.includes(s.id)
    }));

    const eligibleList = evaluatedScholarships.filter(s => s.eval.status === 'eligible');
    const partialList = evaluatedScholarships.filter(s => s.eval.status === 'partial');

    // Build Weekly Action Items
    const weeklyActions = [];

    if (!StorageService.isProfileComplete(profile)) {
      weeklyActions.push({
        title: 'Complete Your Student Profile',
        subtitle: 'Fill in your stream, marks, and state to unlock accurate scholarship matching.',
        cta: 'Update Profile',
        action: () => ProfileModal.open()
      });
    }

    if (!quizResults) {
      weeklyActions.push({
        title: 'Take the Class-Specific Career Guidance Quiz',
        subtitle: 'Select Class 10, Class 11, or Class 12 to discover personalized career recommendations and educational routes.',
        cta: 'Take Quiz',
        href: 'quiz.html'
      });
    }

    const nextMilestoneIndex = [0, 1, 2, 3, 4, 5].find(idx => milestonesState[idx] !== 'completed');
    if (nextMilestoneIndex !== undefined) {
      const milestoneTitles = [
        'Confirm academic subject prerequisites & board targets',
        'Review registration deadlines for entrance examinations',
        'Verify degree options & centralized counseling quota',
        'Enroll in core skill development track',
        'Prepare 1 portfolio project or internship application',
        'Prepare resume and practice technical interview questions'
      ];
      weeklyActions.push({
        title: `Roadmap Step ${nextMilestoneIndex + 1}: ${milestoneTitles[nextMilestoneIndex]}`,
        subtitle: `Active Career: ${activeCareer.title}`,
        cta: 'Open Roadmap',
        href: `roadmaps.html?career=${activeCareer.id}`
      });
    }

    if (eligibleList.length > 0) {
      const topSchol = eligibleList[0];
      weeklyActions.push({
        title: `Check Requirements for ${topSchol.scholarship.name}`,
        subtitle: `${topSchol.scholarship.amount} • Verified on ${topSchol.scholarship.last_verified}`,
        cta: 'View Scholarship',
        href: `scholarships.html#${topSchol.scholarship.id}`
      });
    }

    const notifPermission = NotificationService.getPermission();
    const user = AuthService.getUser();

    container.innerHTML = `
      <div>
        <!-- Profile Banner Card (With User Auth State & Avatar) -->
        <div class="card" style="margin-bottom: 2rem; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: white; border: none; padding: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap;">
            <div style="display: flex; gap: 1.25rem; align-items: flex-start;">
              ${user ? `
                <img src="${user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=4f46e5`}" alt="${user.name}" style="width: 64px; height: 64px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.3); object-fit: cover; box-shadow: var(--shadow-md);">
              ` : ''}
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
                  ${user ? `
                    <span class="badge" style="background: #ecfdf5; color: #047857; font-weight: 700; border: 1px solid #a7f3d0;">
                      ${user.provider === 'google' ? '✓ GOOGLE VERIFIED' : '✓ AUTHENTICATED STUDENT'}
                    </span>
                  ` : `
                    <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 700;">
                      GUEST / DEMO MODE
                    </span>
                  `}
                  <span class="badge" style="background: rgba(255, 255, 255, 0.15); color: #c7d2fe;">
                    ${profile.stage || 'Stage Not Set'}
                  </span>
                  <span class="badge" style="background: rgba(255, 255, 255, 0.15); color: #c7d2fe;">
                    ${profile.stream || 'Stream Not Set'}
                  </span>
                  <span class="badge" style="background: rgba(255, 255, 255, 0.15); color: #c7d2fe;">
                    ${profile.state === 'Maharashtra' ? 'Maharashtra (State Schemes Active)' : (profile.state || 'Maharashtra')}
                  </span>
                </div>

                <h2 style="font-size: 1.85rem; font-weight: 800; color: white;">
                  ${user ? `Welcome, ${user.name}!` : (demoSession?.name ? `Welcome, ${demoSession.name}!` : 'Student Career & Scholarship Command Center')}
                </h2>
                ${user?.email ? `<p style="font-size: 0.85rem; color: #a5b4fc; margin-top: 0.15rem;">${user.email}</p>` : ''}
                <p style="font-size: 0.95rem; color: #cbd5e1; max-width: 650px; margin-top: 0.35rem;">
                  Category: <strong>${profile.category || 'General'}</strong> • Income: <strong>${profile.income || 'Not Stated'}</strong> • Budget: <strong>${profile.budget || 'Moderate'}</strong>
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-direction: column;">
              <button id="dashboardEditProfileBtn" class="btn btn-secondary btn-sm" style="background: white; color: #1e1b4b; border: none;">
                ${Icons.get('user')} Edit Profile
              </button>
              ${user ? `
                <button id="dashboardLogoutBtn" class="btn btn-outline btn-sm" style="color: #fca5a5; border-color: rgba(252, 165, 165, 0.4);">
                  Log Out
                </button>
              ` : `
                <a href="login.html" class="btn btn-sm" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); text-align: center; text-decoration: none;">
                  Log In / Sign Up
                </a>
              `}
              <button id="dashboardTestPushBtn" class="btn btn-outline btn-sm" style="color: white; border-color: rgba(255,255,255,0.4);">
                ${Icons.get('sparkles')} ${notifPermission === 'granted' ? 'Test Push Alert' : 'Enable Web Push'}
              </button>
            </div>
          </div>
        </div>

        <!-- Metric Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-subtle);">Eligible Schemes</div>
            <div style="font-size: 1.75rem; font-weight: 800; color: #059669; margin: 0.2rem 0;">${eligibleList.length}</div>
            <div style="font-size: 0.775rem; color: var(--text-muted);">100% Verified official rules</div>
          </div>

          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-subtle);">Possible Schemes</div>
            <div style="font-size: 1.75rem; font-weight: 800; color: #d97706; margin: 0.2rem 0;">${partialList.length}</div>
            <div style="font-size: 0.775rem; color: var(--text-muted);">Missing income/caste detail</div>
          </div>

          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-subtle);">Active Roadmap</div>
            <div style="font-size: 1.75rem; font-weight: 800; color: var(--primary); margin: 0.2rem 0;">${roadmapPct}%</div>
            <div style="font-size: 0.775rem; color: var(--text-muted);">${activeCareer.title.split(' ')[0]}</div>
          </div>

          <div class="card" style="padding: 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-subtle);">Saved Items</div>
            <div style="font-size: 1.75rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0;">${savedCareerIds.length + savedScholarshipIds.length}</div>
            <div style="font-size: 0.775rem; color: var(--text-muted);">Careers & Scholarships</div>
          </div>
        </div>

        <!-- What Should I Do This Week? -->
        <div class="card" style="margin-bottom: 2.5rem; border-left: 5px solid var(--primary);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
            ${Icons.get('sparkles')}
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main);">
              What Should I Do This Week?
            </h3>
          </div>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            A dynamic action list generated from your nearest roadmap milestone and matching opportunities:
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${weeklyActions.map((act, i) => `
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1rem 1.25rem; background: var(--bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-light); flex-wrap: wrap;">
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main);">
                    ${i + 1}. ${act.title}
                  </h4>
                  <p style="font-size: 0.825rem; color: var(--text-muted); margin-top: 0.15rem;">
                    ${act.subtitle}
                  </p>
                </div>
                ${act.href ? `
                  <a href="${act.href}" class="btn btn-primary btn-sm">
                    ${act.cta} ${Icons.get('arrowRight')}
                  </a>
                ` : `
                  <button class="btn btn-primary btn-sm" id="actionBtn_${i}">
                    ${act.cta}
                  </button>
                `}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
          <!-- Left Column -->
          <div>
            <div class="card" style="margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div>
                  <span class="badge badge-primary">Active Roadmap</span>
                  <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-top: 0.3rem;">
                    ${activeCareer.title}
                  </h3>
                  <p style="font-size: 0.85rem; color: var(--text-muted);">
                    ${completedMilestones} of 6 Milestones Completed
                  </p>
                </div>
                <a href="roadmaps.html?career=${activeCareer.id}${quizResults?.class ? `&class=${quizResults.class}` : ''}" class="btn btn-secondary btn-sm">
                  View Roadmap ${Icons.get('arrowRight')}
                </a>
              </div>

              <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: var(--radius-full); overflow: hidden;">
                <div style="height: 100%; width: ${roadmapPct}%; background: #10b981;"></div>
              </div>
            </div>

            <!-- Quiz Matches -->
            <div class="card" style="margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main);">
                  Top Career Matches
                </h3>
                <a href="quiz.html" class="btn btn-outline btn-sm">
                  ${quizResults ? 'Retake Quiz' : 'Take Quiz'}
                </a>
              </div>

              ${quizResults?.recommendations?.length ? `
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                  ${quizResults.recommendations.map(r => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; border: 1px solid var(--border-light); border-radius: var(--radius-md);">
                      <div>
                        <strong style="font-size: 0.95rem; color: var(--text-main); display: block;">${r.title}</strong>
                        <span style="font-size: 0.8rem; color: var(--text-subtle);">${r.matchPercent}% Compatibility</span>
                      </div>
                      <div style="display: flex; gap: 0.5rem;">
                        <a href="roadmaps.html?career=${r.id}${quizResults?.class ? `&class=${quizResults.class}` : ''}" class="btn btn-sm btn-secondary">Roadmap</a>
                        <a href="career.html?id=${r.id}${quizResults?.class ? `&class=${quizResults.class}` : ''}" class="btn btn-sm btn-outline">Guide</a>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div style="text-align: center; padding: 2rem 1rem; color: var(--text-subtle);">
                  <p style="font-size: 0.9rem; margin-bottom: 1rem;">No quiz results saved yet. Take our Class 10, 11, or 12 career guidance quiz to discover your top matching careers.</p>
                  <a href="quiz.html" class="btn btn-primary btn-sm">Start Career Quiz</a>
                </div>
              `}
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <div class="card" style="margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main);">
                  Eligible Scholarships (${eligibleList.length})
                </h3>
                <a href="scholarships.html" class="btn btn-outline btn-sm">
                  All Schemes
                </a>
              </div>

              ${eligibleList.length ? `
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                  ${eligibleList.slice(0, 3).map(item => `
                    <div style="padding: 0.85rem 1rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); background: #f0fdf4;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                        <strong style="font-size: 0.9rem; color: var(--text-main);">${item.scholarship.name}</strong>
                        <span class="badge badge-eligible">Eligible</span>
                      </div>
                      <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0 0.5rem;">
                        ${item.scholarship.amount}
                      </p>
                      <a href="${item.scholarship.officialUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">
                        Official Portal ${Icons.get('external')}
                      </a>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div style="text-align: center; padding: 2rem 1rem; color: var(--text-subtle);">
                  <p style="font-size: 0.9rem; margin-bottom: 1rem;">No scholarships are marked eligible yet. Update your family income and category in your profile to run the matcher.</p>
                  <button class="btn btn-secondary btn-sm" id="emptyEligibleUpdateProfileBtn">Update Profile</button>
                </div>
              `}
            </div>

            <!-- Saved Bookmarks -->
            <div class="card">
              <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem;">
                Saved Items (${savedCareerIds.length + savedScholarshipIds.length})
              </h3>

              ${(savedCareerIds.length || savedScholarshipIds.length) ? `
                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                  ${savedCareerIds.map(cid => {
                    const c = this.careers.find(item => item.id === cid);
                    if (!c) return '';
                    return `
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
                        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);">${c.title}</span>
                        <div style="display: flex; gap: 0.4rem;">
                          <a href="career.html?id=${c.id}" class="btn btn-sm btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">View</a>
                          <button class="btn btn-sm btn-outline remove-career-btn" data-id="${c.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Remove</button>
                        </div>
                      </div>
                    `;
                  }).join('')}

                  ${savedScholarshipIds.map(sid => {
                    const s = this.scholarships.find(item => item.id === sid);
                    if (!s) return '';
                    return `
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
                        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);">${s.name}</span>
                        <div style="display: flex; gap: 0.4rem;">
                          <a href="scholarships.html#${s.id}" class="btn btn-sm btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">View</a>
                          <button class="btn btn-sm btn-outline remove-schol-btn" data-id="${s.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Remove</button>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <p style="font-size: 0.85rem; color: var(--text-subtle); text-align: center; padding: 1.5rem 0;">
                  You haven't bookmarked any careers or scholarships yet. Click the "Save" button on any item to keep it here.
                </p>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('dashboardEditProfileBtn')?.addEventListener('click', () => ProfileModal.open());
    document.getElementById('emptyEligibleUpdateProfileBtn')?.addEventListener('click', () => ProfileModal.open());

    document.getElementById('dashboardLogoutBtn')?.addEventListener('click', async () => {
      await AuthService.logout();
      this.render();
    });

    document.getElementById('dashboardTestPushBtn')?.addEventListener('click', () => {
      NotificationService.triggerTestNotification();
      setTimeout(() => this.render(), 600);
    });

    weeklyActions.forEach((act, i) => {
      if (act.action) {
        document.getElementById(`actionBtn_${i}`)?.addEventListener('click', act.action);
      }
    });

    container.querySelectorAll('.remove-career-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        StorageService.toggleSaveCareer(id);
      });
    });

    container.querySelectorAll('.remove-schol-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        StorageService.toggleSaveScholarship(id);
      });
    });
  }
};
