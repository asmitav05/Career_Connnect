// Category I: Education, Science and Research (Careers 91 to 100)
module.exports = [
  {
    id: "school-teacher",
    name: "School Teacher",
    category: "Education, Science and Research",
    categoryId: "category-i",
    workType: "People-Oriented",
    sector: "Government & Private",
    educationLevel: "Undergraduate",
    minQualification: "Bachelor's Degree + B.Ed. / D.El.Ed.",
    entranceExams: ["CTET", "State TET", "KVS Recruitment Exam", "NVS Exam"],
    shortDescription: "School Teachers educate primary, secondary, and higher secondary students, developing foundational academic knowledge, critical thinking, and character through structured pedagogy in schools across India.",
    mainResponsibilities: [
      "Design curriculum-aligned lesson plans adhering to CBSE, ICSE, or State Board norms.",
      "Deliver interactive classroom instruction using multimedia tools, activities, and board teaching.",
      "Conduct formative and summative assessments, evaluate exam papers, and provide actionable feedback.",
      "Foster inclusive learning environments and mentor students in personal development and discipline.",
      "Engage parents through regular Parent-Teacher Meetings (PTMs) regarding academic and emotional progress."
    ],
    typicalWorkplace: "Government Schools (Kendriya Vidyalaya, Navodaya Vidyalaya, State Municipal Schools), Private CBSE/ICSE Schools, and International Baccalaureate (IB) Academies.",
    opportunitiesType: "Central/State government schools, prestigious private institutions, coaching institutes, and educational content firms.",
    importantQualities: [
      "Exceptional communication and storytelling skills",
      "Patience, empathy, and active listening",
      "Deep subject matter competence and classroom management",
      "Adaptability to diverse learning paces and child psychology"
    ],
    educationPathways: [
      {
        pathway: "Primary Teacher (PRT) Route",
        title: "10+2 + D.El.Ed. / D.Ed. + CTET Paper I",
        duration: "2 years D.El.Ed.",
        eligibility: "Class 12 with at least 50% aggregate in any stream.",
        description: "Qualifies candidates to teach Classes 1 to 5 in primary schools across state and central jurisdictions.",
        isMandatory: false
      },
      {
        pathway: "Trained Graduate Teacher (TGT) Route",
        title: "Bachelor's Degree (BA/B.Sc./B.Com) + B.Ed. + CTET Paper II",
        duration: "3-4 years UG + 2 years B.Ed. (or 4-year integrated B.El.Ed. / ITEP)",
        eligibility: "Graduation with at least 50% in relevant subject plus B.Ed. degree recognized by NCTE.",
        description: "Standard route to teach Classes 6 to 10 in secondary schools across India.",
        isMandatory: true
      },
      {
        pathway: "Post Graduate Teacher (PGT) Route",
        title: "Master's Degree (MA/M.Sc./M.Com) + B.Ed.",
        duration: "2 years Postgraduation + B.Ed.",
        eligibility: "Postgraduate degree in specialized subject with 50%+ marks.",
        description: "Enables teaching senior secondary students (Classes 11 and 12) preparing for board examinations.",
        isMandatory: false
      }
    ],
    entranceExamsDetails: [
      {
        name: "CTET (Central Teacher Eligibility Test)",
        conductingBody: "Central Board of Secondary Education (CBSE)",
        purpose: "Mandatory qualifying eligibility test for appointment as teachers in central schools (KVS, NVS, Tibetan schools, etc.).",
        frequency: "Twice a year (July and December)",
        details: "Paper I for Class 1-5; Paper II for Class 6-8. Qualifying mark is 60%.",
        isMandatory: true
      },
      {
        name: "State TET (Teacher Eligibility Test - e.g. UPTET, MahaTET, KTET)",
        conductingBody: "Respective State Examination Boards / SCERT",
        purpose: "Qualifying exam for recruitment in state government and aided schools.",
        frequency: "Annual / Biennial",
        details: "Follows state-specific syllabus and language requirements.",
        isMandatory: true
      },
      {
        name: "KVS / NVS Direct Recruitment Exams",
        conductingBody: "Kendriya Vidyalaya Sangathan / Navodaya Vidyalaya Samiti",
        purpose: "Competitive recruitment exams and interviews for permanent teacher posts.",
        frequency: "Periodic vacancy based",
        details: "Requires valid CTET certificate along with subject-specific written exam and demo teaching interview.",
        isMandatory: false
      }
    ],
    skills: {
      beginner: ["Subject Basics", "Lesson Planning", "Classroom Discipline", "Blackboard / Whiteboard Writing"],
      technical: ["Pedagogical Methodologies", "Formative Assessment Design", "Curriculum Mapping", "EdTech Tools (Google Classroom, Kahoot)"],
      advanced: ["Child Psychology & Special Needs Inclusion", "Remedial Teaching Frameworks", "STEM/STEAM Activity Design", "Board Exam Moderation"],
      interpersonal: ["Empathy", "Public Speaking", "Parental Communication", "Conflict Resolution", "Patience"],
      tools: ["Google Classroom", "Microsoft PowerPoint", "DIKSHA Portal", "Teachmint", "Zoom/Teams"],
      certifications: ["B.Ed. (NCTE Recognized)", "CTET Certificate (CBSE - Lifetime Validity)", "Google Certified Educator Level 1"]
    },
    jobOpportunities: [
      { title: "Primary School Teacher (PRT)", type: "Foundational Education", description: "Teaches basic literacy, numeracy, environmental studies, and social skills to children aged 6 to 10." },
      { title: "Trained Graduate Teacher (TGT)", type: "Secondary Education", description: "Subject specialist teaching Mathematics, Science, Social Studies, or Languages to middle and high school students." },
      { title: "Post Graduate Teacher (PGT)", type: "Senior Secondary", description: "Specialized educator teaching Physics, Chemistry, Accountancy, Economics, or History to Class 11-12 students." },
      { title: "EdTech Curriculum Specialist", type: "Private EdTech", description: "Develops digital learning modules, animated video scripts, and quizzes for online learning platforms." }
    ],
    progression: [
      { stage: "Stage 1", role: "Primary / Junior Teacher (PRT)", experience: "0-3 years", focus: "Classroom instruction, basic assessments, foundational pedagogy." },
      { stage: "Stage 2", role: "Trained Graduate Teacher (TGT)", experience: "3-7 years", focus: "Subject teaching, board exam preparation, inter-school competitions." },
      { stage: "Stage 3", role: "Post Graduate Teacher (PGT) / Senior Teacher", experience: "7-12 years", focus: "Senior secondary coaching, curriculum coordinator, teacher mentoring." },
      { stage: "Stage 4", role: "Head of Department (HOD) / Vice Principal", experience: "12-18 years", focus: "Departmental academic supervision, timetable planning, school administration." },
      { stage: "Stage 5", role: "School Principal / Director of Academics", experience: "18+ years", focus: "Overall institution leadership, CBSE/State board liaison, institutional governance." }
    ],
    salary: {
      entry: { range: "₹2.5 Lakhs - ₹4.8 Lakhs per annum", formatted: "₹2.5 - 4.8 LPA" },
      mid: { range: "₹5.0 Lakhs - ₹9.0 Lakhs per annum", formatted: "₹5.0 - 9.0 LPA" },
      experienced: { range: "₹9.5 Lakhs - ₹16.0 Lakhs per annum", formatted: "₹9.5 - 16.0 LPA" },
      currency: "INR",
      source: "7th Central Pay Commission (Level 6 for PRT, Level 7 for TGT, Level 8 for PGT in Central Schools) & AmbitionBox Private School Averages",
      lastVerified: "October 2024",
      disclaimer: "Government school salaries are fixed under 7th CPC (Pay Level 6 to 8) plus DA, HRA, and pension allowances. Private school pay varies drastically by city and brand."
    },
    projects: [
      { title: "Interactive Activity-Based Lesson Plan", type: "Pedagogy", description: "Design a 5-day experiential learning unit in Science or Social Studies with low-cost teaching aids and rubrics.", learningOutcome: "Demonstrates practical lesson structuring and differentiated instruction." },
      { title: "Digital Classroom Sandbox", type: "EdTech", description: "Create a complete Google Classroom module with recorded explanations, self-grading quizzes, and downloadable study notes.", learningOutcome: "Proves competency with modern blended and flipped classroom frameworks." }
    ],
    officialResources: [
      { name: "National Council for Teacher Education (NCTE)", type: "Statutory Regulator", url: "https://ncte.gov.in", description: "Official regulatory body governing teacher education degrees and norms in India." },
      { name: "Central Board of Secondary Education (CBSE) CTET Portal", type: "Examination Portal", url: "https://ctet.nic.in", description: "Official application and syllabus portal for Central Teacher Eligibility Test." },
      { name: "DIKSHA Portal (Ministry of Education)", type: "National Digital Infrastructure", url: "https://diksha.gov.in", description: "National platform for school education offering free textbooks, video modules, and teacher resources." }
    ],
    faqs: [
      { question: "Is B.Ed. compulsory to become a school teacher in India?", answer: "Yes, for regular teaching posts in Classes 6-12 across government and recognized private schools, a B.Ed. degree recognized by NCTE is mandatory. For Classes 1-5, D.El.Ed. or B.El.Ed. is required." },
      { question: "What is the difference between CTET and State TET?", answer: "CTET qualifies you to apply for central government schools (KVS, NVS, Army Public Schools, Delhi DSSSB). State TET qualifies you specifically for state government schools in that particular state." }
    ]
  },
  {
    id: "college-professor",
    name: "College Professor / Assistant Professor",
    category: "Education, Science and Research",
    categoryId: "category-i",
    workType: "Analytical",
    sector: "Government & Private",
    educationLevel: "Doctorate",
    minQualification: "Master's Degree (55%) + UGC-NET / CSIR-NET or Ph.D.",
    entranceExams: ["UGC-NET", "CSIR-NET", "SET / SLET", "GATE"],
    shortDescription: "College Professors and Assistant Professors lecture undergraduate and postgraduate students in higher educational institutions, conduct cutting-edge academic research, publish papers, and supervise doctoral dissertations.",
    mainResponsibilities: [
      "Deliver lectures, seminars, and laboratory sessions to university undergraduate and master's students.",
      "Conduct independent and funded academic research and publish findings in peer-reviewed journals (Scopus/Web of Science).",
      "Mentor and supervise master's dissertations and Ph.D. research scholars.",
      "Design university syllabus, evaluate university examination scripts, and participate in academic councils.",
      "Apply for sponsored research grants from government bodies like DST, DBT, ICSSR, and UGC."
    ],
    typicalWorkplace: "Central Universities (DU, JNU, BHU), State Public Universities, IITs, NITs, IIMs, and autonomous private universities.",
    opportunitiesType: "Tenure-track faculty positions in central/state universities, national institutes of importance, private higher education, and corporate research fellowships.",
    importantQualities: [
      "Deep intellectual curiosity and research methodology mastery",
      "Exceptional academic writing and lecture delivery",
      "Mentorship and scholarly critical thinking",
      "Patience for long-term doctoral research and publication cycles"
    ],
    educationPathways: [
      {
        pathway: "Standard Academic Pathway",
        title: "Bachelor's (3-4 yrs) → Master's (2 yrs) → UGC/CSIR NET → Ph.D.",
        duration: "UG (3-4 yrs) + PG (2 yrs) + Ph.D. (3-5 yrs)",
        eligibility: "Master's degree with minimum 55% marks (50% for SC/ST/OBC-NCL/PwD) in the concerned discipline.",
        description: "Under UGC Regulations, clearing UGC-NET or holding a recognized Ph.D. is mandatory for direct recruitment to Assistant Professor (Academic Level 10).",
        isMandatory: true
      },
      {
        pathway: "Direct Ph.D. After 4-Year Bachelor's",
        title: "4-Year B.Tech / BS / BS-MS → GATE / NET-JRF → Direct Ph.D.",
        duration: "4 years UG + 4-5 years Ph.D.",
        eligibility: "75%+ aggregate or 7.5 CGPA in a 4-year undergraduate degree.",
        description: "Permitted under NEP 2020 guidelines at premier institutes like IITs, IISc, and Central Universities.",
        isMandatory: false
      }
    ],
    entranceExamsDetails: [
      {
        name: "UGC-NET (National Eligibility Test)",
        conductingBody: "National Testing Agency (NTA) on behalf of UGC",
        purpose: "Determines eligibility for Assistant Professorship and award of Junior Research Fellowship (JRF) in Humanities, Commerce, and Computer Science.",
        frequency: "Twice a year (June & December)",
        details: "Two computer-based papers: Paper 1 (General Teaching & Research Aptitude), Paper 2 (Chosen Subject).",
        isMandatory: true
      },
      {
        name: "CSIR-UGC NET",
        conductingBody: "National Testing Agency (NTA)",
        purpose: "Determines eligibility for Lectureship and JRF in Science disciplines (Chemical, Earth, Life, Mathematical, Physical Sciences).",
        frequency: "Twice a year",
        details: "Single 3-hour test assessing fundamental scientific concepts and analytical reasoning.",
        isMandatory: true
      },
      {
        name: "SET / SLET (State Eligibility Test)",
        conductingBody: "State Accreditation Agencies (e.g. MH-SET, TN-SET, WB-SET)",
        purpose: "Qualifies candidates for Assistant Professorship within colleges affiliated with that specific state university system.",
        frequency: "Annual",
        details: "Conducted in regional languages and English following UGC NET guidelines.",
        isMandatory: false
      }
    ],
    skills: {
      beginner: ["Subject Foundations", "Public Speaking", "Academic Literature Review", "Slide Deck Design"],
      technical: ["Research Methodology", "Statistical Tools (SPSS, R, Python, MATLAB)", "Journal Manuscript Preparation", "Curriculum Design"],
      advanced: ["Grant Proposal Writing (DST/SERB/ICSSR)", "Ph.D. Guidance", "Peer Reviewing", "Patent Filing & Technology Transfer"],
      interpersonal: ["Mentorship", "Scholarly Debate", "Academic Integrity", "Student Counseling"],
      tools: ["LaTeX", "Mendeley / Zotero", "Turnitin / Urkund", "Google Scholar", "R / Python"],
      certifications: ["UGC-NET / CSIR-NET Qualification", "Ph.D. Degree (UGC 2018 Regulation Compliant)", "SWAYAM / NPTEL Faculty Development Programme (FDP)"]
    },
    jobOpportunities: [
      { title: "Assistant Professor", type: "Higher Education Entry", description: "Entry-level tenure-track faculty conducting UG/PG teaching and initiating funded research programs." },
      { title: "Associate Professor", type: "Mid-level Academic", description: "Experienced researcher supervising doctoral scholars, publishing regularly, and managing departmental initiatives." },
      { title: "Professor / Senior Professor", type: "Senior Faculty", description: "Distinguished academic leading large research labs, holding endowed chairs, and advising national policy committees." },
      { title: "Dean / University Registrar / Vice-Chancellor", type: "Academic Administration", description: "Senior leadership role governing faculty recruitment, academic standards, university finance, and UGC compliance." }
    ],
    progression: [
      { stage: "Stage 1", role: "Junior Research Fellow (JRF) / Ph.D. Scholar", experience: "0-5 years", focus: "Doctoral research, peer-reviewed publications, teaching assistantship." },
      { stage: "Stage 2", role: "Assistant Professor (Academic Level 10 to 12)", experience: "1-6 years post-Ph.D.", focus: "UG/PG lecturing, student mentoring, independent research grants." },
      { stage: "Stage 3", role: "Associate Professor (Academic Level 13A)", experience: "6-12 years", focus: "Ph.D. supervision, international journal publishing, conference chairs." },
      { stage: "Stage 4", role: "Professor (Academic Level 14)", experience: "12-20 years", focus: "Institutional leadership, high-impact research, national policy committees." },
      { stage: "Stage 5", role: "Dean / Director / Vice-Chancellor (Academic Level 15+)", experience: "20+ years", focus: "University governance, research vision, international academic partnerships." }
    ],
    salary: {
      entry: { range: "₹6.8 Lakhs - ₹11.5 Lakhs per annum", formatted: "₹6.8 - 11.5 LPA" },
      mid: { range: "₹15.0 Lakhs - ₹22.0 Lakhs per annum", formatted: "₹15.0 - 22.0 LPA" },
      experienced: { range: "₹24.0 Lakhs - ₹35.0 Lakhs per annum", formatted: "₹24.0 - 35.0 LPA" },
      currency: "INR",
      source: "UGC 7th Pay Commission Scale (Entry Level 10 basic pay ₹57,700/mo + DA + HRA for Assistant Professor)",
      lastVerified: "October 2024",
      disclaimer: "Central universities, IITs, and NITs strictly implement UGC 7th CPC pay matrices with generous allowances, pension, and research allowances. Private colleges offer competitive market packages."
    },
    projects: [
      { title: "Peer-Reviewed Journal Publication", type: "Research", description: "Author and publish an original empirical paper in a Scopus-indexed or UGC-CARE listed academic journal.", learningOutcome: "Demonstrates rigorous research methodology, data validation, and academic writing." },
      { title: "MOOC / NPTEL Course Syllabus Design", type: "Pedagogy", description: "Design a 40-hour online modular curriculum with video lecture scripts, weekly assignments, and reference reading lists.", learningOutcome: "Proves alignment with modern outcome-based education (OBE) and blended learning standards." }
    ],
    officialResources: [
      { name: "University Grants Commission (UGC)", type: "Apex Regulatory Body", url: "https://www.ugc.gov.in", description: "Statutory body governing university standards, faculty recruitment norms, and research grants in India." },
      { name: "National Testing Agency (NTA) UGC-NET Portal", type: "National Examination Portal", url: "https://ugcnet.nta.ac.in", description: "Official application and syllabus portal for UGC-NET examinations." },
      { name: "National Institutional Ranking Framework (NIRF)", type: "Government Ranking System", url: "https://www.nirfindia.org", description: "Ministry of Education rankings for colleges, universities, and research institutions in India." }
    ],
    faqs: [
      { question: "Is Ph.D. mandatory to become an Assistant Professor?", answer: "According to latest UGC notifications, passing UGC-NET / CSIR-NET / SET remains the minimum eligibility requirement for appointment as Assistant Professor, though a Ph.D. carries significant weight in Academic Performance Index (API) scoring and is required for promotion to Associate Professor." },
      { question: "What is JRF and how does it help?", answer: "Candidates scoring in the top percentile of UGC-NET or CSIR-NET qualify for Junior Research Fellowship (JRF), granting a monthly government fellowship of approx ₹37,000 + HRA for 5 years while pursuing a Ph.D." }
    ]
  },
  {
    id: "research-scientist",
    name: "Research Scientist",
    category: "Education, Science and Research",
    categoryId: "category-i",
    workType: "Analytical",
    sector: "Government, PSU & Research",
    educationLevel: "Doctorate",
    minQualification: "M.Sc. / M.Tech / Ph.D. in Physical / Chemical / Life Sciences / Engineering",
    entranceExams: ["GATE", "CSIR-NET JRF", "JEST", "TIFR GS"],
    shortDescription: "Research Scientists design controlled scientific experiments, formulate novel theoretical models, synthesize compounds, and advance human understanding in physics, chemistry, biology, or computing at premier national laboratories.",
    mainResponsibilities: [
      "Formulate fundamental and applied scientific research hypotheses and design experimental protocols.",
      "Operate sophisticated analytical instrumentation such as NMR, SEM, TEM, Mass Spectrometers, and Supercomputers.",
      "Process complex experimental data using statistical computing and simulation models.",
      "Publish breakthrough research papers in international journals like Nature, Science, and ACS.",
      "Collaborate with industry partners and defense/aerospace agencies for indigenous technology commercialization."
    ],
    typicalWorkplace: "CSIR Laboratories, ISRO, DRDO, DAE (BARC, TIFR), ICMR, IISc, IITs, and private industrial R&D centers.",
    opportunitiesType: "Scientist positions in government research institutes (Scientist B to H), corporate pharmaceutical/biotech R&D, defense research, and academic postdocs.",
    importantQualities: [
      "Rigorous adherence to the scientific method and experimental reproducibility",
      "Advanced mathematical and statistical analytical ability",
      "Perseverance through multi-year trial and research phases",
      "Integrity, documentation accuracy, and lab safety protocols"
    ],
    educationPathways: [
      {
        pathway: "Science Stream to Research Career",
        title: "B.Sc. (3-4 yrs) → M.Sc. (2 yrs) → CSIR-NET JRF / GATE → Ph.D.",
        duration: "UG (3-4 yrs) + PG (2 yrs) + Ph.D. (4-5 yrs)",
        eligibility: "Bachelor's degree in pure sciences with first-class marks followed by master's degree.",
        description: "Standard route for physical, chemical, biological, and mathematical research scientists.",
        isMandatory: true
      },
      {
        pathway: "Engineering Stream to Scientist Post",
        title: "B.Tech / B.E. → GATE Exam → M.Tech / Direct Scientist Recruitment (DRDO/ISRO/BARC)",
        duration: "4 years B.Tech + optional M.Tech",
        eligibility: "First class B.E./B.Tech in Mechanical, Electronics, Computer Science, or Chemical Engineering.",
        description: "Direct entry route as Scientist 'B' or 'SC' in DRDO, ISRO, and DAE via GATE scores or written tests.",
        isMandatory: false
      }
    ],
    entranceExamsDetails: [
      {
        name: "CSIR-UGC NET (JRF)",
        conductingBody: "National Testing Agency (NTA)",
        purpose: "Fellowship and eligibility for Ph.D. admissions across CSIR and academic institutes.",
        frequency: "Twice a year",
        details: "Assesses scientific reasoning, core subject fundamentals, and advanced research concepts.",
        isMandatory: true
      },
      {
        name: "GATE (Graduate Aptitude Test in Engineering)",
        conductingBody: "IITs / IISc",
        purpose: "Admission to M.Tech/Ph.D. at IISc/IITs and direct recruitment for Scientist positions in DRDO (RAC) and BARC (OCES/DGFS).",
        frequency: "Annual (February)",
        details: "High-precision computer-based test in 30 engineering and science subjects.",
        isMandatory: false
      },
      {
        name: "JEST (Joint Entrance Screening Test)",
        conductingBody: "Premier Science Institutes (TIFR, IMSc, RRI, IUCAA)",
        purpose: "National exam for Ph.D. and Integrated Ph.D. programs in Physics, Theoretical Computer Science, and Neuroscience.",
        frequency: "Annual (March)",
        details: "Focuses deeply on theoretical foundations and problem-solving.",
        isMandatory: false
      }
    ],
    skills: {
      beginner: ["Laboratory Safety", "Scientific Method", "Statistical Basics", "Literature Survey"],
      technical: ["Spectroscopy (NMR, FTIR, UV-Vis)", "Electron Microscopy (SEM/TEM)", "Computational Modeling (DFT, Molecular Dynamics)", "Python / MATLAB"],
      advanced: ["Experimental Protocol Optimization", "Grant Proposal Writing", "Patent Drafting", "Interdisciplinary Synthesis"],
      interpersonal: ["Collaborative Teamwork", "Conference Presentation", "Research Ethics", "Scholarly Debate"],
      tools: ["OriginLab", "MATLAB", "Gaussian / VASP", "ChemDraw", "ImageJ", "LaTeX"],
      certifications: ["CSIR-NET JRF Award Letter", "Good Laboratory Practice (GLP) Training", "Radiation Safety Officer Certification (AERB, if applicable)"]
    },
    jobOpportunities: [
      { title: "Scientist 'B' / Scientist 'C'", type: "Government Research Lab", description: "Entry-level gazetted research scientist in CSIR, DRDO, or ICMR executing targeted R&D projects." },
      { title: "Postdoctoral Research Fellow", type: "Academic Research", description: "Advanced academic researcher undertaking 2-3 years of specialized research at international or premier Indian labs." },
      { title: "Principal Scientist / Chief Scientist", type: "R&D Leadership", description: "Leads national priority research missions, manages mega-budgets, and advises cabinet ministries." },
      { title: "Industrial R&D Manager", type: "Corporate Sector", description: "Directs product innovation and patent development in pharma, materials, energy, or tech multinationals." }
    ],
    progression: [
      { stage: "Stage 1", role: "Junior Research Fellow (JRF) / Ph.D. Scholar", experience: "0-4 years", focus: "Laboratory experimentation, research thesis, peer-reviewed publications." },
      { stage: "Stage 2", role: "Scientist 'B' / Postdoctoral Fellow", experience: "1-4 years post-Ph.D.", focus: "Independent project execution, instrument operation, technology validation." },
      { stage: "Stage 3", role: "Scientist 'C' / 'D' / Senior Scientist", experience: "5-10 years", focus: "Grant management, leading research teams, patent filings." },
      { stage: "Stage 4", role: "Principal Scientist / Scientist 'E' / 'F'", experience: "10-18 years", focus: "Program head, technology transfer to industry, international collaborations." },
      { stage: "Stage 5", role: "Chief Scientist / Outstanding Scientist / Lab Director", experience: "18+ years", focus: "Institutional leadership, national science policy advisory, strategic mission delivery." }
    ],
    salary: {
      entry: { range: "₹6.5 Lakhs - ₹11.0 Lakhs per annum", formatted: "₹6.5 - 11.0 LPA" },
      mid: { range: "₹14.0 Lakhs - ₹22.0 Lakhs per annum", formatted: "₹14.0 - 22.0 LPA" },
      experienced: { range: "₹24.0 Lakhs - ₹38.0 Lakhs per annum", formatted: "₹24.0 - 38.0 LPA" },
      currency: "INR",
      source: "7th CPC Central Pay Matrix (Level 10 for Scientist B ~ ₹56,100 basic + DA + HRA; Level 12 for Scientist D; Level 14 for Chief Scientist)",
      lastVerified: "October 2024",
      disclaimer: "Government R&D scales follow central pay rules with extensive healthcare, residential quarters, and conference travel grants. Pharma & Biotech private R&D offers competitive commercial salaries."
    },
    projects: [
      { title: "Nanomaterial / Thin Film Synthesis and Characterization", type: "Experimental R&D", description: "Synthesize metal-oxide nanoparticles using chemical reduction and analyze size distribution via XRD and SEM.", learningOutcome: "Proves mastery of wet-lab synthesis and material characterization protocols." },
      { title: "Computational Molecular Dynamics Simulation", type: "Computational Physics/Chemistry", description: "Simulate protein-ligand binding or crystal lattice vibrations using GROMACS or LAMMPS packages.", learningOutcome: "Demonstrates advanced high-performance computing and statistical mechanics modeling." }
    ],
    officialResources: [
      { name: "Council of Scientific & Industrial Research (CSIR)", type: "Apex R&D Body", url: "https://www.csir.res.in", description: "Network of 37 national laboratories across India pioneering industrial and fundamental science." },
      { name: "Department of Science and Technology (DST)", type: "Government Ministry", url: "https://dst.gov.in", description: "Coordinates national science policies, research fellowships, and competitive research funding." },
      { name: "Defence Research & Development Organisation (DRDO RAC)", type: "Recruitment Assessment Centre", url: "https://rac.gov.in", description: "Direct portal for scientist recruitment in defence and aerospace laboratories across India." }
    ],
    faqs: [
      { question: "Can I become a scientist right after B.Tech without a Ph.D.?", answer: "Yes, organizations like ISRO (via ICRB exam) and DRDO / BARC (via GATE score or direct exams) recruit engineers directly at the Scientist 'SC' or 'B' level with a 4-year B.E./B.Tech degree." },
      { question: "What is the typical career path in CSIR labs?", answer: "One starts as Scientist (Level 11), progressing to Senior Scientist (Level 12), Principal Scientist (Level 13), Senior Principal Scientist (Level 13A), and Chief Scientist (Level 14)." }
    ]
  },
  {
    id: "mathematician",
    name: "Mathematician",
    category: "Education, Science and Research",
    categoryId: "category-i",
    workType: "Analytical",
    sector: "Private & Institutional",
    educationLevel: "Postgraduate",
    minQualification: "M.Sc. / M.Stat / M.Math in Mathematics / Applied Mathematics",
    entranceExams: ["IIT-JAM", "CSIR-NET (Mathematical Sciences)", "GATE", "ISI Admission Test", "CMI Entrance"],
    shortDescription: "Mathematicians apply pure mathematical logic, abstract algebra, topology, differential equations, and computational methods to solve complex theoretical challenges, encryption algorithms, financial models, and scientific simulations.",
    mainResponsibilities: [
      "Develop novel mathematical theories, proofs, and analytical frameworks in pure or applied mathematics.",
      "Formulate mathematical models for physical phenomena, fluid dynamics, cryptography, and complex networks.",
      "Collaborate with computer scientists to optimize algorithms, error-correcting codes, and AI learning theory.",
      "Work with quantitative finance teams to build stochastic calculus models for derivative pricing and risk analysis.",
      "Publish theoretical research papers and teach advanced mathematics in university institutes."
    ],
    typicalWorkplace: "Academic research institutes (TIFR, IMSc, CMI, ISI, IISc, IITs), quantitative trading firms, aerospace/defense agencies, and cryptography divisions.",
    opportunitiesType: "Theoretical research positions, quantitative analyst roles, cryptographic researchers, data science theorists, and university faculty.",
    importantQualities: [
      "Rigorous abstract logical reasoning and spatial visualization",
      "Perseverance with unresolved mathematical theorems and proofs",
      "Precision and formal deduction skills",
      "Ability to translate real-world problems into clean formal systems"
    ],
    educationPathways: [
      {
        pathway: "Premier Mathematics Route (ISI / CMI)",
        title: "B.Math / B.Sc. (Hons) at ISI / CMI → M.Math / M.Sc. → Ph.D.",
        duration: "3 years UG + 2 years PG + 4-5 years Ph.D.",
        eligibility: "Class 12 with strong score in Mathematics; clearing ISI Admission Test or CMI Entrance Test.",
        description: "The gold-standard pathway in India for pure mathematics, theoretical computer science, and logic.",
        isMandatory: false
      },
      {
        pathway: "University Route via IIT-JAM",
        title: "B.Sc. Mathematics → IIT-JAM → M.Sc. at IIT/NIT → CSIR-NET / GATE → Ph.D.",
        duration: "3-4 years UG + 2 years PG + Ph.D.",
        eligibility: "B.Sc. with Mathematics as a major subject with minimum 55% marks.",
        description: "Standard route for pure and applied mathematics research in India.",
        isMandatory: true
      }
    ],
    entranceExamsDetails: [
      {
        name: "IIT-JAM (Joint Admission test for Masters)",
        conductingBody: "IITs / IISc",
        purpose: "Admissions to M.Sc., Joint M.Sc.-Ph.D. in Mathematics at IITs and IISc.",
        frequency: "Annual (February)",
        details: "Assesses Real Analysis, Multivariable Calculus, Linear Algebra, and Group Theory.",
        isMandatory: true
      },
      {
        name: "ISI Admission Test",
        conductingBody: "Indian Statistical Institute (ISI Kolkata/Bangalore/Delhi)",
        purpose: "Admission to B.Math (Hons), M.Math, and JRF programs with full government stipends.",
        frequency: "Annual (May)",
        details: "Challenging subjective and objective mathematics testing problem-solving creativity.",
        isMandatory: false
      },
      {
        name: "CSIR-UGC NET (Mathematical Sciences)",
        conductingBody: "National Testing Agency (NTA)",
        purpose: "Determines JRF fellowship and lectureship eligibility across India.",
        frequency: "Twice a year",
        details: "Comprehensive syllabus spanning Pure, Applied, and Statistical Mathematics.",
        isMandatory: true
      }
    ],
    skills: {
      beginner: ["Calculus", "Linear Algebra", "Proof Techniques", "Discrete Mathematics"],
      technical: ["Real & Complex Analysis", "Abstract Algebra (Groups, Rings, Fields)", "Topology", "Ordinary & Partial Differential Equations"],
      advanced: ["Stochastic Calculus", "Elliptic Curve Cryptography", "Functional Analysis", "Numerical Optimization"],
      interpersonal: ["Abstract Concept Articulation", "Academic Writing", "Logical Debate", "Intellectual Humility"],
      tools: ["MATLAB", "Mathematica", "Python (NumPy, SciPy, SymPy)", "LaTeX", "SageMath"],
      certifications: ["CSIR-NET JRF Qualified (Mathematical Sciences)", "GATE Mathematics (MA) Scorecard"]
    },
    jobOpportunities: [
      { title: "Pure Mathematics Researcher", type: "Fundamental Science", description: "Investigates abstract mathematical structures, algebraic geometry, and number theory in academic institutes." },
      { title: "Cryptographer / Security Theorist", type: "Cybersecurity & Defence", description: "Designs post-quantum cryptographic primitives, zero-knowledge proofs, and public-key algorithms for DRDO, banks, or tech firms." },
      { title: "Quantitative Strategist (Quant)", type: "High-Finance", description: "Develops algorithmic trading models, stochastic volatility forecasts, and statistical arbitrage strategies on Dalal Street and Wall Street." },
      { title: "Applied Mathematician", type: "Engineering & Aerospace", description: "Solves aerodynamic fluid dynamics, computational electromagnetics, and space flight trajectory equations." }
    ],
    progression: [
      { stage: "Stage 1", role: "Graduate Research Assistant / Junior Quant", experience: "0-3 years", focus: "Mathematical modeling, algorithmic prototyping, literature review." },
      { stage: "Stage 2", role: "Postdoctoral Fellow / Quantitative Analyst", experience: "3-7 years", focus: "Independent proof formulation, model backtesting, journal publications." },
      { stage: "Stage 3", role: "Assistant Professor / Senior Quant Researcher", experience: "7-12 years", focus: "Doctoral student supervision, proprietary trading strategy development." },
      { stage: "Stage 4", role: "Professor / Head of Quantitative Research", experience: "12-18 years", focus: "Academic chair, quantitative hedge fund risk governance, national math olympiad training." },
      { stage: "Stage 5", role: "Distinguished Scientist / Managing Director (Quant)", experience: "18+ years", focus: "Global research leadership, high-stakes financial technology direction." }
    ],
    salary: {
      entry: { range: "₹6.0 Lakhs - ₹15.0 Lakhs per annum", formatted: "₹6.0 - 15.0 LPA" },
      mid: { range: "₹16.0 Lakhs - ₹35.0 Lakhs per annum", formatted: "₹16.0 - 35.0 LPA" },
      experienced: { range: "₹40.0 Lakhs - ₹80.0 Lakhs+ per annum", formatted: "₹40.0 - 80.0+ LPA" },
      currency: "INR",
      source: "Academic UGC Pay Matrix (₹6.8-15 LPA) vs. Quant Trading Firms (Tower Research, Jane Street, Graviton - ₹35-80+ LPA)",
      lastVerified: "October 2024",
      disclaimer: "Massive bifurcation: Academic faculty adhere to central UGC pay scales; Quants and Cryptographers in high-frequency trading firms command elite compensation packages."
    },
    projects: [
      { title: "Elliptic Curve Cryptography Implementation", type: "Cryptography", description: "Write an end-to-end Python library implementing point addition, doubling, and ECDSA key generation from scratch.", learningOutcome: "Demonstrates practical number theory and modern cryptographic application." },
      { title: "Monte Carlo Option Pricing Engine", type: "Quantitative Finance", description: "Build a Black-Scholes and Heston stochastic volatility simulator simulating 100,000 price paths for exotic options.", learningOutcome: "Proves mastery of stochastic processes, probability distributions, and numerical methods." }
    ],
    officialResources: [
      { name: "Indian Statistical Institute (ISI)", type: "Institute of National Importance", url: "https://www.isical.ac.in", description: "India's premier institution for mathematics, probability, statistics, and theoretical computer science." },
      { name: "Chennai Mathematical Institute (CMI)", type: "Premier Research University", url: "https://www.cmi.ac.in", description: "Renowned institution dedicated to undergraduate, master's, and doctoral studies in mathematics." },
      { name: "Tata Institute of Fundamental Research (TIFR)", type: "National Centre", url: "https://www.math.tifr.res.in", description: "School of Mathematics conducting frontier research in pure and applied mathematics." }
    ],
    faqs: [
      { question: "What are the job opportunities for a mathematics graduate besides teaching?", answer: "Mathematics graduates are actively recruited in quantitative trading, cryptographic security, data science, machine learning theory, risk analytics in banks, and aerospace simulation." },
      { question: "Which are the best institutes in India for studying mathematics?", answer: "ISI (Kolkata & Bangalore), CMI (Chennai), IISc Bangalore, TIFR Mumbai, and top IITs (Kanpur, Bombay, Madras, Delhi)." }
    ]
  },
  {
    id: "statistician",
    name: "Statistician",
    category: "Education, Science and Research",
    categoryId: "category-i",
    workType: "Analytical",
    sector: "Government & Private",
    educationLevel: "Postgraduate",
    minQualification: "Master's in Statistics (M.Sc. / M.Stat)",
    entranceExams: ["ISS Exam (UPSC)", "IIT-JAM (Mathematical Statistics)", "ISI Admission Test", "CUET-PG"],
    shortDescription: "Statisticians collect, organize, interpret, and present quantitative data to uncover population trends, design randomized clinical trials, evaluate public welfare schemes, and guide data-driven enterprise decisions.",
    mainResponsibilities: [
      "Design statistically sound sampling methodologies, clinical trial protocols, and household sample surveys.",
      "Apply probability distributions, hypothesis testing, Bayesian inference, and time-series forecasting.",
      "Audit government socio-economic indicators (GDP, CPI inflation, employment census) under MoSPI.",
      "Perform biostatistical analyses for drug safety approvals with pharmaceutical clinical research teams.",
      "Translate complex statistical outputs into actionable policy reports and visual dashboards."
    ],
    typicalWorkplace: "Ministry of Statistics & Programme Implementation (MoSPI / NSSO), Indian Statistical Service (ISS), pharmaceutical CROs, market research agencies, and insurance firms.",
    opportunitiesType: "Indian Statistical Service (UPSC ISS), biostatistician in pharma, risk modeling in banks, survey research specialist, and university faculty.",
    importantQualities: [
      "Rigorous understanding of probability, sampling theory, and inference",
      "Detail orientation and bias detection in survey datasets",
      "Competency in statistical computing packages",
      "Integrity in objective presentation of data findings"
    ],
    educationPathways: [
      {
        pathway: "Standard Statistical Pathway",
        title: "B.Sc. / B.Stat in Statistics → M.Sc. / M.Stat → Industry / UPSC ISS",
        duration: "3 years UG + 2 years PG",
        eligibility: "Class 12 with Mathematics/Statistics followed by B.Sc. with Statistics as a principal subject.",
        description: "Qualifies candidates for private industry roles and eligibility for the premier UPSC Indian Statistical Service examination.",
        isMandatory: true
      },
      {
        pathway: "ISI Specialization Pathway",
        title: "B.Stat (Hons) at ISI Kolkata → M.Stat → Global Research / Industry",
        duration: "3 years UG + 2 years PG",
        eligibility: "Selection through national competitive entrance test and interview conducted by ISI.",
        description: "India's highest regarded program offering direct campus recruitment into elite analytics and government research bodies.",
        isMandatory: false
      }
    ],
    entranceExamsDetails: [
      {
        name: "UPSC Indian Statistical Service (ISS) Examination",
        conductingBody: "Union Public Service Commission (UPSC)",
        purpose: "Recruitment to Group 'A' Central Civil Services managing national economic and social statistics.",
        frequency: "Annual (June/July)",
        details: "Written exam with 6 papers (General English, General Studies, Statistics I, II, III, IV) followed by interview.",
        isMandatory: true
      },
      {
        name: "IIT-JAM (Mathematical Statistics - MS)",
        conductingBody: "IITs / IISc",
        purpose: "Admission to M.Sc. in Statistics / Applied Statistics at IIT Bombay, IIT Kanpur, etc.",
        frequency: "Annual (February)",
        details: "Assesses Calculus, Probability, Random Variables, Joint Distributions, and Inference.",
        isMandatory: false
      },
      {
        name: "ISI M.Stat Entrance Exam",
        conductingBody: "Indian Statistical Institute",
        purpose: "Admission to the prestigious 2-year Master of Statistics program.",
        frequency: "Annual",
        details: "Advanced testing in probability theory, statistical inference, and linear models.",
        isMandatory: false
      }
    ],
    skills: {
      beginner: ["Descriptive Statistics", "Probability Basics", "Excel Data Analysis", "Sampling Techniques"],
      technical: ["Hypothesis Testing (t-test, ANOVA, Chi-square)", "Regression & GLM Modeling", "Time Series Forecasting (ARIMA, GARCH)", "R / SAS Programming"],
      advanced: ["Bayesian Data Analysis", "Survival Analysis (Kaplan-Meier, Cox PH)", "Design of Experiments (DoE)", "Stochastic Modeling"],
      interpersonal: ["Data Storytelling", "Scientific Rigor", "Ethics in Data Presentation", "Cross-functional Collaboration"],
      tools: ["R Studio", "SAS", "SPSS", "Python (Statsmodels)", "STATA"],
      certifications: ["UPSC ISS Gazetted Officer Commission", "Base / Advanced SAS Certified Programmer", "Chartered Statistician (CStat)"]
    },
    jobOpportunities: [
      { title: "Assistant Director (ISS)", type: "Government Civil Service", description: "Group A gazetted officer in MoSPI, RBI, or NITI Aayog supervising national data collection and policy analytics." },
      { title: "Biostatistician", type: "Pharmaceuticals / CRO", description: "Designs clinical trial sample sizes, power calculations, and drug efficacy analysis for FDA/CDSCO submissions." },
      { title: "Econometrician / Risk Modeler", type: "Banking & Financial Services", description: "Builds macroeconomic forecasting models and credit scoring models for financial institutions." },
      { title: "Survey Research Methodologist", type: "Market & Public Policy Research", description: "Designs national survey methodologies, weighting schemes, and margin-of-error models for polling and think tanks." }
    ],
    progression: [
      { stage: "Stage 1", role: "Junior Statistical Officer (JSO) / Assistant Biostatistician", experience: "0-3 years", focus: "Data validation, basic regression, summary tables, survey inspection." },
      { stage: "Stage 2", role: "Assistant Director (ISS) / Biostatistician", experience: "3-7 years", focus: "Trial protocol design, complex statistical modeling, SAS/R macro building." },
      { stage: "Stage 3", role: "Deputy Director / Senior Statistical Manager", experience: "7-12 years", focus: "Divisional survey management, regulatory clinical reports, team leadership." },
      { stage: "Stage 4", role: "Director (ISS) / Principal Statistician", experience: "12-18 years", focus: "National sample survey design, CDSCO/FDA defense of trial results." },
      { stage: "Stage 5", role: "Director General (CSO/NSSO) / Chief Data Scientist", experience: "18+ years", focus: "National statistical system leadership, global statistical harmonization with UN." }
    ],
    salary: {
      entry: { range: "₹6.0 Lakhs - ₹10.5 Lakhs per annum", formatted: "₹6.0 - 10.5 LPA" },
      mid: { range: "₹12.0 Lakhs - ₹20.0 Lakhs per annum", formatted: "₹12.0 - 20.0 LPA" },
      experienced: { range: "₹22.0 Lakhs - ₹38.0 Lakhs per annum", formatted: "₹22.0 - 38.0 LPA" },
      currency: "INR",
      source: "7th CPC Central Pay Matrix (Level 10 for UPSC ISS Assistant Director) & Pharma Biostatistics Market Surveys",
      lastVerified: "October 2024",
      disclaimer: "UPSC ISS Officers receive 7th CPC Pay Level 10 plus central government perks. Corporate Biostatisticians in multinational pharma and CROs command high private packages."
    },
    projects: [
      { title: "Randomized Clinical Trial Survival Analysis", type: "Biostatistics", description: "Analyze survival curves and Cox proportional hazards for oncology patient cohorts using R and survival package.", learningOutcome: "Demonstrates practical clinical trial analysis and regulatory reporting compliance." },
      { title: "National Socio-Economic Survey Sampling Design", type: "Survey Statistics", description: "Design a stratified multi-stage cluster sampling framework to estimate rural household internet penetration.", learningOutcome: "Proves mastery of survey weighting, non-response adjustments, and confidence interval estimation." }
    ],
    officialResources: [
      { name: "Ministry of Statistics and Programme Implementation (MoSPI)", type: "Government Ministry", url: "https://www.mospi.gov.in", description: "Central ministry overseeing NSSO, CSO, and Indian Statistical Service administration." },
      { name: "Union Public Service Commission (UPSC ISS)", type: "Examination Portal", url: "https://upsc.gov.in", description: "Conducts the annual competitive examination for Indian Statistical Service officer posts." },
      { name: "Indian Statistical Institute (ISI)", type: "Apex Educational Institution", url: "https://www.isical.ac.in", description: "Premier institute dedicated to statistics research, survey training, and quality control." }
    ],
    faqs: [
      { question: "What is the UPSC Indian Statistical Service (ISS) exam?", answer: "The ISS is a prestigious Group A central government service exam conducted by UPSC. Only candidates with a Bachelor's or Master's degree in Statistics / Applied Statistics / Mathematical Statistics are eligible to apply." },
      { question: "What is the role of a Biostatistician in India?", answer: "India has a massive pharmaceutical clinical trials industry. Biostatisticians design clinical experiments, determine sample sizes, and analyze drug safety and efficacy data for international regulatory authorities." }
    ]
  },
  {
    id: "psychologist",
    name: "Psychologist / Clinical Psychologist",
    category: "Education, Science and Research",
    categoryId: "category-i",
    workType: "People-Oriented",
    sector: "Private & Institutional",
    educationLevel: "Postgraduate",
    minQualification: "Master's in Psychology (MA/M.Sc.) + M.Phil in Clinical Psychology (RCI Licensed)",
    entranceExams: ["CUET-PG", "RCI M.Phil Clinical Psychology Entrance Tests", "UGC-NET"],
    shortDescription: "Psychologists assess cognitive, emotional, and social processes, diagnosing behavioral patterns and delivering evidence-based psychotherapeutic interventions to support mental health and human well-being across diverse populations.",
    mainResponsibilities: [
      "Conduct psychological assessments, diagnostic interviews, and standardized psychometric testing (IQ, personality, neuropsychological).",
      "Formulate clinical treatment plans and deliver psychotherapies including Cognitive Behavioral Therapy (CBT) and Mindfulness practices.",
      "Support individuals dealing with clinical depression, anxiety, trauma, substance abuse, and neurodivergence.",
      "Provide corporate wellness, student counseling, and marriage/family therapy.",
      "Maintain strict clinical confidentiality and adhere to Rehabilitation Council of India (RCI) ethical guidelines."
    ],
    typicalWorkplace: "Hospitals, psychiatric clinics, private counseling practices, schools/colleges, corporate wellness programs, and rehabilitation centers.",
    opportunitiesType: "Clinical Psychologist (RCI certified), Counseling Psychologist, School Counselor, Organizational/Industrial Psychologist, and Neuropsychologist.",
    importantQualities: [
      "Unconditional empathy, non-judgmental active listening, and rapport building",
      "Emotional resilience and healthy therapeutic boundaries",
      "Scientific objectivity in psychometric evaluation",
      "Commitment to ethical codes and client privacy"
    ],
    educationPathways: [
      {
        pathway: "Licensed Clinical Psychologist Pathway",
        title: "BA/B.Sc. Psychology → MA/M.Sc. Clinical Psychology → M.Phil in Clinical Psychology (2 yrs, RCI recognized)",
        duration: "3 yrs UG + 2 yrs PG + 2 yrs M.Phil / Psy.D.",
        eligibility: "Master's degree in Psychology with at least 55% aggregate; clearing institution-specific RCI entrance exams (NIMHANS, CIP, IHBAS).",
        description: "The only legally recognized route in India to register with the Rehabilitation Council of India (RCI) as a Licensed Clinical Psychologist.",
        isMandatory: true
      },
      {
        pathway: "Counseling / Organizational Psychologist Route",
        title: "BA/B.Sc. Psychology → MA/M.Sc. in Counseling / Industrial Psychology",
        duration: "3 years UG + 2 years PG",
        eligibility: "Graduation with Psychology as a major or allied subject.",
        description: "Enables practice as a counseling psychologist, student counselor, or human resource organizational consultant.",
        isMandatory: false
      }
    ],
    entranceExamsDetails: [
      {
        name: "NIMHANS / CIP / IHBAS M.Phil Clinical Psychology Entrance",
        conductingBody: "National Institute of Mental Health and Neurosciences / Central Institute of Psychiatry",
        purpose: "Admission to the prestigious 2-year hospital-based clinical training leading to RCI license.",
        frequency: "Annual",
        details: "Assesses general psychology, psychopathology, psychological testing, and clinical assessment.",
        isMandatory: true
      },
      {
        name: "CUET-PG (Psychology)",
        conductingBody: "National Testing Agency (NTA)",
        purpose: "Admission to MA/M.Sc. Psychology at Central Universities (DU, BHU, JMI).",
        frequency: "Annual (March/April)",
        details: "Covers foundational psychology, cognitive systems, research methods, and social psychology.",
        isMandatory: false
      },
      {
        name: "UGC-NET (Psychology)",
        conductingBody: "National Testing Agency (NTA)",
        purpose: "Eligibility for Assistant Professorship and Junior Research Fellowship (JRF).",
        frequency: "Twice a year",
        details: "Comprehensive syllabus covering physiological psychology, testing, and therapies.",
        isMandatory: false
      }
    ],
    skills: {
      beginner: ["Active Listening", "Basic Empathy", "Psychology Theories", "Observational Techniques"],
      technical: ["Psychometric Testing (Bhatia Battery, TAT, Rorschach, MMPI)", "Diagnostic Criteria (DSM-5, ICD-11)", "Cognitive Behavioral Therapy (CBT)", "Behavior Modification"],
      advanced: ["Dialectical Behavior Therapy (DBT)", "Neuropsychological Rehabilitation", "Trauma-Informed Care", "Crisis Suicide Intervention"],
      interpersonal: ["Unconditional Positive Regard", "Therapeutic Boundaries", "Cultural Sensitivity", "Patience"],
      tools: ["Standardized Psychometric Toolkits", "SPSS / R for Psychological Research", "Telehealth Platforms (Practo, Mindpeers)", "Case History Records"],
      certifications: ["Rehabilitation Council of India (RCI) License", "Certified CBT Practitioner", "Neuro-Linguistic Programming (NLP) / Expressive Arts Therapy"]
    },
    jobOpportunities: [
      { title: "Licensed Clinical Psychologist", type: "Healthcare / Hospital", description: "Diagnoses mental disorders, administers psychometric batteries, and treats patients in psychiatric setups." },
      { title: "Counseling Psychologist", type: "Community & Wellness", description: "Helps clients navigate relationship distress, career burnout, grief, and emotional well-being." },
      { title: "School / Child Psychologist", type: "Educational Institutions", description: "Evaluates learning disabilities (ADHD, dyslexia), behavioral issues, and provides student counseling." },
      { title: "Organizational (I/O) Psychologist", type: "Corporate HR", description: "Designs employee assessment batteries, workplace wellbeing programs, and leadership coaching frameworks." }
    ],
    progression: [
      { stage: "Stage 1", role: "Trainee Psychologist / Clinical Intern", experience: "0-2 years", focus: "Supervised case histories, testing administration, basic counseling rapport." },
      { stage: "Stage 2", role: "Junior Clinical Psychologist / Counselor", experience: "2-5 years", focus: "Independent therapeutic sessions, diagnostic assessments, workshop facilitation." },
      { stage: "Stage 3", role: "Senior Psychologist / Clinic Lead", experience: "5-10 years", focus: "Complex psychopathology treatment, supervising trainees, institutional consulting." },
      { stage: "Stage 4", role: "Head of Mental Health / Department Director", experience: "10-18 years", focus: "Hospital department leadership, psychiatric team management, clinical research." },
      { stage: "Stage 5", role: "Senior Consultant & Private Practice Founder", experience: "18+ years", focus: "Leading private mental health centers, policy advisory for mental health legislation." }
    ],
    salary: {
      entry: { range: "₹3.2 Lakhs - ₹5.5 Lakhs per annum", formatted: "₹3.2 - 5.5 LPA" },
      mid: { range: "₹6.0 Lakhs - ₹11.0 Lakhs per annum", formatted: "₹6.0 - 11.0 LPA" },
      experienced: { range: "₹12.0 Lakhs - ₹25.0 Lakhs+ per annum", formatted: "₹12.0 - 25.0+ LPA" },
      currency: "INR",
      source: "National Mental Health Survey Data & Practo Healthcare Professional Average Rates",
      lastVerified: "October 2024",
      disclaimer: "Hospital roles start at ₹3-6 LPA; experienced private practitioners charging ₹1,500 to ₹3,500 per therapy hour earn significantly higher depending on reputation and city."
    },
    projects: [
      { title: "Comprehensive Psychometric Assessment Case Study", type: "Clinical Evaluation", description: "Administer a full psychological test battery (IQ, personality, depression inventory), score standardized scales, and draft a clinical report under supervision.", learningOutcome: "Demonstrates clinical diagnostic rigor and ethical report preparation." },
      { title: "Workplace Stress Management Psychoeducation Module", type: "Community Mental Health", description: "Design a 4-week evidence-based mindfulness and cognitive coping program for corporate professionals.", learningOutcome: "Proves ability to translate psychotherapeutic insights into preventative mental healthcare." }
    ],
    officialResources: [
      { name: "Rehabilitation Council of India (RCI)", type: "Statutory Licensing Body", url: "https://rehabcouncil.nic.in", description: "Mandatory regulatory authority governing qualifications and licensing for Clinical Psychologists in India." },
      { name: "National Institute of Mental Health and Neurosciences (NIMHANS)", type: "Apex Institute of National Importance", url: "https://nimhans.ac.in", description: "India's premier institute for mental health, clinical psychology training, and neurosciences." },
      { name: "Tele-MANAS (Ministry of Health & Family Welfare)", type: "National Mental Health Helpline", url: "https://telemanas.mohfw.gov.in", description: "Government 24/7 tele-mental health service offering digital psychological counseling." }
    ],
    faqs: [
      { question: "What is the difference between a Psychiatrist and a Psychologist?", answer: "A Psychiatrist is an MBBS doctor with an MD in Psychiatry who can prescribe medications. A Psychologist holds a Master's/M.Phil in Psychology, treats conditions through psychotherapy and counseling, and cannot prescribe psychiatric medications." },
      { question: "Is RCI license mandatory to practice psychology in India?", answer: "An RCI license is mandatory if you want to practice as a 'Clinical Psychologist' diagnosing psychiatric disorders. For general counseling, career counseling, or organizational coaching, a Master's degree in Psychology is the standard requirement." }
    ]
  },
  {
    id: "agricultural-scientist",
    name: "Agricultural Scientist / Agronomist",
    category: "Education, Science and Research",
    categoryId: "category-i",
    workType: "Technical",
    sector: "Government, PSU & Research",
    educationLevel: "Postgraduate",
    minQualification: "M.Sc. / Ph.D. in Agriculture / Agronomy / Soil Science",
    entranceExams: ["ICAR AIEEA PG", "ICAR AICE-JRF/SRF", "ASRB ARS Exam"],
    shortDescription: "Agricultural Scientists conduct agricultural research to improve crop yields, breed climate-resilient seeds, optimize soil health, and develop sustainable farming techniques to ensure food security across India.",
    mainResponsibilities: [
      "Conduct field trials and hybridization experiments to develop drought-, flood-, and pest-resistant crop varieties.",
      "Analyze soil chemistry, nutrient profiles, and formulate balanced organic and chemical fertilization regimes.",
      "Develop water-efficient micro-irrigation and precision farming models tailored for Indian agro-climatic zones.",
      "Publish scientific research findings in peer-reviewed agricultural journals and ICAR bulletins.",
      "Transfer innovative agricultural technologies from laboratory to land through Krishi Vigyan Kendras (KVKs)."
    ],
    typicalWorkplace: "Indian Council of Agricultural Research (ICAR) institutes (IARI, CRRI, NDRI), State Agricultural Universities (SAUs), seed corporations, and agri-biotech firms.",
    opportunitiesType: "Agricultural Research Service (ARS) Scientist posts in ICAR, Assistant Professor in SAUs, R&D scientist in seed/fertilizer companies, and international bodies (CGIAR, FAO).",
    importantQualities: [
      "Passion for fieldwork and agricultural bio-systems",
      "Rigorous experimental design in varying climatic environments",
      "Commitment to farmer welfare and sustainable agriculture",
      "Analytical mindset for genetics, plant pathology, and soil biology"
    ],
    educationPathways: [
      {
        pathway: "Standard ICAR Academic Pathway",
        title: "B.Sc. (Hons) Agriculture (4 yrs) → M.Sc. Agriculture (2 yrs) → Ph.D. / ASRB ARS",
        duration: "4 years UG + 2 years PG + 3-4 years Ph.D.",
        eligibility: "Class 12 with PCB / PCM / Agriculture with 50%+ marks; clearing ICAR AIEEA-UG or State Agri CETs.",
        description: "Accredited four-year degree recognized by ICAR, mandatory for national scientist recruitment.",
        isMandatory: true
      },
      {
        pathway: "Direct Agricultural Research Service (ARS) Pathway",
        title: "M.Sc. Agriculture / Allied → ASRB Agricultural Research Service (ARS) Exam",
        duration: "M.Sc. completed",
        eligibility: "Master's degree in the relevant agricultural discipline from an ICAR-recognized institution.",
        description: "Prestigious direct entry route into Group 'A' Agricultural Scientist posts in ICAR institutes.",
        isMandatory: false
      }
    ],
    entranceExamsDetails: [
      {
        name: "ASRB ARS (Agricultural Research Service) Examination",
        conductingBody: "Agricultural Scientists Recruitment Board (ASRB)",
        purpose: "Direct recruitment of Scientists (Level 10) in ICAR institutes across India.",
        frequency: "Annual / Biennial",
        details: "Preliminary Objective Test, ARS Mains Descriptive Exam, and Research Viva-Voce.",
        isMandatory: true
      },
      {
        name: "ICAR AIEEA-PG (All India Entrance Examination for Admission)",
        conductingBody: "National Testing Agency (NTA) on behalf of ICAR",
        purpose: "Admission to Master's degree programs and award of ICAR-PG Scholarship in State Agricultural Universities.",
        frequency: "Annual (June/July)",
        details: "Computer-based test covering major agricultural subject groups.",
        isMandatory: false
      },
      {
        name: "ICAR AICE-JRF/SRF (Ph.D.)",
        conductingBody: "National Testing Agency (NTA)",
        purpose: "Admission to doctoral programs and award of Junior/Senior Research Fellowships in agriculture.",
        frequency: "Annual",
        details: "Subject-specific advanced evaluation in agricultural sciences.",
        isMandatory: false
      }
    ],
    skills: {
      beginner: ["Crop Anatomy", "Soil Types & Textures", "Basic Meteorology", "Field Observation"],
      technical: ["Plant Breeding & Hybridization", "Soil Chemistry & Nutrient Management", "Plant Pathology & Integrated Pest Management (IPM)", "Precision Agriculture GPS/GIS"],
      advanced: ["Marker-Assisted Selection (MAS)", "Genomic Editing (CRISPR in crops)", "Drip Irrigation Design", "Agro-ecological Modeling"],
      interpersonal: ["Farmer Extension & Communication", "Scientific Report Writing", "Field Team Coordination", "Patience"],
      tools: ["Crop Simulation Models (DSSAT, APSIM)", "ArcGIS / QGIS", "SPSS / SAS for Field Data", "Soil Testing Sensor Kits"],
      certifications: ["ASRB ARS Scientist Certificate", "ICAR National Eligibility Test (NET) Certificate", "Certified Soil Health Analyst"]
    },
    jobOpportunities: [
      { title: "Scientist (ARS - ICAR)", type: "Central Government R&D", description: "Gazetted scientist in premier institutes like IARI Pusa leading research projects in crop improvement or natural resource management." },
      { title: "Assistant Professor (Agronomy / Genetics)", type: "State Agricultural Universities", description: "Educates undergraduate and postgraduate agricultural scholars and heads research farms." },
      { title: "Seed Breeder / Plant Geneticist", type: "Agri-Business Corporate", description: "Develops commercial high-yielding hybrid seeds for multinational seed corporations (Bayer, Syngenta, Mahyco)." },
      { title: "Subject Matter Specialist (KVK)", type: "Farmer Extension", description: "Demonstrates new farm technologies, advises farmers on disease control, and coordinates field trials." }
    ],
    progression: [
      { stage: "Stage 1", role: "Scientist (Level 10 - Probationer / NAARM Trainee)", experience: "0-3 years", focus: "Foundation course at NAARM Hyderabad, trial plots, crop experimentation." },
      { stage: "Stage 2", role: "Senior Scientist (Level 12)", experience: "3-8 years", focus: "Independent breeding trials, variety release proposals, research publications." },
      { stage: "Stage 3", role: "Principal Scientist (Level 14)", experience: "8-15 years", focus: "National mission coordination, patent and variety registration, managing institute divisions." },
      { stage: "Stage 4", role: "Head of Division / Project Coordinator", experience: "15-20 years", focus: "All-India Coordinated Research Project (AICRP) leadership, ICAR policy input." },
      { stage: "Stage 5", role: "Director of ICAR Institute / Vice-Chancellor (SAU)", experience: "20+ years", focus: "Apex agricultural administration, international food policy coordination." }
    ],
    salary: {
      entry: { range: "₹6.5 Lakhs - ₹11.0 Lakhs per annum", formatted: "₹6.5 - 11.0 LPA" },
      mid: { range: "₹14.0 Lakhs - ₹22.0 Lakhs per annum", formatted: "₹14.0 - 22.0 LPA" },
      experienced: { range: "₹24.0 Lakhs - ₹35.0 Lakhs per annum", formatted: "₹24.0 - 35.0 LPA" },
      currency: "INR",
      source: "7th CPC Central Pay Matrix (Level 10 basic pay ₹57,700 + DA + HRA for ARS Scientists)",
      lastVerified: "October 2024",
      disclaimer: "ICAR and SAU scientists receive gazetted central pay scales with residential housing inside research estates and generous scientific travel allowances."
    },
    projects: [
      { title: "Drought Tolerance Hybrid Phenotyping Trial", type: "Crop Improvement", description: "Evaluate 10 hybrid maize or millet genotypes under restricted water conditions and document physiological stress markers.", learningOutcome: "Demonstrates field experimental design, randomized block trials, and phenotypic data logging." },
      { title: "Soil Microbial Respiration & Carbon Sequestration Study", type: "Soil Science", description: "Compare soil microbial biomass and organic carbon content across zero-tillage versus conventional tillage plots.", learningOutcome: "Proves competency in laboratory soil biochemical assay methods and sustainable farming metrics." }
    ],
    officialResources: [
      { name: "Indian Council of Agricultural Research (ICAR)", type: "Apex Agricultural Body", url: "https://icar.org.in", description: "Autonomous organization guiding, coordinating, and managing research and education in agriculture in India." },
      { name: "Agricultural Scientists Recruitment Board (ASRB)", type: "Recruitment Board", url: "https://www.asrb.org.in", description: "Conducts ARS examination and National Eligibility Test (NET) for recruitment of agricultural scientists." },
      { name: "ICAR - Indian Agricultural Research Institute (IARI Pusa)", type: "Premier National Institute", url: "https://www.iari.res.in", description: "India's premier national institute for agricultural research, education, and extension." }
    ],
    faqs: [
      { question: "Can I become an agricultural scientist with a normal B.Sc. degree?", answer: "ICAR guidelines strictly mandate that for ARS exams and SAU recruitment, candidates must hold a 4-year B.Sc. (Hons) Agriculture from an ICAR-accredited college followed by an accredited Master's degree." },
      { question: "What is the training period for newly recruited ICAR scientists?", answer: "Newly selected ARS scientists undergo mandatory 3 to 6 months of Foundation Course for Agricultural Research (FOCARS) at NAARM (National Academy of Agricultural Research Management) in Hyderabad." }
    ]
  },
  {
    id: "geologist",
    name: "Geologist",
    category: "Education, Science and Research",
    categoryId: "category-i",
    workType: "Technical",
    sector: "Government, PSU & Research",
    educationLevel: "Postgraduate",
    minQualification: "M.Sc. / M.Tech in Geology / Applied Geology / Earth Sciences",
    entranceExams: ["UPSC Combined Geo-Scientist Exam", "GATE (Geology & Geophysics)", "IIT-JAM (Geology)"],
    shortDescription: "Geologists investigate the Earth's crust, rock formations, and mineral reserves, conducting geological field mapping, seismic analyses, and resource prospecting for critical minerals, petroleum, and groundwater in India.",
    mainResponsibilities: [
      "Conduct systematic geological mapping, structural rock interpretation, and stratigraphical classification.",
      "Explore and evaluate mineral deposits (lithium, rare earths, iron ore, coal, gold) and hydrocarbon reservoirs.",
      "Analyze geophysical logs, seismic reflection surveys, and rock core drilling samples.",
      "Conduct environmental impact assessments and geotechnical surveys for dams, tunnels, and highways.",
      "Evaluate groundwater aquifers and advise on sustainable hydrogeological watershed recharge."
    ],
    typicalWorkplace: "Geological Survey of India (GSI), ONGC, Coal India, MECL, Atomic Minerals Directorate (AMD), and private mining conglomerates.",
    opportunitiesType: "Geologist Group A in GSI (UPSC), Executive Geologist in PSUs (ONGC, OIL, NMDC), environmental consulting, and academic research.",
    importantQualities: [
      "Physical stamina and adaptability for prolonged geological field mapping",
      "Three-dimensional spatial thinking and structural rock visualization",
      "Proficiency in mineralogical microscopy and geochemical assays",
      "Respect for environmental regulations and safety protocols"
    ],
    educationPathways: [
      {
        pathway: "Standard Earth Science Route",
        title: "B.Sc. Geology (3-4 yrs) → M.Sc. / M.Tech Applied Geology (2 yrs) → UPSC Geo-Scientist / PSU GATE",
        duration: "3-4 years UG + 2 years PG",
        eligibility: "Class 12 with PCM followed by B.Sc. with Geology as a major subject.",
        description: "Mandatory qualification for appointment as Geologist Grade 'A' in the Geological Survey of India.",
        isMandatory: true
      },
      {
        pathway: "Integrated M.Sc. / M.Tech via IITs",
        title: "Class 12 PCM → JEE Advanced → 5-Year Integrated M.Tech in Applied Geology (IIT Kharagpur / IIT ISM Dhanbad)",
        duration: "5 years integrated",
        eligibility: "Clearing JEE Advanced with top ranks in Earth Science preferences.",
        description: "Premier specialized pathway leading directly to executive placements in ONGC, Schlumberger, and international mining majors.",
        isMandatory: false
      }
    ],
    entranceExamsDetails: [
      {
        name: "UPSC Combined Geo-Scientist Examination",
        conductingBody: "Union Public Service Commission (UPSC)",
        purpose: "Selection of Group 'A' Geologists, Geophysicists, and Chemists in the Geological Survey of India (GSI) and Central Ground Water Board (CGWB).",
        frequency: "Annual (Prelims in Feb, Mains in June)",
        details: "Two-stage national competitive examination followed by personality interview.",
        isMandatory: true
      },
      {
        name: "GATE (Geology and Geophysics - GG)",
        conductingBody: "IITs / IISc",
        purpose: "Direct recruitment to executive geologist posts in Maharatna PSUs (ONGC, IOCL, Coal India) and M.Tech admissions.",
        frequency: "Annual (February)",
        details: "Assesses Earth Processes, Mineralogy, Petrology, Structural Geology, and Economic Geology.",
        isMandatory: false
      },
      {
        name: "IIT-JAM (Geology - GG)",
        conductingBody: "IITs / IISc",
        purpose: "Admission to 2-year M.Sc. in Applied Geology at IITs.",
        frequency: "Annual (February)",
        details: "Tests undergraduate geology concepts, paleontology, and physical geology.",
        isMandatory: false
      }
    ],
    skills: {
      beginner: ["Rock & Mineral Identification", "Topographic Map Reading", "Brunton Compass Handling", "Field Sketching"],
      technical: ["Petrography & Optical Microscopy", "Structural Geology & Cross-section Drawing", "Stratigraphy & Sedimentology", "Geochemical Data Interpretation"],
      advanced: ["Seismic Interpretation & Basin Modeling", "Ore Reserve Estimation (JORC/UNFC Standards)", "GIS & Remote Sensing (ArcGIS, QGIS)", "Hydrogeological Modeling"],
      interpersonal: ["Field Camp Teamwork", "Technical Report Writing", "Liaison with Mining Authorities", "Observation Precision"],
      tools: ["ArcGIS / QGIS", "Petrel (Schlumberger)", "Datamine / Surpac", "RockWorks", "Stereonet Software"],
      certifications: ["UPSC Geo-Scientist Gazetted Commission", "Qualified Person (QP) for Mineral Resource Reporting", "BIMSTEC Geotechnical Safety Training"]
    },
    jobOpportunities: [
      { title: "Geologist (Group A - GSI)", type: "Central Ministry of Mines", description: "Gazetted scientific officer in GSI executing national geological mapping and critical mineral exploration programs." },
      { title: "Exploration Geologist (Petroleum)", type: "Oil & Gas PSU", description: "Interprets 3D seismic data, models sedimentary basins, and decides exploration well locations in ONGC or OIL." },
      { title: "Mine Geologist / Resource Geologist", type: "Mining Industry", description: "Directs grade control, ore boundary demarcation, and reserve auditing in open-cast and underground mines." },
      { title: "Hydrogeologist", type: "Water Resources / CGWB", description: "Maps groundwater aquifer geometry, monitors water tables, and designs rainwater harvesting structures." }
    ],
    progression: [
      { stage: "Stage 1", role: "Geologist (Level 10 - GSI / ONGC Trainee)", experience: "0-3 years", focus: "Field mapping expeditions, core logging, basic petrography, wellsite operations." },
      { stage: "Stage 2", role: "Senior Geologist (Level 11)", experience: "3-8 years", focus: "Independent mineral prospect evaluation, 3D seismic interpretation, project reporting." },
      { stage: "Stage 3", role: "Superintending Geologist (Level 12)", experience: "8-15 years", focus: "Supervising regional exploration divisions, tender evaluations, mine lease clearances." },
      { stage: "Stage 4", role: "Director (Geology) / General Manager (ONGC)", experience: "15-20 years", focus: "State/Regional operations leadership, national mineral reserve policy." },
      { stage: "Stage 5", role: "Deputy Director General (DDG) / Director General (GSI)", experience: "20+ years", focus: "Apex national geological leadership, international bilateral mineral diplomacy." }
    ],
    salary: {
      entry: { range: "₹6.8 Lakhs - ₹13.0 Lakhs per annum", formatted: "₹6.8 - 13.0 LPA" },
      mid: { range: "₹14.0 Lakhs - ₹24.0 Lakhs per annum", formatted: "₹14.0 - 24.0 LPA" },
      experienced: { range: "₹25.0 Lakhs - ₹40.0 Lakhs per annum", formatted: "₹25.0 - 40.0 LPA" },
      currency: "INR",
      source: "7th CPC Central Pay Matrix (GSI Level 10) & ONGC E1 Executive CTC Paysheets",
      lastVerified: "October 2024",
      disclaimer: "GSI geologists receive Level 10 pay plus special field allowances, while ONGC geologists receive executive PSU CTCs exceeding ₹15 LPA at entry level with performance-related pay (PRP)."
    },
    projects: [
      { title: "Geological Field Mapping and Structural Cross-Section", type: "Field Exploration", description: "Conduct a 10-day field mapping of folded sedimentary or metamorphic terrains, record strike/dip, and produce a scaled 1:25,000 geological map.", learningOutcome: "Demonstrates hands-on field navigation, structural projection, and stratigraphic profiling." },
      { title: "GIS-Based Mineral Prospectivity Mapping", type: "Remote Sensing & GIS", description: "Integrate multispectral satellite imagery (ASTER/Sentinel) with regional magnetic data to identify prospective hydrothermal alteration zones.", learningOutcome: "Proves competency in digital geospatial exploration and mineral discovery workflows." }
    ],
    officialResources: [
      { name: "Geological Survey of India (GSI)", type: "Apex Geological Body", url: "https://www.gsi.gov.in", description: "Government body under Ministry of Mines responsible for national geological mapping and mineral discovery." },
      { name: "Union Public Service Commission (UPSC Combined Geo-Scientist)", type: "Examination Portal", url: "https://upsc.gov.in", description: "Official examination portal for gazetted Geologist Grade 'A' recruitment." },
      { name: "Oil and Natural Gas Corporation (ONGC)", type: "Maharatna PSU", url: "https://ongcindia.com", description: "India's largest national oil and gas exploration enterprise recruiting geologists through GATE." }
    ],
    faqs: [
      { question: "Is field work compulsory for a Geologist?", answer: "Yes, geological field expeditions—spending weeks mapping terrains, sampling rocks, and logging drill cores—are an essential and foundational part of early and mid-career geologists." },
      { question: "What is the difference between GSI and ONGC geologists?", answer: "GSI geologists focus broadly on solid minerals (lithium, gold, copper, iron), regional mapping, and natural hazard studies under Ministry of Mines. ONGC geologists focus specifically on petroleum, natural gas, and offshore exploration." }
    ]
  },
  {
    id: "laboratory-research-professional",
    name: "Laboratory Research Professional / Research Associate",
    category: "Education, Science and Research",
    categoryId: "category-i",
    workType: "Technical",
    sector: "Private & Institutional",
    educationLevel: "Postgraduate",
    minQualification: "M.Sc. / M.Tech / M.Pharm in Life Sciences, Biotechnology, or Chemistry",
    entranceExams: ["CSIR-NET", "GATE", "DBT-BET", "ICMR-JRF"],
    shortDescription: "Laboratory Research Professionals execute technical biochemical, genomic, analytical chemistry, and microbiological bench protocols, ensuring strict Good Laboratory Practices (GLP) and reproducible scientific outcomes.",
    mainResponsibilities: [
      "Prepare biological samples, chemical reagents, cell cultures, and standard calibration curves.",
      "Execute wet-lab experimental workflows including PCR, Gel Electrophoresis, Western Blotting, HPLC, and ELISA.",
      "Maintain calibrated lab instrumentation, clean rooms, biosafety cabinets, and autoclaves.",
      "Record precise experimental observation logs, raw data, and statistical analyses in compliance with ISO/GLP norms.",
      "Assist principal investigators in compiling research manuscripts, regulatory filings, and patent specifications."
    ],
    typicalWorkplace: "Biopharmaceutical companies (Biocon, Serum Institute, Dr. Reddy's), diagnostic pathology chains, CSIR/ICMR research laboratories, and contract research organizations (CROs).",
    opportunitiesType: "Research Associate (RA), Senior Research Fellow (SRF), Analytical Chemist, Quality Control (QC) Scientist, and Molecular Biology Lab Technologist.",
    importantQualities: [
      "High bench precision and pipetting accuracy",
      "Strict adherence to biosafety (BSL-2/BSL-3) protocols",
      "Meticulous scientific record keeping and audit readiness",
      "Patience and methodical problem-solving during assay troubleshooting"
    ],
    educationPathways: [
      {
        pathway: "Postgraduate Science Pathway",
        title: "B.Sc. (3 yrs) → M.Sc. in Biotechnology / Biochemistry / Microbiology (2 yrs)",
        duration: "3 years UG + 2 years PG",
        eligibility: "Class 12 Science followed by Bachelor's in Life Sciences or Chemistry with at least 55% marks.",
        description: "The primary academic route leading to Research Associate and Lab Scientist positions in pharma R&D and diagnostic labs.",
        isMandatory: true
      },
      {
        pathway: "Engineering & Pharmacy Route",
        title: "B.Tech Biotechnology / B.Pharm → M.Tech / M.Pharm (2 yrs)",
        duration: "4 years UG + 2 years PG",
        eligibility: "First class in B.Tech Biotech or B.Pharm with valid GATE / GPAT score.",
        description: "Focuses on bioprocess engineering, industrial fermentation, formulation development, and downstream processing.",
        isMandatory: false
      }
    ],
    entranceExamsDetails: [
      {
        name: "DBT-BET (Biotechnology Eligibility Test)",
        conductingBody: "Regional Centre for Biotechnology (RCB) on behalf of DBT",
        purpose: "Award of DBT-JRF fellowships and placement in biotechnology labs and universities across India.",
        frequency: "Annual (April/May)",
        details: "Evaluates General Biotechnology, Molecular Biology, Bioinformatics, and Analytical Techniques.",
        isMandatory: false
      },
      {
        name: "CSIR-UGC NET (Life Sciences / Chemical Sciences)",
        conductingBody: "National Testing Agency (NTA)",
        purpose: "National eligibility for JRF and appointment as Project Associates / Researchers in CSIR labs.",
        frequency: "Twice a year",
        details: "Assesses cellular organization, molecular biology, genetics, and applied biology.",
        isMandatory: true
      },
      {
        name: "ICMR-JRF Examination",
        conductingBody: "Indian Council of Medical Research & PGI Chandigarh",
        purpose: "Fellowship for biomedical research in ICMR institutes and medical colleges.",
        frequency: "Annual (July)",
        details: "Tests general science and biomedical/life science specializations.",
        isMandatory: false
      }
    ],
    skills: {
      beginner: ["Aseptic Pipetting", "Solution Preparation (Molar/Normal)", "Microscopy", "Centrifugation"],
      technical: ["PCR & Real-Time qPCR", "High-Performance Liquid Chromatography (HPLC)", "ELISA & Immunofluorescence Assays", "SDS-PAGE & Western Blotting"],
      advanced: ["Mammalian Cell Culture Maintenance", "Flow Cytometry (FACS)", "Next-Generation Sequencing (NGS) Library Prep", "GLP / cGMP Audit Documentation"],
      interpersonal: ["Lab Coordination", "Detailed Note Taking", "Vendor Communication", "Safety Compliance"],
      tools: ["HPLC / GC-MS Software", "GraphPad Prism", "ImageJ", "Laboratory Information Management Systems (LIMS)", "Bio-Rad CFX Maestro"],
      certifications: ["Good Laboratory Practice (GLP) Certified", "Biosafety Level 2/3 Handler Training", "National Skill Development Corporation (NSDC) Life Sciences Skill Certification"]
    },
    jobOpportunities: [
      { title: "Research Associate (RA)", type: "Pharma / Biotech R&D", description: "Performs specialized molecular or analytical assays, optimizes protocols, and prepares drug discovery batches." },
      { title: "Senior Research Fellow (SRF)", type: "Academic Grant Lab", description: "Senior researcher executing funded scientific milestones for DST/DBT research projects in universities." },
      { title: "Quality Control (QC) Lab Analyst", type: "Pharmaceutical Manufacturing", description: "Tests raw materials and finished drug formulations against pharmacopeia standards (IP, BP, USP) using HPLC." },
      { title: "Genomics Lab Technologist", type: "Diagnostic Chains", description: "Performs DNA/RNA extraction, PCR amplifications, and genetic sequencing runs for clinical diagnostics." }
    ],
    progression: [
      { stage: "Stage 1", role: "Junior Research Associate / Project Associate I", experience: "0-2 years", focus: "Routine assay execution, sample logging, buffer prep, instrument cleaning." },
      { stage: "Stage 2", role: "Senior Research Associate / Project Associate II", experience: "2-5 years", focus: "Protocol optimization, troubleshooting failed runs, GLP documentation." },
      { stage: "Stage 3", role: "Scientist I / Lab Operations Supervisor", experience: "5-9 years", focus: "Managing team workflows, procurement of reagents, regulatory audits." },
      { stage: "Stage 4", role: "Senior Scientist / QC Manager", experience: "9-15 years", focus: "Method validation (ICH guidelines), transfer of tech from lab to pilot plant." },
      { stage: "Stage 5", role: "Director of Laboratory Operations", experience: "15+ years", focus: "Overall lab governance, budget allocations, compliance with global FDA/DCGI regulators." }
    ],
    salary: {
      entry: { range: "₹3.0 Lakhs - ₹5.5 Lakhs per annum", formatted: "₹3.0 - 5.5 LPA" },
      mid: { range: "₹6.0 Lakhs - ₹10.5 Lakhs per annum", formatted: "₹6.0 - 10.5 LPA" },
      experienced: { range: "₹11.0 Lakhs - ₹20.0 Lakhs per annum", formatted: "₹11.0 - 20.0 LPA" },
      currency: "INR",
      source: "DST Fellowship Norms (JRF ~ ₹37k/mo, SRF ~ ₹42k/mo + HRA) & Biopharma Industry Survey Data",
      lastVerified: "October 2024",
      disclaimer: "Government project fellowships are strictly governed by DST/DBT monthly norms; private biopharma companies offer annual CTC structures plus performance bonuses."
    },
    projects: [
      { title: "HPLC Method Validation for Paracetamol Assay", type: "Analytical Chemistry", description: "Develop and validate a reverse-phase HPLC protocol assessing linearity, precision, and limit of detection according to ICH Q2 guidelines.", learningOutcome: "Proves mastery of chromatographic instrumentation and pharmaceutical regulatory documentation." },
      { title: "Total RNA Isolation and RT-qPCR Expression Analysis", type: "Molecular Biology", description: "Isolate total RNA from mammalian cell cultures, quantify purity via NanoDrop, and measure gene expression using SYBR Green qPCR.", learningOutcome: "Demonstrates aseptic nucleic acid handling and quantitative PCR analysis." }
    ],
    officialResources: [
      { name: "Department of Biotechnology (DBT)", type: "Government Department", url: "https://dbtindia.gov.in", description: "Promotes biotechnology development, research funding, and biotechnology fellowships in India." },
      { name: "Indian Council of Medical Research (ICMR)", type: "Apex Biomedical Body", url: "https://main.icmr.nic.in", description: "Apex body in India for the formulation, coordination, and promotion of biomedical research." },
      { name: "National Accreditation Board for Testing and Calibration Laboratories (NABL)", type: "Accreditation Board", url: "https://nabl-india.org", description: "Government body governing quality and technical competence of testing laboratories." }
    ],
    faqs: [
      { question: "What is the difference between a Project Assistant and a JRF?", answer: "A Project Assistant is hired on contract for a specific sponsored project (usually funded by DST/DBT) and may not require NET qualification. A JRF (Junior Research Fellow) has qualified national exams like CSIR-NET or GATE, receives an institutional monthly fellowship, and is eligible to register for a Ph.D." },
      { question: "Are jobs in biopharma laboratories available in India?", answer: "Yes, major biopharma hubs like Hyderabad (Genome Valley), Bengaluru, Pune, and Ahmedabad host hundreds of pharmaceutical, vaccine, and contract research laboratories." }
    ]
  },
  {
    id: "instructional-designer",
    name: "Instructional Designer / Learning Experience Designer",
    category: "Education, Science and Research",
    categoryId: "category-i",
    workType: "Creative",
    sector: "Private & Institutional",
    educationLevel: "Postgraduate",
    minQualification: "Bachelor's / Master's in Education, English, Mass Comm, or Instructional Design",
    entranceExams: ["University PG Entrances", "CUET-PG"],
    shortDescription: "Instructional Designers apply cognitive learning theories, adult learning principles, and multimedia technologies to architect engaging, measurable digital learning courses, simulations, and corporate training programs.",
    mainResponsibilities: [
      "Conduct learning needs analysis (LNA) to identify performance gaps in student or corporate employee cohorts.",
      "Apply instructional design models (ADDIE, SAM, Bloom's Taxonomy, Gagne's Nine Events) to structure curriculums.",
      "Collaborate with Subject Matter Experts (SMEs) to translate complex technical jargon into structured learner modules.",
      "Storyboards e-learning screens, interactive simulations, branching scenarios, and formative knowledge checks.",
      "Build SCORM/xAPI compliant interactive modules using authoring tools and upload them to Learning Management Systems (LMS)."
    ],
    typicalWorkplace: "EdTech companies (Unacademy, upGrad, PhysicsWallah), IT services corporate learning departments (Infosys, TCS, Wipro), multinational enterprise L&D, and publishing houses.",
    opportunitiesType: "Instructional Designer, Learning Experience (LXD) Designer, E-Learning Developer, Corporate L&D Specialist, and Curriculum Architect.",
    importantQualities: [
      "Empathy for diverse learning styles and cognitive load management",
      "Exceptional English written communication and storytelling clarity",
      "Proficiency with modern interactive authoring tools",
      "Systematic thinking regarding assessment and learning objectives"
    ],
    educationPathways: [
      {
        pathway: "Direct Instructional Design Route",
        title: "Bachelor's Degree (Any Stream) → MA in Education / M.Ed. / PG Diploma in Instructional Design (PGDID)",
        duration: "3-4 years UG + 1-2 years PG/Diploma",
        eligibility: "Bachelor's degree with strong command of English and academic writing.",
        description: "Specialized qualifications offered by universities (Symbiosis PGDID, IGNOU) focusing on digital pedagogy and curriculum engineering.",
        isMandatory: false
      },
      {
        pathway: "Industry Transition Pathway",
        title: "B.Tech / BA / B.Ed. → Instructional Design Certification + Portfolio",
        duration: "Bachelor's + 6 months professional portfolio build",
        eligibility: "Strong writing and visual structuring skills coupled with mastering tools like Articulate Storyline.",
        description: "Widely adopted path where school teachers, software trainers, or technical writers transition into high-growth corporate instructional design.",
        isMandatory: true
      }
    ],
    entranceExamsDetails: [
      {
        name: "Symbiosis SCDL Entrance / University PG Tests",
        conductingBody: "Symbiosis Centre for Distance Learning / Central Universities",
        purpose: "Admission to Post Graduate Diploma in Instructional Design (PGDID) and Educational Technology programs.",
        frequency: "Annual",
        details: "Assesses English proficiency, logical reasoning, and basic educational concepts.",
        isMandatory: false
      },
      {
        name: "CUET-PG (Education / Mass Communication)",
        conductingBody: "National Testing Agency (NTA)",
        purpose: "Admission to Master's in Education (M.Ed.) or Media Studies across central universities.",
        frequency: "Annual (March)",
        details: "Tests analytical writing, comprehension, and educational foundations.",
        isMandatory: false
      }
    ],
    skills: {
      beginner: ["Writing Style Guides", "Bloom's Taxonomy", "PowerPoint Storyboarding", "Audience Analysis"],
      technical: ["ADDIE & SAM Frameworks", "Interactive Storyboarding", "Microlearning Architecture", "SCORM & xAPI Standards"],
      advanced: ["Branching Scenario Design", "Gamification in Learning", "LMS Administration (Moodle, Canvas)", "Competency-Based Evaluation"],
      interpersonal: ["Subject Matter Expert (SME) Interviewing", "Stakeholder Management", "Constructive Feedback Integration", "Empathy"],
      tools: ["Articulate Storyline 360", "Adobe Captivate", "Canva", "Vyond (Animated Videos)", "Moodle / Blackboard"],
      certifications: ["ATD (Association for Talent Development) Instructional Design Certificate", "Articulate Storyline Certified Professional", "PG Diploma in Instructional Design (SCDL / IGNOU)"]
    },
    jobOpportunities: [
      { title: "Instructional Designer", type: "Corporate / EdTech", description: "Writes storyboards, designs learning activities, and collaborates with SMEs to produce interactive e-learning." },
      { title: "Learning Experience (LXD) Designer", type: "Digital Product", description: "Focuses on learner journey mapping, UX for digital courses, and continuous engagement optimization." },
      { title: "E-Learning Developer", type: "Technical Production", description: "Specializes in developing multimedia modules in Articulate 360, JavaScript interactions, and LMS integration." },
      { title: "L&D Specialist / Corporate Trainer", type: "Human Resources", description: "Identifies organizational training requirements, schedules onboarding modules, and evaluates ROI on corporate learning." }
    ],
    progression: [
      { stage: "Stage 1", role: "Junior Instructional Designer / Content Writer", experience: "0-2 years", focus: "Drafting script outlines, proofreading storyboards, slide conversions." },
      { stage: "Stage 2", role: "Instructional Designer", experience: "2-5 years", focus: "End-to-end course storyboarding, authoring tool development, SME handling." },
      { stage: "Stage 3", role: "Senior Instructional Designer / Project Lead", experience: "5-9 years", focus: "Complex scenario-based learning, client presentations, mentoring junior designers." },
      { stage: "Stage 4", role: "Instructional Design Manager / Lead LXD", experience: "9-14 years", focus: "Curriculum strategy across enterprise verticals, team resource planning, quality governance." },
      { stage: "Stage 5", role: "Director of Learning Design / Head of L&D", experience: "14+ years", focus: "Executive enterprise learning strategy, global workforce upskilling architecture." }
    ],
    salary: {
      entry: { range: "₹3.8 Lakhs - ₹6.5 Lakhs per annum", formatted: "₹3.8 - 6.5 LPA" },
      mid: { range: "₹7.0 Lakhs - ₹13.0 Lakhs per annum", formatted: "₹7.0 - 13.0 LPA" },
      experienced: { range: "₹14.0 Lakhs - ₹26.0 Lakhs per annum", formatted: "₹14.0 - 26.0 LPA" },
      currency: "INR",
      source: "AmbitionBox & Glassdoor Indian Instructional Designer Industry Compensation Reports",
      lastVerified: "October 2024",
      disclaimer: "IT consulting and multinational enterprise L&D teams pay higher compensation compared to early-stage educational content service providers."
    },
    projects: [
      { title: "Interactive E-Learning Module in Articulate Storyline", type: "E-Learning Development", description: "Build a 10-minute SCORM-compliant interactive course on Information Security with clickable hotspot interactions and a graded final quiz.", learningOutcome: "Demonstrates practical competence with industry-standard authoring tools and learner interactions." },
      { title: "Bloom's Taxonomy Aligned Storyboard Document", type: "Pedagogy Design", description: "Develop a 30-screen structured storyboard for a medical or financial topic, detailing visual descriptions, voiceover scripts, and cognitive knowledge checks.", learningOutcome: "Proves instructional structuring rigor and ability to guide visual design teams." }
    ],
    officialResources: [
      { name: "SWAYAM (Ministry of Education)", type: "National MOOC Platform", url: "https://swayam.gov.in", description: "National platform for digital course development and higher education modular courses." },
      { name: "Association for Talent Development (ATD)", type: "Global Professional Body", url: "https://www.td.org", description: "World's leading association for talent development and instructional design standards." },
      { name: "DIKSHA National Education Portal", type: "Digital Infrastructure", url: "https://diksha.gov.in", description: "Showcases Indian curriculum standards, modular digital content, and instructional assets." }
    ],
    faqs: [
      { question: "Can a teacher transition into Instructional Design?", answer: "Yes, school and college teachers possess deep pedagogical understanding and empathy for learners, making them prime candidates for transitioning into instructional design after learning tools like Articulate Storyline and Canva." },
      { question: "Is coding required for Instructional Design?", answer: "No, extensive coding is not required. Most instructional designers use intuitive visual authoring tools like Articulate 360 or Adobe Captivate, though basic knowledge of HTML/CSS/JavaScript can help with custom interactions." }
    ]
  }
];
