const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, '../data/roadmaps-data.json');
const currentData = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));

// 1. allied-health-pharmacy
currentData.archetypes['allied-health-pharmacy'] = {
  title: "Pharmacy, Biomedical & Allied Healthcare Sciences",
  careers: ["pharmacist", "physiotherapist", "biotechnology-engineer", "biomedical-engineer", "clinical-psychologist"],
  class10: {
    routes: [
      {
        "id": "route-a",
        "name": "Route A: School (11-12 PCB/PCM) → 4-Year B.Pharm Degree → Registered Pharmacist",
        "summary": "Statutory Pharmacy Council of India (PCI) route to become a Registered Pharmacist through a 4-year undergraduate B.Pharm degree.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 10 Completion",
            "course": "Class 10 Board Examination",
            "duration": "Completed",
            "eligibility": "Pass Class 10 with science and math foundation.",
            "entranceExams": [],
            "whatToDo": "Enroll in Class 11 Science with Physics, Chemistry, and Biology (or Mathematics). Both PCB and PCM students are eligible for Pharmacy.",
            "skills": ["Chemistry Basics", "Biological Concepts"],
            "officialLink": { "title": "Pharmacy Council of India (PCI)", "url": "https://www.pci.nic.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Higher Secondary (10+2)",
            "course": "Class 11 & 12 Science (PCB or PCM)",
            "duration": "2 Years",
            "eligibility": "Pass 10+2 with Physics, Chemistry, and Biology/Math with min 50% aggregate (45% for reserved category).",
            "entranceExams": [
              { "name": "State Pharmacy CET (e.g. MHT-CET, KCET, WBJEE)", "url": "https://cetcell.mahacet.org/" },
              { "name": "CUET-UG / University Pharmacy Entrances", "url": "https://cuetug.nta.nic.in/" }
            ],
            "whatToDo": "Focus on Organic Chemistry and Human Physiology. Clear Class 12 boards and appear for State Pharmacy CET.",
            "skills": ["Organic Reactions", "Chemical Analysis"],
            "officialLink": { "title": "MHT-CET Pharmacy Portal", "url": "https://cetcell.mahacet.org/" }
          },
          {
            "stepNumber": 3,
            "stage": "B.Pharm Professional Degree",
            "course": "4-Year Bachelor of Pharmacy (B.Pharm)",
            "duration": "4 Years (8 Semesters)",
            "eligibility": "Allotted seat in PCI-approved pharmacy college via CET rank.",
            "entranceExams": [],
            "whatToDo": "Study Pharmaceutics, Pharmacology, Medicinal Chemistry, Pharmacognosy, and Regulatory Affairs. Complete hospital and industrial pharmacy training.",
            "skills": ["Drug Formulation", "Pharmacological Profiling", "Good Manufacturing Practices (GMP)"],
            "officialLink": { "title": "PCI Regulations", "url": "https://www.pci.nic.in/" }
          },
          {
            "stepNumber": 4,
            "stage": "State Pharmacy Council Registration",
            "course": "Registered Pharmacist License + Industry / Clinical Practice",
            "duration": "Career Milestone",
            "eligibility": "B.Pharm graduation from PCI recognized institution.",
            "entranceExams": [],
            "whatToDo": "Register with State Pharmacy Council to obtain statutory license to practice, manufacture, or dispense pharmaceuticals.",
            "skills": ["Statutory Drug Compliance", "Clinical Pharmacotherapy"],
            "officialLink": { "title": "PCI Official", "url": "https://www.pci.nic.in/" }
          }
        ]
      },
      {
        "id": "route-b",
        "name": "Route B: 2-Year Diploma in Pharmacy (D.Pharm) → Lateral Entry to 2nd Year B.Pharm",
        "summary": "Shorter practical diploma qualifying for retail chemist license, with option to enter 2nd year B.Pharm via lateral entry.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 11-12 & D.Pharm Admission",
            "course": "Class 12 Science + 2-Year D.Pharm Diploma",
            "duration": "2 Years",
            "eligibility": "Pass 10+2 Science (PCB or PCM).",
            "entranceExams": [],
            "whatToDo": "Enroll in 2-year D.Pharm covering dispensing pharmacy, pharmacology, and 500 hours hospital training.",
            "skills": ["Drug Dispensing", "Inventory Management"],
            "officialLink": { "title": "DTE Pharmacy Portal", "url": "https://dte.maharashtra.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Lateral Entry into B.Pharm (Year 2)",
            "course": "Direct Second Year B.Pharm",
            "duration": "3 Years",
            "eligibility": "Pass D.Pharm with min 50% from PCI approved college.",
            "entranceExams": [],
            "whatToDo": "Join 2nd year B.Pharm directly to complete degree.",
            "skills": ["Advanced Medicinal Chemistry"],
            "officialLink": { "title": "PCI Lateral Entry Rules", "url": "https://www.pci.nic.in/" }
          }
        ]
      }
    ],
    comparison: {
      factors: [
        { "name": "Starting Point", "routeA": "Class 10 -> Class 11-12 Science -> 4-Yr B.Pharm", "routeB": "Class 12 Science -> 2-Yr D.Pharm -> Lateral B.Pharm" },
        { "name": "Initial Qualification", "routeA": "Degree (B.Pharm)", "routeB": "Diploma (D.Pharm)" },
        { "name": "Total Duration", "routeA": "6 Years from 10th", "routeB": "7 Years from 10th (2 yrs school + 2 yrs diploma + 3 yrs degree)" },
        { "name": "Statutory Licensing", "routeA": "Full PCI license for manufacturing, R&D, and retail", "routeB": "Retail chemist license after D.Pharm; R&D after B.Pharm" }
      ]
    }
  },
  class11: {
    routes: [
      {
        "id": "route-a",
        "name": "Class 11 Science PCB/PCM → State CET → 4-Year B.Pharm Degree",
        "summary": "Master chemistry and biology in Class 11-12 and crack state pharmacy CET.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 11 Focus",
            "course": "Class 11 Chemistry & Biology/Math",
            "duration": "Current Year",
            "eligibility": "Enrolled in Class 11 Science.",
            "entranceExams": [],
            "whatToDo": "Focus on chemical bonding, organic nomenclature, and human anatomy.",
            "skills": ["Organic Chemistry Basics"],
            "officialLink": { "title": "PCI Official", "url": "https://www.pci.nic.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Class 12 & State CET",
            "course": "Class 12 Boards + State Pharmacy CET",
            "duration": "1 Year",
            "eligibility": "Pass Class 12 with PCB or PCM with min 50%.",
            "entranceExams": [{ "name": "State Pharmacy CET", "url": "https://cetcell.mahacet.org/" }],
            "whatToDo": "Appear for board exams and state CET to secure merit seat in B.Pharm.",
            "skills": ["MCQ Speed", "Chemistry Accuracy"],
            "officialLink": { "title": "MHT-CET Portal", "url": "https://cetcell.mahacet.org/" }
          },
          {
            "stepNumber": 3,
            "stage": "B.Pharm Degree & License",
            "course": "4-Year B.Pharm + Registered Pharmacist License",
            "duration": "4 Years",
            "eligibility": "Allotted seat in recognized college.",
            "entranceExams": [],
            "whatToDo": "Complete degree and register with State Pharmacy Council.",
            "skills": ["Clinical Pharmacy", "Drug Formulation"],
            "officialLink": { "title": "PCI Portal", "url": "https://www.pci.nic.in/" }
          }
        ]
      }
    ]
  },
  class12: {
    routes: [
      {
        "id": "route-a",
        "name": "Immediate: Class 12 Boards → State Pharmacy CET → 4-Year B.Pharm Degree",
        "summary": "Immediate post-Class 12 application to 4-year B.Pharm through state CET counselling.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Immediate Focus (Class 12)",
            "course": "Class 12 Boards + State Pharmacy CET",
            "duration": "Next 3-6 Months",
            "eligibility": "Pass Class 12 with PCB or PCM with min 50% aggregate.",
            "entranceExams": [{ "name": "MHT-CET / State Pharmacy CET", "url": "https://cetcell.mahacet.org/" }],
            "whatToDo": "Clear Class 12 boards and appear for State Pharmacy CET in May.",
            "skills": ["Chemistry & Biology Accuracy"],
            "officialLink": { "title": "CET Cell", "url": "https://cetcell.mahacet.org/" }
          },
          {
            "stepNumber": 2,
            "stage": "B.Pharm Degree Coursework",
            "course": "4-Year Bachelor of Pharmacy",
            "duration": "4 Years",
            "eligibility": "Admitted to PCI-approved pharmacy institution.",
            "entranceExams": [],
            "whatToDo": "Complete 8 semesters of pharmaceutical coursework and industrial internship.",
            "skills": ["Pharmacology", "Drug Formulation", "Regulatory Affairs"],
            "officialLink": { "title": "PCI Official", "url": "https://www.pci.nic.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "Pharmacist License & Career",
            "course": "Registered Pharmacist / Pharma Executive",
            "duration": "Graduation Milestone",
            "eligibility": "B.Pharm graduate.",
            "entranceExams": [],
            "whatToDo": "Obtain State Pharmacy Council license and join pharmaceutical MNCs or clinical hospitals.",
            "skills": ["Pharmaceutical Analysis", "Quality Assurance"],
            "officialLink": { "title": "PCI Portal", "url": "https://www.pci.nic.in/" }
          }
        ]
      }
    ]
  }
};

