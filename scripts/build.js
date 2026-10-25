const fs = require('fs');
const path = require('path');

const catA = require('./data/catA');
const catB = require('./data/catB');
const catC = require('./data/catC');
const catD = require('./data/catD');
const catE = require('./data/catE');
const catF = require('./data/catF');
const catG = require('./data/catG');
const catH = require('./data/catH');
const catI = require('./data/catI');
const catJ = require('./data/catJ');

const rawCareers = [
  ...catA,
  ...catB,
  ...catC,
  ...catD,
  ...catE,
  ...catF,
  ...catG,
  ...catH,
  ...catI,
  ...catJ
];

console.log(`Loaded ${rawCareers.length} raw career records.`);

// Category Mapping Helper
const categoryMeta = {
  "Technology and Software": { code: "A", group: "Technology and Software", id: "category-a" },
  "Artificial Intelligence and Data": { code: "B", group: "Artificial Intelligence and Data", id: "category-b" },
  "Cybersecurity and Emerging Technology": { code: "C", group: "Cybersecurity and Emerging Technology", id: "category-c" },
  "Engineering and Core Industries": { code: "D", group: "Engineering and Core Industries", id: "category-d" },
  "Medical and Healthcare": { code: "E", group: "Medical and Healthcare", id: "category-e" },
  "Business, Finance and Management": { code: "F", group: "Business, Finance and Management", id: "category-f" },
  "Design, Media and Creative Careers": { code: "G", group: "Design, Media and Creative Careers", id: "category-g" },
  "Government, Law and Public Services": { code: "H", group: "Government, Law and Public Services", id: "category-h" },
  "Education, Science and Research": { code: "I", group: "Education, Science and Research", id: "category-i" },
  "Agriculture, Commerce and Other Professions": { code: "J", group: "Agriculture, Commerce and Other Professions", id: "category-j" }
};

