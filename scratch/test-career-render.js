const fs = require('fs');
const path = require('path');

const careers = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'careers.json'), 'utf8'));
const roadmapsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'roadmaps-data.json'), 'utf8'));

console.log('Total careers loaded:', careers.length);

// Also check all links in HTML files to see if any link to invalid career IDs
const htmlFiles = [
  'index.html',
  'explore.html',
  'roadmaps.html',
  'pathways.html',
  'quiz.html',
  'scholarships.html',
  'resources.html'
];

const careerIdsInDb = new Set(careers.map(c => c.id));
console.log('Unique IDs in data/careers.json:', careerIdsInDb.size);

// Check if aerospace-engineer is in careerIdsInDb
console.log('aerospace-engineer exists?', careerIdsInDb.has('aerospace-engineer'));

// Scan careers directory if any HTML exists there
const careersDir = path.join(__dirname, '..', 'careers');
if (fs.existsSync(careersDir)) {
  const cFiles = fs.readdirSync(careersDir);
  console.log('Files in careers/:', cFiles);
  for (const cf of cFiles) {
    const content = fs.readFileSync(path.join(careersDir, cf), 'utf8');
    const matches = content.match(/career\.html\?id=([a-zA-Z0-9_-]+)/g) || [];
    for (const m of matches) {
      const id = m.split('=')[1];
      if (!careerIdsInDb.has(id)) {
        console.log(`Missing career ID linked in careers/${cf}: ${id}`);
      }
    }
  }
}

for (const hf of htmlFiles) {
  const fPath = path.join(__dirname, '..', hf);
  if (fs.existsSync(fPath)) {
    const content = fs.readFileSync(fPath, 'utf8');
    const matches = content.match(/career\.html\?id=([a-zA-Z0-9_-]+)/g) || [];
    for (const m of matches) {
      const id = m.split('=')[1];
      if (!careerIdsInDb.has(id)) {
        console.log(`Missing career ID linked in ${hf}: ${id}`);
      }
    }
  }
}

// Now test full rendering of each career
function getArchetypeForCareer(career) {
  if (!roadmapsData || !roadmapsData.archetypes) return null;
  const archs = roadmapsData.archetypes;
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
}

let renderErrors = [];

for (const career of careers) {
  try {
    const title = career.title || career.name;
    const summary = career.summary || career.shortDescription;
    const category = career.category || 'Professional Career';
    const workType = career.workType || 'Technical';
    const sector = career.sector || 'Government & Private';
    const educationLevel = career.educationLevel || 'Undergraduate';
    const qualification = career.qualification || career.minQualification || "Bachelor's Degree";
    const lastVerified = career.lastVerified || (career.salaryDetails && career.salaryDetails.lastVerified) || 'October 2024';

    const responsibilities = career.responsibilities || career.mainResponsibilities || [];
    const qualities = career.qualities || career.importantQualities || [];
    const pathways = career.educationPathways || career.entryRoutes || [];

    const archetype = getArchetypeForCareer(career);
    const selectedClass = '10';
    const classKey = 'class10';
    const classData = archetype && archetype.data ? (archetype.data[classKey] || archetype.data['class10']) : null;
    const primaryRoadmapRoute = classData && classData.routes ? classData.routes[0] : null;

    const examDetails = career.entranceExamsDetails || career.requiredExams || [];
    const skills = career.skillsBreakdown || career.skills || {};
    const softSkills = skills.soft || skills.interpersonal || [];
    const opportunities = career.jobOpportunities || career.jobRoles || [];
    const progression = career.progression || [];
    const growthLadder = career.growthLadder || [];

    const salary = career.salaryDetails || (career.salary && {
      entryLevel: (career.salary.entry && (career.salary.entry.formatted || career.salary.entry.range)) || '₹3.5L - ₹6.5L LPA',
      midLevel: (career.salary.mid && (career.salary.mid.formatted || career.salary.mid.range)) || '₹7.5L - ₹15.0L LPA',
      experienced: (career.salary.experienced && (career.salary.experienced.formatted || career.salary.experienced.range)) || '₹16.0L - ₹30.0L+ LPA',
      source: career.salary.source || 'Industry Reports & Pay Commissions',
      lastVerified: career.salary.lastVerified || 'October 2024',
      disclaimer: career.salary.disclaimer || 'Salaries in India vary.'
    }) || {
      entryLevel: '₹3.5L - ₹6.5L LPA',
      midLevel: '₹7.5L - ₹15.0L LPA',
      experienced: '₹16.0L - ₹30.0L+ LPA',
      source: 'Industry Reports & Pay Commissions',
      lastVerified: 'October 2024',
      disclaimer: 'Salaries vary.'
    };

    const projects = career.projects || career.practicalProjects || [];
    const resources = career.officialResources || [];
    const faqs = career.faqs || [];

    // Check array mapping
    if (responsibilities) responsibilities.slice(0, 5).map(r => r);
    if (qualities) qualities.slice(0, 4).map(q => q);
    if (pathways) pathways.map(route => route.name || route.title || route.pathway);
    if (examDetails) examDetails.map(exam => exam.name || exam.examName);
    if (skills.beginner) skills.beginner.map(s => s);
    if (skills.technical) skills.technical.map(s => s);
    if (skills.advanced) skills.advanced.map(s => s);
    if (softSkills) softSkills.map(s => s);
    if (skills.tools) skills.tools.map(s => s);
    if (skills.certifications) skills.certifications.map(s => s);
    if (opportunities) opportunities.map(opp => opp.title || opp.role || opp);
    if (progression && progression.length > 0) progression.map(s => s.role || s);
    else if (growthLadder) growthLadder.map(s => s);
    if (projects) projects.map(p => p.title || p.name);
    if (resources) resources.map(r => r.name);
    if (faqs) faqs.map(f => f.question);

  } catch (err) {
    renderErrors.push({ id: career.id, error: err.stack });
  }
}

console.log('Total render errors across all 110 careers:', renderErrors.length);
if (renderErrors.length > 0) {
  console.log(renderErrors);
}
