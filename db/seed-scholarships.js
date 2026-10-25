/**
 * CareerConnect Real Verified Scholarship Seeder
 * Populates the persistent database with 12 genuine, verified schemes from:
 * 1. National Scholarship Portal (scholarships.gov.in)
 * 2. Maharashtra MahaDBT (mahadbt.maharashtra.gov.in)
 * 3. Directorate of Technical Education, Maharashtra (dte.maharashtra.gov.in)
 * 4. All India Council for Technical Education (aicte-india.org)
 * 5. University Grants Commission (ugc.gov.in)
 * 6. Department of Science & Technology (online-inspire.gov.in)
 */

const Database = require('./database.js');

const VERIFIED_SCHOLARSHIPS = [
  {
    id: "nmmss-central",
    name: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    description: "Centrally sponsored scheme by Department of School Education & Literacy to provide financial assistance to meritorious students of economically weaker sections to arrest drop-out after Class 8 and encourage secondary education.",
    provider: "Department of School Education & Literacy, Ministry of Education, Govt of India",
    portal_name: "National Scholarship Portal (NSP)",
    official_apply_url: "https://scholarships.gov.in/",
    official_info_url: "https://dsel.education.gov.in/scheme/nmmss",
    education_levels: ["Class 9", "Class 10", "Class 11", "Class 12"],
    courses: ["Secondary & Higher Secondary School Education (Class 9 to 12) in State Govt, Govt-aided, and Local Body schools"],
    eligibility_criteria: {
      gender: "All",
      incomeCap: 350000,
      incomeCapFormatted: "₹3.5 Lakhs / year",
      minMarks: 55,
      marksRequirementText: "Minimum 55% marks (50% for SC/ST) in Class 8 annual examination and qualified in State NMMSS selection test",
      schoolType: "Govt, Govt-aided, or Local Body schools only (KVS, NVS, and residential govt schools not eligible)",
      categories: ["All", "General", "OBC", "SC", "ST", "EWS"],
      states: ["All India"],
      stages: ["Class 9", "Class 10", "Class 11", "Class 12"]
    },
    amount_details: "₹12,000 per annum (₹1,000 per month credited directly through Direct Benefit Transfer - DBT from Class 9 to Class 12)",
    category: "Merit-cum-Means",
    academic_year: "2025-2026",
    opening_date: "2025-07-01",
    deadline: "Annually October - December on NSP (Verified for academic cycle)",
    last_verified_date: "2026-03-25",
    source_url: "https://scholarships.gov.in/",
    verification_status: "verified"
  },
  {
    id: "nsp-central-sector",
    name: "PM-USP Central Sector Scheme of Scholarship for College and University Students (CSSS)",
    description: "National flagship merit-cum-means scholarship by Department of Higher Education providing day-to-day study expenses to meritorious students from low-income families pursuing regular higher education.",
    provider: "Department of Higher Education, Ministry of Education, Govt of India",
    portal_name: "National Scholarship Portal (NSP)",
    official_apply_url: "https://scholarships.gov.in/",
    official_info_url: "https://scholarships.gov.in/",
    education_levels: ["Undergraduate", "Postgraduate"],
    courses: ["Regular Undergraduate (B.Tech, MBBS, B.Sc, B.Com, BA, etc.) and Postgraduate degree courses in UGC/AICTE recognized institutions"],
    eligibility_criteria: {
      gender: "All",
      incomeCap: 450000,
      incomeCapFormatted: "₹4.5 Lakhs / year",
      minMarks: 80,
      marksRequirementText: "Above 80th percentile of successful candidates in relevant stream in Class 12 board exams",
      admissionCriteria: "Pursuing regular (not correspondence or distance mode) degree courses in recognized higher education institutions",
      categories: ["All", "General", "OBC", "SC", "ST", "EWS"],
      states: ["All India"],
      stages: ["Class 12", "Undergraduate", "Postgraduate"]
    },
    amount_details: "₹12,000 per annum for first 3 years of Undergraduate level; ₹20,000 per annum at Postgraduate level",
    category: "Higher Education",
    academic_year: "2025-2026",
    opening_date: "2025-07-15",
    deadline: "Annually August - December on NSP (Check portal for active cycle)",
    last_verified_date: "2026-03-25",
    source_url: "https://scholarships.gov.in/",
    verification_status: "verified"
  },
  {
    id: "aicte-pragati",
    name: "AICTE Pragati Scholarship for Girls",
    description: "Empowering young women in technical and professional education through government financial grants covering tuition fees and academic development resources.",
    provider: "All India Council for Technical Education (AICTE), Ministry of Education",
    portal_name: "National Scholarship Portal (NSP) / AICTE Portal",
    official_apply_url: "https://scholarships.gov.in/",
    official_info_url: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
    education_levels: ["Diploma", "Undergraduate"],
    courses: ["Engineering & Technology (B.Tech / B.E.)", "Diploma in Engineering", "Architecture", "Pharmacy", "Hotel Management"],
    eligibility_criteria: {
      gender: "Female",
      maxPerFamily: 2,
      incomeCap: 800000,
      incomeCapFormatted: "₹8 Lakhs / year",
      minMarks: null,
      admissionCriteria: "Admitted to 1st year of Degree/Diploma level course OR 2nd year through lateral entry in an AICTE approved institution",
      categories: ["All", "General", "OBC", "SC", "ST", "EWS"],
      states: ["All India"],
      stages: ["Class 12", "Diploma", "Undergraduate"]
    },
    amount_details: "₹50,000 per annum (lump sum towards college tuition fee, computer/laptop purchase, books, stationeries, equipment)",
    category: "Technical Education",
    academic_year: "2025-2026",
    opening_date: "2025-08-01",
    deadline: "Annually October - December on NSP (Check official site for current cycle)",
    last_verified_date: "2026-03-25",
    source_url: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
    verification_status: "verified"
  },
  {
    id: "aicte-saksham",
    name: "AICTE Saksham Scholarship Scheme for Specially-Abled Students",
    description: "Dedicated government scheme to encourage specially-abled students to pursue technical degree and diploma education without financial barriers.",
    provider: "All India Council for Technical Education (AICTE)",
    portal_name: "National Scholarship Portal (NSP)",
    official_apply_url: "https://scholarships.gov.in/",
    official_info_url: "https://www.aicte-india.org/schemes/students-development-schemes/Saksham",
    education_levels: ["Diploma", "Undergraduate"],
    courses: ["Technical Degree (B.Tech/B.E.)", "Technical Diploma in AICTE approved institutions"],
    eligibility_criteria: {
      gender: "All",
      disabilityRequired: true,
      minDisabilityPercent: 40,
      incomeCap: 800000,
      incomeCapFormatted: "₹8 Lakhs / year",
      minMarks: null,
      admissionCriteria: "Admitted to 1st year of Degree/Diploma course OR 2nd year of Degree/Diploma through lateral entry in AICTE approved institution",
      categories: ["All", "General", "OBC", "SC", "ST", "EWS", "PwD"],
      states: ["All India"],
      stages: ["Class 12", "Diploma", "Undergraduate"]
    },
    amount_details: "₹50,000 per annum for every year of technical study",
    category: "Special Needs",
    academic_year: "2025-2026",
    opening_date: "2025-08-01",
    deadline: "Annually October - December on NSP",
    last_verified_date: "2026-03-25",
    source_url: "https://www.aicte-india.org/schemes/students-development-schemes/Saksham",
    verification_status: "verified"
  },
  {
    id: "aicte-swanath",
    name: "AICTE Swanath Scholarship Scheme",
    description: "Providing financial support of ₹50,000 annually to orphan students, candidates who lost parents to COVID-19, or wards of Armed and Paramilitary Forces martyred in action.",
    provider: "All India Council for Technical Education (AICTE)",
    portal_name: "National Scholarship Portal (NSP)",
    official_apply_url: "https://scholarships.gov.in/",
    official_info_url: "https://www.aicte-india.org/schemes/students-development-schemes/Swanath-Scholarship-Scheme",
    education_levels: ["Diploma", "Undergraduate"],
    courses: ["AICTE approved Degree & Diploma technical courses"],
    eligibility_criteria: {
      gender: "All",
      specificCriteria: "Orphan students, or candidates whose both parents died due to COVID-19, or wards of Armed Forces/Central Paramilitary Forces martyred in action",
      incomeCap: 800000,
      incomeCapFormatted: "₹8 Lakhs / year",
      minMarks: null,
      admissionCriteria: "Enrolled in AICTE recognized technical institutions as regular students",
      categories: ["All", "General", "OBC", "SC", "ST", "EWS"],
      states: ["All India"],
      stages: ["Class 12", "Diploma", "Undergraduate"]
    },
    amount_details: "₹50,000 per annum for tuition, equipment, and contingency",
    category: "Technical Education",
    academic_year: "2025-2026",
    opening_date: "2025-08-01",
    deadline: "Annually October - December on NSP",
    last_verified_date: "2026-03-25",
    source_url: "https://www.aicte-india.org/schemes/students-development-schemes/Swanath-Scholarship-Scheme",
    verification_status: "verified"
  },
  {
    id: "mahadbt-ebc",
    name: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)",
    description: "Flagship Maharashtra State tuition fee reimbursement scheme for economically weaker students enrolled in higher and technical education.",
    provider: "Directorate of Higher Education (DHE) & Directorate of Technical Education (DTE), Govt of Maharashtra",
    portal_name: "MahaDBT (Aaple Sarkar DBT Portal)",
    official_apply_url: "https://mahadbt.maharashtra.gov.in/",
    official_info_url: "https://mahadbt.maharashtra.gov.in/",
    education_levels: ["Diploma", "Undergraduate", "Postgraduate"],
    courses: ["B.Tech, B.E., B.Arch, B.Pharm, MBA, MCA, General B.A., B.Sc., B.Com, Diploma"],
    eligibility_criteria: {
      gender: "All",
      domicile: "Maharashtra",
      incomeCap: 800000,
      incomeCapFormatted: "₹8 Lakhs / year",
      minMarks: null,
      admissionCriteria: "Admitted through CAP (Centralized Admission Process) round in recognized colleges within Maharashtra",
      categories: ["General", "Open", "SEBC", "EWS"],
      states: ["Maharashtra"],
      stages: ["Class 12", "Diploma", "Undergraduate", "Postgraduate"]
    },
    amount_details: "50% of Tuition Fees and 50% of Exam Fees reimbursement directly to the college account",
    category: "State Welfare",
    academic_year: "2025-2026",
    opening_date: "2025-09-01",
    deadline: "Check MahaDBT Portal (Extended through academic terms, typically Dec - March)",
    last_verified_date: "2026-03-25",
    source_url: "https://mahadbt.maharashtra.gov.in/",
    verification_status: "verified"
  },
  {
    id: "mahadbt-hostel-allowance",
    name: "Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna (Hostel Allowance)",
    description: "Maharashtra State subsistence allowance supporting hostel accommodation and mess expenses for students admitted to professional courses outside their home towns.",
    provider: "Directorate of Technical Education (DTE), Govt of Maharashtra",
    portal_name: "MahaDBT (Aaple Sarkar DBT)",
    official_apply_url: "https://mahadbt.maharashtra.gov.in/",
    official_info_url: "https://dte.maharashtra.gov.in/",
    education_levels: ["Diploma", "Undergraduate", "Postgraduate"],
    courses: ["Professional and Technical Degree & Diploma courses approved by DTE/DHE Maharashtra"],
    eligibility_criteria: {
      gender: "All",
      domicile: "Maharashtra",
      admissionCriteria: "Admitted through CAP round and residing in government/private hostel or rented accommodation outside own district/taluka",
      specificCriteria: "Children of registered marginal landholders/laborers (Alpabhudharak) OR family income <= ₹8 Lakhs",
      incomeCap: 800000,
      incomeCapFormatted: "₹8 Lakhs / year",
      categories: ["General", "Open", "SEBC", "EWS"],
      states: ["Maharashtra"],
      stages: ["Class 12", "Diploma", "Undergraduate", "Postgraduate"]
    },
    amount_details: "₹30,000 per annum (for Mumbai/Pune/Nagpur/corporation areas) or ₹20,000 per annum (for other areas) for 10 months hostel subsistence",
    category: "State Welfare",
    academic_year: "2025-2026",
    opening_date: "2025-09-01",
    deadline: "Check MahaDBT Portal",
    last_verified_date: "2026-03-25",
    source_url: "https://dte.maharashtra.gov.in/",
    verification_status: "verified"
  },
  {
    id: "mahadbt-sc-postmatric",
    name: "Government of India Post-Matric Scholarship for SC Students",
    description: "Centrally sponsored Maharashtra state administered scheme providing complete tuition and exam fee coverage plus monthly maintenance for Scheduled Caste students.",
    provider: "Social Justice and Special Assistance Department, Govt of Maharashtra",
    portal_name: "MahaDBT (Aaple Sarkar DBT)",
    official_apply_url: "https://mahadbt.maharashtra.gov.in/",
    official_info_url: "https://mahadbt.maharashtra.gov.in/",
    education_levels: ["Class 11", "Class 12", "Diploma", "Undergraduate", "Postgraduate"],
    courses: ["All recognized post-matric professional, technical, and non-professional courses"],
    eligibility_criteria: {
      gender: "All",
      domicile: "Maharashtra",
      incomeCap: 250000,
      incomeCapFormatted: "₹2.5 Lakhs / year",
      minMarks: null,
      admissionCriteria: "Candidate must belong to Scheduled Caste / Navbouddha community of Maharashtra with valid caste certificate",
      categories: ["SC"],
      states: ["Maharashtra"],
      stages: ["Class 10", "Class 12", "Diploma", "Undergraduate", "Postgraduate"]
    },
    amount_details: "100% compulsory tuition fee, examination fee waiver, and monthly maintenance allowance (up to ₹1,200/month)",
    category: "Social Welfare",
    academic_year: "2025-2026",
    opening_date: "2025-08-15",
    deadline: "Check MahaDBT Portal",
    last_verified_date: "2026-03-25",
    source_url: "https://mahadbt.maharashtra.gov.in/",
    verification_status: "verified"
  },
  {
    id: "mahadbt-vjnt-obc",
    name: "Post-Matric Scholarship for VJNT, OBC and SBC Students",
    description: "Comprehensive fee reimbursement and maintenance scheme by Maharashtra Govt for Other Backward Classes, Vimukta Jati, Nomadic Tribes, and Special Backward Classes.",
    provider: "VJNT, OBC and SBC Welfare Department, Govt of Maharashtra",
    portal_name: "MahaDBT",
    official_apply_url: "https://mahadbt.maharashtra.gov.in/",
    official_info_url: "https://mahadbt.maharashtra.gov.in/",
    education_levels: ["Class 11", "Class 12", "Diploma", "Undergraduate", "Postgraduate"],
    courses: ["All recognized higher secondary, graduation, and post-graduation courses"],
    eligibility_criteria: {
      gender: "All",
      domicile: "Maharashtra",
      incomeCap: 150000,
      incomeCapFormatted: "₹1.5 Lakhs / year (100% concession) or up to ₹8L (50% fee concession)",
      minMarks: null,
      admissionCriteria: "Belonging to VJNT, OBC, or SBC category of Maharashtra state admitted via recognized process",
      categories: ["OBC", "VJNT", "SBC"],
      states: ["Maharashtra"],
      stages: ["Class 10", "Class 12", "Diploma", "Undergraduate", "Postgraduate"]
    },
    amount_details: "100% Tuition Fee & Exam Fee for income <= ₹1.5L, 50% concession for income ₹1.5L - ₹8L + Maintenance allowance",
    category: "Social Welfare",
    academic_year: "2025-2026",
    opening_date: "2025-08-15",
    deadline: "Check MahaDBT Portal",
    last_verified_date: "2026-03-25",
    source_url: "https://mahadbt.maharashtra.gov.in/",
    verification_status: "verified"
  },
  {
    id: "ugc-ishan-uday",
    name: "UGC Ishan Uday Special Scholarship for North Eastern Region (NER)",
    description: "Special scholarship initiative by University Grants Commission (UGC) to promote higher education and technical studies for youth of North Eastern States.",
    provider: "University Grants Commission (UGC), Ministry of Education, Govt of India",
    portal_name: "National Scholarship Portal (NSP) / UGC Portal",
    official_apply_url: "https://scholarships.gov.in/",
    official_info_url: "https://www.ugc.gov.in/Home/student_Corner",
    education_levels: ["Undergraduate"],
    courses: ["General Degree (BA, B.Sc, B.Com), Technical, Medical, and Professional degree courses in recognized universities/colleges"],
    eligibility_criteria: {
      gender: "All",
      domicile: "North Eastern States (Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura)",
      incomeCap: 450000,
      incomeCapFormatted: "₹4.5 Lakhs / year",
      minMarks: null,
      admissionCriteria: "Passed Class 12 board from NER and enrolled in 1st year of any recognized general or technical undergraduate course",
      categories: ["All", "General", "OBC", "SC", "ST", "EWS"],
      states: ["North Eastern States"],
      stages: ["Class 12", "Undergraduate"]
    },
    amount_details: "₹5,400 per month for general degree courses; ₹7,800 per month for technical/medical/professional courses (for 10 months/year)",
    category: "Higher Education",
    academic_year: "2025-2026",
    opening_date: "2025-08-01",
    deadline: "Annually on NSP (Check portal for active cycle)",
    last_verified_date: "2026-03-25",
    source_url: "https://www.ugc.gov.in/Home/student_Corner",
    verification_status: "verified"
  },
  {
    id: "nsp-pwd-postmatric",
    name: "Post Matric Scholarship for Students with Disabilities",
    description: "Centrally funded scheme by Department of Empowerment of Persons with Disabilities ensuring equal opportunities in higher secondary and university education.",
    provider: "Department of Empowerment of Persons with Disabilities, Ministry of Social Justice & Empowerment",
    portal_name: "National Scholarship Portal (NSP)",
    official_apply_url: "https://scholarships.gov.in/",
    official_info_url: "https://scholarships.gov.in/",
    education_levels: ["Class 11", "Class 12", "Diploma", "Undergraduate", "Postgraduate"],
    courses: ["Class 11, Class 12, recognized Diploma, Degree, and Postgraduate courses"],
    eligibility_criteria: {
      gender: "All",
      disabilityRequired: true,
      minDisabilityPercent: 40,
      incomeCap: 250000,
      incomeCapFormatted: "₹2.5 Lakhs / year",
      admissionCriteria: "Minimum 40% disability with valid UDID / medical board certificate, enrolled in recognized institution",
      categories: ["All", "PwD"],
      states: ["All India"],
      stages: ["Class 10", "Class 12", "Diploma", "Undergraduate", "Postgraduate"]
    },
    amount_details: "Maintenance allowance up to ₹1,600/month + disability allowance up to ₹4,000/year + book grant up to ₹1,500/year",
    category: "Special Needs",
    academic_year: "2025-2026",
    opening_date: "2025-08-01",
    deadline: "Annually on NSP",
    last_verified_date: "2026-03-25",
    source_url: "https://scholarships.gov.in/",
    verification_status: "verified"
  },
  {
    id: "dst-inspire-she",
    name: "INSPIRE Scholarship for Higher Education (SHE)",
    description: "Prestigious national scholarship by Department of Science and Technology (DST) encouraging top 1% meritorious students to pursue basic and natural sciences research.",
    provider: "Department of Science and Technology (DST), Ministry of Science & Technology, Govt of India",
    portal_name: "Online-INSPIRE Portal",
    official_apply_url: "https://online-inspire.gov.in/",
    official_info_url: "https://online-inspire.gov.in/",
    education_levels: ["Undergraduate", "Postgraduate"],
    courses: ["Natural and Basic Sciences (B.Sc., B.S., Int. M.Sc./MS in Mathematics, Physics, Chemistry, Biology, Astronomy, Geology, etc.)"],
    eligibility_criteria: {
      gender: "All",
      incomeCap: null,
      incomeCapFormatted: "No Income Ceiling (Purely Merit-Based)",
      minMarks: 90,
      marksRequirementText: "Top 1% aggregate marks in Class 12 board examination OR top 10,000 ranks in JEE or NEET opting for Basic Sciences",
      admissionCriteria: "Enrolled in regular B.Sc., B.S., or integrated M.Sc./MS in basic sciences in India (engineering/medicine excluded)",
      categories: ["All", "General", "OBC", "SC", "ST", "EWS"],
      states: ["All India"],
      stages: ["Class 12", "Undergraduate"]
    },
    amount_details: "₹80,000 per annum (₹60,000 direct cash scholarship @ ₹5,000/month + ₹20,000 summer research mentorship project grant)",
    category: "Higher Education",
    academic_year: "2025-2026",
    opening_date: "2025-09-01",
    deadline: "Typically September - November on Online-INSPIRE portal",
    last_verified_date: "2026-03-25",
    source_url: "https://online-inspire.gov.in/",
    verification_status: "verified"
  }
];

async function seed() {
  console.log('Seeding CareerConnect database with verified scholarship records...');
  let added = 0;
  for (const s of VERIFIED_SCHOLARSHIPS) {
    await Database.scholarships.upsert(s);
    added++;
  }
  const total = await Database.scholarships.count();
  console.log(`Successfully seeded ${added} verified scholarships. Total in database: ${total}`);
}

if (require.main === module) {
  seed().catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
}

module.exports = { seed, VERIFIED_SCHOLARSHIPS };