// Normalization function to ensure every single career has complete, rich, dual-compatible schema
const normalizedCareers = rawCareers.map((c) => {
  const norm = { ...c };

  // Titles / Names
  norm.title = norm.title || norm.name;
  norm.name = norm.name || norm.title;

  // Summary / Description
  norm.summary = norm.summary || norm.shortDescription;
  norm.shortDescription = norm.shortDescription || norm.summary;

  // Category Metadata
  const meta = categoryMeta[norm.category] || { code: "Other", group: norm.category, id: "category-other" };
  norm.categoryCode = norm.categoryCode || meta.code;
  norm.categoryGroup = norm.categoryGroup || meta.group;
  norm.categoryId = norm.categoryId || meta.id;

  // Responsibilities
  norm.responsibilities = norm.responsibilities || norm.mainResponsibilities || [];
  norm.mainResponsibilities = norm.mainResponsibilities || norm.responsibilities;

  // Workplace
  norm.workplace = norm.workplace || norm.typicalWorkplace || "Standard Office / Enterprise Setup in India";
  norm.typicalWorkplace = norm.typicalWorkplace || norm.workplace;

  // Qualities
  norm.qualities = norm.qualities || norm.importantQualities || [];
  norm.importantQualities = norm.importantQualities || norm.qualities;

  // Qualifications / Stream
  norm.qualification = norm.qualification || norm.minQualification || "Bachelor's Degree";
  norm.minQualification = norm.minQualification || norm.qualification;
  norm.stream = norm.stream || "Class 12 / Higher Secondary in Relevant Stream";

  // Entry routes & education pathways
  if (norm.entryRoutes && !norm.educationPathways) {
    norm.educationPathways = norm.entryRoutes.map(r => ({
      pathway: r.name,
      title: r.name,
      duration: r.duration,
      eligibility: r.eligibility,
      description: r.description,
      isMandatory: (r.mandatoryVsOptional || "").toLowerCase().includes("mandatory")
    }));
  } else if (norm.educationPathways && !norm.entryRoutes) {
    norm.entryRoutes = norm.educationPathways.map(p => ({
      name: p.title || p.pathway,
      duration: p.duration,
      eligibility: p.eligibility,
      description: p.description,
      approxCost: "Standard University Fees",
      source: "UGC / Statutory Regulatory Guidelines",
      mandatoryVsOptional: p.isMandatory ? "Mandatory requirement" : "Recommended pathway"
    }));
  }

  // Entrance exams
  norm.entranceExams = norm.entranceExams || [];
  if (norm.requiredExams && !norm.entranceExamsDetails) {
    norm.entranceExamsDetails = norm.requiredExams.map(ex => ({
      name: ex.examName || ex.name,
      conductingBody: ex.conductingBody || "National / State Examination Authority",
      purpose: ex.purpose || "Admission / Recruitment Qualification",
      frequency: ex.frequency || "Annual",
      details: ex.details || ex.notes || "National Level Examination",
      isMandatory: !!ex.compulsory
    }));
    if (norm.entranceExams.length === 0) {
      norm.entranceExams = norm.requiredExams.map(ex => ex.examName || ex.name);
    }
  } else if (norm.entranceExamsDetails && !norm.requiredExams) {
    norm.requiredExams = norm.entranceExamsDetails.map(ex => ({
      examName: ex.name,
      conductingBody: ex.conductingBody,
      purpose: ex.purpose,
      frequency: ex.frequency,
      details: ex.details,
      compulsory: ex.isMandatory
    }));
    if (norm.entranceExams.length === 0) {
      norm.entranceExams = norm.entranceExamsDetails.map(ex => ex.name);
    }
  }

  // Skills
  const s = norm.skillsBreakdown || norm.skills || {};
  const softList = s.soft || s.interpersonal || [];
  norm.skillsBreakdown = {
    beginner: s.beginner || [],
    technical: s.technical || [],
    advanced: s.advanced || [],
    soft: softList,
    interpersonal: softList,
    tools: s.tools || [],
    certifications: s.certifications || []
  };
  norm.skills = norm.skillsBreakdown;

  // Job opportunities / Roles
  if (norm.jobRoles && !norm.jobOpportunities) {
    norm.jobOpportunities = norm.jobRoles.map(j => ({
      title: j.role || j.title || j,
      type: j.type || "Industry Specialization",
      description: j.description || j.duties || "Key specialized professional role."
    }));
  } else if (norm.jobOpportunities && !norm.jobRoles) {
    norm.jobRoles = norm.jobOpportunities.map(j => ({
      role: j.title,
      type: j.type,
      description: j.description
    }));
  }

  // Growth ladder & progression
  if (norm.growthLadder && !norm.progression) {
    norm.progression = norm.growthLadder.map((step, idx) => ({
      stage: `Stage ${idx + 1}`,
      role: typeof step === 'string' ? step.split(':')[0] : (step.role || `Step ${idx+1}`),
      experience: typeof step === 'string' ? "Milestone" : (step.experience || ""),
      focus: typeof step === 'string' ? step : (step.focus || "")
    }));
  } else if (norm.progression && !norm.growthLadder) {
    norm.growthLadder = norm.progression.map(p => `${p.role} (${p.experience}): ${p.focus}`);
  }

  // Salary normalization
  if (norm.salaryDetails && !norm.salary) {
    norm.salary = {
      entry: { range: norm.salaryDetails.entryLevel, formatted: norm.salaryDetails.entryLevel },
      mid: { range: norm.salaryDetails.midLevel, formatted: norm.salaryDetails.midLevel },
      experienced: { range: norm.salaryDetails.experienced, formatted: norm.salaryDetails.experienced },
      currency: "INR",
      source: norm.salaryDetails.source || "Indian Industry Salary Surveys & Government Pay Commissions",
      lastVerified: norm.salaryDetails.lastVerified || "October 2024",
      disclaimer: norm.salaryDetails.disclaimer || "Salary varies based on location, employer, qualifications, and experience."
    };
  } else if (norm.salary && !norm.salaryDetails) {
    norm.salaryDetails = {
      entryLevel: norm.salary.entry ? (norm.salary.entry.formatted || norm.salary.entry.range) : "₹3L - ₹6L LPA",
      midLevel: norm.salary.mid ? (norm.salary.mid.formatted || norm.salary.mid.range) : "₹7L - ₹15L LPA",
      experienced: norm.salary.experienced ? (norm.salary.experienced.formatted || norm.salary.experienced.range) : "₹16L - ₹30L+ LPA",
      source: norm.salary.source || "Industry Reports & Pay Commissions",
      lastVerified: norm.salary.lastVerified || "October 2024",
      payScaleType: norm.sector.includes("Government") ? "Official 7th CPC Pay Scale" : "Market-driven Industry CTC",
      disclaimer: norm.salary.disclaimer || "Salaries in India vary by city tier, institution tier, and candidate skill."
    };
  }

  // Practical Projects
  if (norm.practicalProjects && !norm.projects) {
    norm.projects = norm.practicalProjects.map(p => ({
      title: p.title || p.name,
      type: p.type || "Practical Project",
      description: p.description,
      learningOutcome: p.learningOutcome || p.impact || "Hands-on domain skills application."
    }));
  } else if (norm.projects && !norm.practicalProjects) {
    norm.practicalProjects = norm.projects.map(p => ({
      title: p.title,
      type: p.type,
      description: p.description,
      learningOutcome: p.learningOutcome
    }));
  }

  // Official resources & FAQs
  norm.officialResources = norm.officialResources || [];
  norm.faqs = norm.faqs || [];

  return norm;
});

// Check unique IDs
const idMap = new Map();
normalizedCareers.forEach((c, idx) => {
  if (idMap.has(c.id)) {
    console.error(`Duplicate ID found: '${c.id}' at index ${idx} and ${idMap.get(c.id)}`);
    process.exit(1);
  }
  idMap.set(c.id, idx);
});

console.log(`All ${normalizedCareers.length} career IDs are unique!`);

// Write out to data/careers.json
const outputPath = path.join(__dirname, '..', 'data', 'careers.json');
fs.writeFileSync(outputPath, JSON.stringify(normalizedCareers, null, 2), 'utf-8');
console.log(`\nSuccessfully compiled and wrote ${normalizedCareers.length} careers to ${outputPath}`);

// Summary by category
const catCounts = {};
normalizedCareers.forEach(c => {
  catCounts[c.category] = (catCounts[c.category] || 0) + 1;
});
console.log("\nSummary by Category:");
Object.entries(catCounts).forEach(([cat, cnt]) => {
  console.log(`- ${cat}: ${cnt} careers`);
});
