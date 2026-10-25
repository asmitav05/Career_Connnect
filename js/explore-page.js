/**
 * Interactive Career Explorer & Comparison Controller
 * Live keyword search, 7 multi-criteria filters, 4 sort modes, dynamic counts,
 * and side-by-side career comparison across all 110 Indian careers.
 */

import { StorageService } from './storage.js';
import { Icons } from './icons.js';

export const ExplorePage = {
  careers: [],
  selectedCategory: 'All',
  selectedEducation: 'All',
  selectedWorkType: 'All',
  selectedSector: 'All',
  selectedExam: 'All',
  sortBy: 'az',
  searchQuery: '',
  compareList: [], // array of career IDs to compare (up to 3)

  async init() {
    try {
      const res = await fetch('data/careers.json');
      this.careers = await res.json();

      // Check URL search parameters
      const params = new URLSearchParams(window.location.search);
      if (params.get('category')) {
        this.selectedCategory = params.get('category');
      }
      if (params.get('search')) {
        this.searchQuery = params.get('search');
      }
      if (params.get('compare')) {
        const compId = params.get('compare');
        if (this.careers.some(c => c.id === compId)) {
          this.compareList.push(compId);
        }
      }

      this.render();

      window.addEventListener('careerpath:savedUpdated', () => this.renderCardsOnly());
    } catch (e) {
      console.error('Failed to load careers:', e);
      const container = document.getElementById('exploreMount');
      if (container) {
        container.innerHTML = `<div class="card" style="padding: 2rem; text-align: center;"><p>Failed to load careers database. Please refresh the page.</p></div>`;
      }
    }
  },

  resetFilters() {
    this.selectedCategory = 'All';
    this.selectedEducation = 'All';
    this.selectedWorkType = 'All';
    this.selectedSector = 'All';
    this.selectedExam = 'All';
    this.sortBy = 'az';
    this.searchQuery = '';
    this.render();
  },

  getFilteredCareers() {
    let list = this.careers.filter(c => {
      // Category filter
      if (this.selectedCategory !== 'All' && c.category !== this.selectedCategory) {
        return false;
      }
      // Education level filter
      if (this.selectedEducation !== 'All' && c.educationLevel !== this.selectedEducation) {
        return false;
      }
      // Work type filter
      if (this.selectedWorkType !== 'All' && c.workType !== this.selectedWorkType) {
        return false;
      }
      // Sector filter
      if (this.selectedSector !== 'All') {
        const sec = (c.sector || '').toLowerCase();
        if (this.selectedSector === 'Government' && !sec.includes('govt') && !sec.includes('government') && !sec.includes('psu') && !sec.includes('civil') && !sec.includes('defence')) {
          return false;
        }
        if (this.selectedSector === 'Private' && !sec.includes('private') && !sec.includes('corporate') && !sec.includes('commercial')) {
          return false;
        }
      }
      // Entrance Exam filter
      if (this.selectedExam !== 'All') {
        const exams = (c.entranceExams || []).map(e => e.toLowerCase());
        const target = this.selectedExam.toLowerCase();
        const hasExam = exams.some(e => e.includes(target));
        if (!hasExam) return false;
      }
      // Search query filter
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase().trim();
        const title = (c.title || c.name || '').toLowerCase();
        const summary = (c.summary || c.shortDescription || '').toLowerCase();
        const category = (c.category || '').toLowerCase();
        const qual = (c.qualification || c.minQualification || '').toLowerCase();
        const exams = (c.entranceExams || []).join(' ').toLowerCase();
        const skillsObj = c.skillsBreakdown || c.skills || {};
        const skillsText = [
          ...(skillsObj.beginner || []),
          ...(skillsObj.technical || []),
          ...(skillsObj.tools || [])
        ].join(' ').toLowerCase();

        const fullText = `${title} ${summary} ${category} ${qual} ${exams} ${skillsText}`;
        if (!fullText.includes(q)) return false;
      }
      return true;
    });

    // Sorting
    list.sort((a, b) => {
      const titleA = (a.title || a.name || '').toLowerCase();
      const titleB = (b.title || b.name || '').toLowerCase();

      if (this.sortBy === 'az') {
        return titleA.localeCompare(titleB);
      }
      if (this.sortBy === 'za') {
        return titleB.localeCompare(titleA);
      }
      if (this.sortBy === 'category') {
        return (a.category || '').localeCompare(b.category || '') || titleA.localeCompare(titleB);
      }
      if (this.sortBy === 'salary') {
        const parseSalary = (c) => {
          const s = (c.salaryDetails && c.salaryDetails.experienced) || (c.salary && c.salary.experienced && c.salary.experienced.range) || "10";
          const match = s.match(/(\d+(\.\d+)?)/);
          return match ? parseFloat(match[1]) : 0;
        };
        return parseSalary(b) - parseSalary(a);
      }
      return 0;
    });

    return list;
  },

  render() {
    const container = document.getElementById('exploreMount');
    if (!container) return;

    const filtered = this.getFilteredCareers();
    const totalCount = this.careers.length;
    const matchCount = filtered.length;

    // Categories list
    const categories = [
      'All',
      'Technology and Software',
      'Artificial Intelligence and Data',
      'Cybersecurity and Emerging Technology',
      'Engineering and Core Industries',
      'Medical and Healthcare',
      'Business, Finance and Management',
      'Design, Media and Creative Careers',
      'Government, Law and Public Services',
      'Education, Science and Research',
      'Agriculture, Commerce and Other Professions'
    ];

    container.innerHTML = `
      <div>
        <!-- Multi-Criteria Discovery Filter Panel -->
        <div class="card" style="margin-bottom: 2rem; padding: 1.75rem; border-top: 4px solid var(--primary);">
          
          <!-- Top Row: Search Input & Reset Button -->
          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.25rem;">
            <div style="flex: 1; min-width: 280px; position: relative;">
              <input 
                type="text" 
                id="exploreSearchInput" 
                class="form-input" 
                placeholder="Search by career title, qualification (e.g. B.Tech, MBBS), exams (JEE, NEET, UPSC), or skills..." 
                value="${this.searchQuery}"
                style="padding-left: 2.5rem; height: 46px; font-size: 0.95rem;"
              >
              <span style="position: absolute; left: 1rem; top: 13px; color: var(--text-subtle);">
                ${Icons.get('sparkles')}
              </span>
            </div>

            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <select id="exploreSortSelect" class="form-input" style="height: 46px; width: auto; font-size: 0.875rem;">
                <option value="az" ${this.sortBy === 'az' ? 'selected' : ''}>Sort: Alphabetical (A-Z)</option>
                <option value="za" ${this.sortBy === 'za' ? 'selected' : ''}>Sort: Alphabetical (Z-A)</option>
                <option value="category" ${this.sortBy === 'category' ? 'selected' : ''}>Sort: By Category</option>
                <option value="salary" ${this.sortBy === 'salary' ? 'selected' : ''}>Sort: Highest Experienced Salary</option>
              </select>

              <button id="exploreResetBtn" class="btn btn-secondary" style="height: 46px; font-size: 0.875rem;" title="Reset all applied filters">
                Reset
              </button>
            </div>
          </div>

          <!-- Secondary Filters Row (Education Level, Work Type, Sector, Key Exams) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem; font-size: 0.85rem;">
            <div>
              <label style="display: block; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">Education Level</label>
              <select id="filterEducationSelect" class="form-input" style="font-size: 0.825rem; height: 38px;">
                <option value="All" ${this.selectedEducation === 'All' ? 'selected' : ''}>All Levels</option>
                <option value="Undergraduate" ${this.selectedEducation === 'Undergraduate' ? 'selected' : ''}>Undergraduate (UG)</option>
                <option value="Postgraduate" ${this.selectedEducation === 'Postgraduate' ? 'selected' : ''}>Postgraduate (PG)</option>
                <option value="Doctorate" ${this.selectedEducation === 'Doctorate' ? 'selected' : ''}>Doctorate / Ph.D.</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">Work Interest Type</label>
              <select id="filterWorkTypeSelect" class="form-input" style="font-size: 0.825rem; height: 38px;">
                <option value="All" ${this.selectedWorkType === 'All' ? 'selected' : ''}>All Work Types</option>
                <option value="Technical" ${this.selectedWorkType === 'Technical' ? 'selected' : ''}>Technical</option>
                <option value="Analytical" ${this.selectedWorkType === 'Analytical' ? 'selected' : ''}>Analytical</option>
                <option value="Creative" ${this.selectedWorkType === 'Creative' ? 'selected' : ''}>Creative</option>
                <option value="People-Oriented" ${this.selectedWorkType === 'People-Oriented' ? 'selected' : ''}>People-Oriented</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">Employment Sector</label>
              <select id="filterSectorSelect" class="form-input" style="font-size: 0.825rem; height: 38px;">
                <option value="All" ${this.selectedSector === 'All' ? 'selected' : ''}>All Sectors</option>
                <option value="Government" ${this.selectedSector === 'Government' ? 'selected' : ''}>Government & PSU</option>
                <option value="Private" ${this.selectedSector === 'Private' ? 'selected' : ''}>Private & Corporate</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">Indian Entrance Examination</label>
              <select id="filterExamSelect" class="form-input" style="font-size: 0.825rem; height: 38px;">
                <option value="All" ${this.selectedExam === 'All' ? 'selected' : ''}>All Examinations</option>
                <option value="JEE" ${this.selectedExam === 'JEE' ? 'selected' : ''}>JEE Main / Advanced</option>
                <option value="NEET" ${this.selectedExam === 'NEET' ? 'selected' : ''}>NEET-UG</option>
                <option value="UPSC" ${this.selectedExam === 'UPSC' ? 'selected' : ''}>UPSC Civil Services</option>
                <option value="GATE" ${this.selectedExam === 'GATE' ? 'selected' : ''}>GATE</option>
                <option value="CAT" ${this.selectedExam === 'CAT' ? 'selected' : ''}>CAT / Management</option>
                <option value="CLAT" ${this.selectedExam === 'CLAT' ? 'selected' : ''}>CLAT / Law</option>
                <option value="CUET" ${this.selectedExam === 'CUET' ? 'selected' : ''}>CUET-UG / PG</option>
              </select>
            </div>
          </div>

          <!-- Industry Categories Pill Bar -->
          <div style="border-top: 1px solid var(--border-light); padding-top: 1rem;">
            <div style="font-size: 0.775rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle); margin-bottom: 0.6rem;">
              Filter by Industry Category:
            </div>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              ${categories.map(cat => `
                <button 
                  class="btn btn-sm ${this.selectedCategory === cat ? 'btn-primary' : 'btn-secondary'} category-filter-btn" 
                  data-category="${cat}"
                  style="font-size: 0.775rem; padding: 0.3rem 0.65rem;"
                >
                  ${cat}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Dynamic Counter & Active Comparison Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div style="font-size: 1rem; color: var(--text-main); font-weight: 700;">
            Showing <span style="color: var(--primary);">${matchCount}</span> of ${totalCount} verified Indian careers
            ${this.selectedCategory !== 'All' ? `<span style="font-weight: 400; color: var(--text-muted);">in <em>${this.selectedCategory}</em></span>` : ''}
          </div>

          <!-- Compare Floating Bar Trigger -->
          ${this.compareList.length > 0 ? `
            <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 0.4rem 0.85rem; border-radius: var(--radius-md); display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 0.825rem; font-weight: 700; color: var(--primary);">
                Comparing (${this.compareList.length}/3 careers):
              </span>
              <button id="openCompareModalBtn" class="btn btn-primary btn-sm" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;">
                View Side-by-Side Comparison
              </button>
              <button id="clearCompareBtn" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;" title="Clear selected careers">
                Clear
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Career Cards Grid Mount -->
        <div id="cardsGridMount" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 1.5rem; margin-bottom: 4rem;">
          ${this.renderCardList(filtered)}
        </div>

        <!-- Comparison Modal Mount -->
        <div id="compareModalMount"></div>
      </div>
    `;

    this.bindEvents(container);
  },

  renderCardList(list) {
    if (list.length === 0) {
      return `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 2rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--primary);">🔍</div>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
            No careers match your selected filters
          </h3>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
            Try adjusting search keywords, clearing specific examination requirements, or setting the category to "All".
          </p>
          <button id="emptyResetBtn" class="btn btn-primary">
            Reset All Filters
          </button>
        </div>
      `;
    }

    const savedIds = StorageService.getSavedCareers();

    return list.map(c => {
      const isSaved = savedIds.includes(c.id);
      const isComparing = this.compareList.includes(c.id);
      const title = c.title || c.name;
      const summary = c.summary || c.shortDescription || "";
      const salaryStr = (c.salaryDetails && c.salaryDetails.entryLevel) || (c.salary && c.salary.entry && c.salary.entry.formatted) || "₹3.5L - ₹6.5L LPA";
      const qualification = c.qualification || c.minQualification || "Bachelor's Degree";
      const workType = c.workType || "Technical";
      const duration = (c.educationPathways && c.educationPathways[0] && c.educationPathways[0].duration) || (c.entryRoutes && c.entryRoutes[0] && c.entryRoutes[0].duration) || "3-4 Years";

      return `
        <div class="card career-card" style="display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid var(--primary); transition: transform 0.2s, box-shadow 0.2s;">
          <div>
            <!-- Top Badges Row -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.65rem;">
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                <span class="badge badge-primary" style="font-size: 0.7rem;">${c.categoryCode ? `Cat ${c.categoryCode}: ` : ''}${c.category}</span>
                <span class="badge" style="background: #f1f5f9; color: #475569; font-size: 0.675rem;">${workType}</span>
              </div>
              <button class="modal-close toggle-save-career-btn" data-id="${c.id}" title="${isSaved ? 'Remove from saved' : 'Save career'}" style="color: ${isSaved ? 'var(--primary)' : 'var(--text-subtle)'};">
                ${isSaved ? Icons.get('bookmarkFilled') : Icons.get('bookmark')}
              </button>
            </div>

            <!-- Title -->
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); line-height: 1.3; margin-bottom: 0.45rem;">
              <a href="career.html?id=${c.id}" style="color: var(--text-main); text-decoration: none;">
                ${title}
              </a>
            </h3>

            <!-- Short Summary -->
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.85rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              ${summary}
            </p>

            <!-- Key Indian Qualification & Duration Pill -->
            <div style="background: var(--bg-subtle); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.775rem; color: var(--text-muted); margin-bottom: 0.85rem;">
              <div><strong>Route:</strong> ${qualification} (${duration})</div>
              <div style="margin-top: 0.2rem; color: #059669;"><strong>Indicative Entry Pay:</strong> ${salaryStr}</div>
            </div>
          </div>

          <div>
            <!-- Action Buttons Row -->
            <div style="display: flex; gap: 0.4rem; margin-top: 0.5rem;">
              <a href="career.html?id=${c.id}" class="btn btn-primary btn-sm" style="flex: 1; justify-content: center; font-size: 0.8rem; padding: 0.45rem 0.6rem;">
                Detailed Guide
              </a>
              <a href="roadmaps.html?career=${c.id}" class="btn btn-secondary btn-sm" style="justify-content: center; font-size: 0.8rem; padding: 0.45rem 0.6rem;" title="View customized learning roadmap">
                ${Icons.get('map')} Roadmap
              </a>
              <button class="btn ${isComparing ? 'btn-primary' : 'btn-outline'} btn-sm toggle-compare-btn" data-id="${c.id}" style="font-size: 0.75rem; padding: 0.45rem 0.5rem;" title="Compare this career with others">
                ${isComparing ? '✓ Comparing' : '+ Compare'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderCardsOnly() {
    const mount = document.getElementById('cardsGridMount');
    if (!mount) return;
    const filtered = this.getFilteredCareers();
    mount.innerHTML = this.renderCardList(filtered);
    this.bindCardEvents();
  },

  bindEvents(container) {
    // Search input
    const searchInput = document.getElementById('exploreSearchInput');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderCardsOnly();
    });

    // Sort select
    const sortSelect = document.getElementById('exploreSortSelect');
    sortSelect?.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.renderCardsOnly();
    });

    // Reset button
    document.getElementById('exploreResetBtn')?.addEventListener('click', () => {
      this.resetFilters();
    });
    document.getElementById('emptyResetBtn')?.addEventListener('click', () => {
      this.resetFilters();
    });

    // Education select
    document.getElementById('filterEducationSelect')?.addEventListener('change', (e) => {
      this.selectedEducation = e.target.value;
      this.renderCardsOnly();
    });

    // Work type select
    document.getElementById('filterWorkTypeSelect')?.addEventListener('change', (e) => {
      this.selectedWorkType = e.target.value;
      this.renderCardsOnly();
    });

    // Sector select
    document.getElementById('filterSectorSelect')?.addEventListener('change', (e) => {
      this.selectedSector = e.target.value;
      this.renderCardsOnly();
    });

    // Exam select
    document.getElementById('filterExamSelect')?.addEventListener('change', (e) => {
      this.selectedExam = e.target.value;
      this.renderCardsOnly();
    });

    // Category buttons
    container.querySelectorAll('.category-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedCategory = e.currentTarget.getAttribute('data-category');
        this.render();
      });
    });

    // Compare modal trigger
    document.getElementById('openCompareModalBtn')?.addEventListener('click', () => {
      this.openCompareModal();
    });

    // Clear compare list
    document.getElementById('clearCompareBtn')?.addEventListener('click', () => {
      this.compareList = [];
      this.render();
    });

    this.bindCardEvents();
  },

  bindCardEvents() {
    const container = document.getElementById('exploreMount');
    if (!container) return;

    // Save bookmark buttons
    container.querySelectorAll('.toggle-save-career-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        StorageService.toggleSaveCareer(id);
        this.renderCardsOnly();
      });
    });

    // Compare toggle buttons
    container.querySelectorAll('.toggle-compare-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (this.compareList.includes(id)) {
          this.compareList = this.compareList.filter(item => item !== id);
        } else {
          if (this.compareList.length >= 3) {
            alert('You can compare a maximum of 3 careers simultaneously. Please deselect one first.');
            return;
          }
          this.compareList.push(id);
        }
        this.render();
      });
    });
  },

  openCompareModal() {
    const mount = document.getElementById('compareModalMount');
    if (!mount) return;

    const selectedCareers = this.compareList.map(id => this.careers.find(c => c.id === id)).filter(Boolean);
    if (selectedCareers.length === 0) return;

    mount.innerHTML = `
      <div class="modal-backdrop" id="compareModalBackdrop" style="display: flex; align-items: center; justify-content: center; z-index: 9999; position: fixed; inset: 0; background: rgba(11, 19, 43, 0.7); padding: 1.5rem;">
        <div class="modal-content" style="max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto; background: #fff; border-radius: var(--radius-lg); padding: 2rem;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem;">
            <div>
              <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0;">
                Side-by-Side Career Comparison
              </h2>
              <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0.25rem 0 0;">
                Comparing ${selectedCareers.length} Indian career pathways
              </p>
            </div>
            <button id="closeCompareModalBtn" class="btn btn-secondary btn-sm" style="font-size: 1.1rem; line-height: 1;">
              ✕
            </button>
          </div>

          <!-- Comparison Table -->
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
              <thead>
                <tr style="background: var(--bg-subtle); border-bottom: 2px solid var(--border-light);">
                  <th style="padding: 1rem; width: 180px; color: var(--text-subtle); font-size: 0.775rem; text-transform: uppercase;">Feature</th>
                  ${selectedCareers.map(c => `
                    <th style="padding: 1rem; min-width: 240px; color: var(--text-main); font-size: 1.1rem; font-weight: 800;">
                      ${c.title || c.name}
                      <div style="font-size: 0.75rem; font-weight: 400; color: var(--primary); margin-top: 0.25rem;">
                        ${c.category}
                      </div>
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                <!-- Minimum Qualification -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--text-main); background: #fafafa;">Minimum Qualification</td>
                  ${selectedCareers.map(c => `
                    <td style="padding: 0.85rem 1rem; color: var(--text-muted);">
                      ${c.qualification || c.minQualification || "Bachelor's Degree"}
                    </td>
                  `).join('')}
                </tr>

                <!-- Work Type -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--text-main); background: #fafafa;">Work Interest Type</td>
                  ${selectedCareers.map(c => `
                    <td style="padding: 0.85rem 1rem; color: var(--text-muted);">
                      <span class="badge" style="background: #eef2ff; color: var(--primary); font-weight: 600;">
                        ${c.workType || 'Technical'}
                      </span>
                    </td>
                  `).join('')}
                </tr>

                <!-- Employment Sector -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--text-main); background: #fafafa;">Sector</td>
                  ${selectedCareers.map(c => `
                    <td style="padding: 0.85rem 1rem; color: var(--text-muted);">
                      ${c.sector || 'Government & Private'}
                    </td>
                  `).join('')}
                </tr>

                <!-- Key Entrance Exams -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--text-main); background: #fafafa;">Entrance Exams</td>
                  ${selectedCareers.map(c => `
                    <td style="padding: 0.85rem 1rem; color: var(--text-muted);">
                      ${(c.entranceExams && c.entranceExams.length) ? c.entranceExams.slice(0, 3).join(', ') : 'Direct / Merit-Based'}
                    </td>
                  `).join('')}
                </tr>

                <!-- Indicative Entry Salary -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--text-main); background: #fafafa;">Entry-Level Pay</td>
                  ${selectedCareers.map(c => `
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #059669;">
                      ${(c.salaryDetails && c.salaryDetails.entryLevel) || (c.salary && c.salary.entry && c.salary.entry.formatted) || '₹3.5L - ₹6.5L LPA'}
                    </td>
                  `).join('')}
                </tr>

                <!-- Indicative Experienced Salary -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--text-main); background: #fafafa;">Experienced Pay</td>
                  ${selectedCareers.map(c => `
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #7c3aed;">
                      ${(c.salaryDetails && c.salaryDetails.experienced) || (c.salary && c.salary.experienced && c.salary.experienced.formatted) || '₹16L - ₹30L+ LPA'}
                    </td>
                  `).join('')}
                </tr>

                <!-- Typical Workplace -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--text-main); background: #fafafa;">Typical Workplace</td>
                  ${selectedCareers.map(c => `
                    <td style="padding: 0.85rem 1rem; color: var(--text-muted); font-size: 0.825rem;">
                      ${c.workplace || c.typicalWorkplace || 'Offices, Facilities, Field'}
                    </td>
                  `).join('')}
                </tr>

                <!-- Action Links -->
                <tr>
                  <td style="padding: 1.25rem 1rem; background: #fafafa;">Actions</td>
                  ${selectedCareers.map(c => `
                    <td style="padding: 1.25rem 1rem;">
                      <a href="career.html?id=${c.id}" class="btn btn-primary btn-sm" style="width: 100%; justify-content: center; margin-bottom: 0.4rem;">
                        View Guide
                      </a>
                      <a href="roadmaps.html?career=${c.id}" class="btn btn-secondary btn-sm" style="width: 100%; justify-content: center;">
                        ${Icons.get('map')} Roadmap
                      </a>
                    </td>
                  `).join('')}
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    `;

    document.getElementById('closeCompareModalBtn')?.addEventListener('click', () => {
      mount.innerHTML = '';
    });
    document.getElementById('compareModalBackdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'compareModalBackdrop') {
        mount.innerHTML = '';
      }
    });
  }
};
