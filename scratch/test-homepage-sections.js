const http = require('http');
const fs = require('fs');

console.log('=== STARTING HOMEPAGE SCHOLARSHIPS & PORTALS VERIFICATION ===\n');

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

function fetchUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: '127.0.0.1',
      port: 3000,
      path: urlPath
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function runTests() {
  const indexHtml = fs.readFileSync('index.html', 'utf8');

  // 1. POSITIONING & SECTIONS VERIFICATION
  console.log('1. Verifying Section Order & Structure:');
  const careerDossiersPos = indexHtml.indexOf('In-Demand Career Dossiers');
  const scholarshipsPos = indexHtml.indexOf('id="scholarshipsSection"');
  const portalsPos = indexHtml.indexOf('id="portalsSection"');

  assert(careerDossiersPos !== -1, 'Career Exploration section is present');
  assert(scholarshipsPos !== -1, 'Scholarships section (#scholarshipsSection) is present');
  assert(portalsPos !== -1, 'Important Educational Portals section (#portalsSection) is present');
  assert(scholarshipsPos > careerDossiersPos, 'Scholarships section is positioned below Career Exploration');
  assert(portalsPos > scholarshipsPos, 'Educational Portals section is positioned below Scholarships section');

  // 2. SCHOLARSHIP CARDS VERIFICATION
  console.log('\n2. Verifying 4 Core Scholarship Cards & Verified Content:');
  
  // Card 1: NSP
  assert(indexHtml.includes('National Scholarship Portal (NSP)'), 'Card 1: National Scholarship Portal (NSP) present');
  assert(indexHtml.includes('Top 20th percentile in Class 12 boards') && indexHtml.includes('₹4.5 Lakhs/year'), 'NSP has verified eligibility information');
  assert(indexHtml.includes('https://scholarships.gov.in/'), 'NSP card has link to official https://scholarships.gov.in/');

  // Card 2: MahaDBT
  assert(indexHtml.includes('Maharashtra Scholarships (MahaDBT)'), 'Card 2: MahaDBT Scholarships present');
  assert(indexHtml.includes('Maharashtra domicile') && indexHtml.includes('₹8 Lakhs/year'), 'MahaDBT has verified eligibility information');
  assert(indexHtml.includes('https://mahadbt.maharashtra.gov.in/'), 'MahaDBT card has link to official https://mahadbt.maharashtra.gov.in/');

  // Card 3: AICTE
  assert(indexHtml.includes('AICTE Scholarships (Pragati & Saksham)'), 'Card 3: AICTE Scholarships present');
  assert(indexHtml.includes('Admitted to AICTE-approved institute') && indexHtml.includes('max 2 girls per family'), 'AICTE has verified eligibility information');
  assert(indexHtml.includes('https://www.aicte-india.org/'), 'AICTE card has link to official https://www.aicte-india.org/');

  // Card 4: College and University Scholarships
  assert(indexHtml.includes('College & University Scholarships'), 'Card 4: College & University Scholarships present');
  assert(indexHtml.includes('UGC-recognized universities') && indexHtml.includes('60%-75%'), 'College & University has verified eligibility information');
  assert(indexHtml.includes('https://www.ugc.gov.in/'), 'College & University card has link to official https://www.ugc.gov.in/');

  // 3. IMPORTANT EDUCATIONAL PORTALS VERIFICATION
  console.log('\n3. Verifying 7 Important Educational Portal Cards:');

  assert(indexHtml.includes('Important Educational Portals'), 'Title "Important Educational Portals" present');
  assert(indexHtml.includes('National Scholarship Portal —') || indexHtml.includes('National Scholarship Portal (NSP)'), 'Portal 1: National Scholarship Portal present');
  assert(indexHtml.includes('MahaDBT (Aaple Sarkar)'), 'Portal 2: MahaDBT present');
  assert(indexHtml.includes('National Testing Agency (NTA)'), 'Portal 3: National Testing Agency present');
  assert(indexHtml.includes('https://nta.ac.in/'), 'NTA official website link verified');
  assert(indexHtml.includes('JEE (Main) Portal'), 'Portal 4: JEE Main present');
  assert(indexHtml.includes('https://jeemain.nta.nic.in/'), 'JEE Main official website link verified');
  assert(indexHtml.includes('NEET-UG Portal'), 'Portal 5: NEET-UG present');
  assert(indexHtml.includes('https://exams.nta.ac.in/NEET/'), 'NEET-UG official website link verified');
  assert(indexHtml.includes('Maharashtra CET Cell'), 'Portal 6: Maharashtra CET Cell present');
  assert(indexHtml.includes('https://cetcell.mahacet.org/'), 'Maharashtra CET Cell official website link verified');
  assert(indexHtml.includes('DTE Maharashtra'), 'Portal 7: Directorate of Technical Education present');
  assert(indexHtml.includes('https://www.dtemaharashtra.gov.in/'), 'DTE Maharashtra official website link verified');

  // 4. NAVIGATION & FUNCTIONALITY
  console.log('\n4. Verifying Navigation & Live HTTP Response:');
  const componentsJs = fs.readFileSync('js/components.js', 'utf8');
  assert(componentsJs.includes('scholarships.html'), 'Navigation bar includes Scholarships link');
  assert(indexHtml.includes('href="scholarships.html"'), 'Buttons connect to internal scholarships.html page');
  assert(indexHtml.includes('href="resources.html"'), 'Buttons connect to internal resources.html page');

  const liveRes = await fetchUrl('/index.html');
  assert(liveRes.statusCode === 200, 'HTTP GET /index.html returns 200 OK');
  assert(liveRes.data.includes('scholarshipsSection'), 'Live server serves updated scholarshipsSection');
  assert(liveRes.data.includes('portalsSection'), 'Live server serves updated portalsSection');

  console.log(`\n=== HOMEPAGE SECTIONS TEST SUMMARY ===`);
  console.log(`Results: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)\n`);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
