/**
 * CareerConnect Shared Component Injector
 * Mounts a unified Header, Navigation bar, and Footer on every page.
 * Responsive, with authentic user authentication state and student profile management.
 */

import { Icons } from './icons.js';
import { ProfileModal } from './profile.js';
import { AuthService } from './auth.js';

export const SiteComponents = {
  activePage: '',

  init(activePage = '') {
    this.activePage = activePage;
    this.renderHeader(activePage);
    this.renderFooter();
    ProfileModal.init();
    this.bindMobileMenu();

    // Re-render header when auth status changes
    window.addEventListener('careerpath:authChanged', () => {
      this.renderHeader(this.activePage);
    });
  },

  renderHeader(activePage = '') {
    const headerContainer = document.getElementById('siteHeaderMount');
    if (!headerContainer) return;

    if (!activePage) {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('explore')) activePage = 'explore';
      else if (path.includes('scholarship')) activePage = 'scholarships';
      else if (path.includes('quiz')) activePage = 'quiz';
      else if (path.includes('pathway')) activePage = 'pathways';
      else if (path.includes('roadmap')) activePage = 'roadmaps';
      else if (path.includes('resource')) activePage = 'resources';
      else if (path.includes('faq')) activePage = 'faqs';
      else if (path.includes('dashboard')) activePage = 'dashboard';
      else if (path.includes('career')) activePage = 'explore';
      else activePage = 'home';
    }

    const isNested = window.location.pathname.includes('/careers/') || window.location.pathname.includes('/categories/');
    const root = isNested ? '../' : './';

    const user = AuthService.getUser();

    headerContainer.className = 'site-header';
    headerContainer.innerHTML = `
      <div class="container">
        <nav class="navbar" aria-label="Main Navigation">
          <!-- Brand Logo with Modern SaaS Icon Mark -->
          <a href="${root}index.html" class="brand-logo">
            <div class="brand-icon-box">
              ${Icons.get('sparkles')}
            </div>
            <div>Career<span>Connect</span></div>
            <small class="brand-badge">India</small>
          </a>

          <!-- Primary Navigation Links -->
          <ul class="nav-links" id="primaryNavLinks">
            <li>
              <a href="${root}index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
            </li>
            <li>
              <a href="${root}explore.html" class="nav-link ${activePage === 'explore' ? 'active' : ''}">Explore Careers</a>
            </li>
            <li>
              <a href="${root}pathways.html" class="nav-link ${activePage === 'pathways' ? 'active' : ''}">Pathways</a>
            </li>
            <li>
              <a href="${root}scholarships.html" class="nav-link ${activePage === 'scholarships' ? 'active' : ''}">Scholarships</a>
            </li>
            <li>
              <a href="${root}quiz.html" class="nav-link ${activePage === 'quiz' ? 'active' : ''}">Career Quiz</a>
            </li>
            <li>
              <a href="${root}roadmaps.html" class="nav-link ${activePage === 'roadmaps' ? 'active' : ''}">Roadmaps</a>
            </li>
            <li>
              <a href="${root}faqs.html" class="nav-link ${activePage === 'faqs' ? 'active' : ''}">FAQs</a>
            </li>
            <li>
              <a href="${root}resources.html" class="nav-link ${activePage === 'resources' ? 'active' : ''}">Resources</a>
            </li>
            <li>
              <a href="${root}dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}">My Dashboard</a>
            </li>
          </ul>

          <!-- Action Items (Auth, Profile & Mobile Toggle) -->
          <div class="nav-actions">
            ${user ? `
              <!-- Logged In User Dropdown -->
              <div class="user-auth-menu" style="position: relative; display: inline-block;">
                <button id="headerUserMenuBtn" class="profile-pill-btn" style="border-color: var(--primary-border); background: var(--primary-light); cursor: pointer; padding: 0.35rem 0.75rem;" title="Account Menu" aria-haspopup="true" aria-expanded="false">
                  <img src="${user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=4f46e5`}" alt="${user.name}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover;">
                  <span style="font-weight: 700; color: var(--primary); font-size: 0.85rem;">${user.name.split(' ')[0]}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary);"><path d="m6 9 6 6 6-6"/></svg>
                </button>

                <div id="headerUserDropdown" class="user-dropdown-panel" style="display: none; position: absolute; right: 0; top: calc(100% + 8px); background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-md); box-shadow: var(--shadow-xl); min-width: 220px; padding: 0.5rem 0; z-index: 1000;">
                  <div style="padding: 0.65rem 1rem; border-bottom: 1px solid var(--border-light);">
                    <div style="font-weight: 700; font-size: 0.875rem; color: var(--text-main);">${user.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${user.email}</div>
                  </div>
                  <a href="${root}dashboard.html" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; font-size: 0.85rem; color: var(--text-body); text-decoration: none;">
                    ${Icons.get('sparkles')} My Dashboard
                  </a>
                  <button id="headerDropdownProfileBtn" style="display: flex; align-items: center; gap: 0.5rem; width: 100%; text-align: left; padding: 0.6rem 1rem; font-size: 0.85rem; color: var(--text-body); background: none; border: none; cursor: pointer;">
                    ${Icons.get('user')} Student Profile
                  </button>
                  <div style="border-top: 1px solid var(--border-light); margin: 0.25rem 0;"></div>
                  <button id="headerLogoutBtn" style="display: flex; align-items: center; gap: 0.5rem; width: 100%; text-align: left; padding: 0.6rem 1rem; font-size: 0.85rem; color: #b91c1c; background: none; border: none; cursor: pointer; font-weight: 600;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Log Out
                  </button>
                </div>
              </div>
            ` : `
              <!-- Unauthenticated State: Log In & Sign Up -->
              <a href="${root}login.html" class="btn btn-secondary btn-sm" style="font-size: 0.825rem; font-weight: 600; padding: 0.4rem 0.85rem;">
                Log In
              </a>
              <a href="${root}signup.html" class="btn btn-primary btn-sm" style="font-size: 0.825rem; font-weight: 600; padding: 0.4rem 0.85rem;">
                Sign Up
              </a>
            `}

            <!-- Profile Pill Trigger -->
            <button id="headerProfilePill" class="profile-pill-btn" title="View or edit your student profile">
              <span class="profile-indicator"></span>
              <span>My Profile</span>
            </button>

            <!-- Mobile Toggle -->
            <button id="mobileNavToggle" class="mobile-toggle" aria-label="Toggle navigation menu">
              ${Icons.get('menu')}
            </button>
          </div>
        </nav>
      </div>
    `;

    // Dropdown toggle
    const menuBtn = document.getElementById('headerUserMenuBtn');
    const dropdown = document.getElementById('headerUserDropdown');

    if (menuBtn && dropdown) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        menuBtn.setAttribute('aria-expanded', !isOpen);
      });

      document.addEventListener('click', () => {
        if (dropdown.style.display === 'block') {
          dropdown.style.display = 'none';
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Dropdown Profile Modal open
    document.getElementById('headerDropdownProfileBtn')?.addEventListener('click', () => {
      if (dropdown) dropdown.style.display = 'none';
      ProfileModal.open();
    });

    // Logout handler
    document.getElementById('headerLogoutBtn')?.addEventListener('click', async () => {
      await AuthService.logout();
      window.location.href = `${root}index.html`;
    });

    // Direct Profile Pill handler
    document.getElementById('headerProfilePill')?.addEventListener('click', () => {
      ProfileModal.open();
    });
  },

  renderFooter() {
    const footerContainer = document.getElementById('siteFooterMount');
    if (!footerContainer) return;

    const isNested = window.location.pathname.includes('/careers/') || window.location.pathname.includes('/categories/');
    const root = isNested ? '../' : './';

    footerContainer.className = 'site-footer';
    footerContainer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Trust -->
          <div class="footer-brand">
            <h4>Career<span>Connect</span></h4>
            <p>
              A personalized, privacy-friendly career mentor & official scholarship assistant built specifically for Indian students.
            </p>
            <div class="footer-trust-box">
              <strong>Official Verification Standard:</strong> All scholarship rules, income limits, and application deadlines are cited directly from government gazettes (NSP, AICTE, MahaDBT).
            </div>
          </div>

          <!-- Col 2: Guidance Tools -->
          <div class="footer-col">
            <h5>Guidance Tools</h5>
            <ul class="footer-links">
              <li><a href="${root}quiz.html">Career Fit Quiz</a></li>
              <li><a href="${root}explore.html">Career Database (110 Options)</a></li>
              <li><a href="${root}pathways.html">Education Pathways</a></li>
              <li><a href="${root}scholarships.html">Scholarship Matcher</a></li>
              <li><a href="${root}roadmaps.html">Step-by-Step Roadmaps</a></li>
              <li><a href="${root}faqs.html">Student FAQs</a></li>
              <li><a href="${root}dashboard.html">Student Dashboard</a></li>
            </ul>
          </div>

          <!-- Col 3: Official Portals -->
          <div class="footer-col">
            <h5>Official Portals</h5>
            <ul class="footer-links">
              <li><a href="https://scholarships.gov.in/" target="_blank" rel="noopener noreferrer">National Scholarship Portal (NSP)</a></li>
              <li><a href="https://www.aicte-india.org/" target="_blank" rel="noopener noreferrer">AICTE Student Schemes</a></li>
              <li><a href="https://mahadbt.maharashtra.gov.in/" target="_blank" rel="noopener noreferrer">MahaDBT Aaple Sarkar</a></li>
              <li><a href="https://nta.ac.in/" target="_blank" rel="noopener noreferrer">National Testing Agency (NTA)</a></li>
              <li><a href="https://cetcell.mahacet.org/" target="_blank" rel="noopener noreferrer">State CET Cell Maharashtra</a></li>
            </ul>
          </div>

          <!-- Col 4: Privacy & Ethics -->
          <div class="footer-col">
            <h5>Privacy & Ethics</h5>
            <ul class="footer-links">
              <li><a href="javascript:void(0)" id="footerOpenProfileLink">Edit Student Profile</a></li>
              <li><a href="${root}resources.html#privacy">Student Data Privacy</a></li>
              <li><a href="${root}resources.html#verification">Verification Standards</a></li>
              <li><a href="${root}resources.html#disclaimer">Educational Disclaimer</a></li>
              <li><a href="${root}login.html">Student Account Log In</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>
            &copy; 2026 CareerConnect India. Verified Career Guidance & Scholarship Portal.
          </div>
          <div class="footer-lang-badge">
            ${Icons.get('sparkles')}
            <span>English (Default) • Hindi & Marathi Coming Soon</span>
          </div>
        </div>
      </div>
    `;

    document.getElementById('footerOpenProfileLink')?.addEventListener('click', () => {
      ProfileModal.open();
    });
  },

  bindMobileMenu() {
    const toggle = document.getElementById('mobileNavToggle');
    const links = document.getElementById('primaryNavLinks');
    toggle?.addEventListener('click', () => {
      links?.classList.toggle('open');
    });
  }
};
