/**
 * Complete Educational Roadmap & Pathway Engine ("CareerConnect Roadmaps")
 * Dynamic, class-adaptive roadmaps starting from Class 10, Class 11, Class 12, or College.
 * Features multi-route tabs (Route A, Route B, Route C), interactive side-by-side comparison,
 * expandable milestone cards with official statutory links, and 6 working action tools.
 */

import { StorageService } from './storage.js';
import { Icons } from './icons.js';

const LEGACY_ALIASES = {
  'civil-services-officer': 'ias-officer',
  'healthcare-professional': 'doctor-medical-practitioner',
  'science-researcher': 'research-scientist',
  'lawyer-legal-advisor': 'lawyer-advocate',
  'ai-data-scientist': 'data-scientist',
  'cybersecurity-expert': 'cybersecurity-analyst',
  'cloud-architect': 'cloud-engineer',
  'product-manager': 'product-designer'
};

export const RoadmapsEngine = {
  careers: [],
  roadmapsData: null,
  selectedCareerId: 'software-developer',
  selectedClass: '10', // '10' | '11' | '12' | 'college'
  selectedStream: null,
  activeRouteId: 'route-a',

  async init() {
    try {
      const [careersRes, roadmapsRes] = await Promise.all([
        fetch('data/careers.json'),
        fetch('data/roadmaps-data.json')
      ]);

      this.careers = await careersRes.json();
      this.roadmapsData = await roadmapsRes.json();

      // Parse URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      let queryCareer = urlParams.get('career');
      if (queryCareer) {
        queryCareer = LEGACY_ALIASES[queryCareer] || queryCareer;
        if (this.careers.some(c => c.id === queryCareer)) {
          this.selectedCareerId = queryCareer;
        }
      } else {
        const savedQuiz = StorageService.getQuizResults();
        if (savedQuiz?.recommendations?.length) {
          const recId = LEGACY_ALIASES[savedQuiz.recommendations[0].id] || savedQuiz.recommendations[0].id;
          if (this.careers.some(c => c.id === recId)) {
            this.selectedCareerId = recId;
          }
        }
      }

      const queryClass = urlParams.get('class');
      if (['10', '11', '12', 'college'].includes(queryClass)) {
        this.selectedClass = queryClass;
      } else {
        const profile = StorageService.getProfile();
        if (profile.educationStage) {
          if (profile.educationStage.includes('10')) this.selectedClass = '10';
          else if (profile.educationStage.includes('11')) this.selectedClass = '11';
          else if (profile.educationStage.includes('12')) this.selectedClass = '12';
          else if (profile.educationStage.includes('undergraduate') || profile.educationStage.includes('college')) this.selectedClass = 'college';
        }
      }

      const queryStream = urlParams.get('stream');
      if (queryStream) this.selectedStream = queryStream;

      this.render();
    } catch (e) {
      console.error('Failed to initialize roadmaps engine:', e);
      const container = document.getElementById('roadmapMount');
      if (container) {
        container.innerHTML = `
          <div class="card" style="text-align: center; padding: 3rem;">
            <h3>Unable to load roadmap dataset</h3>
            <p style="color: var(--text-muted); margin: 0.5rem 0 1.5rem;">Please check your connection and reload the page.</p>
            <button onclick="location.reload()" class="btn btn-primary btn-sm">Reload Page</button>
          </div>
        `;
      }
    }
  },

  getArchetypeForCareer(career) {
    if (!this.roadmapsData?.archetypes) return null;
    const archs = this.roadmapsData.archetypes;

    // Direct career list matching
    for (const [key, arch] of Object.entries(archs)) {
      if (arch.careers && arch.careers.includes(career.id)) {
        return { key, data: arch };
      }
    }

    // Category based heuristic fallback
    const cat = career.category || '';
    if (cat.includes('Technology') || cat.includes('Intelligence') || cat.includes('Cybersecurity')) {
      return { key: 'software-engineering', data: archs['software-engineering'] };
    }
    if (cat.includes('Medical')) {
      return { key: 'allied-health-pharmacy', data: archs['allied-health-pharmacy'] };
    }
    if (cat.includes('Finance') || cat.includes('Business')) {
      return { key: 'chartered-accountancy', data: archs['chartered-accountancy'] };
    }
    if (cat.includes('Design') || cat.includes('Media')) {
      return { key: 'design-creative', data: archs['design-creative'] };
    }
    if (cat.includes('Government') || cat.includes('Law')) {
      return { key: 'civil-services', data: archs['civil-services'] };
    }
    if (cat.includes('Engineering')) {
      return { key: 'core-engineering', data: archs['core-engineering'] };
    }
    if (cat.includes('Science') || cat.includes('Education')) {
      return { key: 'science-research', data: archs['science-research'] };
    }

    // Default to software engineering archetype as base template
    return { key: 'software-engineering', data: archs['software-engineering'] };
  },

  getClassPathway(archetype, career) {
    const classKey = this.selectedClass === 'college' ? 'class12' : `class${this.selectedClass}`;
    const classData = archetype.data[classKey] || archetype.data['class10'];

    return {
      routes: classData.routes || [],
      comparison: archetype.data['class10']?.comparison || archetype.data.comparison || null
    };
  },

  render() {
    const container = document.getElementById('roadmapMount');
    if (!container) return;

    const career = this.careers.find(c => c.id === this.selectedCareerId) || this.careers[0];
    const archetype = this.getArchetypeForCareer(career);
    const pathwayData = this.getClassPathway(archetype, career);

    // Ensure active route exists
    const validRoutes = pathwayData.routes;
    if (!validRoutes.some(r => r.id === this.activeRouteId)) {
      this.activeRouteId = validRoutes[0]?.id || 'route-a';
    }

    const currentRoute = validRoutes.find(r => r.id === this.activeRouteId) || validRoutes[0];
    const milestonesState = StorageService.getMilestones(`${career.id}_${this.selectedClass}_${this.activeRouteId}`);

    // Progress calculation
    const totalSteps = currentRoute?.steps?.length || 1;
    const completedCount = Object.values(milestonesState).filter(s => s === 'completed').length;
    const progressPct = Math.round((completedCount / totalSteps) * 100);
    const isSaved = StorageService.isCareerSaved(career.id);

    const classNames = {
      '10': 'Class 10 (Starting After 10th)',
      '11': 'Class 11 (Starting from Current 11th Focus)',
      '12': 'Class 12 (Starting Immediately Post-12th)',
      'college': 'College / Graduate (Advanced Pathway)'
    };

    container.innerHTML = `
      <div style="max-width: 1000px; margin: 0 auto; padding-bottom: 4rem;">
        
        <!-- Top Career & Stage Control Bar -->
        <div class="card" style="padding: 1.75rem 2rem; border-top: 4px solid var(--primary); margin-bottom: 2rem; box-shadow: var(--shadow-md);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
            <div>
              <span class="badge badge-primary" style="margin-bottom: 0.35rem;">COMPLETE STEP-BY-STEP ROADMAP</span>
              <h2 style="font-size: 1.65rem; font-weight: 800; color: var(--text-main); margin: 0;">
                Roadmap to Becoming a ${career.title || career.name}
              </h2>
              <p style="font-size: 0.95rem; color: var(--text-muted); margin-top: 0.25rem;">
                Adapted starting point: <strong>${classNames[this.selectedClass]}</strong>
              </p>
            </div>

            <!-- Target Career Select Dropdown -->
            <div style="min-width: 260px;">
              <label for="careerSelector" style="font-size: 0.8rem; font-weight: 700; color: var(--text-subtle); display: block; margin-bottom: 0.25rem;">
                Select Target Career (110 Options):
              </label>
              <select id="careerSelector" class="form-input" style="font-size: 0.85rem; height: 42px; border-radius: var(--radius-md);">
                ${this.careers.map(c => `
                  <option value="${c.id}" ${c.id === career.id ? 'selected' : ''}>
                    ${c.title || c.name} (${c.category})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Academic Stage Selector Tabs -->
          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-subtle); display: block; margin-bottom: 0.5rem;">
              Change Your Current Academic Stage:
            </label>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="stage-btn btn ${this.selectedClass === '10' ? 'btn-primary' : 'btn-outline'} btn-sm" data-stage="10">
                Class 10 Student
              </button>
              <button class="stage-btn btn ${this.selectedClass === '11' ? 'btn-primary' : 'btn-outline'} btn-sm" data-stage="11">
                Class 11 Student
              </button>
              <button class="stage-btn btn ${this.selectedClass === '12' ? 'btn-primary' : 'btn-outline'} btn-sm" data-stage="12">
                Class 12 Student
              </button>
              <button class="stage-btn btn ${this.selectedClass === 'college' ? 'btn-primary' : 'btn-outline'} btn-sm" data-stage="college">
                Completed 12th / College
              </button>
            </div>
          </div>
        </div>

        <!-- 6 Interactive Action Buttons Bar (Prompt Requirements) -->
        <div class="card" style="padding: 1.25rem 1.5rem; margin-bottom: 2rem; background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem;">
              ${Icons.get('sparkles')}
              Pathway Decision & Planning Tools:
            </div>
            
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button id="compareRoutesBtn" class="btn btn-secondary btn-sm" style="font-weight: 700;">
                📊 Compare Routes
              </button>
              <button id="viewEligibilityBtn" class="btn btn-outline btn-sm">
                📋 View Eligibility
              </button>
              <button id="exploreCoursesBtn" class="btn btn-outline btn-sm">
                🎓 Explore Courses
              </button>
              <button id="viewEntranceExamsBtn" class="btn btn-outline btn-sm">
                📝 View Entrance Exams
              </button>
              <button id="exploreScholarshipsBtn" class="btn btn-outline btn-sm">
                💰 Explore Scholarships
              </button>
              <button id="saveRoadmapBtn" class="btn ${isSaved ? 'btn-secondary' : 'btn-primary'} btn-sm">
                ${isSaved ? '✓ Saved in Profile' : '🔖 Save This Roadmap'}
              </button>
            </div>
          </div>
        </div>

        <!-- Multiple Valid Route Tabs -->
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <span style="font-size: 0.775rem; font-weight: 700; color: var(--text-subtle); text-transform: uppercase;">
                AVAILABLE PATHWAYS TO THIS CAREER (${validRoutes.length} VALID ROUTES)
              </span>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0 0;">
                Select Education Route:
              </h3>
            </div>
            <span style="font-size: 0.85rem; color: var(--text-muted);">
              Milestones completed: <strong>${completedCount} of ${totalSteps}</strong> (${progressPct}%)
            </span>
          </div>

          <div class="roadmap-route-tabs">
            ${validRoutes.map((r, idx) => `
              <button class="roadmap-route-tab ${r.id === this.activeRouteId ? 'active' : ''}" data-route="${r.id}">
                ${r.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Active Route Summary & Suitability Box -->
        <div class="card" style="background: #f8fafc; border-left: 4px solid var(--primary); padding: 1.25rem 1.5rem; margin-bottom: 2rem;">
          <h4 style="font-size: 1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.35rem;">
            ${currentRoute.name}
          </h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.5rem;">
            ${currentRoute.summary}
          </p>
          ${currentRoute.suitability ? `
            <div style="font-size: 0.825rem; color: var(--primary); font-weight: 600;">
              <strong>Who is this for?</strong> ${currentRoute.suitability}
            </div>
          ` : ''}
        </div>

        <!-- Visual Step-by-Step Interactive Timeline -->
        <div class="roadmap-timeline">
          ${(currentRoute.steps || []).map((step, idx) => {
            const isCompleted = milestonesState[step.stepNumber] === 'completed';
            return `
              <div class="roadmap-step" id="step-${step.stepNumber}">
                <div class="roadmap-node" style="${isCompleted ? 'background: #10b981; color: white; border-color: #059669;' : ''}">
                  ${isCompleted ? '✓' : step.stepNumber}
                </div>

                <div class="roadmap-step-card ${isCompleted ? 'active-step' : ''}">
                  
                  <!-- Step Header -->
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                    <div>
                      <span class="badge" style="background: #eef2ff; color: var(--primary); font-weight: 700; margin-bottom: 0.35rem;">
                        ${step.stage}
                      </span>
                      <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main); margin: 0;">
                        ${step.course}
                      </h4>
                    </div>

                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                      <span class="badge" style="background: #f1f5f9; color: var(--text-main); font-weight: 600;">
                        ⏱ ${step.duration}
                      </span>
                      <label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; font-weight: 700; color: var(--text-subtle); cursor: pointer; background: var(--bg-subtle); padding: 0.25rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                        <input type="checkbox" class="step-checkbox" data-step="${step.stepNumber}" ${isCompleted ? 'checked' : ''}>
                        <span>${isCompleted ? 'Completed' : 'Mark Done'}</span>
                      </label>
                    </div>
                  </div>

                  <!-- Eligibility Requirement Banner -->
                  <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-sm); padding: 0.75rem 1rem; margin: 0.75rem 0 1rem; font-size: 0.85rem; color: #92400e; line-height: 1.5;">
                    <strong>Eligibility Criteria:</strong> ${step.eligibility}
                  </div>

                  <!-- What The Student Needs To Do (Action Checklist) -->
                  <div style="margin-bottom: 1rem;">
                    <strong style="font-size: 0.85rem; color: var(--text-main); display: block; margin-bottom: 0.35rem;">
                      What You Need to Do at this Step:
                    </strong>
                    <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.55; margin: 0;">
                      ${step.whatToDo}
                    </p>
                  </div>

                  <!-- Entrance Exams (if applicable) -->
                  ${step.entranceExams && step.entranceExams.length > 0 ? `
                    <div style="margin-bottom: 1rem; background: var(--bg-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                      <strong style="font-size: 0.825rem; color: var(--text-main); display: block; margin-bottom: 0.35rem;">
                        Relevant Entrance Examinations:
                      </strong>
                      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${step.entranceExams.map(ex => `
                          <a href="${ex.url}" target="_blank" rel="noopener noreferrer" class="badge" style="background: #ffffff; color: var(--primary); border: 1px solid #cbd5e1; text-decoration: none; font-weight: 600; padding: 0.35rem 0.65rem; display: inline-flex; align-items: center; gap: 0.3rem;">
                            📝 ${ex.name} ↗
                          </a>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}

                  <!-- Skills to Develop -->
                  ${step.skills && step.skills.length > 0 ? `
                    <div style="margin-bottom: 1rem;">
                      <strong style="font-size: 0.825rem; color: var(--text-subtle); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">
                        Key Skills to Build:
                      </strong>
                      <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                        ${step.skills.map(sk => `
                          <span class="badge" style="background: #f1f5f9; color: var(--text-main); font-weight: 500;">
                            ${sk}
                          </span>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}

                  <!-- Official Link Footer -->
                  ${step.officialLink ? `
                    <div style="border-top: 1px solid var(--border-light); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.825rem;">
                      <span style="color: var(--text-subtle);">Official Statutory Information:</span>
                      <a href="${step.officialLink.url}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.3rem;">
                        ${step.officialLink.title} ↗
                      </a>
                    </div>
                  ` : ''}

                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Career Page Direct Integration Card -->
        <div class="card" style="background: #ffffff; border: 1.5px solid var(--border-light); padding: 1.75rem; border-radius: var(--radius-lg); margin-top: 3rem; text-align: center;">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
            Explore the Complete 10-Section Profile for ${career.title || career.name}
          </h3>
          <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 600px; margin: 0 auto 1.5rem; line-height: 1.5;">
            Read comprehensive details on verified Indian salary structures, statutory regulators, approved college directories, top employers, and frequently asked questions.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <a href="career.html?id=${career.id}&class=${this.selectedClass}" class="btn btn-primary btn-sm">
              Explore Full Career Profile
            </a>
            <a href="explore.html" class="btn btn-secondary btn-sm">
              Browse All 110 Careers
            </a>
          </div>
        </div>

      </div>
    `;

    this.bindEvents(career, archetype, pathwayData);
  },

  bindEvents(career, archetype, pathwayData) {
    const container = document.getElementById('roadmapMount');
    if (!container) return;

    // Career Dropdown Change
    document.getElementById('careerSelector')?.addEventListener('change', (e) => {
      this.selectedCareerId = e.target.value;
      this.activeRouteId = 'route-a';
      this.render();
    });

    // Stage Selector Buttons
    container.querySelectorAll('.stage-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const stage = btn.getAttribute('data-stage');
        this.selectedClass = stage;
        this.activeRouteId = 'route-a';
        this.render();
      });
    });

    // Route Tabs
    container.querySelectorAll('.roadmap-route-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeRouteId = tab.getAttribute('data-route');
        this.render();
      });
    });

    // Checkbox State Persistence
    container.querySelectorAll('.step-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const stepNum = e.target.getAttribute('data-step');
        const key = `${career.id}_${this.selectedClass}_${this.activeRouteId}`;
        const state = StorageService.getMilestones(key);
        state[stepNum] = e.target.checked ? 'completed' : 'pending';
        StorageService.saveMilestones(key, state);
        this.render();
      });
    });

    // Button 1: Compare Routes
    document.getElementById('compareRoutesBtn')?.addEventListener('click', () => {
      this.renderCompareModal(archetype, pathwayData);
    });

    // Button 2: View Eligibility
    document.getElementById('viewEligibilityBtn')?.addEventListener('click', () => {
      this.renderEligibilityModal(career, pathwayData);
    });

    // Button 3: Explore Courses
    document.getElementById('exploreCoursesBtn')?.addEventListener('click', () => {
      this.renderCoursesModal(career, pathwayData);
    });

    // Button 4: View Entrance Exams
    document.getElementById('viewEntranceExamsBtn')?.addEventListener('click', () => {
      this.renderEntranceExamsModal(career, pathwayData);
    });

    // Button 5: Explore Scholarships
    document.getElementById('exploreScholarshipsBtn')?.addEventListener('click', () => {
      this.renderScholarshipsModal(career);
    });

    // Button 6: Save This Roadmap
    document.getElementById('saveRoadmapBtn')?.addEventListener('click', () => {
      this.saveRoadmapToProfile(career);
    });
  },

  renderCompareModal(archetype, pathwayData) {
    const existing = document.getElementById('compareRoutesModal');
    if (existing) existing.remove();

    const comparison = pathwayData.comparison;
    const routes = pathwayData.routes;

    const modal = document.createElement('div');
    modal.id = 'compareRoutesModal';
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(11, 19, 43, 0.7);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    `;

    // Build comparison table content
    let tableHtml = '';
    if (comparison && comparison.factors) {
      tableHtml = `
        <table class="compare-matrix-table">
          <thead>
            <tr>
              <th style="width: 25%;">Comparison Factor</th>
              ${routes.map(r => `<th>${r.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${comparison.factors.map(f => `
              <tr>
                <td style="font-weight: 700; color: var(--text-main); background: #f8fafc;">${f.name}</td>
                <td>${f.routeA || 'N/A'}</td>
                ${routes.length > 1 ? `<td>${f.routeB || 'N/A'}</td>` : ''}
                ${routes.length > 2 ? `<td>${f.routeC || 'N/A'}</td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      // Dynamic route comparison fallback
      tableHtml = `
        <table class="compare-matrix-table">
          <thead>
            <tr>
              <th style="width: 25%;">Comparison Factor</th>
              ${routes.map(r => `<th>${r.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: 700; background: #f8fafc;">Starting Stage</td>
              ${routes.map(() => `<td>Class ${this.selectedClass}</td>`).join('')}
            </tr>
            <tr>
              <td style="font-weight: 700; background: #f8fafc;">Target Duration</td>
              ${routes.map(r => `<td>${r.steps?.reduce((acc, s) => acc + (s.duration ? ` • ${s.duration}` : ''), '') || '3-4 Years'}</td>`).join('')}
            </tr>
            <tr>
              <td style="font-weight: 700; background: #f8fafc;">Key Entrances</td>
              ${routes.map(r => `<td>${r.steps?.flatMap(s => (s.entranceExams || []).map(e => e.name)).filter(Boolean).join(', ') || 'Merit Based'}</td>`).join('')}
            </tr>
            <tr>
              <td style="font-weight: 700; background: #f8fafc;">Primary Advantage</td>
              ${routes.map(r => `<td>${r.summary}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      `;
    }

    modal.innerHTML = `
      <div class="card" style="max-width: 900px; width: 100%; max-height: 85vh; display: flex; flex-direction: column; padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
          <div>
            <span class="badge badge-primary" style="margin-bottom: 0.25rem;">COMPARATIVE ROUTE ANALYSIS</span>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0;">
              Side-by-Side Comparison of Valid Career Routes
            </h3>
          </div>
          <button id="closeCompareModalBtn" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer;">&times;</button>
        </div>

        <div style="overflow-y: auto; flex: 1; margin-bottom: 1rem;">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
            Compare initial starting points, degree qualifications, entrance examination burdens, eligibility thresholds, and strategic trade-offs before deciding your pathway.
          </p>
          <div style="overflow-x: auto;">
            ${tableHtml}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-light); padding-top: 1rem;">
          <button id="closeCompareModalFooterBtn" class="btn btn-secondary btn-sm">Close Comparison</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const close = () => modal.remove();
    document.getElementById('closeCompareModalBtn')?.addEventListener('click', close);
    document.getElementById('closeCompareModalFooterBtn')?.addEventListener('click', close);
  },

  renderEligibilityModal(career, pathwayData) {
    const existing = document.getElementById('eligibilityModal');
    if (existing) existing.remove();

    const currentRoute = pathwayData.routes.find(r => r.id === this.activeRouteId) || pathwayData.routes[0];

    const modal = document.createElement('div');
    modal.id = 'eligibilityModal';
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(11, 19, 43, 0.7);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    `;

    modal.innerHTML = `
      <div class="card" style="max-width: 760px; width: 100%; max-height: 85vh; display: flex; flex-direction: column; padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
          <div>
            <span class="badge badge-primary">STATUTORY ADMISSION CRITERIA</span>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0 0;">
              Eligibility Requirements: ${career.title || career.name}
            </h3>
          </div>
          <button id="closeEligibilityModalBtn" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer;">&times;</button>
        </div>

        <div style="overflow-y: auto; flex: 1; padding-right: 0.5rem; margin-bottom: 1rem;">
          <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.25rem; color: #92400e; font-size: 0.9rem; line-height: 1.55;">
            <strong>Important Regulatory Note:</strong> Educational eligibility rules in India are governed by central statutory bodies (such as NMC for medicine, AICTE for engineering, ICAI for chartered accountancy, BCI for law, and COA for architecture). Always check institutional prospectuses for recent changes.
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${(currentRoute.steps || []).map((step, idx) => `
              <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <span class="badge" style="background: #eef2ff; color: var(--primary); font-weight: 700;">Step ${step.stepNumber}: ${step.stage}</span>
                  <span style="font-size: 0.8rem; color: var(--text-subtle);">Duration: ${step.duration}</span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.4rem;">
                  ${step.course}
                </h4>
                <div style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.5rem;">
                  <strong>Required Marks & Subjects:</strong> ${step.eligibility}
                </div>
                ${step.officialLink ? `
                  <a href="${step.officialLink.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.8rem; color: var(--primary); font-weight: 700; text-decoration: none;">
                    Verify at ${step.officialLink.title} ↗
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-light); padding-top: 1rem;">
          <button id="closeEligibilityModalFooterBtn" class="btn btn-secondary btn-sm">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const close = () => modal.remove();
    document.getElementById('closeEligibilityModalBtn')?.addEventListener('click', close);
    document.getElementById('closeEligibilityModalFooterBtn')?.addEventListener('click', close);
  },

  renderCoursesModal(career, pathwayData) {
    const existing = document.getElementById('coursesModal');
    if (existing) existing.remove();

    const pathways = career.educationPathways || [];

    const modal = document.createElement('div');
    modal.id = 'coursesModal';
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(11, 19, 43, 0.7);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    `;

    modal.innerHTML = `
      <div class="card" style="max-width: 760px; width: 100%; max-height: 85vh; display: flex; flex-direction: column; padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
          <div>
            <span class="badge badge-primary">COURSE DIRECTORY</span>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0 0;">
              Relevant Degree & Course Options
            </h3>
          </div>
          <button id="closeCoursesModalBtn" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer;">&times;</button>
        </div>

        <div style="overflow-y: auto; flex: 1; padding-right: 0.5rem; margin-bottom: 1rem;">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5;">
            Explore approved undergraduate and postgraduate degree programmes for <strong>${career.title || career.name}</strong>.
          </p>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${pathways.length > 0 ? pathways.map((p, idx) => `
              <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.15rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <span class="badge" style="background: #eef2ff; color: var(--primary); font-weight: 700;">Path ${idx + 1}</span>
                  <span style="font-size: 0.8rem; color: var(--text-subtle);">${p.duration || '3-4 Years'}</span>
                </div>
                <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.4rem;">
                  ${p.title || p.name}
                </h4>
                <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                  ${p.description || p.summary || 'Recognized Indian university coursework and professional training.'}
                </p>
              </div>
            `).join('') : `
              <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
                <p>Course pathways: <strong>${career.qualification || "Bachelor's Degree"}</strong></p>
              </div>
            `}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1rem;">
          <a href="pathways.html" class="btn btn-outline btn-sm">Explore General Education Pathways</a>
          <button id="closeCoursesModalFooterBtn" class="btn btn-secondary btn-sm">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const close = () => modal.remove();
    document.getElementById('closeCoursesModalBtn')?.addEventListener('click', close);
    document.getElementById('closeCoursesModalFooterBtn')?.addEventListener('click', close);
  },

  renderEntranceExamsModal(career, pathwayData) {
    const existing = document.getElementById('entranceExamsModal');
    if (existing) existing.remove();

    const exams = career.entranceExamsDetails || career.requiredExams || [];

    const modal = document.createElement('div');
    modal.id = 'entranceExamsModal';
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(11, 19, 43, 0.7);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    `;

    modal.innerHTML = `
      <div class="card" style="max-width: 760px; width: 100%; max-height: 85vh; display: flex; flex-direction: column; padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
          <div>
            <span class="badge badge-primary">OFFICIAL ADMISSION TESTS</span>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0 0;">
              Key Entrance Examinations
            </h3>
          </div>
          <button id="closeExamsModalBtn" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer;">&times;</button>
        </div>

        <div style="overflow-y: auto; flex: 1; padding-right: 0.5rem; margin-bottom: 1rem;">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5;">
            Verified entrance tests conducted by statutory testing agencies (NTA, State CET Cells, Autonomous National Institutes):
          </p>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${exams.length > 0 ? exams.map(ex => `
              <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.15rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.5rem;">
                  <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin: 0;">
                    ${ex.name || ex.examName || ex}
                  </h4>
                  <span class="badge" style="background: #eef2ff; color: var(--primary); font-weight: 700;">
                    ${ex.conductingBody || 'Statutory Authority'}
                  </span>
                </div>
                <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; margin: 0.35rem 0 0.75rem;">
                  ${ex.eligibility || ex.description || 'Statutory entrance examination required for merit counselling and college admissions.'}
                </p>
                ${ex.portalUrl || ex.url ? `
                  <a href="${ex.portalUrl || ex.url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs" style="font-size: 0.775rem;">
                    Visit Official Portal (${ex.portalUrl || ex.url}) ↗
                  </a>
                ` : ''}
              </div>
            `).join('') : `
              <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
                <p>Admission based primarily on 12th board merit or institutional screening interviews.</p>
              </div>
            `}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-light); padding-top: 1rem;">
          <button id="closeExamsModalFooterBtn" class="btn btn-secondary btn-sm">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const close = () => modal.remove();
    document.getElementById('closeExamsModalBtn')?.addEventListener('click', close);
    document.getElementById('closeExamsModalFooterBtn')?.addEventListener('click', close);
  },

  async renderScholarshipsModal(career) {
    const existing = document.getElementById('scholarshipsModal');
    if (existing) existing.remove();

    let scholarships = [];
    try {
      const res = await fetch('data/scholarships.json');
      scholarships = await res.json();
    } catch (e) {
      console.error(e);
    }

    const modal = document.createElement('div');
    modal.id = 'scholarshipsModal';
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(11, 19, 43, 0.7);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    `;

    modal.innerHTML = `
      <div class="card" style="max-width: 800px; width: 100%; max-height: 85vh; display: flex; flex-direction: column; padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
          <div>
            <span class="badge badge-primary">FINANCIAL AID & SUBSIDIES</span>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0 0;">
              Government & Foundation Scholarships
            </h3>
          </div>
          <button id="closeScholarshipsModalBtn" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer;">&times;</button>
        </div>

        <div style="overflow-y: auto; flex: 1; padding-right: 0.5rem; margin-bottom: 1rem;">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5;">
            Verified financial aid schemes applicable for Indian students pursuing professional degrees:
          </p>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${scholarships.slice(0, 6).map(s => `
              <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.15rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.5rem;">
                  <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin: 0;">
                    ${s.name}
                  </h4>
                  <span class="badge" style="background: #dcfce7; color: #166534; font-weight: 700;">
                    ${s.awardAmount || s.award || 'Financial Grant'}
                  </span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-subtle); margin-bottom: 0.4rem;">
                  Offered by: <strong>${s.provider || s.organization || 'Govt Authority'}</strong>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 0.75rem;">
                  ${s.eligibilitySummary || s.eligibility || 'Check specific criteria on portal.'}
                </p>
                ${s.portalUrl || s.applicationUrl ? `
                  <a href="${s.portalUrl || s.applicationUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs" style="font-size: 0.775rem;">
                    Apply on Official Portal ↗
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1rem;">
          <a href="scholarships.html" class="btn btn-outline btn-sm">View All Scholarships Directory</a>
          <button id="closeScholarshipsModalFooterBtn" class="btn btn-secondary btn-sm">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const close = () => modal.remove();
    document.getElementById('closeScholarshipsModalBtn')?.addEventListener('click', close);
    document.getElementById('closeScholarshipsModalFooterBtn')?.addEventListener('click', close);
  },

  saveRoadmapToProfile(career) {
    StorageService.toggleSaveCareer(career.id);
    
    // Show toast notification
    const existing = document.querySelector('.roadmap-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'roadmap-toast';
    toast.innerHTML = `
      <span style="font-size: 1.25rem;">🔖</span>
      <div>
        <strong style="display: block; font-size: 0.9rem;">Roadmap Saved!</strong>
        <span style="font-size: 0.8rem; color: #94a3b8;">Class ${this.selectedClass} roadmap for ${career.title || career.name} saved to your dashboard.</span>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);

    this.render();
  }
};
