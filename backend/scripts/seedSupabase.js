/**
 * ====================================================================
 * TechBridge Supabase Auth & Database Seed Script
 * ====================================================================
 * Securely seeds sample authentication users via Supabase Auth Admin API
 * and creates corresponding profiles, roadmaps, discussions, and opportunities.
 *
 * Safety & Reliability Rules:
 * 1. Does NOT pass manually assigned IDs to Supabase Auth createUser().
 *    Supabase generates Auth user IDs, and the script captures createdData.user.id.
 * 2. If Auth creation fails, it safely skips dependent records (no fake fallback IDs).
 * 3. Handles existing Auth users by email and consistently uses their actual Auth IDs.
 * 4. Strictly requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SEED_USER_PASSWORD.
 *    No hardcoded password fallbacks.
 * 5. Never logs passwords, tokens, or secret keys in the terminal.
 * 6. Checks for existing profiles and handles triggers safely via upsert.
 * 7. Checks and logs errors for every database operation individually.
 * 8. All foreign keys in discussions, answers, and project teams reference the
 *    actual confirmed Auth IDs.
 * 9. All sample opportunities use updated future dates and are clearly labelled
 *    as demonstration data.
 * 10. Completely idempotent: safe to execute multiple times without duplicates.
 * ====================================================================
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// --------------------------------------------------------------------
// 1. Environment Variable Validation (No hardcoded credentials)
// --------------------------------------------------------------------
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const seedPassword = process.env.SEED_USER_PASSWORD;

const missingEnvVars = [];
if (!supabaseUrl || !supabaseUrl.startsWith('http')) missingEnvVars.push('SUPABASE_URL');
if (!serviceRoleKey) missingEnvVars.push('SUPABASE_SERVICE_ROLE_KEY');
if (!seedPassword) missingEnvVars.push('SEED_USER_PASSWORD');

if (missingEnvVars.length > 0) {
  console.error('\n❌ Execution Blocked: Missing required environment variable(s) in backend/.env:');
  missingEnvVars.forEach((v) => console.error(`   - ${v}`));
  console.error('\nPlease configure these variables in backend/.env before running this script.');
  console.error('Note: Never place SUPABASE_SERVICE_ROLE_KEY in frontend code or repository commits.\n');
  process.exit(1);
}

// Initialize Supabase Admin client with service_role secret key
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// --------------------------------------------------------------------
// 2. Fixed Hexadecimal Identifiers for Colleges, Roadmaps & Content
// --------------------------------------------------------------------
const FIXED_IDS = {
  colleges: {
    nitw: 'c1111111-1111-1111-1111-111111111111',
    iiith: 'c2222222-2222-2222-2222-222222222222',
    vit: 'c3333333-3333-3333-3333-333333333333',
    bits: 'c4444444-4444-4444-4444-444444444444'
  },
  roadmaps: {
    year1: 'b1111111-1111-1111-1111-111111111111',
    year2: 'b2222222-2222-2222-2222-222222222222',
    year3: 'b3333333-3333-3333-3333-333333333333',
    year4: 'b4444444-4444-4444-4444-444444444444',
    fullstack: 'b5555555-5555-5555-5555-555555555555',
    aiml: 'b6666666-6666-6666-6666-666666666666'
  },
  discussions: {
    d1: 'd1111111-1111-1111-1111-111111111111',
    d2: 'd2222222-2222-2222-2222-222222222222',
    d3: 'd3333333-3333-3333-3333-333333333333'
  },
  answers: {
    ans1: 'aa111111-1111-1111-1111-111111111111',
    ans2: 'aa222222-2222-2222-2222-222222222222',
    ans3: 'aa333333-3333-3333-3333-333333333333'
  },
  techUpdates: {
    t1: '11111111-1111-1111-1111-111111111111',
    t2: '11111111-2222-2222-2222-222222222222',
    t3: '11111111-3333-3333-3333-333333333333',
    t4: '11111111-4444-4444-4444-444444444444'
  },
  resources: {
    r1: '22222222-1111-1111-1111-111111111111',
    r2: '22222222-2222-2222-2222-222222222222',
    r3: '22222222-3333-3333-3333-333333333333',
    r4: '22222222-4444-4444-4444-444444444444'
  },
  opportunities: {
    o1: '33333333-1111-1111-1111-111111111111',
    o2: '33333333-2222-2222-2222-222222222222',
    o3: '33333333-3333-3333-3333-333333333333'
  },
  projects: {
    p1: '44444444-1111-1111-1111-111111111111',
    team1: '55555555-1111-1111-1111-111111111111'
  }
};

// --------------------------------------------------------------------
// 3. Sample Users Data Definitions (Without manual Auth IDs)
// --------------------------------------------------------------------
const SAMPLE_USERS = [
  {
    email: 'admin@techbridge.edu',
    full_name: 'Dr. Ramesh Kumar (Admin)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: 'Chief Platform Administrator ensuring student safety, verification and quality mentorship.',
    role: 'admin',
    college_id: FIXED_IDS.colleges.nitw,
    college_name: 'National Institute of Technology (NIT)',
    academic_year: 4,
    branch: 'Computer Science and Engineering',
    student_id_number: 'ADM-2024-001',
    college_email: 'admin@nitw.ac.in',
    skills: ['System Architecture', 'Database Management', 'Platform Safety'],
    interests: ['Community Building', 'Mentorship Quality'],
    is_verified: true,
    verification_status: 'approved',
    is_open_to_mentor: false
  },
  {
    email: 'aravind.placed@google.com',
    full_name: 'Aravind Sharma',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    bio: 'SDE-1 at Google. Ex-Intern at Microsoft. Passionate about DSA, distributed systems and helping juniors crack tier-1 tech interviews.',
    role: 'placed_graduate',
    college_id: FIXED_IDS.colleges.iiith,
    college_name: 'Indian Institute of Information Technology (IIIT)',
    academic_year: 4,
    branch: 'Computer Science and Engineering',
    student_id_number: '2020-CSE-045',
    college_email: 'aravind.s@iiit.ac.in',
    placed_company: 'Google',
    job_designation: 'Software Development Engineer I',
    package_lpa: 42.50,
    linkedin_url: 'https://linkedin.com/in/aravind-tech',
    github_url: 'https://github.com/aravind-dev',
    skills: ['C++', 'Data Structures & Algorithms', 'System Design', 'Go', 'Distributed Systems'],
    interests: ['FAANG Interview Prep', 'Resume Reviews', 'Competitive Programming'],
    is_verified: true,
    verification_status: 'approved',
    is_open_to_mentor: true,
    mentor_topics: ['Google Interview Strategy', 'Mastering LeetCode', 'System Design Basics', 'Off-campus Opportunities']
  },
  {
    email: 'sneha.reddy@microsoft.com',
    full_name: 'Sneha Reddy',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Software Engineer at Microsoft Cloud & AI. Final year mentor with 50+ junior 1-on-1 sessions.',
    role: 'placed_graduate',
    college_id: FIXED_IDS.colleges.nitw,
    college_name: 'National Institute of Technology (NIT)',
    academic_year: 4,
    branch: 'Computer Science and Engineering',
    student_id_number: '2020-CSE-112',
    college_email: 'sneha.r@nitw.ac.in',
    placed_company: 'Microsoft',
    job_designation: 'Software Engineer',
    package_lpa: 38.00,
    linkedin_url: 'https://linkedin.com/in/sneha-reddy',
    github_url: 'https://github.com/sneha-codes',
    skills: ['Java', 'Spring Boot', 'Azure', 'Microservices', 'PostgreSQL', 'Docker'],
    interests: ['Backend Engineering', 'Women in Tech Mentorship', 'Cloud Architecture'],
    is_verified: true,
    verification_status: 'approved',
    is_open_to_mentor: true,
    mentor_topics: ['Backend Engineering Career Path', 'Azure Cloud Fundamentals', 'Mock Interviews', 'College to Corporate Transition']
  },
  {
    email: 'rohit.finalyear@nitw.ac.in',
    full_name: 'Rohit Verma',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Final Year CSE student. Upcoming SDE at Amazon. Open source contributor and Hackathon winner.',
    role: 'final_year',
    college_id: FIXED_IDS.colleges.nitw,
    college_name: 'National Institute of Technology (NIT)',
    academic_year: 4,
    branch: 'Computer Science and Engineering',
    student_id_number: '2021-CSE-088',
    college_email: 'rohit.v@nitw.ac.in',
    placed_company: 'Amazon',
    job_designation: 'SDE Intern / PPO',
    package_lpa: 28.50,
    linkedin_url: 'https://linkedin.com/in/rohit-verma',
    github_url: 'https://github.com/rohit-v',
    skills: ['React.js', 'Node.js', 'Python', 'AWS', 'DSA in Python'],
    interests: ['Full Stack Web Development', 'Hackathons', 'Open Source'],
    is_verified: true,
    verification_status: 'approved',
    is_open_to_mentor: true,
    mentor_topics: ['Full Stack Roadmaps', 'Hackathon Winning Strategies', 'Amazon Online Assessments']
  },
  {
    email: 'priya.thirdyear@vit.ac.in',
    full_name: 'Priya Patel',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    bio: '3rd Year CSE student exploring AI/ML, PyTorch and deep learning computer vision projects.',
    role: 'third_year',
    college_id: FIXED_IDS.colleges.vit,
    college_name: 'Vellore Institute of Technology',
    academic_year: 3,
    branch: 'Computer Science and Engineering',
    student_id_number: '2022-VIT-231',
    college_email: 'priya.p@vit.ac.in',
    skills: ['Python', 'Machine Learning', 'PyTorch', 'Data Analysis', 'SQL'],
    interests: ['Research Papers', 'AI Projects', 'Internship Hunt for 3rd Year'],
    is_verified: true,
    verification_status: 'approved',
    is_open_to_mentor: true,
    mentor_topics: ['Machine Learning Roadmap for Beginners', 'Project Selection']
  },
  {
    email: 'karthik.secondyear@bits.ac.in',
    full_name: 'Karthik Nair',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bio: '2nd Year CSE student focusing on core CS fundamentals: OS, DBMS, Computer Networks and DSA in Java.',
    role: 'second_year',
    college_id: FIXED_IDS.colleges.bits,
    college_name: 'Birla Institute of Technology and Science',
    academic_year: 2,
    branch: 'Computer Science and Engineering',
    student_id_number: '2023-BITS-104',
    college_email: 'karthik.n@bits.ac.in',
    skills: ['Java', 'Data Structures', 'C', 'MySQL', 'Git'],
    interests: ['Competitive Programming', 'Core CS Subjects', 'Web Dev Basics'],
    is_verified: true,
    verification_status: 'approved',
    is_open_to_mentor: false
  },
  {
    email: 'rahul.firstyear@nitw.ac.in',
    full_name: 'Rahul Gupta',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    bio: '1st Year CSE student enthusiastic about learning programming, curious about web development and AI.',
    role: 'first_year',
    college_id: FIXED_IDS.colleges.nitw,
    college_name: 'National Institute of Technology (NIT)',
    academic_year: 1,
    branch: 'Computer Science and Engineering',
    student_id_number: '2024-CSE-310',
    college_email: 'rahul.g@nitw.ac.in',
    skills: ['C Language', 'HTML5', 'Basic Python'],
    interests: ['Where to Start Programming', 'Finding Right Mentor', 'Choosing Languages'],
    is_verified: true,
    verification_status: 'approved',
    is_open_to_mentor: false
  }
];

// Sample Colleges
const SAMPLE_COLLEGES = [
  { id: FIXED_IDS.colleges.nitw, name: 'National Institute of Technology (NIT)', code: 'NIT-01', city: 'Warangal', state: 'Telangana' },
  { id: FIXED_IDS.colleges.iiith, name: 'Indian Institute of Information Technology (IIIT)', code: 'IIIT-H', city: 'Hyderabad', state: 'Telangana' },
  { id: FIXED_IDS.colleges.vit, name: 'Vellore Institute of Technology', code: 'VIT-V', city: 'Vellore', state: 'Tamil Nadu' },
  { id: FIXED_IDS.colleges.bits, name: 'Birla Institute of Technology and Science', code: 'BITS-P', city: 'Pilani', state: 'Rajasthan' }
];

// --------------------------------------------------------------------
// 4. Main Seed Execution Function
// --------------------------------------------------------------------
async function runSeed() {
  console.log('\n================================================================');
  console.log('🌱 Starting TechBridge Supabase Database & Auth Seed Process');
  console.log('================================================================\n');

  let hasErrors = false;

  // ------------------------------------------------------------------
  // PHASE 1: Colleges
  // ------------------------------------------------------------------
  console.log('📍 Phase 1: Seeding Colleges...');
  const { error: colError } = await supabaseAdmin
    .from('colleges')
    .upsert(SAMPLE_COLLEGES, { onConflict: 'name' });

  if (colError) {
    console.error(`❌ Failed to seed colleges: ${colError.message}`);
    hasErrors = true;
  } else {
    console.log(`✅ Seeded ${SAMPLE_COLLEGES.length} colleges successfully.`);
  }

  // ------------------------------------------------------------------
  // PHASE 2: Auth Users (via Supabase Auth Admin API)
  // ------------------------------------------------------------------
  console.log('\n🔐 Phase 2: Resolving & Creating Supabase Auth Users...');

  // Retrieve existing users to handle idempotency safely
  let existingAuthUsers = [];
  try {
    let page = 1;
    const perPage = 50;
    while (true) {
      const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (listError) throw listError;
      const users = listData?.users || [];
      existingAuthUsers.push(...users);
      if (users.length < perPage) break;
      page++;
    }
  } catch (err) {
    console.error(`❌ Failed to query existing Supabase Auth users: ${err.message}`);
    process.exit(1);
  }

  const userMap = {}; // email.toLowerCase() -> actual Auth User ID
  const failedUserEmails = new Set();

  for (const sample of SAMPLE_USERS) {
    const emailKey = sample.email.toLowerCase();
    const existing = existingAuthUsers.find(
      (u) => u.email && u.email.toLowerCase() === emailKey
    );

    if (existing) {
      console.log(`ℹ️ Auth user already exists: ${sample.email} (Auth ID: ${existing.id})`);
      userMap[emailKey] = existing.id;
    } else {
      // Do NOT pass manual ID; let Supabase generate it and capture createdData.user.id
      const { data: createdData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: sample.email,
        password: seedPassword,
        email_confirm: true,
        user_metadata: {
          full_name: sample.full_name,
          role: sample.role
        }
      });

      if (createError) {
        console.error(`❌ Failed to create auth user for ${sample.email}: ${createError.message}`);
        failedUserEmails.add(emailKey);
        hasErrors = true;
        // Do NOT set a fallback UUID
        continue;
      }

      if (!createdData?.user?.id) {
        console.error(`❌ Supabase did not return a valid user ID for ${sample.email}`);
        failedUserEmails.add(emailKey);
        hasErrors = true;
        continue;
      }

      const actualAuthId = createdData.user.id;
      console.log(`✅ Created auth user: ${sample.email} (Auth ID: ${actualAuthId})`);
      userMap[emailKey] = actualAuthId;
    }
  }

  // ------------------------------------------------------------------
  // PHASE 3: Profiles (Safe Handling of Triggers & Existing Profiles)
  // ------------------------------------------------------------------
  console.log('\n👤 Phase 3: Seeding Profile Records...');

  for (const sample of SAMPLE_USERS) {
    const emailKey = sample.email.toLowerCase();
    const confirmedAuthId = userMap[emailKey];

    // If auth user was not created or resolved, safely skip profile creation
    if (!confirmedAuthId) {
      console.warn(`⚠️ Skipping profile for ${sample.email} because its Auth user record is missing.`);
      continue;
    }

    // Check if an Auth trigger (e.g. handle_new_user) already created a profile stub
    const { data: existingProfile, error: fetchProfError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, is_verified, role')
      .eq('id', confirmedAuthId)
      .maybeSingle();

    if (fetchProfError) {
      console.error(`❌ Error checking existing profile for ${sample.email}: ${fetchProfError.message}`);
      hasErrors = true;
      continue;
    }

    if (existingProfile) {
      console.log(`ℹ️ Existing profile record detected for: ${sample.full_name} (${sample.email})`);
    }

    const profilePayload = {
      id: confirmedAuthId, // Foreign key -> auth.users.id
      email: sample.email,
      full_name: sample.full_name,
      avatar_url: sample.avatar_url,
      bio: sample.bio,
      role: sample.role,
      college_id: sample.college_id,
      college_name: sample.college_name,
      academic_year: sample.academic_year,
      branch: sample.branch,
      student_id_number: sample.student_id_number,
      college_email: sample.college_email,
      placed_company: sample.placed_company || null,
      job_designation: sample.job_designation || null,
      package_lpa: sample.package_lpa || null,
      linkedin_url: sample.linkedin_url || null,
      github_url: sample.github_url || null,
      skills: sample.skills,
      interests: sample.interests,
      is_verified: sample.is_verified,
      verification_status: sample.verification_status,
      is_open_to_mentor: sample.is_open_to_mentor,
      mentor_topics: sample.mentor_topics || []
    };

    // Upsert safely updates stub profiles or creates missing profile rows
    const { error: profError } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' });

    if (profError) {
      console.error(`❌ Failed to upsert profile for ${sample.email}: ${profError.message}`);
      hasErrors = true;
    } else {
      console.log(`✅ Profile synchronized for: ${sample.full_name} (${sample.role})`);
    }
  }

  // ------------------------------------------------------------------
  // PHASE 4: Learning Roadmaps & Milestones
  // ------------------------------------------------------------------
  console.log('\n🗺️ Phase 4: Seeding Learning Roadmaps & Milestones...');

  const SAMPLE_ROADMAPS = [
    {
      id: FIXED_IDS.roadmaps.year1,
      title: 'First-Year CSE Starter Blueprint',
      slug: 'first-year-cse-starter',
      description: 'Comprehensive foundation for newcomers: mastering C/C++ programming fundamentals, Linux command line, Git & GitHub, and problem-solving thinking.',
      category: 'year_wise',
      target_year: 1,
      estimated_months: 6,
      prerequisites: ['Basic Computer Literacy', 'High School Math'],
      icon_name: 'Terminal',
      is_featured: true
    },
    {
      id: FIXED_IDS.roadmaps.year2,
      title: 'Second-Year Core CS & DSA Mastery',
      slug: 'second-year-dsa-core-cs',
      description: 'Structured roadmap covering Object-Oriented Programming (Java/C++), Standard Data Structures, Algorithmic Analysis, and Operating Systems.',
      category: 'year_wise',
      target_year: 2,
      estimated_months: 8,
      prerequisites: ['Basic C/C++ or Java Programming', 'Loops & Functions'],
      icon_name: 'Code2',
      is_featured: true
    },
    {
      id: FIXED_IDS.roadmaps.year3,
      title: 'Third-Year Internship & Full-Stack / AI Specialization',
      slug: 'third-year-internship-specialization',
      description: 'Deep dive into real-world production stacks (MERN/Java Backend or PyTorch AI), resume-grade projects, and preparation for summer internship OA tests.',
      category: 'year_wise',
      target_year: 3,
      estimated_months: 6,
      prerequisites: ['Data Structures & Algorithms', 'Object Oriented Programming', 'Database Basics'],
      icon_name: 'Layers',
      is_featured: true
    },
    {
      id: FIXED_IDS.roadmaps.year4,
      title: 'Final-Year Campus Placement & Off-Campus Accelerator',
      slug: 'final-year-placement-accelerator',
      description: 'Intensive placement sprint: Low-Level Design (LLD), System Design (HLD), CS Fundamentals (DBMS, OS, CN), Behavioral HR questions, and mock interviews.',
      category: 'year_wise',
      target_year: 4,
      estimated_months: 4,
      prerequisites: ['Proficiency in 1 Programming Language', 'DSA LeetCode Mediums', 'At least 2 Capstone Projects'],
      icon_name: 'Award',
      is_featured: true
    },
    {
      id: FIXED_IDS.roadmaps.fullstack,
      title: 'Modern Full-Stack Web Development',
      slug: 'full-stack-web-dev',
      description: 'From semantic HTML/CSS and JavaScript ES6+ to React, Node.js, Express, PostgreSQL, REST APIs, authentication and cloud deployment.',
      category: 'career',
      target_year: null,
      estimated_months: 6,
      prerequisites: ['Basic Programming Knowledge'],
      icon_name: 'Globe',
      is_featured: true
    },
    {
      id: FIXED_IDS.roadmaps.aiml,
      title: 'Artificial Intelligence & Machine Learning Track',
      slug: 'ai-machine-learning-track',
      description: 'Mathematics for ML (Linear Algebra, Calculus, Statistics), Python data stack (NumPy, Pandas), Scikit-Learn, Deep Learning with PyTorch, and GenAI basics.',
      category: 'skill_based',
      target_year: null,
      estimated_months: 7,
      prerequisites: ['Python Programming', 'High School Calculus and Statistics'],
      icon_name: 'Cpu',
      is_featured: true
    }
  ];

  const { error: rdError } = await supabaseAdmin
    .from('roadmaps')
    .upsert(SAMPLE_ROADMAPS, { onConflict: 'slug' });

  if (rdError) {
    console.error(`❌ Failed to seed roadmaps: ${rdError.message}`);
    hasErrors = true;
  } else {
    console.log(`✅ Seeded ${SAMPLE_ROADMAPS.length} roadmaps successfully.`);
  }

  // To prevent duplicate milestones on repeated runs, safely clear milestones for seed roadmaps
  for (const roadmapId of Object.values(FIXED_IDS.roadmaps)) {
    const { error: delError } = await supabaseAdmin
      .from('roadmap_milestones')
      .delete()
      .eq('roadmap_id', roadmapId);

    if (delError) {
      console.error(`⚠️ Error clearing previous milestones for roadmap ${roadmapId}: ${delError.message}`);
    }
  }

  const SAMPLE_MILESTONES = [
    {
      roadmap_id: FIXED_IDS.roadmaps.year1,
      milestone_order: 1,
      title: 'Programming Fundamentals in C/C++',
      description: 'Build strong algorithmic logic and understand memory models, pointers, and compilation.',
      objectives: ['Understand variables, control flow, loops', 'Grasp arrays, strings, and functions', 'Master pointers and manual memory allocation'],
      recommended_topics: ['Input/Output and Operators', 'Conditionals and Loops', 'Functions and Scope', 'Pointers and Addresses', 'Structures and Dynamic Memory'],
      suggested_resources: [
        { title: 'CS50 Introduction to Computer Science', url: 'https://cs50.harvard.edu' },
        { title: 'Learn C the Hard Way', url: 'https://learncodethehardway.org' }
      ],
      suggested_projects: [
        { title: 'Student Grade Management System in C', description: 'CLI tool using structs and file I/O to store, update and compute student averages.' }
      ]
    },
    {
      roadmap_id: FIXED_IDS.roadmaps.year1,
      milestone_order: 2,
      title: 'Developer Tooling: Git, GitHub and Linux Basics',
      description: 'Learn how modern software engineers collaborate, track versions, and navigate Unix terminals.',
      objectives: ['Learn common Bash commands', 'Understand Git commit, branch, merge, and PRs', 'Create clean GitHub README portfolios'],
      recommended_topics: ['Linux Terminal Navigation', 'Package Managers', 'Git Version Control', 'SSH Keys and Remote Repositories'],
      suggested_resources: [
        { title: 'Missing Semester of Your CS Education (MIT)', url: 'https://missing.csail.mit.edu' }
      ],
      suggested_projects: [
        { title: 'First Open Source Contribution / Personal Portfolio Repo', description: 'Host a markdown portfolio on GitHub with Git version history.' }
      ]
    },
    {
      roadmap_id: FIXED_IDS.roadmaps.year2,
      milestone_order: 1,
      title: 'Linear Data Structures & Time Complexity',
      description: 'Master Big-O notation, memory layout of arrays, linked lists, stacks, and queues.',
      objectives: ['Calculate Time and Space Complexity', 'Implement Singly and Doubly Linked Lists', 'Solve Stack and Queue problems'],
      recommended_topics: ['Big-O, Big-Theta, Big-Omega', 'Dynamic Arrays', 'Singly/Doubly Linked Lists', 'Stack implementation using Arrays/Nodes', 'Monotonic Stack pattern'],
      suggested_resources: [
        { title: 'NeetCode DSA Roadmap', url: 'https://neetcode.io/roadmap' },
        { title: 'Striver A2Z DSA Sheet', url: 'https://takeuforward.org' }
      ],
      suggested_projects: [
        { title: 'Infix to Postfix Converter & Expression Evaluator', description: 'Build an arithmetic formula evaluator utilizing stacks.' }
      ]
    },
    {
      roadmap_id: FIXED_IDS.roadmaps.year2,
      milestone_order: 2,
      title: 'Trees, Graphs, and Recursion',
      description: 'Conquer hierarchical data structures, binary search trees, graph traversals (BFS/DFS), and recursion.',
      objectives: ['Understand tree traversals (Inorder, Preorder, Postorder)', 'Grasp Binary Search Trees and balancing', 'Master Graph representations (Adjacency Matrix/List) and BFS/DFS'],
      recommended_topics: ['Binary Trees and BST', 'Recursion and Backtracking', 'Graph BFS & DFS', 'Shortest Path (Dijkstra)'],
      suggested_resources: [
        { title: 'VisuAlgo Visual Data Structures', url: 'https://visualgo.net' }
      ],
      suggested_projects: [
        { title: 'Maze Pathfinding Visualizer', description: 'Visualize BFS and DFS searching paths through a custom grid.' }
      ]
    }
  ];

  const { error: msError } = await supabaseAdmin
    .from('roadmap_milestones')
    .insert(SAMPLE_MILESTONES);

  if (msError) {
    console.error(`❌ Failed to seed roadmap milestones: ${msError.message}`);
    hasErrors = true;
  } else {
    console.log(`✅ Seeded ${SAMPLE_MILESTONES.length} roadmap milestones successfully.`);
  }

  // ------------------------------------------------------------------
  // PHASE 5: Discussions & Answers (Referencing Actual Confirmed Auth IDs)
  // ------------------------------------------------------------------
  console.log('\n💬 Phase 5: Seeding Discussions & Senior Answers...');

  const rahulId = userMap['rahul.firstyear@nitw.ac.in'];
  const karthikId = userMap['karthik.secondyear@bits.ac.in'];
  const priyaId = userMap['priya.thirdyear@vit.ac.in'];
  const aravindId = userMap['aravind.placed@google.com'];
  const snehaId = userMap['sneha.reddy@microsoft.com'];
  const rohitId = userMap['rohit.finalyear@nitw.ac.in'];

  const discussionsToInsert = [];
  if (rahulId) {
    discussionsToInsert.push({
      id: FIXED_IDS.discussions.d1,
      author_id: rahulId,
      title: 'Should I learn C++ or Java for Data Structures & Algorithms and placements?',
      content: 'I just completed my 1st semester with basic C. I see seniors recommending C++ for competitive programming speed, but some placed seniors swear by Java for enterprise placements and Spring Boot. Which one provides better long-term return on investment?',
      category: 'DSA',
      tags: ['DSA', 'C++', 'Java', 'Beginners', 'Placements'],
      views_count: 342,
      likes_count: 28,
      answers_count: 2,
      is_resolved: true,
      has_verified_senior_answer: Boolean(aravindId || snehaId)
    });
  }

  if (karthikId) {
    discussionsToInsert.push({
      id: FIXED_IDS.discussions.d2,
      author_id: karthikId,
      title: 'How many LeetCode questions are actually enough before applying for 3rd-year summer internships?',
      content: 'There is a lot of anxiety around numbers (some say 500+, some say 150). Could seniors who cracked top internships at Google, Microsoft, Amazon share what pattern recognition strategy worked for you rather than blindly grinding?',
      category: 'Placements',
      tags: ['LeetCode', 'Internships', 'Strategy', 'Preparation'],
      views_count: 510,
      likes_count: 45,
      answers_count: 1,
      is_resolved: true,
      has_verified_senior_answer: Boolean(rohitId)
    });
  }

  if (priyaId) {
    discussionsToInsert.push({
      id: FIXED_IDS.discussions.d3,
      author_id: priyaId,
      title: 'What makes a Web Development or AI project stand out on a resume for tier-1 companies?',
      content: 'Almost everyone has a todo app or a weather app or a basic Titanic ML model. What differentiates a mediocre project from an impressive resume capstone?',
      category: 'Projects',
      tags: ['Resume', 'WebDev', 'MachineLearning', 'Projects'],
      views_count: 289,
      likes_count: 31,
      answers_count: 0,
      is_resolved: false,
      has_verified_senior_answer: false
    });
  }

  if (discussionsToInsert.length > 0) {
    const { error: discError } = await supabaseAdmin
      .from('discussions')
      .upsert(discussionsToInsert, { onConflict: 'id' });

    if (discError) {
      console.error(`❌ Failed to seed discussions: ${discError.message}`);
      hasErrors = true;
    } else {
      console.log(`✅ Seeded ${discussionsToInsert.length} discussions.`);
    }
  }

  const answersToInsert = [];
  if (aravindId && rahulId) {
    answersToInsert.push({
      id: FIXED_IDS.answers.ans1,
      discussion_id: FIXED_IDS.discussions.d1,
      author_id: aravindId,
      content: `Here is the factual breakdown from having interviewed and practiced across both:

1. STL in C++ (Standard Template Library) is extremely concise. In competitive programming contests (Codeforces, CodeChef), C++ is king because of typing speed and minimal boilerplate.
2. Java has strict OOP, excellent garbage collection, and is the industry standard for backend microservices in Amazon, banks, and enterprise SaaS.
3. In campus and off-campus technical interviews (Google, Microsoft, Amazon, Uber), interviewers DO NOT care whether you pick C++ or Java. They only evaluate your problem-solving, time/space complexity analysis, and clean edge-case handling.

Recommendation: Pick C++ if you love raw algorithms and fast STL syntax. Pick Java if you intend to build backend web services alongside your DSA. Never juggle both simultaneously in your first year — master one first.`,
      is_helpful: true,
      is_accepted: true,
      likes_count: 39
    });
  }

  if (snehaId && rahulId) {
    answersToInsert.push({
      id: FIXED_IDS.answers.ans2,
      discussion_id: FIXED_IDS.discussions.d1,
      author_id: snehaId,
      content: `Agree with Aravind! At Microsoft, many candidates used Java, C++, or even Python. What gave Java candidates a slight edge in my personal opinion during managerial rounds was that they could seamlessly write Object-Oriented Design (Low Level Design) classes and interfaces during round 2. Pick one and stick with it for at least 6 months!`,
      is_helpful: true,
      is_accepted: false,
      likes_count: 24
    });
  }

  if (rohitId && karthikId) {
    answersToInsert.push({
      id: FIXED_IDS.answers.ans3,
      discussion_id: FIXED_IDS.discussions.d2,
      author_id: rohitId,
      content: `Focus on the 75 Blind / NeetCode 150 patterns instead of grinding 600 random questions. 
Specifically:
- Two Pointers & Sliding Window (20 problems)
- Trees & Binary Search (25 problems)
- Dynamic Programming patterns (0/1 Knapsack, Longest Common Subsequence) (25 problems)
- Graph BFS/DFS & Disjoint Set Union (20 problems)
If you solve 150 to 200 questions where you can explain the intuition out loud without looking at solutions, you are in the top 10% of applicants.`,
      is_helpful: true,
      is_accepted: true,
      likes_count: 41
    });
  }

  if (answersToInsert.length > 0) {
    const { error: ansError } = await supabaseAdmin
      .from('answers')
      .upsert(answersToInsert, { onConflict: 'id' });

    if (ansError) {
      console.error(`❌ Failed to seed answers: ${ansError.message}`);
      hasErrors = true;
    } else {
      console.log(`✅ Seeded ${answersToInsert.length} answers.`);
    }
  }

  // ------------------------------------------------------------------
  // PHASE 6: Tech Updates, Resources, Opportunities & Projects
  // ------------------------------------------------------------------
  console.log('\n📰 Phase 6: Seeding Tech Updates, Resources, Opportunities & Projects...');

  // Technology Updates
  const SAMPLE_TECH_UPDATES = [
    {
      id: FIXED_IDS.techUpdates.t1,
      title: 'Node.js 22 Promoted to Long Term Support (LTS)',
      description: 'Node.js 22 includes built-in WebSocket client, V8 12.4 engine updates, enhanced ESM support with --experimental-require-module, and improved crypto performance.',
      category: 'Languages & Frameworks',
      source_url: 'https://nodejs.org/en/blog/release/v22.0.0',
      source_name: 'Node.js Foundation',
      is_verified: true
    },
    {
      id: FIXED_IDS.techUpdates.t2,
      title: 'PostgreSQL 17 Released with Enhanced Query Performance and JSON Features',
      description: 'PostgreSQL 17 features memory management enhancements for vacuuming, enhanced query optimization for subqueries, and standard JSON_TABLE features.',
      category: 'Languages & Frameworks',
      source_url: 'https://www.postgresql.org/about/news/postgresql-17-released-2722/',
      source_name: 'PostgreSQL Global Development Group',
      is_verified: true
    },
    {
      id: FIXED_IDS.techUpdates.t3,
      title: 'Google DeepMind Releases Gemini 1.5 Flash and Pro Upgrades',
      description: 'Massive context window improvements up to 2 million tokens, breakthrough multimodal audio/video processing, and high efficiency for developer API workflows.',
      category: 'AI & Emerging',
      source_url: 'https://deepmind.google/technologies/gemini/',
      source_name: 'Google DeepMind',
      is_verified: true
    },
    {
      id: FIXED_IDS.techUpdates.t4,
      title: 'Smart India Hackathon (SIH) National Registrations Announced',
      description: 'National level competition by Ministry of Education inviting college student teams to solve real-world problems for government ministries and tech corporations.',
      category: 'Hackathons & Events',
      source_url: 'https://www.sih.gov.in',
      source_name: 'Ministry of Education Innovation Cell',
      is_verified: true
    }
  ];

  const { error: techError } = await supabaseAdmin
    .from('technology_updates')
    .upsert(SAMPLE_TECH_UPDATES, { onConflict: 'id' });

  if (techError) {
    console.error(`❌ Failed to seed tech updates: ${techError.message}`);
    hasErrors = true;
  } else {
    console.log(`✅ Seeded ${SAMPLE_TECH_UPDATES.length} technology updates.`);
  }

  // Learning Resources
  const SAMPLE_RESOURCES = [
    {
      id: FIXED_IDS.resources.r1,
      title: 'CS50: Introduction to Computer Science',
      description: 'Harvard University renowned introductory course on computer science and programming fundamentals taught by David J. Malan.',
      category: 'Video Lectures',
      resource_type: 'course',
      url: 'https://cs50.harvard.edu/x/',
      tags: ['C', 'Python', 'Algorithms', 'Harvard'],
      difficulty: 'all_levels',
      is_free: true
    },
    {
      id: FIXED_IDS.resources.r2,
      title: 'Striver A2Z DSA Course and Sheet',
      description: 'Most comprehensive structured DSA guide with step-by-step video solutions, problem links, and curated topics from basics to dynamic programming.',
      category: 'Tutorials',
      resource_type: 'website',
      url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
      tags: ['DSA', 'C++', 'Java', 'InterviewPrep'],
      difficulty: 'all_levels',
      is_free: true
    },
    {
      id: FIXED_IDS.resources.r3,
      title: 'The Odin Project - Full Stack JavaScript',
      description: 'Free, open source, project-driven web development curriculum covering modern JavaScript, React, Node.js, and databases with hands-on Git workflows.',
      category: 'Free Courses',
      resource_type: 'course',
      url: 'https://www.theodinproject.com/',
      tags: ['JavaScript', 'React', 'Node.js', 'WebDev'],
      difficulty: 'all_levels',
      is_free: true
    },
    {
      id: FIXED_IDS.resources.r4,
      title: 'System Design Primer (GitHub Repository)',
      description: 'Learn how to design large-scale distributed systems. Trusted by over 250,000 developers worldwide for tech interview prep.',
      category: 'Interview Prep',
      resource_type: 'github',
      url: 'https://github.com/donnemartin/system-design-primer',
      tags: ['SystemDesign', 'DistributedSystems', 'Architecture'],
      difficulty: 'intermediate',
      is_free: true
    }
  ];

  const { error: resError } = await supabaseAdmin
    .from('learning_resources')
    .upsert(SAMPLE_RESOURCES, { onConflict: 'id' });

  if (resError) {
    console.error(`❌ Failed to seed learning resources: ${resError.message}`);
    hasErrors = true;
  } else {
    console.log(`✅ Seeded ${SAMPLE_RESOURCES.length} learning resources.`);
  }

  // Opportunities (Updated future dates and clearly labelled demonstration data)
  const SAMPLE_OPPORTUNITIES = [
    {
      id: FIXED_IDS.opportunities.o1,
      title: '[DEMO] Google Summer Software Engineering Internship 2027',
      company_name: 'Google India (Demonstration Listing)',
      opportunity_type: 'internship',
      location: 'Bangalore / Hyderabad',
      stipend_or_salary: 'INR 1,10,000 / month (Demo)',
      eligibility_criteria: 'Demonstration listing: Enrolled in Bachelor or Master program in CSE/IT graduating in 2027 or 2028. Strong algorithmic foundation.',
      eligible_batches: ['2027', '2028'],
      required_skills: ['C++', 'Java', 'Python', 'Algorithms', 'Data Structures'],
      application_deadline: '2027-04-30',
      official_apply_link: 'https://careers.google.com/jobs',
      is_verified: true
    },
    {
      id: FIXED_IDS.opportunities.o2,
      title: '[DEMO] Microsoft Software Engineering Full-time Campus Graduate 2027',
      company_name: 'Microsoft IDC (Demonstration Listing)',
      opportunity_type: 'placement',
      location: 'Hyderabad / Noida / Bangalore',
      stipend_or_salary: 'INR 45,00,000 CTC (Base + Stocks + Bonus) (Demo)',
      eligibility_criteria: 'Demonstration listing: B.Tech / M.Tech in CSE / IT graduating in 2027 with minimum 7.5 CGPA. Zero active backlogs.',
      eligible_batches: ['2027'],
      required_skills: ['Problem Solving', 'Data Structures', 'OOP', 'OS Concepts', 'System Architecture'],
      application_deadline: '2027-05-15',
      official_apply_link: 'https://careers.microsoft.com',
      is_verified: true
    },
    {
      id: FIXED_IDS.opportunities.o3,
      title: '[DEMO] Amazon SDE 6-Month Intern & Off-Campus Drive 2027',
      company_name: 'Amazon Development Centre (Demonstration Listing)',
      opportunity_type: 'internship',
      location: 'Chennai / Bangalore',
      stipend_or_salary: 'INR 80,000 / month (Demo)',
      eligibility_criteria: 'Demonstration listing: Penultimate or Final year engineering students. Online assessment and technical interview rounds.',
      eligible_batches: ['2027', '2028'],
      required_skills: ['DSA', 'OOP', 'Code Quality', 'Debugging'],
      application_deadline: '2027-03-31',
      official_apply_link: 'https://amazon.jobs',
      is_verified: true
    }
  ];

  const { error: oppError } = await supabaseAdmin
    .from('opportunities')
    .upsert(SAMPLE_OPPORTUNITIES, { onConflict: 'id' });

  if (oppError) {
    console.error(`❌ Failed to seed opportunities: ${oppError.message}`);
    hasErrors = true;
  } else {
    console.log(`✅ Seeded ${SAMPLE_OPPORTUNITIES.length} demonstration opportunities.`);
  }

  // Project Ideas & Teams
  const SAMPLE_PROJECT_IDEAS = [
    {
      id: FIXED_IDS.projects.p1,
      title: 'AI-Powered Code Reviewer & Security Linter Bot',
      description: 'A GitHub App that runs automated AST analysis and calls an LLM to review pull requests, detect security vulnerabilities, and suggest optimized refactorings with diffs.',
      difficulty: 'advanced',
      required_technologies: ['Node.js', 'TypeScript', 'GitHub REST/GraphQL API', 'Gemini API', 'Docker'],
      domain: 'AI/ML'
    }
  ];

  const { error: prjError } = await supabaseAdmin
    .from('project_ideas')
    .upsert(SAMPLE_PROJECT_IDEAS, { onConflict: 'id' });

  if (prjError) {
    console.error(`❌ Failed to seed project ideas: ${prjError.message}`);
    hasErrors = true;
  } else {
    console.log(`✅ Seeded project ideas.`);
  }

  if (rohitId) {
    const SAMPLE_TEAMS = [
      {
        id: FIXED_IDS.projects.team1,
        project_id: FIXED_IDS.projects.p1,
        title: 'AI Code Reviewer Core Team',
        description: 'Building an open source AI GitHub action that gives smart line-by-line PR feedback. We need a frontend engineer for the analytics dashboard and a backend developer.',
        creator_id: rohitId,
        open_roles: ['Frontend React Engineer', 'DevOps / Docker Specialist'],
        current_members: 2,
        max_members: 4,
        github_repo_url: 'https://github.com/techbridge/ai-reviewer',
        status: 'recruiting'
      }
    ];

    const { error: teamError } = await supabaseAdmin
      .from('project_teams')
      .upsert(SAMPLE_TEAMS, { onConflict: 'id' });

    if (teamError) {
      console.error(`❌ Failed to seed project teams: ${teamError.message}`);
      hasErrors = true;
    } else {
      console.log(`✅ Seeded project teams.`);
    }
  }

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  console.log('\n================================================================');
  if (hasErrors) {
    console.warn('⚠️ Seed process completed with one or more warnings/errors. Review log output above.');
  } else {
    console.log('🎉 TechBridge Seed Completed Successfully!');
    console.log('All sample users, profiles, roadmaps, discussions, and opportunities are synchronized.');
  }
  console.log('================================================================\n');
}

runSeed().catch((err) => {
  console.error('\n❌ Unhandled exception in seed script:', err.message);
  process.exit(1);
});
