const fs = require('fs');
const http = require('http');
const path = require('path');

console.log('=== STARTING CAREERCONNECT FEATURE SUITE TESTS ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. DATASETS INTEGRITY
console.log('1. Testing Quiz & Roadmap Datasets:');
const careers = JSON.parse(fs.readFileSync('data/careers.json', 'utf8'));
const q10 = JSON.parse(fs.readFileSync('data/quiz-class10.json', 'utf8'));
const q11 = JSON.parse(fs.readFileSync('data/quiz-class11.json', 'utf8'));
const q12 = JSON.parse(fs.readFileSync('data/quiz-class12.json', 'utf8'));
const roadmapsData = JSON.parse(fs.readFileSync('data/roadmaps-data.json', 'utf8'));

assert(careers.length === 110, `All 110 careers intact in careers.json (Found: ${careers.length})`);
assert(q10.length >= 15 && q10.length <= 20, `Class 10 Quiz has 15-20 questions (Found: ${q10.length})`);
assert(q11.length >= 18 && q11.length <= 22, `Class 11 Quiz has 18-22 questions (Found: ${q11.length})`);
assert(q12.length >= 20 && q12.length <= 25, `Class 12 Quiz has 20-25 questions (Found: ${q12.length})`);
assert(q11[0].isStreamSelector === true, 'Class 11 Quiz begins with current stream & subject selector');
assert(q12[0].isStreamSelector === true, 'Class 12 Quiz begins with stream & exact subjects');
assert(Object.keys(roadmapsData.archetypes).length >= 10, `Roadmaps data covers 10+ major archetypes (Found: ${Object.keys(roadmapsData.archetypes).length})`);

// 2. CLASS 10 SOFTWARE ENGINEERING PATHWAY
console.log('\n2. Testing Class 10 Software Engineering Roadmap:');
const seArch = roadmapsData.archetypes['software-engineering'];
assert(Boolean(seArch), 'Software engineering archetype found');
const seC10 = seArch.class10;
assert(Boolean(seC10 && seC10.routes && seC10.routes.length >= 2), 'Class 10 has multiple valid routes');
const seRouteA = seC10.routes.find(r => r.id === 'route-a');
const seRouteB = seC10.routes.find(r => r.id === 'route-b');
assert(Boolean(seRouteA), 'Route A (School 11-12 PCM -> B.Tech) exists');
assert(Boolean(seRouteB), 'Route B (Polytechnic Diploma -> Lateral Entry B.Tech) exists');
assert(seRouteA.steps[0].stage.includes('Class 10'), 'Route A starts after Class 10');
assert(seRouteB.steps[1].course.toLowerCase().includes('diploma'), 'Route B includes technical polytechnic diploma');
assert(seRouteB.steps[2].course.toLowerCase().includes('lateral entry') || seRouteB.steps[2].course.toLowerCase().includes('second year'), 'Route B details lateral entry');
assert(Boolean(seC10.comparison && seC10.comparison.factors), 'Route comparison matrix exists for Software Engineering');

// 3. CLASS 10 MEDICINE / DOCTOR PATHWAY
console.log('\n3. Testing Class 10 Medicine / Doctor Pathway:');
const medArch = roadmapsData.archetypes['medicine-doctor'];
assert(Boolean(medArch), 'Medicine / Doctor archetype found');
const medC10 = medArch.class10;
const medRouteA = medC10.routes[0];
assert(medRouteA.steps[1].course.includes('PCB'), 'Medical pathway specifies Class 11-12 Science with PCB');
assert(medRouteA.steps[1].entranceExams.some(e => e.name.includes('NEET-UG')), 'NEET-UG is specified as mandatory entrance exam');
assert(medRouteA.steps[3].course.includes('MBBS'), 'MBBS specified as required degree');
assert(medC10.comparison.factors.some(f => f.routeA.includes('NO shortcut or diploma')), 'Explicitly clarifies NO diploma shortcut exists to become an allopathic doctor');

// 4. CLASS 10 CHARTERED ACCOUNTANCY PATHWAY
console.log('\n4. Testing Class 10 Chartered Accountancy Pathway:');
const caArch = roadmapsData.archetypes['chartered-accountancy'];
assert(Boolean(caArch), 'Chartered Accountancy archetype found');
const caRouteA = caArch.class10.routes.find(r => r.id === 'route-a');
const caRouteB = caArch.class10.routes.find(r => r.id === 'route-b');
assert(Boolean(caRouteA), 'CA Foundation route from school exists');
assert(Boolean(caRouteB), 'Direct Entry route for graduates exists');
assert(caRouteA.steps[2].entranceExams.some(e => e.name.includes('ICAI') || e.name.includes('Foundation')), 'ICAI CA Foundation exam included');
assert(caRouteA.steps[3].course.includes('Articleship'), 'Mandatory practical articleship included');

// 5. CLASS-ADAPTIVE STARTING STAGE TEST
console.log('\n5. Testing Class-Adaptive Roadmap Starting Points:');
const seC11 = seArch.class11;
const seC12 = seArch.class12;
assert(Boolean(seC11), 'Class 11 specific roadmap exists');
assert(Boolean(seC12), 'Class 12 specific roadmap exists');
assert(seC11.routes[0].steps[0].stage.includes('Class 11'), 'Class 11 roadmap starts directly at Class 11 academic focus');
assert(seC12.routes[0].steps[0].stage.includes('Class 12'), 'Class 12 roadmap starts directly at Class 12 immediate admissions');

// 6. SCORING & RECOMMENDATION ENGINE SIMULATION
console.log('\n6. Testing Quiz Scoring & Distinct Recommendations:');
// Profile A: Student choosing Math, Coding, Logic
const scoresA = {};
careers.forEach(c => scoresA[c.id] = 0);
q10[0].options[0].scores && Object.entries(q10[0].options[0].scores).forEach(([cid, pts]) => scoresA[cid] = (scoresA[cid]||0) + pts);
q10[0].options[4].scores && Object.entries(q10[0].options[4].scores).forEach(([cid, pts]) => scoresA[cid] = (scoresA[cid]||0) + pts);
const topRecsA = Object.keys(scoresA).sort((a,b) => scoresA[b] - scoresA[a]).slice(0, 5);

// Profile B: Student choosing Biology, Healthcare, Lab
const scoresB = {};
careers.forEach(c => scoresB[c.id] = 0);
q10[0].options[1].scores && Object.entries(q10[0].options[1].scores).forEach(([cid, pts]) => scoresB[cid] = (scoresB[cid]||0) + pts);
q10[1].options[3].scores && Object.entries(q10[1].options[3].scores).forEach(([cid, pts]) => scoresB[cid] = (scoresB[cid]||0) + pts);
const topRecsB = Object.keys(scoresB).sort((a,b) => scoresB[b] - scoresB[a]).slice(0, 5);

console.log('  Profile A (Tech/Math) Top Recs:', topRecsA);
console.log('  Profile B (Medical/Bio) Top Recs:', topRecsB);
assert(topRecsA.includes('software-developer'), 'Tech profile recommends software developer');
assert(topRecsB.includes('doctor-medical-practitioner'), 'Medical profile recommends doctor/medical practitioner');
assert(topRecsA[0] !== topRecsB[0], 'Meaningfully different answers produce distinctly different top recommendations');

// 7. HTTP SERVER HEALTH CHECK
console.log('\n7. Testing Live Server Endpoints:');
const endpoints = [
  '/',
  '/index.html',
  '/explore.html',
  '/career.html?id=software-developer&class=10',
  '/career.html?id=doctor-medical-practitioner&class=11',
  '/career.html?id=chartered-accountant&class=12',
  '/quiz.html',
  '/quiz.html?class=10',
  '/quiz.html?class=11',
  '/quiz.html?class=12',
  '/roadmaps.html',
  '/roadmaps.html?career=software-developer&class=10',
  '/roadmaps.html?career=doctor-medical-practitioner&class=11',
  '/roadmaps.html?career=chartered-accountant&class=12',
  '/pathways.html',
  '/scholarships.html',
  '/data/quiz-class10.json',
  '/data/quiz-class11.json',
  '/data/quiz-class12.json',
  '/data/roadmaps-data.json',
  '/data/careers.json'
];

let checkedCount = 0;

endpoints.forEach(ep => {
  const req = http.get(`http://127.0.0.1:3000${ep}`, (res) => {
    assert(res.statusCode === 200, `HTTP GET ${ep} returned ${res.statusCode} OK`);
    checkedCount++;
    if (checkedCount === endpoints.length) {
      console.log(`\n==============================================`);
      console.log(`TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
      console.log(`==============================================`);
    }
  });
  req.on('error', (err) => {
    assert(false, `HTTP GET ${ep} failed: ${err.message}`);
    checkedCount++;
  });
});
