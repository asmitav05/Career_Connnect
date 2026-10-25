const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, '../data/roadmaps-data.json');
const currentData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));

// Add core-engineering
currentData.archetypes['core-engineering'] = {
  title: "Core Engineering & Infrastructure (Mechanical / Civil / Electrical / Aerospace)",
  careers: [
    "mechanical-engineer", "civil-engineer", "electrical-engineer", "chemical-engineer",
    "automobile-engineer", "aerospace-engineer", "robotics-engineer"
  ],
  class10: {
    routes: [
      {
        "id": "route-a",
        "name": "Route A: School (11-12 Science PCM) → B.Tech / B.E. in Core Engineering",
        "summary": "Standard academic route preparing for JEE Main, Advanced, and State CETs for admission to 4-year core engineering degrees.",
        "suitability": "Ideal for students aiming for IITs, NITs, and top state engineering colleges with strong campus placement records.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 10 Completion",
            "course": "Class 10 Board Examination",
            "duration": "Completed",
            "eligibility": "Pass Class 10 with strong marks in Mathematics and Science.",
            "entranceExams": [],
            "whatToDo": "Enroll in Class 11 Science with Physics, Chemistry, and Mathematics (PCM).",
            "skills": ["Foundational Math", "Basic Physics Concepts"],
            "officialLink": { "title": "CBSE Official", "url": "https://cbse.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Higher Secondary (10+2)",
            "course": "Class 11 & 12 Science (PCM)",
            "duration": "2 Years",
            "eligibility": "Class 12 with PCM. Target min 75% for JoSAA / 50% for state CETs.",
            "entranceExams": [
              { "name": "JEE Main & Advanced", "url": "https://jeemain.nta.nic.in/" },
              { "name": "MHT-CET / State CET", "url": "https://cetcell.mahacet.org/" }
            ],
            "whatToDo": "Master mechanics, thermodynamics, electromagnetism, and calculus. Prepare for JEE and state CET.",
            "skills": ["Calculus", "Classical Mechanics", "Vector Geometry"],
            "officialLink": { "title": "NTA Portal", "url": "https://nta.ac.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "Undergraduate Core Engineering Degree",
            "course": "4-Year B.Tech / B.E. (Mechanical / Civil / Electrical / Aerospace)",
            "duration": "4 Years",
            "eligibility": "Valid rank in JEE Main or State CET counselling.",
            "entranceExams": [],
            "whatToDo": "Complete CAD/CAM design, finite element analysis, thermodynamics, structural design, and industrial internships.",
            "skills": ["AutoCAD / SolidWorks / MATLAB", "Finite Element Analysis", "Circuit & Power Systems"],
            "officialLink": { "title": "AICTE Portal", "url": "https://www.aicte-india.org/" }
          },
          {
            "stepNumber": 4,
            "stage": "Industry Core Placement / GATE for PSU & M.Tech",
            "course": "Core Industry Engineer (L&T, Tata Motors, BHEL) OR GATE Examination",
            "duration": "Graduation Milestone",
            "eligibility": "B.Tech/B.E. graduate.",
            "entranceExams": [{ "name": "GATE (Graduate Aptitude Test in Engineering)", "url": "https://gate.iitk.ac.in/" }],
            "whatToDo": "Join manufacturing, infrastructure, or aerospace firms, or crack GATE for PSU recruitments (IOCL, NTPC, ONGC) or IIT M.Tech.",
            "skills": ["Project Engineering", "Quality Control & Safety", "Plant Operations"],
            "officialLink": { "title": "GATE Official Portal", "url": "https://gate.iitk.ac.in/" }
          }
        ]
      },
      {
        "id": "route-b",
        "name": "Route B: Polytechnic Diploma (3 Yrs) → Direct 2nd Year B.Tech (Lateral Entry)",
        "summary": "Practical hands-on technical diploma right after Class 10, entering directly into 2nd year B.Tech via state lateral entry.",
        "suitability": "Ideal for students seeking early mechanical workshop, electrical lab, and surveying experience without JEE stress.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 10 Completion",
            "course": "Pass Class 10 with Math & Science",
            "duration": "Completed",
            "eligibility": "Pass Class 10 with min 35-50% marks.",
            "entranceExams": [],
            "whatToDo": "Apply for 3-Year Polytechnic Engineering Diploma via State DTE CAP rounds.",
            "skills": ["Basic Math & Workshop Curiosity"],
            "officialLink": { "title": "DTE Maharashtra", "url": "https://dte.maharashtra.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Polytechnic Engineering Diploma",
            "course": "3-Year Diploma in Mechanical / Civil / Electrical Engineering",
            "duration": "3 Years",
            "eligibility": "Class 10 merit admission into MSBTE / AICTE approved polytechnic.",
            "entranceExams": [],
            "whatToDo": "Excel in workshop practice, machine drawing, surveying, circuitry, and maintain 75%+ in final diploma year.",
            "skills": ["Machine Drawing", "Workshop Fabrication", "AutoCAD Drafting"],
            "officialLink": { "title": "MSBTE Portal", "url": "https://msbte.org.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "Direct Second Year Engineering (Lateral Entry)",
            "course": "Direct Second Year (DSE) B.Tech Admission",
            "duration": "3 Years",
            "eligibility": "Pass 3-year diploma with min 45% (40% for reserved category). Lateral entry quota is subject to state rules and seat availability.",
            "entranceExams": [{ "name": "State DSE Lateral Entry CAP", "url": "https://cetcell.mahacet.org/" }],
            "whatToDo": "Register for DSE lateral entry counselling and enter directly into year 2 of B.E./B.Tech.",
            "skills": ["Advanced Engineering Mathematics", "Structural Design"],
            "officialLink": { "title": "DTE Lateral Entry Portal", "url": "https://cetcell.mahacet.org/" }
          },
          {
            "stepNumber": 4,
            "stage": "Core Engineering Graduation",
            "course": "Graduate Core Engineer",
            "duration": "Immediate",
            "eligibility": "B.E./B.Tech completion.",
            "entranceExams": [],
            "whatToDo": "Join engineering consultancies, infrastructure developers, or automotive plants.",
            "skills": ["Industrial Manufacturing", "Site Management"],
            "officialLink": { "title": "AICTE Official", "url": "https://www.aicte-india.org/" }
          }
        ]
      }
    ],
    "comparison": {
      "factors": [
        { "name": "Starting Point", "routeA": "After Class 10 (via 11-12 School)", "routeB": "After Class 10 (Direct Polytechnic Diploma)" },
        { "name": "Initial 2-3 Years", "routeA": "Class 11-12 Science (PCM) with intense JEE/CET prep", "routeB": "3-Year practical workshop polytechnic diploma" },
        { "name": "Degree Admission", "routeA": "Enters 1st year B.Tech via JEE/CET rank", "routeB": "Enters directly into 2nd year B.Tech via lateral entry" },
        { "name": "Total Time to B.Tech", "routeA": "6 Years (2 yrs + 4 yrs)", "routeB": "6 Years (3 yrs + 3 yrs)" },
        { "name": "Key Advantage", "routeA": "Access to IITs/NITs and theoretical depth", "routeB": "Early hands-on workshop skills, bypasses JEE stress" }
      ]
    }
  },
  class11: {
    routes: [
      {
        "id": "route-a",
        "name": "Class 11 Science PCM → JEE / State CET → 4-Year B.Tech in Core Engineering",
        "summary": "Master core physical science principles in Class 11-12 and enter 4-year core engineering.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 11 Academic Mastery",
            "course": "Class 11 Physics, Chemistry & Math",
            "duration": "Current Year (Class 11)",
            "eligibility": "Enrolled in Class 11 Science PCM.",
            "entranceExams": [],
            "whatToDo": "Build strong conceptual foundations in mechanics, thermodynamics, and calculus.",
            "skills": ["Mechanics", "Calculus", "Stoichiometry"],
            "officialLink": { "title": "NTA Portal", "url": "https://nta.ac.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Class 12 Boards & CET/JEE",
            "course": "Class 12 Boards + JEE Main / State CETs",
            "duration": "1 Year",
            "eligibility": "Pass Class 12 with PCM.",
            "entranceExams": [{ "name": "JEE Main", "url": "https://jeemain.nta.nic.in/" }, { "name": "MHT-CET", "url": "https://cetcell.mahacet.org/" }],
            "whatToDo": "Appear for board exams and engineering entrance tests to secure top ranks.",
            "skills": ["Problem Solving", "Time Accuracy"],
            "officialLink": { "title": "MHT-CET Portal", "url": "https://cetcell.mahacet.org/" }
          },
          {
            "stepNumber": 3,
            "stage": "B.Tech Core Degree",
            "course": "4-Year B.Tech / B.E. in Mechanical / Civil / Electrical / Aerospace",
            "duration": "4 Years",
            "eligibility": "Admitted via CET rank.",
            "entranceExams": [],
            "whatToDo": "Complete lab coursework, CAD modeling, industrial internships, and major capstone design.",
            "skills": ["CAD/CAM Modeling", "Simulation (ANSYS/MATLAB)", "Systems Engineering"],
            "officialLink": { "title": "AICTE Portal", "url": "https://www.aicte-india.org/" }
          }
        ]
      }
    ]
  },
  class12: {
    routes: [
      {
        "id": "route-a",
        "name": "Immediate: Class 12 Boards + JEE/CET → 4-Year Core Engineering Degree",
        "summary": "Immediate post-Class 12 entry into mechanical, civil, electrical, or aerospace engineering.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Immediate Focus (Class 12)",
            "course": "Class 12 Board Exams + JEE Main & State CETs",
            "duration": "Next 3-6 Months",
            "eligibility": "Pass Class 12 with PCM with min 75% for JoSAA / 50% for state CETs.",
            "entranceExams": [{ "name": "JEE Main", "url": "https://jeemain.nta.nic.in/" }, { "name": "State CET", "url": "https://cetcell.mahacet.org/" }],
            "whatToDo": "Complete board exams, appear for entrance tests, and fill engineering option forms.",
            "skills": ["Speed Drills", "Formula Revision"],
            "officialLink": { "title": "JEE Main Official", "url": "https://jeemain.nta.nic.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "B.Tech Core Coursework",
            "course": "4-Year B.Tech in Core Engineering Branch",
            "duration": "4 Years",
            "eligibility": "Admitted to AICTE recognized engineering college.",
            "entranceExams": [],
            "whatToDo": "Specialize in machine design, structural analysis, power electronics, or aerodynamics.",
            "skills": ["CAD Modeling", "Thermodynamics", "Hardware Interfacing"],
            "officialLink": { "title": "AICTE Official", "url": "https://www.aicte-india.org/" }
          },
          {
            "stepNumber": 3,
            "stage": "Industry Launch / PSU Career via GATE",
            "course": "Core Industry Engineer / PSU Officer",
            "duration": "Graduation Milestone",
            "eligibility": "B.Tech graduate.",
            "entranceExams": [{ "name": "GATE Exam", "url": "https://gate.iitk.ac.in/" }],
            "whatToDo": "Secure campus placement in manufacturing/infrastructure companies or clear GATE for PSUs.",
            "skills": ["Industrial Operations", "Technical Safety Management"],
            "officialLink": { "title": "GATE Portal", "url": "https://gate.iitk.ac.in/" }
          }
        ]
      }
    ]
  }
};