// 2. science-research
currentData.archetypes['science-research'] = {
  title: "Pure Science, Research & Academia",
  careers: ["research-scientist", "agricultural-scientist"],
  class10: {
    routes: [
      {
        "id": "route-a",
        "name": "Premier Research Route: 11-12 Science → IAT / NEST → 5-Year BS-MS (IISc / IISER) → PhD",
        "summary": "Premier research track into Indian Institute of Science (IISc Bangalore) and IISERs for fundamental scientific research.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 10 Completion",
            "course": "Class 10 Board Examination",
            "duration": "Completed",
            "eligibility": "Pass Class 10 with deep curiosity for scientific phenomena.",
            "entranceExams": [],
            "whatToDo": "Enroll in Class 11 Science with PCM or PCB/PCMB.",
            "skills": ["Scientific Curiosity", "Analytical Reading"],
            "officialLink": { "title": "IISc Bangalore", "url": "https://iisc.ac.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Higher Secondary (10+2)",
            "course": "Class 11 & 12 Science (PCM/PCB) + IAT / NEST Prep",
            "duration": "2 Years",
            "eligibility": "Pass Class 12 with Science with min 60% aggregate.",
            "entranceExams": [
              { "name": "IISER Aptitude Test (IAT)", "url": "https://iiseradmission.in/" },
              { "name": "NEST (National Entrance Screening Test for NISER)", "url": "https://www.nestexam.in/" },
              { "name": "JEE Advanced (for IISc BS)", "url": "https://jeeadv.ac.in/" }
            ],
            "whatToDo": "Master conceptual fundamentals across Physics, Chemistry, Math, and Biology. Appear for IAT and NEST.",
            "skills": ["Theoretical Derivations", "Experimental Design"],
            "officialLink": { "title": "IISER Admissions Portal", "url": "https://iiseradmission.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "5-Year Integrated BS-MS Degree",
            "course": "5-Year BS-MS Dual Degree at IISER / IISc / NISER",
            "duration": "5 Years",
            "eligibility": "Qualified rank in IAT / NEST / JEE Advanced.",
            "entranceExams": [],
            "whatToDo": "Conduct advanced laboratory research, publish peer-reviewed papers, and complete master's thesis.",
            "skills": ["Laboratory Instrumentation", "Statistical Data Analysis", "Scientific Paper Writing"],
            "officialLink": { "title": "IISc Research Programs", "url": "https://iisc.ac.in/" }
          },
          {
            "stepNumber": 4,
            "stage": "PhD & Scientific Career",
            "course": "Doctoral Research (PhD) in India (CSIR-UGC NET) or Abroad",
            "duration": "4 - 5 Years",
            "eligibility": "Master's degree with valid CSIR-NET JRF rank or international fellowship.",
            "entranceExams": [{ "name": "CSIR-UGC NET JRF", "url": "https://csirnet.nta.nic.in/" }],
            "whatToDo": "Earn PhD and join national research laboratories (DRDO, ISRO, CSIR, TIFR) or university professorships.",
            "skills": ["Independent Hypothesis Testing", "Grant Writing", "Patent Filing"],
            "officialLink": { "title": "CSIR Official Portal", "url": "https://www.csir.res.in/" }
          }
        ]
      }
    ],
    comparison: {
      factors: [
        { "name": "Focus", "routeA": "Fundamental scientific discovery and academic research" },
        { "name": "Top Institutes", "routeA": "IISc Bangalore, IISER (Pune, Kolkata, Mohali, Bhopal, Thiruvananthapuram), NISER Bhubaneswar" },
        { "name": "Degree Route", "routeA": "5-Year Integrated BS-MS followed by PhD" },
        { "name": "Key Entrances", "routeA": "IISER Aptitude Test (IAT), NEST, JEE Advanced" }
      ]
    }
  },
  class11: {
    routes: [
      {
        "id": "route-a",
        "name": "Class 11 Science → IAT / NEST in Class 12 → 5-Year BS-MS Research Degree",
        "summary": "Build strong research and conceptual reasoning in Class 11-12 to crack IAT and NEST.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 11 Science Foundation",
            "course": "Class 11 Physics, Chemistry & Biology/Math",
            "duration": "Current Year",
            "eligibility": "Enrolled in Class 11 Science.",
            "entranceExams": [],
            "whatToDo": "Deep conceptual study beyond rote learning, focusing on scientific proofs and experiments.",
            "skills": ["Scientific Inquiry"],
            "officialLink": { "title": "IISER Admissions", "url": "https://iiseradmission.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Class 12 & Research Entrances",
            "course": "Class 12 Boards + IAT / NEST Exams",
            "duration": "1 Year",
            "eligibility": "Pass Class 12 with 60%+.",
            "entranceExams": [{ "name": "IAT (IISER)", "url": "https://iiseradmission.in/" }, { "name": "NEST", "url": "https://www.nestexam.in/" }],
            "whatToDo": "Appear for board exams and national research aptitude tests.",
            "skills": ["Interdisciplinary Problem Solving"],
            "officialLink": { "title": "NEST Portal", "url": "https://www.nestexam.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "5-Year BS-MS & PhD",
            "course": "BS-MS at IISER/IISc → PhD Fellowship",
            "duration": "5 Years",
            "eligibility": "Merit seat in premier research institute.",
            "entranceExams": [],
            "whatToDo": "Complete interdisciplinary science curriculum and master's research thesis.",
            "skills": ["Advanced Laboratory Research"],
            "officialLink": { "title": "IISc Portal", "url": "https://iisc.ac.in/" }
          }
        ]
      }
    ]
  },
  class12: {
    routes: [
      {
        "id": "route-a",
        "name": "Immediate: Class 12 Science → IAT / NEST / CUET → BS-MS / B.Sc Research",
        "summary": "Immediate post-Class 12 application to national research institutes.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 12 Boards & Research Entrances",
            "course": "Class 12 Boards + IAT / NEST / CUET-UG",
            "duration": "Next 3-6 Months",
            "eligibility": "Pass Class 12 Science with min 60% aggregate.",
            "entranceExams": [{ "name": "IAT", "url": "https://iiseradmission.in/" }, { "name": "CUET-UG", "url": "https://cuetug.nta.nic.in/" }],
            "whatToDo": "Complete board examinations and appear for IAT/CUET for admission to IISERs or Central Universities.",
            "skills": ["Conceptual Science Accuracy"],
            "officialLink": { "title": "IISER Portal", "url": "https://iiseradmission.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Undergraduate Science Research Degree",
            "course": "5-Year BS-MS Dual Degree or 3-Year B.Sc (Hons)",
            "duration": "3 - 5 Years",
            "eligibility": "Admitted to recognized university.",
            "entranceExams": [],
            "whatToDo": "Conduct scientific research, laboratory assays, and submit undergraduate research dissertation.",
            "skills": ["Data Analysis", "Laboratory Techniques"],
            "officialLink": { "title": "UGC Research Portal", "url": "https://www.ugc.gov.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "Scientist / Doctoral Fellow",
            "course": "PhD Fellowship / CSIR Research Scientist",
            "duration": "Post-Graduation",
            "eligibility": "Master's degree in Science.",
            "entranceExams": [{ "name": "CSIR NET", "url": "https://csirnet.nta.nic.in/" }],
            "whatToDo": "Join national laboratories or corporate R&D as a Research Scientist.",
            "skills": ["Independent Research Execution"],
            "officialLink": { "title": "CSIR Official", "url": "https://www.csir.res.in/" }
          }
        ]
      }
    ]
  }
};

