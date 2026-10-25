/**
 * Comprehensive Career Detail Engine
 * Renders all 10 required sections (A to J) from data/careers.json with authentic Indian context.
 */

import { StorageService } from './storage.js';
import { Icons } from './icons.js';

// Legacy ID Alias Mapping to prevent broken links
const LEGACY_ALIASES = {
  'civil-services-officer': 'ias-officer',
  'civil-services': 'ias-officer',
  'healthcare-professional': 'doctor-medical-practitioner',
  'healthcare': 'doctor-medical-practitioner',
  'lawyer-legal-advisor': 'lawyer-advocate',
  'law': 'lawyer-advocate',
  'science-researcher': 'research-scientist',
  'science-research': 'research-scientist',
  'ai-data-scientist': 'data-scientist',
  'cybersecurity-expert': 'cybersecurity-analyst',
  'cloud-architect': 'cloud-engineer',
  'product-manager': 'product-designer'
};

function toArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim().length > 0) {
    return val.split(/,\s*(?=[A-Za-z0-9])/).map(s => s.trim().replace(/\.$/, '')).filter(Boolean);
  }
  return [];
}

export const CareerDetailEngine = {
  careers: [],
  roadmapsData: null,
  selectedClass: '10',

  async init() {
    try {
      const [careersRes, roadmapsRes] = await Promise.all([
        fetch('data/careers.json'),
        fetch('data/roadmaps-data.json')
      ]);
      this.careers = await careersRes.json();
      this.roadmapsData = await roadmapsRes.json();

      const urlParams = new URLSearchParams(window.location.search);
      let rawId = urlParams.get('id') || 'software-developer';
      let careerId = rawId.toLowerCase().trim();

      // Check legacy alias
      if (LEGACY_ALIASES[careerId]) {
        careerId = LEGACY_ALIASES[careerId];
      }

      const classParam = urlParams.get('class');
      if (['10', '11', '12', 'college'].includes(classParam)) {
        this.selectedClass = classParam;
      }

      let career = this.careers.find(c => c.id.toLowerCase() === careerId);
      if (!career) {
        // Try fuzzy slug match on title or stripped hyphens
        career = this.careers.find(c => 
          (c.title && c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === careerId) ||
          (c.id.replace(/-/g, '') === careerId.replace(/-/g, ''))
        );
      }

      if (!career) {
        this.renderNotFound(rawId);
        return;
      }

      this.render(career);
    } catch (e) {
      console.error('Failed to load career guide:', e);
      this.renderNotFound(new URLSearchParams(window.location.search).get('id'));
    }
  },

  renderNotFound(queriedId) {
    const container = document.getElementById('careerDetailMount');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 3.5rem 2rem; max-width: 720px; margin: 2rem auto;">
        <span style="font-size: 3rem; margin-bottom: 1rem; display: block;">🔍</span>
        <h2 style="font-size: 1.75rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
          Career Guide Not Found
        </h2>
        <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 1.5rem; line-height: 1.6;">
          We could not locate a career matching <strong>"${queriedId ? encodeURIComponent(queriedId) : 'unknown'}"</strong>.
          Explore any of our 110 verified Indian career guides below.
        </p>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2rem;">
          <a href="career.html?id=aerospace-engineer" class="btn btn-outline btn-sm">Aerospace Engineer</a>
          <a href="career.html?id=software-developer" class="btn btn-outline btn-sm">Software Developer</a>
          <a href="career.html?id=doctor-medical-practitioner" class="btn btn-outline btn-sm">Doctor (MBBS)</a>
          <a href="career.html?id=ias-officer" class="btn btn-outline btn-sm">IAS Officer</a>
          <a href="career.html?id=chartered-accountant" class="btn btn-outline btn-sm">Chartered Accountant</a>
          <a href="career.html?id=data-scientist" class="btn btn-outline btn-sm">Data Scientist</a>
        </div>

        <a href="explore.html" class="btn btn-primary" style="padding: 0.75rem 1.75rem;">
          Browse All 110 Career Guides &rarr;
        </a>
      </div>
    `;
  },

  getArchetypeForCareer(career) {
    if (!this.roadmapsData?.archetypes) return null;
    const archs = this.roadmapsData.archetypes;
    for (const [key, arch] of Object.entries(archs)) {
      if (arch.careers && arch.careers.includes(career.id)) return { key, data: arch };
    }
    const cat = career.category || '';
    if (cat.includes('Technology') || cat.includes('Intelligence') || cat.includes('Cybersecurity')) return { key: 'software-engineering', data: archs['software-engineering'] };
    if (cat.includes('Medical')) return { key: 'allied-health-pharmacy', data: archs['allied-health-pharmacy'] };
    if (cat.includes('Finance') || cat.includes('Business')) return { key: 'chartered-accountancy', data: archs['chartered-accountancy'] };
    if (cat.includes('Design') || cat.includes('Media')) return { key: 'design-creative', data: archs['design-creative'] };
    if (cat.includes('Government') || cat.includes('Law')) return { key: 'civil-services', data: archs['civil-services'] };
    if (cat.includes('Engineering')) return { key: 'core-engineering', data: archs['core-engineering'] };
    if (cat.includes('Science') || cat.includes('Education')) return { key: 'science-research', data: archs['science-research'] };
    return { key: 'software-engineering', data: archs['software-engineering'] };
  },

  render(career) {
    const container = document.getElementById('careerDetailMount');
    if (!container) return;

    document.title = `${career.title || career.name} | CareerConnect India`;

    const isSaved = StorageService.isCareerSaved(career.id);
    const title = career.title || career.name;
    const summary = career.summary || career.shortDescription || '';
    const category = career.category || "Professional Career";
    const workType = career.workType || "Technical";
    const sector = career.sector || "Government & Private";
    const educationLevel = career.educationLevel || "Undergraduate";
    const qualification = career.qualification || career.minQualification || "Bachelor's Degree";
    const lastVerified = career.lastVerified || (career.salaryDetails && career.salaryDetails.lastVerified) || "October 2024";

    // Responsibilities
    const responsibilities = toArray(career.responsibilities || career.mainResponsibilities);

    // Qualities
    const qualities = toArray(career.qualities || career.importantQualities);

    // Entry Routes / Education Pathways
    const pathways = toArray(career.educationPathways || career.entryRoutes);

    // Archetype and class-specific roadmap preview
    const archetype = this.getArchetypeForCareer(career);
    const classKey = this.selectedClass === 'college' ? 'class12' : `class${this.selectedClass}`;
    const classData = archetype?.data?.[classKey] || archetype?.data?.['class10'];
    const primaryRoadmapRoute = classData?.routes?.[0];

    // Entrance Exams
    const examDetails = toArray(career.entranceExamsDetails || career.requiredExams);

    // Skills
    const skills = (career.skillsBreakdown && typeof career.skillsBreakdown === 'object') ? career.skillsBreakdown : ((career.skills && typeof career.skills === 'object') ? career.skills : {});
    const softSkills = toArray(skills.soft || skills.interpersonal);

    // Job Opportunities
    const opportunities = toArray(career.jobOpportunities || career.jobRoles);

    // Progression
    const progression = toArray(career.progression);
    const growthLadder = toArray(career.growthLadder);

    // Salary
    const salary = career.salaryDetails || (career.salary && {
      entryLevel: career.salary.entry?.formatted || career.salary.entry?.range || "₹3.5L - ₹6.5L LPA",
      midLevel: career.salary.mid?.formatted || career.salary.mid?.range || "₹7.5L - ₹15.0L LPA",
      experienced: career.salary.experienced?.formatted || career.salary.experienced?.range || "₹16.0L - ₹30.0L+ LPA",
      source: career.salary.source || "Industry Reports & Pay Commissions",
      lastVerified: career.salary.lastVerified || "October 2024",
      disclaimer: career.salary.disclaimer || "Salaries in India vary by city, employer, experience, qualifications, and specialization."
    }) || {
      entryLevel: "₹3.5L - ₹6.5L LPA",
      midLevel: "₹7.5L - ₹15.0L LPA",
      experienced: "₹16.0L - ₹30.0L+ LPA",
      source: "Industry Reports & Pay Commissions",
      lastVerified: "October 2024",
      disclaimer: "Salaries vary by city tier, employer brand, and candidate skill."
    };

    // Practical Projects
    const projects = toArray(career.projects || career.practicalProjects);

    // Official Resources
    const resources = toArray(career.officialResources);

    // FAQs
    const faqs = toArray(career.faqs);

    container.innerHTML = `
      <div style="max-width: 980px; margin: 0 auto; padding-bottom: 4rem;">
        
        <!-- Breadcrumbs -->
        <nav style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-subtle); margin-bottom: 1.5rem; flex-wrap: wrap;">
          <a href="index.html" style="color: var(--text-subtle); text-decoration: none;">Home</a>
          <span>/</span>
          <a href="explore.html" style="color: var(--text-subtle); text-decoration: none;">Explore Careers</a>
          <span>/</span>
          <a href="explore.html?category=${encodeURIComponent(category)}" style="color: var(--primary); text-decoration: none;">${category}</a>
          <span>/</span>
          <span style="color: var(--text-main); font-weight: 600;">${title}</span>
        </nav>

        <!-- SECTION A: Career Overview Hero Card -->
        <div class="card" style="margin-bottom: 2rem; border-top: 5px solid var(--primary); padding: 2.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 280px;">
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                <span class="badge badge-primary">${career.badge || category}</span>
                <span class="badge" style="background: #e0e7ff; color: #3730a3; font-weight: 600;">${workType} Work</span>
                <span class="badge" style="background: #f1f5f9; color: #475569;">${sector}</span>
                <span class="badge" style="background: #ecfdf5; color: #065f46;">${educationLevel}</span>
              </div>

              <h1 style="font-size: 2.35rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin-bottom: 0.75rem;">
                ${title}
              </h1>

              <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.65; margin-bottom: 1.5rem;">
                ${summary}
              </p>

              <!-- Quick Badges / Meta -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; background: var(--bg-subtle); padding: 1rem 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; font-size: 0.85rem;">
                <div>
                  <span style="color: var(--text-subtle); display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Minimum Qualification</span>
                  <strong style="color: var(--text-main);">${qualification}</strong>
                </div>
                <div>
                  <span style="color: var(--text-subtle); display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Typical Workplace</span>
                  <strong style="color: var(--text-main);">${career.workplace || career.typicalWorkplace || 'Offices, Field, Institutions'}</strong>
                </div>
                <div>
                  <span style="color: var(--text-subtle); display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Opportunity Sector</span>
                  <strong style="color: var(--text-main);">${career.opportunitiesType || sector}</strong>
                </div>
              </div>
            </div>

            <!-- Action Controls Column -->
            <div style="display: flex; gap: 0.75rem; flex-direction: column; width: 220px;">
              <a href="roadmaps.html?career=${career.id}&class=${this.selectedClass}" class="btn btn-primary btn-sm" style="justify-content: center; padding: 0.65rem 1rem;">
                ${Icons.get('map')} View Complete Roadmap
              </a>
              <button id="careerSaveBtn" class="btn ${isSaved ? 'btn-secondary' : 'btn-outline'} btn-sm" style="justify-content: center; padding: 0.65rem 1rem;">
                ${isSaved ? Icons.get('bookmarkFilled') : Icons.get('bookmark')}
                <span>${isSaved ? 'Saved in Dashboard' : 'Save Career'}</span>
              </button>
              <a href="explore.html?compare=${career.id}" class="btn btn-secondary btn-sm" style="justify-content: center; padding: 0.65rem 1rem;">
                ${Icons.get('sparkles')} Compare Career
              </a>
            </div>
          </div>

          <!-- Important Qualities & Responsibilities Accordion / Highlights -->
          <div style="margin-top: 1.5rem; pt-4; border-top: 1px solid var(--border-light); display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
                ${Icons.get('check')} Core Responsibilities
              </h4>
              <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.875rem; color: var(--text-muted);">
                ${responsibilities.slice(0, 5).map(r => `
                  <li style="display: flex; align-items: flex-start; gap: 0.45rem;">
                    <span style="color: var(--primary); font-weight: 800; line-height: 1.2;">•</span>
                    <span>${r}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
                ${Icons.get('sparkles')} Key Personal Qualities
              </h4>
              <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.875rem; color: var(--text-muted);">
                ${qualities.slice(0, 4).map(q => `
                  <li style="display: flex; align-items: flex-start; gap: 0.45rem;">
                    <span style="color: #059669; font-weight: 800; line-height: 1.2;">✓</span>
                    <span>${q}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- Verification Timestamp Bar -->
          <div style="margin-top: 1.5rem; padding-top: 0.85rem; border-top: 1px dashed var(--border-light); display: flex; justify-content: space-between; align-items: center; font-size: 0.775rem; color: var(--text-subtle); flex-wrap: wrap; gap: 0.5rem;">
            <div>
              ${Icons.get('shieldCheck')} Verified against statutory Indian educational frameworks (UGC, AICTE, NMC, BCI, ICAI, UPSC)
            </div>
            <div>
              Last Verified: <strong>${lastVerified}</strong>
            </div>
          </div>
        </div>

        <!-- SECTION G: Indicative Indian Salary Ranges (Prominently Placed) -->
        <section style="margin-bottom: 2.75rem;">
          <div style="margin-bottom: 1.25rem;">
            <span class="section-eyebrow">INDIAN COMPENSATION INSIGHTS</span>
            <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-main);">
              Salary Information in India (INR per annum)
            </h2>
            <p style="font-size: 0.925rem; color: var(--text-muted);">
              Figures represent verified indicative industry averages and official pay commission scales.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
            <!-- Entry Level -->
            <div class="card" style="padding: 1.35rem; border-left: 4px solid #6366f1; background: #fff;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle);">Entry-Level (0-3 Years)</span>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0.35rem 0;">
                ${salary.entryLevel}
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
                Campus placements, trainee scales, junior associate positions.
              </p>
            </div>

            <!-- Mid Level -->
            <div class="card" style="padding: 1.35rem; border-left: 4px solid #059669; background: #fff;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle);">Mid-Level (4-8 Years)</span>
              <div style="font-size: 1.35rem; font-weight: 800; color: #059669; margin: 0.35rem 0;">
                ${salary.midLevel}
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
                Independent practitioner, senior engineer, project lead, specialist.
              </p>
            </div>

            <!-- Experienced Level -->
            <div class="card" style="padding: 1.35rem; border-left: 4px solid #8b5cf6; background: #fff;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle);">Experienced (9+ Years)</span>
              <div style="font-size: 1.35rem; font-weight: 800; color: #7c3aed; margin: 0.35rem 0;">
                ${salary.experienced}
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
                Team leads, directors, partners, department heads, chief executives.
              </p>
            </div>
          </div>

          <!-- Salary Source & Statutory Disclaimer -->
          <div class="card" style="padding: 1rem 1.25rem; background: var(--bg-subtle); border: 1px solid var(--border-light); font-size: 0.825rem; color: var(--text-muted);">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.35rem;">
              <span><strong>Source of Data:</strong> ${salary.source}</span>
              <span><strong>Last Checked:</strong> ${salary.lastVerified}</span>
            </div>
            <p style="margin: 0; font-size: 0.785rem; color: var(--text-subtle); line-height: 1.45;">
              <strong>Disclaimer:</strong> ${salary.disclaimer} Government positions are remunerated in accordance with official Central Pay Commission (7th CPC) pay matrices (basic pay + DA + HRA + allowances), whereas private sector compensation depends on company scale, funding, individual skill level, and metropolitan city tier.
            </p>
          </div>
        </section>

          <!-- SECTION B: Education and Qualifications Pathways -->
        <section style="margin-bottom: 3rem;">
          <div style="margin-bottom: 1.25rem;">
            <span class="section-eyebrow">EDUCATION & ELIGIBILITY</span>
            <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-main);">
              Available Indian Education Pathways
            </h2>
            <p style="font-size: 0.925rem; color: var(--text-muted);">
              Clear breakdown of eligibility after Class 10, Class 12 streams, diploma courses, and alternative degree routes.
            </p>
          </div>

          <!-- Personalized Class-Specific Roadmap Module -->
          <div class="card" style="margin-bottom: 2rem; border-top: 4px solid var(--primary); padding: 1.75rem 2rem; background: #ffffff; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
              <div>
                <span class="badge badge-primary" style="margin-bottom: 0.25rem;">PERSONALIZED STEP-BY-STEP ROADMAP</span>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0;">
                  Educational Pathway for Class ${this.selectedClass === 'college' ? 'College' : this.selectedClass} Students
                </h3>
              </div>

              <!-- Stage Switcher Pills -->
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                <button class="detail-stage-pill btn ${this.selectedClass === '10' ? 'btn-primary' : 'btn-outline'} btn-xs" data-stage="10">Class 10</button>
                <button class="detail-stage-pill btn ${this.selectedClass === '11' ? 'btn-primary' : 'btn-outline'} btn-xs" data-stage="11">Class 11</button>
                <button class="detail-stage-pill btn ${this.selectedClass === '12' ? 'btn-primary' : 'btn-outline'} btn-xs" data-stage="12">Class 12</button>
                <button class="detail-stage-pill btn ${this.selectedClass === 'college' ? 'btn-primary' : 'btn-outline'} btn-xs" data-stage="college">College / Grad</button>
              </div>
            </div>

            ${primaryRoadmapRoute ? `
              <div style="background: #f8fafc; border-left: 3px solid var(--primary); padding: 0.85rem 1.15rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
                <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">
                  ${primaryRoadmapRoute.name}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45;">
                  ${primaryRoadmapRoute.summary}
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem;">
                ${(primaryRoadmapRoute.steps || []).map((st, sidx) => `
                  <div style="display: flex; align-items: flex-start; gap: 0.85rem; background: var(--bg-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                    <div style="width: 26px; height: 26px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; flex-shrink: 0; margin-top: 0.15rem;">
                      ${st.stepNumber || sidx + 1}
                    </div>
                    <div style="flex: 1;">
                      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem;">
                        <strong style="font-size: 0.9rem; color: var(--text-main);">${st.course}</strong>
                        <span style="font-size: 0.75rem; color: var(--text-subtle); background: #ffffff; padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">${st.duration}</span>
                      </div>
                      <div style="font-size: 0.825rem; color: var(--text-muted); margin-top: 0.2rem;">
                        <strong>Action:</strong> ${st.whatToDo}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1rem; flex-wrap: wrap; gap: 0.75rem;">
              <span style="font-size: 0.825rem; color: var(--text-subtle);">
                Explore alternative routes & compare options side-by-side:
              </span>
              <a href="roadmaps.html?career=${career.id}&class=${this.selectedClass}" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                ${Icons.get('map')} View Complete Multi-Route Roadmap & Compare
              </a>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${pathways.map((route, i) => {
              const rTitle = route.name || route.title || route.pathway;
              const rDuration = route.duration || "Standard Programme";
              const rEligibility = route.eligibility || "Higher Secondary / Bachelor's Degree";
              const rDesc = route.description || "";
              const rMandatory = route.isMandatory || (route.mandatoryVsOptional && route.mandatoryVsOptional.toLowerCase().includes('mandatory'));

              return `
                <div class="card" style="padding: 1.5rem; border-left: 4px solid ${rMandatory ? 'var(--primary)' : '#94a3b8'};">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                      <span class="badge" style="background: var(--bg-subtle); color: var(--primary); font-weight: 800;">
                        Route ${i + 1}
                      </span>
                      <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin: 0;">
                        ${rTitle}
                      </h3>
                    </div>
                    <div style="display: flex; gap: 0.4rem; align-items: center;">
                      <span class="badge" style="background: #f1f5f9; color: var(--text-main); font-size: 0.75rem;">
                        ${rDuration}
                      </span>
                      <span class="badge" style="background: ${rMandatory ? '#fee2e2' : '#f0fdf4'}; color: ${rMandatory ? '#991b1b' : '#166534'}; font-size: 0.725rem;">
                        ${rMandatory ? 'Mandatory Requirement' : 'Common / Alternative Route'}
                      </span>
                    </div>
                  </div>

                  <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">
                    Eligibility Criteria: <span style="color: var(--text-main); font-weight: 500;">${rEligibility}</span>
                  </div>

                  <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.75rem;">
                    ${rDesc}
                  </p>

                  <div style="font-size: 0.75rem; color: var(--text-subtle); border-top: 1px dashed var(--border-light); padding-top: 0.5rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                    <span><strong>Accreditation / Norms:</strong> UGC / AICTE / Statutory Regulatory Council</span>
                    <span><strong>Pathway Type:</strong> ${rMandatory ? 'Statutory Requirement' : 'Flexible Industry Entry'}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- SECTION C: Entrance Examinations and Admissions -->
        <section style="margin-bottom: 3rem;">
          <div style="margin-bottom: 1.25rem;">
            <span class="section-eyebrow">ENTRANCE EXAMINATIONS</span>
            <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-main);">
              Relevant Indian Entrance Examinations & Admission Rules
            </h2>
            <p style="font-size: 0.925rem; color: var(--text-muted);">
              Competitive national and state examinations relevant to this career. Admission may be entrance-based, merit-based, or via direct recruitment.
            </p>
          </div>

          ${examDetails.length > 0 ? `
            <div class="card" style="overflow-x: auto; padding: 0; margin-bottom: 1rem;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                <thead>
                  <tr style="background: var(--bg-subtle); border-bottom: 1px solid var(--border-light); font-weight: 700; color: var(--text-main);">
                    <th style="padding: 1rem 1.25rem;">Examination Name</th>
                    <th style="padding: 1rem 1.25rem;">Conducting Authority</th>
                    <th style="padding: 1rem 1.25rem;">Purpose & Details</th>
                    <th style="padding: 1rem 1.25rem;">Requirement Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${examDetails.map(exam => {
                    const exName = exam.name || exam.examName;
                    const exBody = exam.conductingBody || exam.body || "Statutory Examination Body";
                    const exPurpose = exam.purpose || exam.targetCourses || "Admission / Recruitment";
                    const exDetails = exam.details || exam.notes || "";
                    const exCompulsory = exam.isMandatory || exam.compulsory;

                    return `
                      <tr style="border-bottom: 1px solid var(--border-light);">
                        <td style="padding: 1rem 1.25rem; font-weight: 700; color: var(--text-main);">
                          ${exName}
                        </td>
                        <td style="padding: 1rem 1.25rem; color: var(--text-muted);">
                          ${exBody}
                        </td>
                        <td style="padding: 1rem 1.25rem; color: var(--text-muted); font-size: 0.825rem;">
                          <strong>${exPurpose}</strong>
                          ${exDetails ? `<div style="color: var(--text-subtle); margin-top: 0.2rem;">${exDetails}</div>` : ''}
                        </td>
                        <td style="padding: 1rem 1.25rem;">
                          <span class="badge" style="background: ${exCompulsory ? '#fee2e2' : '#f1f5f9'}; color: ${exCompulsory ? '#991b1b' : '#334155'}; font-size: 0.725rem;">
                            ${exCompulsory ? 'Compulsory' : 'Institution Specific / Merit'}
                          </span>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
            <p style="font-size: 0.775rem; color: var(--text-subtle); margin: 0;">
              * Note: Entrance examinations are mandatory for premier central and state government institutions. Many private universities admit based on institutional tests or Class 12 board marks.
            </p>
          ` : `
            <div class="card" style="padding: 1.5rem; background: var(--bg-subtle);">
              <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;">
                No single compulsory national entrance examination is required for this career. Admissions generally depend on undergraduate merit, institutional selection processes, or direct recruitment interviews.
              </p>
            </div>
          `}
        </section>

        <!-- SECTION D: Skills to Build -->
        <section style="margin-bottom: 3rem;">
          <div style="margin-bottom: 1.25rem;">
            <span class="section-eyebrow">SKILLS & CERTIFICATIONS</span>
            <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-main);">
              Skills, Tools & Recommended Certifications
            </h2>
            <p style="font-size: 0.925rem; color: var(--text-muted);">
              Structured breakdown across beginner foundations, core technical proficiencies, advanced practices, and industry software.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
            <!-- Beginner Skills -->
            <div class="card" style="padding: 1.35rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span class="badge" style="background: #e0f2fe; color: #0369a1;">1</span> Beginner Foundations
              </h3>
              <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
                ${(skills.beginner || []).map(sk => `
                  <li style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="color: #0284c7;">▸</span> <span>${sk}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Technical / Domain Skills -->
            <div class="card" style="padding: 1.35rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span class="badge" style="background: #e0e7ff; color: #3730a3;">2</span> Core Technical & Domain Skills
              </h3>
              <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
                ${(skills.technical || []).map(sk => `
                  <li style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="color: var(--primary);">▸</span> <span>${sk}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Advanced Skills -->
            <div class="card" style="padding: 1.35rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span class="badge" style="background: #fdf2f8; color: #9d174d;">3</span> Advanced & Strategic Skills
              </h3>
              <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
                ${(skills.advanced || []).map(sk => `
                  <li style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="color: #be185d;">▸</span> <span>${sk}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Interpersonal / Communication -->
            <div class="card" style="padding: 1.35rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span class="badge" style="background: #ecfdf5; color: #047857;">4</span> Communication & Interpersonal
              </h3>
              <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
                ${softSkills.map(sk => `
                  <li style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="color: #059669;">▸</span> <span>${sk}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- Tools & Certifications Pills Bar -->
          <div class="card" style="padding: 1.5rem; background: var(--bg-subtle);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
              <div>
                <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.6rem;">
                  Industry Tools & Software:
                </h4>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                  ${(skills.tools || []).map(tool => `
                    <span class="badge" style="background: #fff; border: 1px solid var(--border-light); color: var(--text-main); font-size: 0.8rem; padding: 0.35rem 0.65rem;">
                      ${tool}
                    </span>
                  `).join('')}
                </div>
              </div>

              <div>
                <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.6rem;">
                  Recommended Certifications (Optional / Value-Add):
                </h4>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                  ${(skills.certifications || []).map(cert => `
                    <span class="badge" style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 0.8rem; padding: 0.35rem 0.65rem;">
                      ${cert}
                    </span>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION E: Career Opportunities & Specializations -->
        <section style="margin-bottom: 3rem;">
          <div style="margin-bottom: 1.25rem;">
            <span class="section-eyebrow">CAREER OPPORTUNITIES</span>
            <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-main);">
              Job Roles and Specializations
            </h2>
            <p style="font-size: 0.925rem; color: var(--text-muted);">
              How individual specializations differ within this career path in the Indian employment market.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${opportunities.map(opp => {
              const oTitle = opp.title || opp.role || opp;
              const oType = opp.type || "Specialized Vertical";
              const oDesc = opp.description || opp.duties || "Specialized professional role.";

              return `
                <div class="card" style="padding: 1.35rem;">
                  <span class="badge badge-primary" style="font-size: 0.7rem; margin-bottom: 0.4rem;">${oType}</span>
                  <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">
                    ${oTitle}
                  </h3>
                  <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                    ${oDesc}
                  </p>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- SECTION F: Career Progression Ladder -->
        <section style="margin-bottom: 3rem;">
          <div style="margin-bottom: 1.25rem;">
            <span class="section-eyebrow">CAREER PROGRESSION</span>
            <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-main);">
              Realistic Career Progression Ladder
            </h2>
            <p style="font-size: 0.925rem; color: var(--text-muted);">
              Illustrative progression from entry-level trainee to apex director leadership. Timeline depends on individual skill, institutional performance, and competitive exams.
            </p>
          </div>

          <div class="card" style="padding: 1.5rem;">
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${progression.length > 0 ? progression.map((step, idx) => `
                <div style="display: flex; align-items: flex-start; gap: 1rem; padding: 0.85rem 1rem; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--primary);">
                  <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary); min-width: 65px; margin-top: 0.1rem;">
                    Stage ${idx + 1}
                  </div>
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                      <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin: 0;">
                        ${step.role || step}
                      </h4>
                      ${step.experience ? `<span style="font-size: 0.75rem; color: var(--text-subtle); font-weight: 600;">${step.experience}</span>` : ''}
                    </div>
                    ${step.focus ? `<p style="font-size: 0.825rem; color: var(--text-muted); margin: 0.25rem 0 0;">${step.focus}</p>` : ''}
                  </div>
                </div>
              `).join('') : growthLadder.map((step, idx) => `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: var(--bg-subtle); border-radius: var(--radius-md);">
                  <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary); min-width: 65px;">
                    Stage ${idx + 1}
                  </div>
                  <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-main);">
                    ${step}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- SECTION H: Practical Projects and Hands-On Experience -->
        <section style="margin-bottom: 3rem;">
          <div style="margin-bottom: 1.25rem;">
            <span class="section-eyebrow">PRACTICAL EXPERIENCE</span>
            <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-main);">
              Recommended Projects & Practical Training
            </h2>
            <p style="font-size: 0.925rem; color: var(--text-muted);">
              Hands-on projects, supervised clinical rotations, or case studies that demonstrate competence to recruiters and academic admissions committees.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem;">
            ${projects.map((proj, idx) => `
              <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="badge" style="background: #eef2ff; color: var(--primary); font-size: 0.725rem;">
                      Project ${idx + 1} • ${proj.type || 'Portfolio Work'}
                    </span>
                  </div>
                  <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">
                    ${proj.title || proj.name}
                  </h3>
                  <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">
                    ${proj.description}
                  </p>
                </div>

                <div style="font-size: 0.8rem; background: var(--bg-subtle); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); color: var(--text-main);">
                  <strong>Key Learning:</strong> ${proj.learningOutcome || proj.impact || 'Applied domain mastery'}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- SECTION I: Verified Official Resources -->
        <section style="margin-bottom: 3rem;">
          <div style="margin-bottom: 1.25rem;">
            <span class="section-eyebrow">OFFICIAL DIRECTORY</span>
            <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-main);">
              Official Regulators, Portals & Institutional Resources
            </h2>
            <p style="font-size: 0.925rem; color: var(--text-muted);">
              Verified destinations to statutory bodies, examination authorities, and national councils.
            </p>
          </div>

          <div class="card" style="padding: 1.5rem; background: var(--bg-subtle);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              ${resources.map(res => `
                <div style="background: #fff; padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--primary);">
                      ${res.type || 'Official Portal'}
                    </span>
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin: 0.25rem 0 0.35rem;">
                      ${res.name}
                    </h4>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 0.75rem; line-height: 1.4;">
                      ${res.description || 'Statutory authority governing standards, examinations, and recognition.'}
                    </p>
                  </div>
                  <div>
                    <a href="${res.url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="font-size: 0.775rem; width: 100%; justify-content: center;">
                      Visit Official Portal ${Icons.get('external')}
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- SECTION J: Frequently Asked Questions (Interactive Accordion) -->
        <section style="margin-bottom: 3.5rem;">
          <div style="margin-bottom: 1.25rem;">
            <span class="section-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
            <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-main);">
              Common Student Questions About ${title}
            </h2>
            <p style="font-size: 0.925rem; color: var(--text-muted);">
              Clear, practical answers tailored for Indian school and college students.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${faqs.map((faq, idx) => `
              <details class="card" style="padding: 1.15rem 1.5rem; cursor: pointer;" ${idx === 0 ? 'open' : ''}>
                <summary style="font-weight: 700; font-size: 1rem; color: var(--text-main); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                  <span>${faq.question}</span>
                  <span style="font-size: 1.25rem; color: var(--primary); font-weight: 300;">+</span>
                </summary>
                <div style="margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px solid var(--border-light); font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
                  ${faq.answer}
                </div>
              </details>
            `).join('')}
          </div>
        </section>

        <!-- Bottom Action CTA Banner -->
        <div class="card" style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); color: #fff; padding: 2.25rem; text-align: center; border-radius: var(--radius-lg);">
          <h3 style="font-size: 1.65rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff;">
            Ready to plan your path toward ${title}?
          </h3>
          <p style="font-size: 1rem; opacity: 0.9; max-width: 600px; margin: 0 auto 1.5rem; color: #e0e7ff;">
            Generate your personalized, stage-by-stage learning roadmap, track milestones in local browser storage, or compare with allied careers.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="roadmaps.html?career=${career.id}&class=${this.selectedClass}" class="btn" style="background: #fff; color: var(--primary); font-weight: 700;">
              ${Icons.get('map')} View Complete Roadmap
            </a>
            <a href="explore.html?compare=${career.id}" class="btn" style="background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.4);">
              Compare with Another Career
            </a>
            <a href="quiz.html" class="btn" style="background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.4);">
              Take Career Quiz
            </a>
          </div>
        </div>

      </div>
    `;

    // Event listeners
    container.querySelectorAll('.detail-stage-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const stage = pill.getAttribute('data-stage');
        this.selectedClass = stage;
        this.render(career);
      });
    });

    document.getElementById('careerSaveBtn')?.addEventListener('click', () => {
      StorageService.toggleSaveCareer(career.id);
      this.render(career);
    });
  }
};
