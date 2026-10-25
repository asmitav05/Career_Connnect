const fs = require('fs');
const path = require('path');

const careers = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'careers.json'), 'utf8'));

console.log('--- COMPREHENSIVE CAREERS AUDIT ---');
console.log('Total careers:', careers.length);

const arrayFields = [
  'responsibilities',
  'qualities',
  'educationPathways',
  'entranceExamsDetails',
  'jobOpportunities',
  'progression',
  'projects',
  'officialResources',
  'faqs'
];

const issues = {};

for (const c of careers) {
  const cIssues = [];

  // Check responsibilities
  const resp = c.responsibilities || c.mainResponsibilities;
  if (!resp) cIssues.push('missing responsibilities');
  else if (!Array.isArray(resp)) cIssues.push(`responsibilities is ${typeof resp}`);

  // Check qualities
  const qual = c.qualities || c.importantQualities;
  if (!qual) cIssues.push('missing qualities');
  else if (!Array.isArray(qual)) cIssues.push(`qualities is ${typeof qual}`);

  // Check educationPathways
  const ep = c.educationPathways || c.entryRoutes;
  if (!ep) cIssues.push('missing educationPathways');
  else if (!Array.isArray(ep)) cIssues.push(`educationPathways is ${typeof ep}`);

  // Check entranceExamsDetails
  const exams = c.entranceExamsDetails || c.requiredExams;
  if (exams && !Array.isArray(exams)) cIssues.push(`entranceExamsDetails is ${typeof exams}`);

  // Check skills
  const skills = c.skillsBreakdown || c.skills;
  if (!skills) cIssues.push('missing skills');
  else if (typeof skills !== 'object') cIssues.push(`skills is ${typeof skills}`);
  else {
    const subArrays = ['beginner', 'technical', 'advanced', 'soft', 'tools', 'certifications'];
    for (const sub of subArrays) {
      if (skills[sub] && !Array.isArray(skills[sub])) {
        cIssues.push(`skills.${sub} is ${typeof skills[sub]}`);
      }
    }
  }

  // Check jobOpportunities
  const opps = c.jobOpportunities || c.jobRoles;
  if (opps && !Array.isArray(opps)) cIssues.push(`jobOpportunities is ${typeof opps}`);

  // Check progression
  const prog = c.progression;
  const growth = c.growthLadder;
  if (prog && !Array.isArray(prog)) cIssues.push(`progression is ${typeof prog}`);
  if (growth && !Array.isArray(growth)) cIssues.push(`growthLadder is ${typeof growth}`);

  // Check projects
  const proj = c.projects || c.practicalProjects;
  if (proj && !Array.isArray(proj)) cIssues.push(`projects is ${typeof proj}`);

  // Check officialResources
  const res = c.officialResources;
  if (res && !Array.isArray(res)) cIssues.push(`officialResources is ${typeof res}`);

  // Check faqs
  const faqs = c.faqs;
  if (faqs && !Array.isArray(faqs)) cIssues.push(`faqs is ${typeof faqs}`);

  if (cIssues.length > 0) {
    issues[c.id] = cIssues;
  }
}

console.log(`Careers with format issues: ${Object.keys(issues).length} / ${careers.length}`);
console.log(JSON.stringify(issues, null, 2));
