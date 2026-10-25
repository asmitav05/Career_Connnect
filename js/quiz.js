/**
 * Class-Specific Career Aptitude & Education Roadmap Quiz Engine
 * Separate quizzes for Class 10, Class 11, and Class 12 Indian students.
 * Supports backward navigation, answer review, transparent multi-factor scoring,
 * stream eligibility checks, and seamless linkage to class-specific roadmaps.
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

export const QuizEngine = {
  selectedClass: null, // '10' | '11' | '12'
  userStream: null,     // 'science-pcm' | 'science-pcb' | 'science-pcmb' | 'commerce-math' | 'commerce-nonmath' | 'arts' | 'vocational'
  questions: [],
  careers: [],
  currentIndex: 0,
  userAnswers: {},     // questionId -> chosenOptionIndex
  isReviewing: false,

  async init() {
    try {
      const careersRes = await fetch('data/careers.json');
      this.careers = await careersRes.json();

      // Check query parameter for class selection (e.g. ?class=10)
      const urlParams = new URLSearchParams(window.location.search);
      const classParam = urlParams.get('class');
      if (['10', '11', '12'].includes(classParam)) {
        this.selectedClass = classParam;
        await this.loadClassQuiz(this.selectedClass);
        return;
      }

      // Check profile saved stage
      const profile = StorageService.getProfile();
      if (profile.educationStage) {
        if (profile.educationStage.includes('10')) this.selectedClass = '10';
        else if (profile.educationStage.includes('11')) this.selectedClass = '11';
        else if (profile.educationStage.includes('12')) this.selectedClass = '12';
      }

      if (this.selectedClass) {
        await this.loadClassQuiz(this.selectedClass);
      } else {
        this.renderClassSelector();
      }
    } catch (e) {
      console.error('Failed to initialize quiz:', e);
      this.renderError('Unable to load career dataset. Please check your connection and reload the page.');
    }
  },

  renderClassSelector() {
    const container = document.getElementById('quizAppMount');
    if (!container) return;

    container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <div class="card" style="padding: 2.5rem; text-align: center; border-top: 4px solid var(--primary); margin-bottom: 2rem;">
          <span class="badge badge-primary" style="margin-bottom: 0.75rem;">STEP 1: SELECT YOUR STAGE</span>
          <h2 style="font-size: 1.75rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
            Choose Your Current Academic Stage
          </h2>
          <p style="font-size: 1rem; color: var(--text-muted); max-width: 640px; margin: 0 auto 2rem; line-height: 1.5;">
            Career requirements and educational pathways are very different at each stage. Select your class to receive questions and roadmaps tailored specifically for your academic position.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; text-align: left;">
            
            <!-- Class 10 Card -->
            <div class="card quiz-class-card" style="
              border: 2px solid var(--border-light);
              border-radius: var(--radius-lg);
              padding: 1.75rem;
              cursor: pointer;
              transition: all var(--transition-normal);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            " data-class="10">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <span class="badge" style="background: #eef2ff; color: var(--primary); font-weight: 700;">Class 10</span>
                  <span style="font-size: 0.8rem; color: var(--text-subtle);">18 Questions</span>
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
                  Explore Your Future
                </h3>
                <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
                  Discover suitable streams (Science PCM/PCB, Commerce, Arts), 3-year polytechnic diplomas, and vocational routes after Class 10.
                </p>
                <ul style="font-size: 0.825rem; color: var(--text-subtle); padding-left: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                  <li>Stream recommendations with eligibility notes</li>
                  <li>Polytechnic technical diploma alternatives</li>
                  <li>School-to-degree career roadmaps</li>
                </ul>
              </div>
              <button class="btn btn-primary btn-sm" style="width: 100%;">
                Start Class 10 Quiz
              </button>
            </div>

            <!-- Class 11 Card -->
            <div class="card quiz-class-card" style="
              border: 2px solid var(--border-light);
              border-radius: var(--radius-lg);
              padding: 1.75rem;
              cursor: pointer;
              transition: all var(--transition-normal);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            " data-class="11">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <span class="badge" style="background: #f0fdf4; color: #166534; font-weight: 700;">Class 11</span>
                  <span style="font-size: 0.8rem; color: var(--text-subtle);">20 Questions</span>
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
                  Choose Your Direction
                </h3>
                <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
                  Select your current stream (Science PCM/PCB, Commerce with/without Math, Arts) and get stream-adapted career and exam guidance.
                </p>
                <ul style="font-size: 0.825rem; color: var(--text-subtle); padding-left: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                  <li>Stream-adapted question sequencing</li>
                  <li>Entrance exam strategy (JEE, NEET, CLAT, CA)</li>
                  <li>Roadmaps starting from Class 11 focus</li>
                </ul>
              </div>
              <button class="btn btn-primary btn-sm" style="width: 100%;">
                Start Class 11 Quiz
              </button>
            </div>

            <!-- Class 12 Card -->
            <div class="card quiz-class-card" style="
              border: 2px solid var(--border-light);
              border-radius: var(--radius-lg);
              padding: 1.75rem;
              cursor: pointer;
              transition: all var(--transition-normal);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            " data-class="12">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 700;">Class 12</span>
                  <span style="font-size: 0.8rem; color: var(--text-subtle);">22 Questions</span>
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
                  Plan Your Next Step
                </h3>
                <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
                  Map out immediate college degrees, entrance examinations, budget preferences, location factors, and backup career routes.
                </p>
                <ul style="font-size: 0.825rem; color: var(--text-subtle); padding-left: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                  <li>Undergraduate degrees & professional certifications</li>
                  <li>Alternative pathways (e.g. BCA vs B.Tech)</li>
                  <li>Roadmaps starting immediately post-12th</li>
                </ul>
              </div>
              <button class="btn btn-primary btn-sm" style="width: 100%;">
                Start Class 12 Quiz
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.quiz-class-card').forEach(card => {
      card.addEventListener('click', async () => {
        const cls = card.getAttribute('data-class');
        this.selectedClass = cls;
        await this.loadClassQuiz(cls);
      });
    });
  },

  async loadClassQuiz(cls) {
    const container = document.getElementById('quizAppMount');
    if (container) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem; max-width: 760px; margin: 0 auto;">
          <p style="color: var(--text-muted);">Loading Class ${cls} Career Quiz dataset...</p>
        </div>
      `;
    }

    try {
      const dataFile = `data/quiz-class${cls}.json`;
      const res = await fetch(dataFile);
      this.questions = await res.json();
      this.currentIndex = 0;
      this.userAnswers = {};
      this.isReviewing = false;
      this.renderQuestion();
    } catch (e) {
      console.error(`Failed to load Class ${cls} quiz:`, e);
      this.renderError(`Failed to load Class ${cls} quiz data. Please reload the page.`);
    }
  },

  renderQuestion() {
    const container = document.getElementById('quizAppMount');
    if (!container || !this.questions.length) return;

    const q = this.questions[this.currentIndex];
    const total = this.questions.length;
    const answeredCount = Object.keys(this.userAnswers).length;
    const progressPct = Math.round(((this.currentIndex) / total) * 100);
    const selectedOption = this.userAnswers[q.id];

    // Class badge labels
    const classLabels = {
      '10': 'Class 10: Explore Your Future',
      '11': 'Class 11: Choose Your Career Direction',
      '12': 'Class 12: Plan Your Next Step'
    };

    container.innerHTML = `
      <div class="card" style="max-width: 820px; margin: 0 auto; box-shadow: var(--shadow-lg); border-top: 4px solid var(--primary); padding: 2.25rem;">
        
        <!-- Header & Class Switcher -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="badge badge-primary">${classLabels[this.selectedClass] || `Class ${this.selectedClass}`}</span>
            <span class="badge" style="background: #f1f5f9; color: var(--text-main);">${q.category}</span>
          </div>
          <button id="switchClassBtn" class="btn btn-outline btn-xs" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">
            Switch Stage
          </button>
        </div>

        <!-- Progress Bar -->
        <div style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; color: var(--text-subtle); margin-bottom: 0.4rem;">
            <span>Question ${this.currentIndex + 1} of ${total}</span>
            <span>${progressPct}% Completed (${answeredCount}/${total} Answered)</span>
          </div>
          <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: var(--radius-full); overflow: hidden;">
            <div style="height: 100%; width: ${progressPct}%; background: var(--primary); transition: width var(--transition-normal);"></div>
          </div>
        </div>

        <!-- Question Title -->
        <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 1.5rem; line-height: 1.45;">
          ${q.question}
        </h2>

        <!-- Options List -->
        <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 2rem;">
          ${q.options.map((opt, idx) => `
            <label class="quiz-option ${selectedOption === idx ? 'selected' : ''}" style="
              display: flex;
              align-items: flex-start;
              gap: 0.85rem;
              padding: 1.1rem 1.25rem;
              border: 1.5px solid ${selectedOption === idx ? 'var(--primary)' : 'var(--border-light)'};
              background: ${selectedOption === idx ? 'var(--primary-light)' : 'var(--bg-card)'};
              border-radius: var(--radius-md);
              cursor: pointer;
              transition: all var(--transition-fast);
            ">
              <input type="radio" name="quizChoice" value="${idx}" ${selectedOption === idx ? 'checked' : ''} style="margin-top: 0.25rem;">
              <div style="flex: 1;">
                <span style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); line-height: 1.45; display: block;">
                  ${opt.text}
                </span>
                ${opt.streamHint ? `
                  <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600; display: block; margin-top: 0.25rem;">
                    Suggested Pathway: ${opt.streamHint}
                  </span>
                ` : ''}
              </div>
            </label>
          `).join('')}
        </div>

        <!-- Question Navigator Dots / Review Bar -->
        <div style="margin-bottom: 1.5rem; padding: 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--text-subtle);">
            <span>QUESTION NAVIGATOR (Jump to any question to review or change answer)</span>
            <button id="openReviewSheetBtn" style="background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; text-decoration: underline; font-size: 0.75rem;">
              Review All Answers
            </button>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${this.questions.map((qn, i) => {
              const isAnswered = this.userAnswers[qn.id] !== undefined;
              const isCurrent = i === this.currentIndex;
              let bg = '#e2e8f0';
              let color = 'var(--text-subtle)';
              let border = '1px solid transparent';
              if (isCurrent) {
                border = '2px solid var(--primary)';
                bg = 'var(--primary)';
                color = '#ffffff';
              } else if (isAnswered) {
                bg = '#10b981';
                color = '#ffffff';
              }
              return `
                <button class="q-nav-pill" data-idx="${i}" style="
                  width: 26px;
                  height: 26px;
                  border-radius: var(--radius-sm);
                  border: ${border};
                  background: ${bg};
                  color: ${color};
                  font-size: 0.75rem;
                  font-weight: 700;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0;
                " title="Question ${i + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}">
                  ${i + 1}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1.25rem;">
          <button id="quizPrevBtn" class="btn btn-secondary btn-sm" ${this.currentIndex === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
            ← Previous Question
          </button>
          
          <button id="quizNextBtn" class="btn btn-primary btn-sm" ${selectedOption === undefined ? 'disabled style="opacity: 0.6; cursor: not-allowed;"' : ''}>
            ${this.currentIndex === total - 1 ? 'Analyze My Career Matches →' : 'Next Question →'}
          </button>
        </div>

      </div>
    `;

    // Event Bindings
    container.querySelectorAll('input[name="quizChoice"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        this.userAnswers[q.id] = val;
        
        // Track stream selection if question is stream selector
        if (q.isStreamSelector && q.options[val]) {
          this.userStream = q.options[val].stream;
        }

        this.renderQuestion();
      });
    });

    document.getElementById('switchClassBtn')?.addEventListener('click', () => {
      this.renderClassSelector();
    });

    document.getElementById('quizPrevBtn')?.addEventListener('click', () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.renderQuestion();
      }
    });

    document.getElementById('quizNextBtn')?.addEventListener('click', () => {
      if (this.userAnswers[q.id] === undefined) return;
      if (this.currentIndex < total - 1) {
        this.currentIndex++;
        this.renderQuestion();
      } else {
        this.computeAndShowResults();
      }
    });

    container.querySelectorAll('.q-nav-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-idx'), 10);
        this.currentIndex = targetIdx;
        this.renderQuestion();
      });
    });

    document.getElementById('openReviewSheetBtn')?.addEventListener('click', () => {
      this.renderReviewModal();
    });
  },

  renderReviewModal() {
    const existing = document.getElementById('quizReviewModal');
    if (existing) existing.remove();

    const total = this.questions.length;
    const answered = Object.keys(this.userAnswers).length;

    const modal = document.createElement('div');
    modal.id = 'quizReviewModal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(11, 19, 43, 0.65);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    `;

    modal.innerHTML = `
      <div class="card" style="max-width: 760px; width: 100%; max-height: 85vh; display: flex; flex-direction: column; padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0;">
              Review Your Quiz Answers
            </h3>
            <span style="font-size: 0.85rem; color: var(--text-muted);">${answered} of ${total} Questions Answered</span>
          </div>
          <button id="closeReviewModalBtn" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; line-height: 1;">&times;</button>
        </div>

        <div style="overflow-y: auto; flex: 1; padding-right: 0.5rem; margin-bottom: 1.25rem;">
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${this.questions.map((qn, i) => {
              const ansIdx = this.userAnswers[qn.id];
              const ansText = ansIdx !== undefined ? qn.options[ansIdx]?.text : '<span style="color: #ef4444; font-style: italic;">Not answered yet</span>';
              return `
                <div style="padding: 0.85rem; background: var(--bg-subtle); border-radius: var(--radius-sm); border: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                  <div style="flex: 1;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 0.2rem;">
                      Q${i + 1} • ${qn.category}
                    </div>
                    <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">
                      ${qn.question}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">
                      <strong>Your Answer:</strong> ${ansText}
                    </div>
                  </div>
                  <button class="review-jump-btn btn btn-outline btn-xs" data-idx="${i}" style="font-size: 0.75rem; white-space: nowrap;">
                    Change
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1rem;">
          <button id="closeReviewModalFooterBtn" class="btn btn-secondary btn-sm">
            Resume Quiz
          </button>
          <button id="submitFromReviewBtn" class="btn btn-primary btn-sm" ${answered < total ? 'disabled style="opacity: 0.6;"' : ''}>
            Submit & View Recommendations (${answered}/${total})
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    document.getElementById('closeReviewModalBtn')?.addEventListener('click', closeModal);
    document.getElementById('closeReviewModalFooterBtn')?.addEventListener('click', closeModal);

    modal.querySelectorAll('.review-jump-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        closeModal();
        this.currentIndex = idx;
        this.renderQuestion();
      });
    });

    document.getElementById('submitFromReviewBtn')?.addEventListener('click', () => {
      closeModal();
      this.computeAndShowResults();
    });
  },

  computeAndShowResults() {
    const scores = {};
    const factors = {};

    this.careers.forEach(c => {
      scores[c.id] = 0;
      factors[c.id] = [];
    });

    // Score accumulation across all questions
    this.questions.forEach(q => {
      const chosenIdx = this.userAnswers[q.id];
      if (chosenIdx !== undefined) {
        const chosen = q.options[chosenIdx];
        if (chosen && chosen.scores) {
          Object.entries(chosen.scores).forEach(([rawCid, pts]) => {
            const cid = LEGACY_ALIASES[rawCid] || rawCid;
            if (scores[cid] !== undefined) {
              scores[cid] += pts;
              if (chosen.factor && !factors[cid].includes(chosen.factor)) {
                factors[cid].push(chosen.factor);
              }
            }
          });
        }
      }
    });

    // Rule-based stream eligibility filtering / weighting
    if (this.userStream) {
      this.careers.forEach(c => {
        const cid = c.id;
        const streamReq = (c.stream || '').toLowerCase();
        
        // If student is strictly PCB and career mandates Mathematics (like aerospace, core engineering)
        if (this.userStream === 'science-pcb') {
          if (streamReq.includes('pcm') && !streamReq.includes('pcb') && !streamReq.includes('any')) {
            scores[cid] = Math.max(0, scores[cid] - 15);
          }
          if (c.category === 'Medical and Healthcare' || c.category === 'Education, Science and Research') {
            scores[cid] += 8;
          }
        }

        // If student is Commerce without Math and career mandates PCM/Math
        if (this.userStream === 'commerce-nonmath') {
          if (streamReq.includes('pcm') || streamReq.includes('math')) {
            scores[cid] = Math.max(0, scores[cid] - 20);
          }
          if (c.category === 'Business, Finance and Management' || c.category === 'Government, Law and Public Services') {
            scores[cid] += 8;
          }
        }

        // If student is Science PCM, boost engineering & software
        if (this.userStream === 'science-pcm') {
          if (c.category === 'Technology and Software' || c.category === 'Engineering and Core Industries' || c.category === 'Artificial Intelligence and Data') {
            scores[cid] += 8;
          }
        }
      });
    }

    // Normalize scores relative to highest career score
    const highestRaw = Math.max(...Object.values(scores), 1);
    const rankedCareers = Object.keys(scores)
      .map(cid => {
        const careerObj = this.careers.find(c => c.id === cid);
        const rawScore = scores[cid];
        const matchPercent = Math.min(98, Math.max(45, Math.round((rawScore / highestRaw) * 96)));

        // Qualitative match tier category
        let matchCategory = "Promising Potential";
        let matchBadgeColor = "#2563eb";
        let matchBadgeBg = "#dbeafe";
        if (matchPercent >= 90) {
          matchCategory = "Outstanding Alignment";
          matchBadgeColor = "#15803d";
          matchBadgeBg = "#dcfce7";
        } else if (matchPercent >= 80) {
          matchCategory = "High Compatibility";
          matchBadgeColor = "#4338ca";
          matchBadgeBg = "#e0e7ff";
        } else if (matchPercent >= 70) {
          matchCategory = "Strong Match";
          matchBadgeColor = "#7c3aed";
          matchBadgeBg = "#f3e8ff";
        }

        return {
          career: careerObj,
          score: rawScore,
          matchPercent,
          matchCategory,
          matchBadgeColor,
          matchBadgeBg,
          factors: factors[cid].slice(0, 3) // Top 3 explainability factors
        };
      })
      .filter(item => item.career && item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 7); // Exactly 7 suitable recommendations (within 5-8 requirement)

    // Save results to StorageService
    StorageService.saveQuizResults({
      class: this.selectedClass,
      stream: this.userStream,
      recommendations: rankedCareers.map(r => ({
        id: r.career.id,
        title: r.career.title || r.career.name,
        matchPercent: r.matchPercent,
        matchCategory: r.matchCategory
      })),
      answers: this.userAnswers
    });

    this.renderResults(rankedCareers);
  },

  renderResults(top7) {
    const container = document.getElementById('quizAppMount');
    if (!container) return;

    const classNames = {
      '10': 'Class 10 (Explore Your Future)',
      '11': 'Class 11 (Choose Your Direction)',
      '12': 'Class 12 (Plan Your Next Step)'
    };

    // Stage-specific advisory banner
    let stageAdvisory = '';
    if (this.selectedClass === '10') {
      stageAdvisory = `
        <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: var(--radius-md); padding: 1.25rem 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #166534; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            ${Icons.get('sparkles')}
            Recommended Educational Pathways after Class 10:
          </h3>
          <p style="font-size: 0.9rem; color: #14532d; line-height: 1.55; margin-bottom: 0.75rem;">
            Based on your interests and strengths, explore:
            <strong>Class 11-12 Science (PCM/PCB)</strong> for technical and medical careers, 
            <strong>Commerce</strong> for financial and accounting credentials (ICAI CA), 
            <strong>Arts/Humanities</strong> for law and administrative governance, 
            or <strong>3-Year Polytechnic Technical Diplomas</strong> for hands-on applied engineering.
          </p>
          <div style="font-size: 0.8rem; color: #15803d; font-weight: 600;">
            * Note: Stream and subject availability depends on your school, board, institution, and minimum admission marks eligibility.
          </div>
        </div>
      `;
    } else if (this.selectedClass === '11') {
      stageAdvisory = `
        <div style="background: #eef2ff; border: 1.5px solid #a5b4fc; border-radius: var(--radius-md); padding: 1.25rem 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #3730a3; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            ${Icons.get('sparkles')}
            Strategic Guidance for Class 11 Students:
          </h3>
          <p style="font-size: 0.9rem; color: #312e81; line-height: 1.55; margin-bottom: 0.75rem;">
            Class 11 syllabus forms nearly 45-50% of national competitive exams (JEE Main, NEET-UG, CA Foundation, CLAT). Focus right now on core concept clarity without backlogs. In Class 12, balance board marks (aiming for 75%+ thresholds) with regular entrance mock test drills.
          </p>
          <div style="font-size: 0.8rem; color: #4338ca; font-weight: 600;">
            * Your personalized roadmaps below start directly from your current position in Class 11.
          </div>
        </div>
      `;
    } else if (this.selectedClass === '12') {
      stageAdvisory = `
        <div style="background: #fef3c7; border: 1.5px solid #fcd34d; border-radius: var(--radius-md); padding: 1.25rem 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #92400e; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            ${Icons.get('sparkles')}
            Immediate Next Steps for Class 12 Students:
          </h3>
          <p style="font-size: 0.9rem; color: #78350f; line-height: 1.55; margin-bottom: 0.75rem;">
            Keep track of entrance exam registration deadlines (JEE Main, NEET-UG, CUET-UG, CLAT, NATA). Check central and state counselling schedules (JoSAA, MCC, State CAP). If entrance ranks are challenging, our roadmaps provide verified alternative degree pathways (such as BCA, B.Sc, B.Pharm, 5-Yr Law) that lead to identical industry roles.
          </p>
          <div style="font-size: 0.8rem; color: #92400e; font-weight: 600;">
            * Your personalized roadmaps start immediately with post-Class 12 college applications and cutoffs.
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="max-width: 920px; margin: 0 auto; padding-bottom: 4rem;">
        
        <!-- Results Hero Banner -->
        <div class="card" style="background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%); color: white; padding: 2.25rem; margin-bottom: 2rem; border: none; border-radius: var(--radius-lg);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #a5b4fc;">
              PERSONALIZED CAREER MATCHING RESULTS
            </span>
            <span class="badge" style="background: rgba(255,255,255,0.2); color: white; font-weight: 700;">
              ${classNames[this.selectedClass] || `Class ${this.selectedClass}`}
            </span>
          </div>
          <h1 style="font-size: 2.15rem; font-weight: 800; margin: 0.5rem 0 0.75rem; color: white;">
            Your Top Recommended Career Options
          </h1>
          <p style="font-size: 1rem; color: #e0e7ff; max-width: 760px; line-height: 1.6;">
            We analyzed your self-reported subject affinity, academic strengths, practical vs theoretical learning preferences, examination willingness, and future career horizons against 110 Indian careers.
          </p>
          
          <!-- Exploratory Guidance Disclaimer Notice -->
          <div style="margin-top: 1.25rem; font-size: 0.825rem; background: rgba(255, 255, 255, 0.12); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border-left: 3px solid #facc15; line-height: 1.5; color: #fef08a;">
            <strong>Exploratory Guidance Notice:</strong> A match score indicates alignment with your quiz answers and is designed to spark structured self-discovery. It does not guarantee future college admission or career success. Students should verify admission rules on official statutory portals and consult teachers and parents.
          </div>
        </div>

        <!-- Stage-Specific Advisory -->
        ${stageAdvisory}

        <!-- Recommendations Count Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0;">
              Top ${top7.length} Suitable Careers for You
            </h2>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Ranked by multidimensional compatibility scoring</span>
          </div>
          <button id="retakeQuizTopBtn" class="btn btn-outline btn-sm">
            Retake Class ${this.selectedClass} Quiz
          </button>
        </div>

        <!-- Career Cards List -->
        <div style="display: flex; flex-direction: column; gap: 1.75rem; margin-bottom: 3rem;">
          ${top7.map((item, idx) => {
            const c = item.career;
            const cTitle = c.title || c.name;
            const cSummary = c.summary || c.shortDescription || "";
            const qualification = c.qualification || c.minQualification || "Bachelor's Degree";
            const pathways = c.educationPathways || c.entryRoutes || [];
            const primaryRoute = (pathways[0] && (pathways[0].title || pathways[0].name)) || qualification;
            const routeCount = pathways.length || 2;

            // Route overview snippets
            const routeSnippets = pathways.slice(0, 2).map((p, pidx) => `
              <div style="font-size: 0.825rem; color: var(--text-muted); display: flex; align-items: flex-start; gap: 0.4rem;">
                <span style="font-weight: 700; color: var(--primary);">Route ${String.fromCharCode(65 + pidx)}:</span>
                <span>${p.title || p.name || p.course || p}</span>
              </div>
            `).join('');

            return `
              <div class="card" style="border-left: 5px solid var(--primary); padding: 2rem; box-shadow: var(--shadow-md);">
                
                <!-- Card Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                      <span class="badge badge-primary">#${idx + 1} Recommendation</span>
                      <span class="badge" style="background: ${item.matchBadgeBg}; color: ${item.matchBadgeColor}; font-weight: 700;">
                        ${item.matchCategory}
                      </span>
                      <span class="badge" style="background: #f1f5f9; color: var(--text-main);">${c.category}</span>
                    </div>
                    <h3 style="font-size: 1.45rem; font-weight: 800; color: var(--text-main); margin: 0;">
                      <a href="career.html?id=${c.id}&class=${this.selectedClass}" style="color: var(--text-main); text-decoration: none;">
                        ${cTitle}
                      </a>
                    </h3>
                  </div>

                  <!-- Compatibility Metric -->
                  <div style="text-align: right;">
                    <span style="font-size: 1.85rem; font-weight: 800; color: var(--primary); line-height: 1;">
                      ${item.matchPercent}%
                    </span>
                    <div style="font-size: 0.725rem; font-weight: 700; color: var(--text-subtle); text-transform: uppercase;">
                      Match Score
                    </div>
                  </div>
                </div>

                <!-- Match Progress Bar -->
                <div style="width: 100%; height: 6px; background: #f1f5f9; border-radius: var(--radius-full); margin: 0.25rem 0 1rem; overflow: hidden;">
                  <div style="height: 100%; width: ${item.matchPercent}%; background: var(--primary);"></div>
                </div>

                <!-- Short Description -->
                <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.55; margin-bottom: 1.25rem;">
                  ${cSummary}
                </p>

                <!-- Why This Fits You (Derived Factors) -->
                <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
                  <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                    ${Icons.get('sparkles')}
                    Why this career was recommended for you:
                  </h4>
                  <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.35rem; margin: 0;">
                    ${item.factors.map(f => `
                      <li style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: flex-start; gap: 0.5rem;">
                        <span style="color: #059669; font-weight: 700;">✓</span>
                        <span>${f}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>

                <!-- Required Qualifications & Possible Education Routes Overview -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem;">
                  
                  <div style="background: #f8fafc; padding: 0.85rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                    <strong style="color: var(--text-main); display: block; margin-bottom: 0.35rem;">Required Qualifications:</strong>
                    <span style="color: var(--text-muted);">${qualification}</span>
                    ${c.stream ? `<div style="font-size: 0.775rem; color: var(--text-subtle); margin-top: 0.25rem;">Eligible stream: ${c.stream}</div>` : ''}
                  </div>

                  <div style="background: #f8fafc; padding: 0.85rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                    <strong style="color: var(--text-main); display: block; margin-bottom: 0.35rem;">Possible Educational Routes (${routeCount} Options):</strong>
                    <div style="display: flex; flex-direction: column; gap: 0.3rem;">
                      ${routeSnippets || `<span style="color: var(--text-muted);">${primaryRoute}</span>`}
                    </div>
                  </div>

                </div>

                <!-- Action Buttons (Strictly per user requirements) -->
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
                  <a href="roadmaps.html?career=${c.id}&class=${this.selectedClass}${this.userStream ? `&stream=${this.userStream}` : ''}" class="btn btn-primary btn-sm" style="display: flex; align-items: center; gap: 0.4rem;">
                    ${Icons.get('map')} View Complete Roadmap
                  </a>
                  <a href="career.html?id=${c.id}&class=${this.selectedClass}" class="btn btn-secondary btn-sm">
                    Explore Career
                  </a>
                  <a href="explore.html?compare=${c.id}" class="btn btn-outline btn-sm">
                    Compare Alternatives
                  </a>
                </div>

              </div>
            `;
          }).join('')}
        </div>

        <!-- Retake & Switch Stage Bar -->
        <div style="text-align: center; padding: 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">
            Want to test a different academic stage or stream?
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            You can retake this quiz or switch to Class 10, Class 11, or Class 12 anytime.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button id="retakeQuizBtn" class="btn btn-secondary btn-sm">
              Retake Class ${this.selectedClass} Quiz
            </button>
            <button id="switchStageBottomBtn" class="btn btn-outline btn-sm">
              Switch Academic Stage
            </button>
          </div>
        </div>

      </div>
    `;

    document.getElementById('retakeQuizTopBtn')?.addEventListener('click', () => {
      this.currentIndex = 0;
      this.userAnswers = {};
      this.renderQuestion();
    });

    document.getElementById('retakeQuizBtn')?.addEventListener('click', () => {
      this.currentIndex = 0;
      this.userAnswers = {};
      this.renderQuestion();
    });

    document.getElementById('switchStageBottomBtn')?.addEventListener('click', () => {
      this.renderClassSelector();
    });
  },

  renderError(msg) {
    const container = document.getElementById('quizAppMount');
    if (container) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem; max-width: 600px; margin: 0 auto;">
          <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">Quiz Engine Error</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${msg}</p>
          <button onclick="location.reload()" class="btn btn-primary btn-sm">Reload Page</button>
        </div>
      `;
    }
  }
};