// Add aviation
currentData.archetypes['aviation'] = {
  title: "Aviation & Commercial Piloting (DGCA Pathway)",
  careers: ["commercial-pilot"],
  class10: {
    routes: [
      {
        "id": "route-a",
        "name": "Statutory DGCA Route: 11-12 Science (PCM) → Class 2 & 1 Medicals → Flying School (CPL 200 Hrs) → Airline Type Rating",
        "summary": "The statutory Directorate General of Civil Aviation (DGCA) roadmap to earn a Commercial Pilot License (CPL).",
        "suitability": "Mandatory for anyone aspiring to become a commercial airline pilot flying multi-engine passenger aircraft in India.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 10 Completion",
            "course": "Class 10 Board Examination",
            "duration": "Completed",
            "eligibility": "Pass Class 10 with strong vision, physical fitness, and affinity for aviation.",
            "entranceExams": [],
            "whatToDo": "Enroll in Class 11 Science with Physics and Mathematics (compulsory statutory requirement by DGCA).",
            "skills": ["Physical Fitness", "Mental Alertness", "Basic Physics"],
            "officialLink": { "title": "DGCA Official Portal", "url": "https://www.dgca.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Higher Secondary (10+2) & DGCA Medical Assessment",
            "course": "Class 11-12 Science (PCM) + DGCA Class 2 & Class 1 Medical Clearance",
            "duration": "2 Years",
            "eligibility": "Must pass 10+2 with Physics and Mathematics (min 50%). Obtain Class 2 Medical certificate from DGCA-empaneled medical examiner, followed by Class 1 Medical at designated IAF medical centers.",
            "entranceExams": [
              { "name": "IGRUA Entrance Examination (Optional for Govt Flying School)", "url": "https://igrua.gov.in/" }
            ],
            "whatToDo": "Clear Class 12 PCM boards and secure DGCA Class 1 Medical Fitness certificate. Obtain Computer Number from DGCA Pariksha portal.",
            "skills": ["Aviation English (ICAO Level 4+)", "Radio Telephony Basics", "Spatial Orientation"],
            "officialLink": { "title": "DGCA Pariksha Portal", "url": "https://pariksha.dgca.gov.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "Flying Training & DGCA Theory Examinations",
            "course": "200 Flying Hours at DGCA-Approved Flying Training Organisation (FTO)",
            "duration": "18 - 24 Months",
            "eligibility": "Minimum 17 years old + Class 1 Medical Fitness + 10+2 PCM pass.",
            "entranceExams": [
              { "name": "DGCA CPL Theory Exams (Air Navigation, Meteorology, Air Regulations, Technical General/Specific)", "url": "https://pariksha.dgca.gov.in/" },
              { "name": "RTR(A) Exam by Ministry of Communications (WPC)", "url": "https://dot.gov.in/" }
            ],
            "whatToDo": "Log 200 hours flight training (solo, cross-country, night flying, instrument flying). Pass all 5 DGCA ground theory exams and RTR(A) wireless telephony license.",
            "skills": ["Aircraft Cockpit Handling", "Air Navigation Calculations", "Meteorological Weather Analysis", "Emergency Flight Procedures"],
            "officialLink": { "title": "DGCA Pilot Licensing Rules", "url": "https://www.dgca.gov.in/" }
          },
          {
            "stepNumber": 4,
            "stage": "CPL License Issuance & Airline Type Rating",
            "course": "Commercial Pilot License (CPL-ME-IR) + Multi-Engine Jet Type Rating (A320 / B737)",
            "duration": "3 - 6 Months",
            "eligibility": "Hold valid DGCA CPL with Multi-Engine and Instrument Rating.",
            "entranceExams": [],
            "whatToDo": "Receive statutory CPL from DGCA. Complete multi-crew cooperation (MCC) and aircraft type rating simulator training (Airbus A320 or Boeing 737) at approved ATO.",
            "skills": ["Glass Cockpit Automation", "Multi-Crew Resource Management (CRM)", "Jet Transition"],
            "officialLink": { "title": "DGCA Approved ATOs", "url": "https://www.dgca.gov.in/" }
          },
          {
            "stepNumber": 5,
            "stage": "Airline Induction as First Officer",
            "course": "Junior First Officer with Commercial Airline (IndiGo, Air India, SpiceJet, Akasa)",
            "duration": "Career Milestone",
            "eligibility": "CPL + Type Rating + Airline Pilot Selection Assessment clearance.",
            "entranceExams": [],
            "whatToDo": "Pass airline psychomotor, compass, and simulator assessment rounds. Complete airline line training to fly passenger commercial flights.",
            "skills": ["Standard Operating Procedures (SOP)", "Flight Safety Management", "Crew Leadership"],
            "officialLink": { "title": "Ministry of Civil Aviation", "url": "https://www.civilaviation.gov.in/" }
          }
        ]
      }
    ],
    "comparison": {
      "factors": [
        { "name": "Statutory Authority", "routeA": "Directorate General of Civil Aviation (DGCA) & Ministry of Civil Aviation" },
        { "name": "Mandatory School Subjects", "routeA": "Class 12 with Physics and Mathematics (Compulsory under DGCA rules)" },
        { "name": "Medical Fitness", "routeA": "DGCA Class 2 Medical followed by Class 1 Medical at designated IAF centers" },
        { "name": "Flight Hours Required", "routeA": "Minimum 200 total verified flight hours at approved Flying Training Organization" },
        { "name": "Ground Exams", "routeA": "Air Navigation, Meteorology, Air Regulations, Technical General, Technical Specific + RTR(A)" },
        { "name": "Financial Investment", "routeA": "₹35 to ₹50+ Lakhs for flight training + type rating (Self-funded or cadet pilot programme)" }
      ]
    }
  },
  class11: {
    routes: [
      {
        "id": "route-a",
        "name": "Class 11 Focus → DGCA Medicals in 12th → Flying School & CPL",
        "summary": "Master Physics and Math in Class 11-12, obtain DGCA medical clearances, and enroll in flight training.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 11 Science PCM",
            "course": "Class 11 Physics and Mathematics Mastery",
            "duration": "Current Year (Class 11)",
            "eligibility": "Enrolled in Class 11 Science with PCM.",
            "entranceExams": [],
            "whatToDo": "Excel in physics vectors, thermodynamics, kinematics, and trigonometry required for aviation ground school.",
            "skills": ["Vector Mathematics", "Kinematics", "Physical Fitness"],
            "officialLink": { "title": "DGCA Official", "url": "https://www.dgca.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Class 12 Boards & DGCA Medicals",
            "course": "Class 12 Boards + DGCA Class 2 and Class 1 Medical Clearance",
            "duration": "1 Year",
            "eligibility": "Pass Class 12 with Physics and Mathematics.",
            "entranceExams": [{ "name": "IGRUA / Cadet Pilot Entrance (Optional)", "url": "https://igrua.gov.in/" }],
            "whatToDo": "Pass Class 12 boards with 50%+ in Physics and Math, clear DGCA Class 1 Medical examination, and get a DGCA computer number.",
            "skills": ["Medical Fitness", "English Fluency"],
            "officialLink": { "title": "DGCA Pariksha", "url": "https://pariksha.dgca.gov.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "Flying Training (200 Hours) & CPL",
            "course": "Commercial Pilot License at DGCA Flying Training Organization",
            "duration": "18 - 24 Months",
            "eligibility": "Age 17+, Class 1 Medical, 10+2 PCM.",
            "entranceExams": [{ "name": "DGCA Theory Exams + RTR(A)", "url": "https://pariksha.dgca.gov.in/" }],
            "whatToDo": "Log 200 flying hours, clear 5 DGCA ground exams, and earn Commercial Pilot License.",
            "skills": ["Cockpit Navigation", "Aviation Meteorology", "Instrument Flying"],
            "officialLink": { "title": "DGCA CPL Rules", "url": "https://www.dgca.gov.in/" }
          }
        ]
      }
    ]
  },
  class12: {
    routes: [
      {
        "id": "route-a",
        "name": "Immediate: Class 12 PCM → DGCA Class 1 Medical → Flying Training & CPL",
        "summary": "Immediate post-Class 12 pathway into commercial aviation and flight training.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 12 Boards & DGCA Medical Verification",
            "course": "Class 12 Boards (Physics & Math) + DGCA Class 2/1 Medical Examinations",
            "duration": "Next 3-6 Months",
            "eligibility": "Pass Class 12 with Physics & Math (min 50%). Class 1 Medical fitness.",
            "entranceExams": [{ "name": "Cadet Pilot Tests / IGRUA", "url": "https://igrua.gov.in/" }],
            "whatToDo": "Clear Class 12 boards, obtain DGCA Class 1 Medical certificate, apply for DGCA Computer Number, and choose an approved FTO.",
            "skills": ["Physical Stamina", "Spatial Awareness"],
            "officialLink": { "title": "DGCA Official Portal", "url": "https://www.dgca.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Flight Training & DGCA License Clearance",
            "course": "200 Hours Flying + DGCA Ground School Exams",
            "duration": "18 - 24 Months",
            "eligibility": "Enrolled student pilot with valid Student Pilot License (SPL).",
            "entranceExams": [{ "name": "DGCA CPL Exams + RTR(A)", "url": "https://pariksha.dgca.gov.in/" }],
            "whatToDo": "Complete solo, night, instrument, and cross-country flying checks. Clear DGCA papers and RTR(A) radio telephony exam.",
            "skills": ["Aircraft Handling", "Instrument Flight Rules (IFR)", "Emergency Protocols"],
            "officialLink": { "title": "DGCA Pilot Examination", "url": "https://pariksha.dgca.gov.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "Type Rating & First Officer Employment",
            "course": "A320 / B737 Type Rating → Airline Induction",
            "duration": "6 Months",
            "eligibility": "DGCA CPL holder.",
            "entranceExams": [],
            "whatToDo": "Complete type rating on commercial transport jet simulator and join airline cadet/first officer roster.",
            "skills": ["Multi-Crew Operations", "Airline Flight Safety"],
            "officialLink": { "title": "Ministry of Civil Aviation", "url": "https://www.civilaviation.gov.in/" }
          }
        ]
      }
    ]
  }
};

