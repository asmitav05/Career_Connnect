/**
 * Smart Scholarship Matcher (Phase 1)
 * Evaluates student profile against official verified eligibility criteria.
 * 100% Rule-Based & Explainable: Never invents rules, gives plain-language reasons.
 */

import { StorageService } from './storage.js';
import { Icons } from './icons.js';

export const ScholarshipMatcher = {
  evaluateEligibility(scholarship, profile) {
    const status = scholarship.verification_status || scholarship.status;
    // Unverified items cannot be matched with certainty
    if (status === 'unverified') {
      return {
        status: 'unverified',
        label: 'Verification Pending',
        badgeClass: 'badge-unverified',
        reasons: ['Official notification guidelines have not yet been gazetted. Marked unverified.']
      };
    }

    const rules = scholarship.eligibility_criteria || scholarship.eligibility || {};
    const criteriaChecks = [];
    let isDisqualified = false;
    let hasMissingContext = false;

    // 1. Gender Rule (e.g., AICTE Pragati)
    if (rules.gender && rules.gender === 'Female') {
      if (profile.gender === 'Female') {
        criteriaChecks.push({ name: 'Gender', met: true, reason: 'Meets female eligibility requirement.' });
      } else if (profile.gender === 'Male') {
        isDisqualified = true;
        criteriaChecks.push({ name: 'Gender', met: false, reason: 'Exclusively reserved for female students.' });
      } else {
        hasMissingContext = true;
        criteriaChecks.push({ name: 'Gender', met: null, reason: 'Reserved for female candidates (specify gender in profile).' });
      }
    }

    // 2. Domicile / State Rule (e.g., MahaDBT)
    if (rules.states && rules.states.length > 0 && !rules.states.includes('All India')) {
      if (profile.state && rules.states.includes(profile.state)) {
        criteriaChecks.push({ name: 'State Domicile', met: true, reason: `Resident of ${profile.state} (meets domicile rule).` });
      } else if (profile.state && profile.state !== 'All India / Other') {
        isDisqualified = true;
        criteriaChecks.push({ name: 'State Domicile', met: false, reason: `Requires ${rules.states.join(', ')} domicile certificate.` });
      } else {
        hasMissingContext = true;
        criteriaChecks.push({ name: 'State Domicile', met: null, reason: `Requires domicile in ${rules.states.join(', ')}.` });
      }
    }

    // 3. Category / Reservation Rule
    if (rules.categories && rules.categories.length > 0 && !rules.categories.includes('All')) {
      if (rules.minorityOnly) {
        if (profile.category === 'Minority') {
          criteriaChecks.push({ name: 'Community', met: true, reason: 'Belongs to notified minority community.' });
        } else if (profile.category) {
          isDisqualified = true;
          criteriaChecks.push({ name: 'Community', met: false, reason: 'Restricted to notified religious minority communities.' });
        } else {
          hasMissingContext = true;
          criteriaChecks.push({ name: 'Community', met: null, reason: 'Check your category in profile to verify minority eligibility.' });
        }
      } else if (rules.disabilityRequired) {
        if (profile.category === 'PwD') {
          criteriaChecks.push({ name: 'Disability / PwD', met: true, reason: 'Qualifies under Specially-Abled / PwD quota.' });
        } else if (profile.category) {
          isDisqualified = true;
          criteriaChecks.push({ name: 'Disability / PwD', met: false, reason: 'Requires medical disability certificate (>= 40%).' });
        } else {
          hasMissingContext = true;
          criteriaChecks.push({ name: 'Disability / PwD', met: null, reason: 'Reserved for students with >= 40% disability.' });
        }
      } else {
        const matchesCategory = rules.categories.includes(profile.category);
        if (matchesCategory) {
          criteriaChecks.push({ name: 'Category', met: true, reason: `Eligible under ${profile.category} category quota.` });
        } else if (profile.category) {
          isDisqualified = true;
          criteriaChecks.push({ name: 'Category', met: false, reason: `Reserved for ${rules.categories.join(' / ')} candidates.` });
        } else {
          hasMissingContext = true;
          criteriaChecks.push({ name: 'Category', met: null, reason: `Applicable to ${rules.categories.join(' / ')}.` });
        }
      }
    }

    // 4. Annual Family Income Cap
    if (rules.incomeCap) {
      if (!profile.income) {
        hasMissingContext = true;
        criteriaChecks.push({ name: 'Family Income', met: null, reason: `Must have family income under ${rules.incomeCapFormatted}. (Add income in profile to verify)` });
      } else {
        let numericEst = 9999999;
        if (profile.income.includes('< 1.5')) numericEst = 140000;
        else if (profile.income.includes('1.5L - 2.5L')) numericEst = 220000;
        else if (profile.income.includes('2.5L - 8L')) numericEst = 600000;
        else if (profile.income.includes('> 8 Lakhs')) numericEst = 900000;

        if (numericEst <= rules.incomeCap) {
          criteriaChecks.push({ name: 'Family Income', met: true, reason: `Your income tier (${profile.income}) is under the ${rules.incomeCapFormatted} cap.` });
        } else {
          isDisqualified = true;
          criteriaChecks.push({ name: 'Family Income', met: false, reason: `Your stated income (${profile.income}) exceeds the ${rules.incomeCapFormatted} limit.` });
        }
      }
    }

    // 5. Academic Marks Requirement
    if (rules.minMarks) {
      if (!profile.marks) {
        hasMissingContext = true;
        criteriaChecks.push({ name: 'Academic Marks', met: null, reason: rules.marksRequirementText || `Requires minimum ${rules.minMarks}% marks.` });
      } else {
        let studentPctScore = 50;
        if (profile.marks === 'Above 90%') studentPctScore = 95;
        else if (profile.marks === '75% - 90%') studentPctScore = 82;
        else if (profile.marks === '60% - 75%') studentPctScore = 68;
        else if (profile.marks === 'Below 60%') studentPctScore = 55;

        if (studentPctScore >= rules.minMarks) {
          criteriaChecks.push({ name: 'Academic Marks', met: true, reason: `Your marks (${profile.marks}) meet the minimum requirement (${rules.minMarks}%).` });
        } else {
          isDisqualified = true;
          criteriaChecks.push({ name: 'Academic Marks', met: false, reason: `Your marks (${profile.marks}) are below the required threshold (${rules.minMarks}%).` });
        }
      }
    }

    // Final Determination
    if (isDisqualified) {
      return {
        status: 'ineligible',
        label: 'Not Eligible',
        badgeClass: 'badge-ineligible',
        checks: criteriaChecks
      };
    } else if (hasMissingContext || !StorageService.isProfileComplete(profile)) {
      return {
        status: 'partial',
        label: 'Possibly Eligible (Missing Info)',
        badgeClass: 'badge-partial',
        checks: criteriaChecks
      };
    } else {
      return {
        status: 'eligible',
        label: 'Eligible',
        badgeClass: 'badge-eligible',
        checks: criteriaChecks
      };
    }
  }
};