// 3. hospitality-culinary
currentData.archetypes['hospitality-culinary'] = {
  title: "Hospitality, Culinary Arts & Event Management",
  careers: ["chef", "hotel-management-professional", "event-manager"],
  class10: {
    routes: [
      {
        "id": "route-a",
        "name": "Route A: School (11-12 Any Stream) → NCHM JEE → 3-Year B.Sc in Hospitality & Hotel Administration",
        "summary": "Premier statutory pathway under National Council for Hotel Management and Catering Technology (NCHMCT).",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 10 Completion",
            "course": "Class 10 Board Examination",
            "duration": "Completed",
            "eligibility": "Pass Class 10 with interest in culinary arts, guest relations, or events.",
            "entranceExams": [],
            "whatToDo": "Complete Class 11 and 12 in any stream (Arts, Commerce, or Science with English as a compulsory subject).",
            "skills": ["Interpersonal Warmth", "Culinary Interest"],
            "officialLink": { "title": "NCHMCT Official Portal", "url": "https://nchm.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Higher Secondary (10+2) & NCHM JEE",
            "course": "Class 11 & 12 + NCHM JEE Entrance Test",
            "duration": "2 Years",
            "eligibility": "Pass 10+2 with English as a compulsory subject.",
            "entranceExams": [
              { "name": "NCHM JEE (Conducted pan-India by NTA)", "url": "https://nchmjee.nta.nic.in/" }
            ],
            "whatToDo": "Appear for NCHM JEE testing numerical ability, English communication, reasoning, and service aptitude.",
            "skills": ["Service Aptitude", "General Knowledge", "English Fluency"],
            "officialLink": { "title": "NTA NCHM JEE Portal", "url": "https://nchmjee.nta.nic.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "3-Year Degree at Institute of Hotel Management (IHM)",
            "course": "B.Sc. in Hospitality & Hotel Administration (IHMs)",
            "duration": "3 Years (6 Semesters)",
            "eligibility": "NCHM JEE rank in central/state government IHM.",
            "entranceExams": [],
            "whatToDo": "Master Food Production (Culinary), Food & Beverage Service, Front Office Operations, and Accommodation Management. Complete 20-week industrial training at 5-star hotels.",
            "skills": ["Culinary Operations", "Fine Dining Service", "Hotel ERP Systems (Opera)"],
            "officialLink": { "title": "NCHMCT Curriculum", "url": "https://nchm.gov.in/" }
          },
          {
            "stepNumber": 4,
            "stage": "Management Trainee (MT) / Commis Chef",
            "course": "Executive Trainee at Luxury Hotel Chains (Taj, Oberoi, Marriott, ITC)",
            "duration": "Graduation Milestone",
            "eligibility": "IHM graduation.",
            "entranceExams": [],
            "whatToDo": "Crack prestigious hotel management trainee (MT) corporate selection rounds.",
            "skills": ["Hospitality Leadership", "Revenue Management"],
            "officialLink": { "title": "NCHMCT Placements", "url": "https://nchm.gov.in/" }
          }
        ]
      },
      {
        "id": "route-b",
        "name": "Route B: Vocational Diploma in Food Production / Bakery (Direct after 10th)",
        "summary": "1.5-Year Craftsmanship Certificate directly after Class 10 for fast-track entry into commercial kitchens.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Craftsmanship Course after 10th",
            "course": "1.5-Year Craftsmanship Course in Food Production & Patisserie",
            "duration": "1.5 Years",
            "eligibility": "Pass Class 10 with English.",
            "entranceExams": [],
            "whatToDo": "Learn hands-on knife skills, bakery, continental and regional Indian cooking at state IHMs.",
            "skills": ["Culinary Techniques", "Kitchen Hygiene (FSSAI)"],
            "officialLink": { "title": "NCHMCT Craft Courses", "url": "https://nchm.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Kitchen Commis Role",
            "course": "Commis-III / Kitchen Apprentice at Restaurants & Hotels",
            "duration": "Immediate",
            "eligibility": "Craft certificate completion.",
            "entranceExams": [],
            "whatToDo": "Work under senior sous chefs and executive chefs to build culinary mastery.",
            "skills": ["Line Cooking", "Speed & Precision"],
            "officialLink": { "title": "FSSAI Guidelines", "url": "https://www.fssai.gov.in/" }
          }
        ]
      }
    ],
    comparison: {
      factors: [
        { "name": "Starting Point", "routeA": "After Class 10 via 11-12 School", "routeB": "Directly after Class 10 (Craft Diploma)" },
        { "name": "Degree / Award", "routeA": "3-Year B.Sc in Hospitality & Hotel Administration", "routeB": "1.5-Year Craftsmanship Certificate" },
        { "name": "Entrance Exam", "routeA": "NCHM JEE (by NTA)", "routeB": "Class 10 Merit Admission" },
        { "name": "Target Career Level", "routeA": "Hotel Operations Manager / Management Trainee", "routeB": "Direct Line Chef / Commis Chef" }
      ]
    }
  },
  class11: {
    routes: [
      {
        "id": "route-a",
        "name": "Class 11 Focus → NCHM JEE in 12th → 3-Year B.Sc Hospitality at IHM",
        "summary": "Prepare communication and service aptitude in Class 11-12, clear NCHM JEE, and enter top IHMs.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Class 11 Academic & Communication Focus",
            "course": "Class 11 (Any Stream) with English",
            "duration": "Current Year",
            "eligibility": "Enrolled in Class 11.",
            "entranceExams": [],
            "whatToDo": "Develop English fluency, general awareness, and numerical reasoning.",
            "skills": ["Service Communication"],
            "officialLink": { "title": "NCHMCT Official", "url": "https://nchm.gov.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "Class 12 Boards & NCHM JEE",
            "course": "Class 12 Boards + NCHM JEE Exam",
            "duration": "1 Year",
            "eligibility": "Pass Class 12 with English.",
            "entranceExams": [{ "name": "NCHM JEE (NTA)", "url": "https://nchmjee.nta.nic.in/" }],
            "whatToDo": "Clear Class 12 boards and crack NCHM JEE conducted in May.",
            "skills": ["Service Aptitude", "Aptitude Speed"],
            "officialLink": { "title": "NCHM JEE NTA", "url": "https://nchmjee.nta.nic.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "3-Year B.Sc Degree at IHM",
            "course": "B.Sc Hospitality & Hotel Administration",
            "duration": "3 Years",
            "eligibility": "Allotted seat in IHM (Pusa Delhi, Mumbai, Bengaluru, etc.).",
            "entranceExams": [],
            "whatToDo": "Complete classroom theory and 5-star hotel industrial training.",
            "skills": ["Hotel Operations", "Food Production"],
            "officialLink": { "title": "NCHMCT Portal", "url": "https://nchm.gov.in/" }
          }
        ]
      }
    ]
  },
  class12: {
    routes: [
      {
        "id": "route-a",
        "name": "Immediate: Class 12 Boards → NCHM JEE → 3-Year B.Sc Hospitality at IHM",
        "summary": "Immediate application to central and state IHMs through NCHM JEE.",
        "steps": [
          {
            "stepNumber": 1,
            "stage": "Immediate Focus (Class 12)",
            "course": "Class 12 Board Exams + NCHM JEE",
            "duration": "Next 3-6 Months",
            "eligibility": "Pass Class 12 with English.",
            "entranceExams": [{ "name": "NCHM JEE (NTA)", "url": "https://nchmjee.nta.nic.in/" }],
            "whatToDo": "Clear Class 12 boards and appear for NCHM JEE exam.",
            "skills": ["Service Aptitude", "Numerical Ability"],
            "officialLink": { "title": "NCHM JEE Official", "url": "https://nchmjee.nta.nic.in/" }
          },
          {
            "stepNumber": 2,
            "stage": "3-Year B.Sc Coursework at IHM",
            "course": "B.Sc. Hospitality & Hotel Administration",
            "duration": "3 Years",
            "eligibility": "Admitted to recognized IHM.",
            "entranceExams": [],
            "whatToDo": "Undergo culinary kitchen labs, banquet management, front office training, and luxury hotel internship.",
            "skills": ["Food Production", "Guest Experience Management"],
            "officialLink": { "title": "NCHMCT", "url": "https://nchm.gov.in/" }
          },
          {
            "stepNumber": 3,
            "stage": "Hotel Management Trainee (MT)",
            "course": "Corporate Trainee at 5-Star Hotel Chains",
            "duration": "Graduation Milestone",
            "eligibility": "IHM graduate.",
            "entranceExams": [],
            "whatToDo": "Join luxury hotel groups as Management Trainee or Demi-Chef de Partie.",
            "skills": ["Hotel Administration", "Hospitality Management"],
            "officialLink": { "title": "NCHMCT Careers", "url": "https://nchm.gov.in/" }
          }
        ]
      }
    ]
  }
};

fs.writeFileSync(roadmapPath, JSON.stringify(currentData, null, 2), 'utf8');
console.log('Successfully completed roadmaps-data.json! Total Archetypes:', Object.keys(currentData.archetypes).length);