// Add architecture
currentData.archetypes['architecture'] = {
  title: "Architecture & Spatial Environmental Design",
  careers: ["architect", "interior-designer"],
  class10: {
    routes: [
      {
        "id": "route-a",
        "name": "Statutory Council of Architecture (COA) Route: 11-12 PCM → NATA / JEE Paper 2 → 5-Year B.Arch",
        "summary": "The statutory pathway prescribed by the Council of Architecture (COA) to become a licensed Architect in India.",
        "suitability": "Mandatory for anyone aspiring to sign architectural drawings and register with the Council of Architecture.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 10 Completion",
            "course": "Class 10 Board Examination",
            "duration": "Completed",
            "eligibility": "Pass Class 10 with strong interest in geometry, drawing, and structures.",
            "entranceExams": [],
            "whatToDo": "Enroll in Class 11 Science with Physics, Chemistry, and Mathematics (PCM). Note: Council of Architecture regulations mandate Physics, Chemistry, and Mathematics at 10+2 level.",
            "skills": ["Geometric Drawing", "Spatial Visualisation"],
            "officialLink": { "title": "Council of Architecture (COA)", "url": "https://www.coa.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Higher Secondary (10+2)",
            "course": "Class 11-12 Science (PCM) + Architecture Drawing Prep",
            "duration": "2 Years",
            "eligibility": "Pass 10+2 with Physics, Chemistry, and Mathematics with minimum 50% aggregate (or 10+3 Diploma with Mathematics with 50%).",
            "entranceExams": [
              { "name": "NATA (National Aptitude Test in Architecture conducted by COA)", "url": "https://www.nata.in/" },
              { "name": "JEE Main Paper 2 (B.Arch for SPAs, NITs, IITs)", "url": "https://jeemain.nta.nic.in/" }
            ],
            "whatToDo": "Master perspective sketching, architectural awareness, light & shade rendering, and 2D/3D composition. Appear for NATA or JEE Main Paper 2.",
            "skills": ["2-Point & 3-Point Perspective", "Architectural History Awareness", "Spatial Geometry"],
            "officialLink": { "title": "NATA Official Portal", "url": "https://www.nata.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "5-Year Professional B.Arch Degree",
            "course": "Bachelor of Architecture (B.Arch)",
            "duration": "5 Years (10 Semesters)",
            "eligibility": "Qualified score in NATA or JEE Main Paper 2 + fulfillment of 10+2 PCM criteria.",
            "entranceExams": [],
            "whatToDo": "Study Architectural Design Studios, Building Materials & Construction, History of Architecture, Climate Responsive Design, and Structural Mechanics. Complete 1 semester practical training in an architectural firm.",
            "skills": ["Architectural Studio Design", "AutoCAD / Revit / Rhino 3D", "Sustainable Building Principles", "Structural Feasibility"],
            "officialLink": { "title": "Council of Architecture Regulations", "url": "https://www.coa.gov.in/" }
          },
          {
            "stepNumber": 4,
            "stage": "Council of Architecture Registration & Practice",
            "course": "COA Certificate of Registration (Architect CA Number)",
            "duration": "Career Milestone",
            "eligibility": "Successful B.Arch graduation from COA recognized institution.",
            "entranceExams": [],
            "whatToDo": "Obtain statutory registration certificate from Council of Architecture to use the protected legal title 'Architect' and start independent practice or join architectural firms.",
            "skills": ["Building Bye-Laws & Sanctions", "Contract Administration", "Client Project Management"],
            "officialLink": { "title": "COA Official Portal", "url": "https://www.coa.gov.in/" }
          }
        ]
      }
    ],
    "comparison": {
      "factors": [
        { "name": "Statutory Authority", "routeA": "Council of Architecture (COA), Government of India" },
        { "name": "School Stream Requirement", "routeA": "Class 11-12 with Physics, Chemistry, and Mathematics (PCM) or 10+3 Diploma with Math" },
        { "name": "Mandatory Architecture Entrances", "routeA": "NATA (by COA) or JEE Main Paper 2 (for NITs/SPAs)" },
        { "name": "Degree Duration", "routeA": "5 Years Full-Time (10 Semesters including mandatory office internship)" },
        { "name": "Legal Protection of Title", "routeA": "Under the Architects Act 1972, only individuals registered with COA can legally use the title 'Architect'" }
      ]
    }
  },
  class11: {
    routes: [
      {
        "id": "route-a",
        "name": "Class 11 Science PCM → NATA / JEE Paper 2 → 5-Year B.Arch Degree",
        "summary": "Build strong drawing, spatial visualization, and math foundations in Class 11, crack NATA, and complete 5-year B.Arch.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 11 Academic & Sketching Practice",
            "course": "Class 11 Science PCM + Architecture Drawing",
            "duration": "Current Year (Class 11)",
            "eligibility": "Enrolled in Class 11 Science with PCM.",
            "entranceExams": [],
            "whatToDo": "Maintain solid marks in PCM while sketching daily: perspective layouts, urban scenes, shadow casting, and 3D geometric views.",
            "skills": ["Perspective Drawing", "Spatial Visualization", "Maths Geometry"],
            "officialLink": { "title": "Council of Architecture", "url": "https://www.coa.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Class 12 Boards & NATA / JEE Paper 2",
            "course": "Class 12 Boards + Architecture Entrance Exams",
            "duration": "1 Year",
            "eligibility": "Pass Class 12 with PCM with 50% aggregate.",
            "entranceExams": [
              { "name": "NATA (COA)", "url": "https://www.nata.in/" },
              { "name": "JEE Main Paper 2", "url": "https://jeemain.nta.nic.in/" }
            ],
            "whatToDo": "Clear Class 12 boards and appear for NATA and JEE Paper 2 for admission to School of Planning and Architecture (SPAs) and state architecture colleges.",
            "skills": ["Architectural Aptitude", "Drawing Accuracy"],
            "officialLink": { "title": "NATA Official Portal", "url": "https://www.nata.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "5-Year B.Arch Degree & COA License",
            "course": "Bachelor of Architecture (B.Arch) + COA Registration",
            "duration": "5 Years",
            "eligibility": "NATA / JEE Paper 2 rank in recognized college.",
            "entranceExams": [],
            "whatToDo": "Complete studio design projects, structural analysis, green building certifications, and register with COA.",
            "skills": ["Architectural Design Studios", "BIM (Revit / ArchiCAD)", "Building Sanctions"],
            "officialLink": { "title": "Council of Architecture", "url": "https://www.coa.gov.in/" }
          }
        ]
      }
    ]
  },
  class12: {
    routes: [
      {
        "id": "route-a",
        "name": "Immediate: Class 12 PCM → NATA / JEE Paper 2 → 5-Year B.Arch Program",
        "summary": "Immediate post-Class 12 application to 5-year B.Arch programs through NATA and centralized admission.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Immediate Focus (Class 12)",
            "course": "Class 12 Board Exams + NATA / JEE Paper 2",
            "duration": "Next 3-6 Months",
            "eligibility": "Pass Class 12 with Physics, Chemistry, and Math with min 50% aggregate.",
            "entranceExams": [
              { "name": "NATA", "url": "https://www.nata.in/" },
              { "name": "JEE Main Paper 2 (B.Arch)", "url": "https://jeemain.nta.nic.in/" }
            ],
            "whatToDo": "Complete Class 12 board exams, register for NATA test dates, practice architectural aptitude questions, and participate in state CAP counselling.",
            "skills": ["Perspective Rendering", "Architectural Awareness"],
            "officialLink": { "title": "NATA Portal", "url": "https://www.nata.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "5-Year B.Arch Coursework",
            "course": "5-Year Bachelor of Architecture Degree",
            "duration": "5 Years",
            "eligibility": "Admitted to COA recognized architecture college.",
            "entranceExams": [],
            "whatToDo": "Undergo architectural studio training, building physics, climate design, urban planning, and 6-month architectural internship.",
            "skills": ["AutoCAD & Revit", "Sustainable Architecture", "Structural Detailing"],
            "officialLink": { "title": "COA Portal", "url": "https://www.coa.gov.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "COA Registration & Architect License",
            "course": "Council of Architecture Registration (CA Number)",
            "duration": "Graduation Milestone",
            "eligibility": "B.Arch completion.",
            "entranceExams": [],
            "whatToDo": "Receive statutory license to practice as an Architect and launch independent studio or join premier design firms.",
            "skills": ["Architectural Practice", "Urban Bye-Laws & Approvals"],
            "officialLink": { "title": "Council of Architecture Official", "url": "https://www.coa.gov.in/" }
          }
        ]
      }
    ]
  }
};

fs.writeFileSync(roadmapPath, JSON.stringify(currentData, null, 2), 'utf8');
console.log('Successfully expanded roadmaps-data.json! Total Archetypes:', Object.keys(currentData.archetypes).length);
