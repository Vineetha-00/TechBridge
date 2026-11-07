-- ====================================================================
-- TECHBRIDGE CORRECTED SEED DATA (Valid RFC 4122 UUIDs)
-- ====================================================================
-- NOTE ON FOREIGN KEY DEPENDENCY:
-- The `profiles` table has a foreign key:
--   `profiles.id REFERENCES auth.users(id) ON DELETE CASCADE`
--
-- Therefore, rows cannot be inserted into `profiles` unless the corresponding
-- user IDs already exist in `auth.users`.
--
-- PREFERRED METHOD:
-- Run the automated Node.js seed script which handles both Auth creation
-- and Profile population via the Supabase Auth Admin API:
--   node backend/scripts/seedSupabase.js
--
-- If executing this SQL file manually inside the Supabase SQL Editor,
-- ensure the auth users have been created first or use the automated script.
-- ====================================================================

-- 1. Colleges (All valid hexadecimal UUIDs: c1111..., c2222..., etc.)
INSERT INTO colleges (id, name, code, city, state) VALUES
('c1111111-1111-1111-1111-111111111111', 'National Institute of Technology (NIT)', 'NIT-01', 'Warangal', 'Telangana'),
('c2222222-2222-2222-2222-222222222222', 'Indian Institute of Information Technology (IIIT)', 'IIIT-H', 'Hyderabad', 'Telangana'),
('c3333333-3333-3333-3333-333333333333', 'Vellore Institute of Technology', 'VIT-V', 'Vellore', 'Tamil Nadu'),
('c4444444-4444-4444-4444-444444444444', 'Birla Institute of Technology and Science', 'BITS-P', 'Pilani', 'Rajasthan')
ON CONFLICT (name) DO NOTHING;

-- 2. Profiles (All invalid 'p' and 's' prefixes replaced with valid hex 'e' and 'f')
-- a1111111-... = Admin (Dr. Ramesh Kumar)
-- e1111111-... = Placed Graduate 1 (Aravind Sharma @ Google)
-- e2222222-... = Placed Graduate 2 (Sneha Reddy @ Microsoft)
-- f4444444-... = Final Year Student (Rohit Verma, Amazon PPO)
-- f3333333-... = Third Year Student (Priya Patel)
-- f2222222-... = Second Year Student (Karthik Nair)
-- f1111111-... = First Year Student (Rahul Gupta)

INSERT INTO profiles (
    id, email, full_name, avatar_url, bio, role, college_id, college_name, 
    academic_year, branch, student_id_number, college_email,
    placed_company, job_designation, package_lpa, linkedin_url, github_url,
    skills, interests, is_verified, verification_status, is_open_to_mentor, mentor_topics
) VALUES
(
    'a1111111-1111-1111-1111-111111111111', 'admin@techbridge.edu', 'System Administrator',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'Chief Platform Administrator ensuring student safety, verification and quality mentorship.',
    'admin', 'c1111111-1111-1111-1111-111111111111', 'National Institute of Technology (NIT)',
    4, 'Computer Science and Engineering', 'ADM-2024-001', 'admin@nitw.ac.in',
    NULL, NULL, NULL, 'https://linkedin.com', 'https://github.com',
    ARRAY['System Architecture', 'Database Management', 'Platform Safety'],
    ARRAY['Community Building', 'Mentorship Quality'],
    true, 'approved', false, ARRAY[]::text[]
),
(
    'e1111111-1111-1111-1111-111111111111', 'aravind.placed@google.com', 'Aravind Sharma',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    'SDE-1 at Google. Ex-Intern at Microsoft. Passionate about DSA, distributed systems and helping juniors crack tier-1 tech interviews.',
    'placed_graduate', 'c2222222-2222-2222-2222-222222222222', 'Indian Institute of Information Technology (IIIT)',
    4, 'Computer Science and Engineering', '2020-CSE-045', 'aravind.s@iiit.ac.in',
    'Google', 'Software Development Engineer I', 42.50, 'https://linkedin.com/in/aravind-tech', 'https://github.com/aravind-dev',
    ARRAY['C++', 'Data Structures & Algorithms', 'System Design', 'Go', 'Distributed Systems'],
    ARRAY['FAANG Interview Prep', 'Resume Reviews', 'Competitive Programming'],
    true, 'approved', true, ARRAY['Google Interview Strategy', 'Mastering LeetCode', 'System Design Basics', 'Off-campus Opportunities']
),
(
    'e2222222-2222-2222-2222-222222222222', 'sneha.reddy@microsoft.com', 'Sneha Reddy',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'Software Engineer at Microsoft Cloud & AI. Final year mentor with 50+ junior 1-on-1 sessions.',
    'placed_graduate', 'c1111111-1111-1111-1111-111111111111', 'National Institute of Technology (NIT)',
    4, 'Computer Science and Engineering', '2020-CSE-112', 'sneha.r@nitw.ac.in',
    'Microsoft', 'Software Engineer', 38.00, 'https://linkedin.com/in/sneha-reddy', 'https://github.com/sneha-codes',
    ARRAY['Java', 'Spring Boot', 'Azure', 'Microservices', 'PostgreSQL', 'Docker'],
    ARRAY['Backend Engineering', 'Women in Tech Mentorship', 'Cloud Architecture'],
    true, 'approved', true, ARRAY['Backend Engineering Career Path', 'Azure Cloud Fundamentals', 'Mock Interviews', 'College to Corporate Transition']
),
(
    'f4444444-4444-4444-4444-444444444444', 'rohit.finalyear@nitw.ac.in', 'Rohit Verma',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'Final Year CSE student. Upcoming SDE at Amazon. Open source contributor and Hackathon winner.',
    'final_year', 'c1111111-1111-1111-1111-111111111111', 'National Institute of Technology (NIT)',
    4, 'Computer Science and Engineering', '2021-CSE-088', 'rohit.v@nitw.ac.in',
    'Amazon', 'SDE Intern / PPO', 28.50, 'https://linkedin.com/in/rohit-verma', 'https://github.com/rohit-v',
    ARRAY['React.js', 'Node.js', 'Python', 'AWS', 'DSA in Python'],
    ARRAY['Full Stack Web Development', 'Hackathons', 'Open Source'],
    true, 'approved', true, ARRAY['Full Stack Roadmaps', 'Hackathon Winning Strategies', 'Amazon Online Assessments']
),
(
    'f3333333-3333-3333-3333-333333333333', 'priya.thirdyear@vit.ac.in', 'Priya Patel',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    '3rd Year CSE student exploring AI/ML, PyTorch and deep learning computer vision projects.',
    'third_year', 'c3333333-3333-3333-3333-333333333333', 'Vellore Institute of Technology',
    3, 'Computer Science and Engineering', '2022-VIT-231', 'priya.p@vit.ac.in',
    NULL, NULL, NULL, 'https://linkedin.com', 'https://github.com',
    ARRAY['Python', 'Machine Learning', 'PyTorch', 'Data Analysis', 'SQL'],
    ARRAY['Research Papers', 'AI Projects', 'Internship Hunt for 3rd Year'],
    true, 'approved', true, ARRAY['Machine Learning Roadmap for Beginners', 'Project Selection']
),
(
    'f2222222-2222-2222-2222-222222222222', 'karthik.secondyear@bits.ac.in', 'Karthik Nair',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    '2nd Year CSE student focusing on core CS fundamentals: OS, DBMS, Computer Networks and DSA in Java.',
    'second_year', 'c4444444-4444-4444-4444-444444444444', 'Birla Institute of Technology and Science',
    2, 'Computer Science and Engineering', '2023-BITS-104', 'karthik.n@bits.ac.in',
    NULL, NULL, NULL, 'https://linkedin.com', 'https://github.com',
    ARRAY['Java', 'Data Structures', 'C', 'MySQL', 'Git'],
    ARRAY['Competitive Programming', 'Core CS Subjects', 'Web Dev Basics'],
    true, 'approved', false, ARRAY[]::text[]
),
(
    'f1111111-1111-1111-1111-111111111111', 'rahul.firstyear@nitw.ac.in', 'Rahul Gupta',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    '1st Year CSE student enthusiastic about learning programming, curious about web development and AI.',
    'first_year', 'c1111111-1111-1111-1111-111111111111', 'National Institute of Technology (NIT)',
    1, 'Computer Science and Engineering', '2024-CSE-310', 'rahul.g@nitw.ac.in',
    NULL, NULL, NULL, 'https://linkedin.com', 'https://github.com',
    ARRAY['C Language', 'HTML5', 'Basic Python'],
    ARRAY['Where to Start Programming', 'Finding Right Mentor', 'Choosing Languages'],
    true, 'approved', false, ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
    bio = EXCLUDED.bio,
    skills = EXCLUDED.skills,
    interests = EXCLUDED.interests,
    placed_company = EXCLUDED.placed_company,
    job_designation = EXCLUDED.job_designation,
    package_lpa = EXCLUDED.package_lpa,
    is_open_to_mentor = EXCLUDED.is_open_to_mentor,
    mentor_topics = EXCLUDED.mentor_topics;

-- 3. Learning Roadmaps (All invalid 'r' prefixes replaced with valid hex 'b')
INSERT INTO roadmaps (id, title, slug, description, category, target_year, estimated_months, prerequisites, icon_name, is_featured) VALUES
(
    'b1111111-1111-1111-1111-111111111111',
    'First-Year CSE Starter Blueprint',
    'first-year-cse-starter',
    'Comprehensive foundation for newcomers: mastering C/C++ programming fundamentals, Linux command line, Git & GitHub, and problem-solving thinking.',
    'year_wise', 1, 6, ARRAY['Basic Computer Literacy', 'High School Math'], 'Terminal', true
),
(
    'b2222222-2222-2222-2222-222222222222',
    'Second-Year Core CS & DSA Mastery',
    'second-year-dsa-core-cs',
    'Structured roadmap covering Object-Oriented Programming (Java/C++), Standard Data Structures, Algorithmic Analysis, and Operating Systems.',
    'year_wise', 2, 8, ARRAY['Basic C/C++ or Java Programming', 'Loops & Functions'], 'Code2', true
),
(
    'b3333333-3333-3333-3333-333333333333',
    'Third-Year Internship & Full-Stack / AI Specialization',
    'third-year-internship-specialization',
    'Deep dive into real-world production stacks (MERN/Java Backend or PyTorch AI), resume-grade projects, and preparation for summer internship OA tests.',
    'year_wise', 3, 6, ARRAY['Data Structures & Algorithms', 'Object Oriented Programming', 'Database Basics'], 'Layers', true
),
(
    'b4444444-4444-4444-4444-444444444444',
    'Final-Year Campus Placement & Off-Campus Accelerator',
    'final-year-placement-accelerator',
    'Intensive placement sprint: Low-Level Design (LLD), System Design (HLD), CS Fundamentals (DBMS, OS, CN), Behavioral HR questions, and mock interviews.',
    'year_wise', 4, 4, ARRAY['Proficiency in 1 Programming Language', 'DSA LeetCode Mediums', 'At least 2 Capstone Projects'], 'Award', true
),
(
    'b5555555-5555-5555-5555-555555555555',
    'Modern Full-Stack Web Development',
    'full-stack-web-dev',
    'From semantic HTML/CSS and JavaScript ES6+ to React, Node.js, Express, PostgreSQL, REST APIs, authentication and cloud deployment.',
    'career', NULL, 6, ARRAY['Basic Programming Knowledge'], 'Globe', true
),
(
    'b6666666-6666-6666-6666-666666666666',
    'Artificial Intelligence & Machine Learning Track',
    'ai-machine-learning-track',
    'Mathematics for ML (Linear Algebra, Calculus, Statistics), Python data stack (NumPy, Pandas), Scikit-Learn, Deep Learning with PyTorch, and GenAI basics.',
    'skill_based', NULL, 7, ARRAY['Python Programming', 'High School Calculus and Statistics'], 'Cpu', true
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Roadmap Milestones (Referencing b1111... and b2222...)
INSERT INTO roadmap_milestones (roadmap_id, milestone_order, title, description, objectives, recommended_topics, suggested_resources, suggested_projects) VALUES
(
    'b1111111-1111-1111-1111-111111111111', 1, 'Programming Fundamentals in C/C++',
    'Build strong algorithmic logic and understand memory models, pointers, and compilation.',
    ARRAY['Understand variables, control flow, loops', 'Grasp arrays, strings, and functions', 'Master pointers and manual memory allocation'],
    ARRAY['Input/Output and Operators', 'Conditionals and Loops', 'Functions and Scope', 'Pointers and Addresses', 'Structures and Dynamic Memory'],
    '[{"title": "CS50 Introduction to Computer Science", "url": "https://cs50.harvard.edu"}, {"title": "Learn C the Hard Way", "url": "https://learncodethehardway.org"}]'::jsonb,
    '[{"title": "Student Grade Management System in C", "description": "CLI tool using structs and file I/O to store, update and compute student averages."}]'::jsonb
),
(
    'b1111111-1111-1111-1111-111111111111', 2, 'Developer Tooling: Git, GitHub and Linux Basics',
    'Learn how modern software engineers collaborate, track versions, and navigate Unix terminals.',
    ARRAY['Learn common Bash commands', 'Understand Git commit, branch, merge, and PRs', 'Create clean GitHub README portfolios'],
    ARRAY['Linux Terminal Navigation', 'Package Managers', 'Git Version Control', 'SSH Keys and Remote Repositories'],
    '[{"title": "Missing Semester of Your CS Education (MIT)", "url": "https://missing.csail.mit.edu"}]'::jsonb,
    '[{"title": "First Open Source Contribution / Personal Portfolio Repo", "description": "Host a markdown portfolio on GitHub with Git version history."}]'::jsonb
),
(
    'b2222222-2222-2222-2222-222222222222', 1, 'Linear Data Structures & Time Complexity',
    'Master Big-O notation, memory layout of arrays, linked lists, stacks, and queues.',
    ARRAY['Calculate Time and Space Complexity', 'Implement Singly and Doubly Linked Lists', 'Solve Stack and Queue problems'],
    ARRAY['Big-O, Big-Theta, Big-Omega', 'Dynamic Arrays', 'Singly/Doubly Linked Lists', 'Stack implementation using Arrays/Nodes', 'Monotonic Stack pattern'],
    '[{"title": "NeetCode DSA Roadmap", "url": "https://neetcode.io/roadmap"}, {"title": "Striver A2Z DSA Sheet", "url": "https://takeuforward.org"}]'::jsonb,
    '[{"title": "Infix to Postfix Converter & Expression Evaluator", "description": "Build an arithmetic formula evaluator utilizing stacks."}]'::jsonb
),
(
    'b2222222-2222-2222-2222-222222222222', 2, 'Trees, Graphs, and Recursion',
    'Conquer hierarchical data structures, binary search trees, graph traversals (BFS/DFS), and recursion.',
    ARRAY['Understand tree traversals (Inorder, Preorder, Postorder)', 'Grasp Binary Search Trees and balancing', 'Master Graph representations (Adjacency Matrix/List) and BFS/DFS'],
    ARRAY['Binary Trees and BST', 'Recursion and Backtracking', 'Graph BFS & DFS', 'Shortest Path (Dijkstra)'],
    '[{"title": "VisuAlgo Visual Data Structures", "url": "https://visualgo.net"}]'::jsonb,
    '[{"title": "Maze Pathfinding Visualizer", "description": "Visualize BFS and DFS searching paths through a custom grid."}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 5. Discussion Posts with verified answers (Referencing f1111... Rahul, f2222... Karthik, f3333... Priya)
INSERT INTO discussions (id, author_id, title, content, category, tags, views_count, likes_count, answers_count, is_resolved, has_verified_senior_answer) VALUES
(
    'd1111111-1111-1111-1111-111111111111',
    'f1111111-1111-1111-1111-111111111111', -- Rahul (1st year)
    'Should I learn C++ or Java for Data Structures & Algorithms and placements?',
    'I just completed my 1st semester with basic C. I see seniors recommending C++ for competitive programming speed, but some placed seniors swear by Java for enterprise placements and Spring Boot. Which one provides better long-term return on investment?',
    'DSA', ARRAY['DSA', 'C++', 'Java', 'Beginners', 'Placements'],
    342, 28, 2, true, true
),
(
    'd2222222-2222-2222-2222-222222222222',
    'f2222222-2222-2222-2222-222222222222', -- Karthik (2nd year)
    'How many LeetCode questions are actually enough before applying for 3rd-year summer internships?',
    'There is a lot of anxiety around numbers (some say 500+, some say 150). Could seniors who cracked top internships at Google, Microsoft, Amazon share what pattern recognition strategy worked for you rather than blindly grinding?',
    'Placements', ARRAY['LeetCode', 'Internships', 'Strategy', 'Preparation'],
    510, 45, 1, true, true
),
(
    'd3333333-3333-3333-3333-333333333333',
    'f3333333-3333-3333-3333-333333333333', -- Priya (3rd year)
    'What makes a Web Development or AI project stand out on a resume for tier-1 companies?',
    'Almost everyone has a todo app or a weather app or a basic Titanic ML model. What differentiates a mediocre project from an impressive resume capstone?',
    'Projects', ARRAY['Resume', 'WebDev', 'MachineLearning', 'Projects'],
    289, 31, 1, false, true
)
ON CONFLICT (id) DO NOTHING;

-- 6. Discussion Answers (All invalid 'ans' prefixes replaced with valid hex 'aa1111...', 'aa2222...', 'aa3333...')
-- Author IDs: e1111... Aravind (Google), e2222... Sneha (Microsoft), f4444... Rohit (Amazon)
INSERT INTO answers (id, discussion_id, author_id, content, is_helpful, is_accepted, likes_count) VALUES
(
    'aa111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'e1111111-1111-1111-1111-111111111111', -- Aravind (Google)
    'Here is the factual breakdown from having interviewed and practiced across both:

1. STL in C++ (Standard Template Library) is extremely concise. In competitive programming contests (Codeforces, CodeChef), C++ is king because of typing speed and minimal boilerplate.
2. Java has strict OOP, excellent garbage collection, and is the industry standard for backend microservices in Amazon, banks, and enterprise SaaS.
3. In campus and off-campus technical interviews (Google, Microsoft, Amazon, Uber), interviewers DO NOT care whether you pick C++ or Java. They only evaluate your problem-solving, time/space complexity analysis, and clean edge-case handling.

Recommendation: Pick C++ if you love raw algorithms and fast STL syntax. Pick Java if you intend to build backend web services alongside your DSA. Never juggle both simultaneously in your first year — master one first.',
    true, true, 39
),
(
    'aa222222-2222-2222-2222-222222222222',
    'd1111111-1111-1111-1111-111111111111',
    'e2222222-2222-2222-2222-222222222222', -- Sneha (Microsoft)
    'Agree with Aravind! At Microsoft, many candidates used Java, C++, or even Python. What gave Java candidates a slight edge in my personal opinion during managerial rounds was that they could seamlessly write Object-Oriented Design (Low Level Design) classes and interfaces during round 2. Pick one and stick with it for at least 6 months!',
    true, false, 24
),
(
    'aa333333-3333-3333-3333-333333333333',
    'd2222222-2222-2222-2222-222222222222',
    'f4444444-4444-4444-4444-444444444444', -- Rohit (Amazon PPO)
    'Focus on the 75 Blind / NeetCode 150 patterns instead of grinding 600 random questions. 
Specifically:
- Two Pointers & Sliding Window (20 problems)
- Trees & Binary Search (25 problems)
- Dynamic Programming patterns (0/1 Knapsack, Longest Common Subsequence) (25 problems)
- Graph BFS/DFS & Disjoint Set Union (20 problems)
If you solve 150 to 200 questions where you can explain the intuition out loud without looking at solutions, you are in the top 10% of applicants.',
    true, true, 41
)
ON CONFLICT (id) DO NOTHING;

-- 7. Technology Updates
INSERT INTO technology_updates (title, description, category, source_url, source_name, is_verified) VALUES
(
    'Node.js 22 Promoted to Long Term Support (LTS)',
    'Node.js 22 includes built-in WebSocket client, V8 12.4 engine updates, enhanced ESM support with --experimental-require-module, and improved crypto performance.',
    'Languages & Frameworks',
    'https://nodejs.org/en/blog/release/v22.0.0',
    'Node.js Foundation',
    true
),
(
    'PostgreSQL 17 Released with Enhanced Query Performance and JSON Features',
    'PostgreSQL 17 features memory management enhancements for vacuuming, enhanced query optimization for subqueries, and standard JSON_TABLE features.',
    'Languages & Frameworks',
    'https://www.postgresql.org/about/news/postgresql-17-released-2722/',
    'PostgreSQL Global Development Group',
    true
),
(
    'Google DeepMind Releases Gemini 1.5 Flash and Pro Upgrades',
    'Massive context window improvements up to 2 million tokens, breakthrough multimodal audio/video processing, and high efficiency for developer API workflows.',
    'AI & Emerging',
    'https://deepmind.google/technologies/gemini/',
    'Google DeepMind',
    true
),
(
    'Smart India Hackathon (SIH) 2025 Registrations Announced',
    'National level competition by Ministry of Education inviting college student teams to solve real-world problems for government ministries and tech corporations.',
    'Hackathons & Events',
    'https://www.sih.gov.in',
    'Ministry of Education Innovation Cell',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 8. Learning Resources
INSERT INTO learning_resources (title, description, category, resource_type, url, tags, difficulty, is_free) VALUES
(
    'CS50: Introduction to Computer Science',
    'Harvard University renowned introductory course on computer science and programming fundamentals taught by David J. Malan.',
    'Video Lectures', 'course', 'https://cs50.harvard.edu/x/',
    ARRAY['C', 'Python', 'Algorithms', 'Harvard'], 'all_levels', true
),
(
    'Striver A2Z DSA Course and Sheet',
    'Most comprehensive structured DSA guide with step-by-step video solutions, problem links, and curated topics from basics to dynamic programming.',
    'Tutorials', 'website', 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    ARRAY['DSA', 'C++', 'Java', 'InterviewPrep'], 'all_levels', true
),
(
    'The Odin Project - Full Stack JavaScript',
    'Free, open source, project-driven web development curriculum covering modern JavaScript, React, Node.js, and databases with hands-on Git workflows.',
    'Free Courses', 'course', 'https://www.theodinproject.com/',
    ARRAY['JavaScript', 'React', 'Node.js', 'WebDev'], 'all_levels', true
),
(
    'System Design Primer (GitHub Repository)',
    'Learn how to design large-scale distributed systems. Trusted by over 250,000 developers worldwide for tech interview prep.',
    'Interview Prep', 'github', 'https://github.com/donnemartin/system-design-primer',
    ARRAY['SystemDesign', 'DistributedSystems', 'Architecture'], 'intermediate', true
)
ON CONFLICT (id) DO NOTHING;

-- 9. Internship & Placement Opportunities
INSERT INTO opportunities (title, company_name, opportunity_type, location, stipend_or_salary, eligibility_criteria, eligible_batches, required_skills, application_deadline, official_apply_link, is_verified) VALUES
(
    'Google Summer Student Software Engineering Intern 2025',
    'Google India',
    'internship',
    'Bangalore / Hyderabad',
    'INR 1,10,000 / month',
    'Enrolled in a Bachelor or Master program in Computer Science or related STEM field. Graduating in 2026. Strong foundation in algorithms and software engineering.',
    ARRAY['2026'],
    ARRAY['C++', 'Java', 'Python', 'Algorithms', 'Data Structures'],
    '2025-04-30',
    'https://careers.google.com/jobs',
    true
),
(
    'Microsoft Software Engineering Full-time College Graduate',
    'Microsoft IDC',
    'placement',
    'Hyderabad / Noida / Bangalore',
    'INR 45,00,000 CTC (Base + Stocks + Bonus)',
    'B.Tech / M.Tech in CSE / IT with minimum 7.5 CGPA. Zero active backlogs. Passing out batch 2025.',
    ARRAY['2025'],
    ARRAY['Problem Solving', 'Data Structures', 'OOP', 'OS Concepts', 'System Architecture'],
    '2025-05-15',
    'https://careers.microsoft.com',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 10. Project Ideas & Collaborative Teams (Creator: f4444... Rohit)
INSERT INTO project_ideas (title, description, difficulty, required_technologies, domain) VALUES
(
    'AI-Powered Code Reviewer & Security Linter Bot',
    'A GitHub App that runs automated AST analysis and calls an LLM to review pull requests, detect security vulnerabilities, and suggest optimized refactorings with diffs.',
    'advanced',
    ARRAY['Node.js', 'TypeScript', 'GitHub REST/GraphQL API', 'Gemini API', 'Docker'],
    'AI/ML'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO project_teams (title, description, creator_id, open_roles, current_members, max_members, github_repo_url, status) VALUES
(
    'AI Code Reviewer Core Team',
    'Building an open source AI GitHub action that gives smart line-by-line PR feedback. We need a frontend engineer for the analytics dashboard and a backend developer.',
    'f4444444-4444-4444-4444-444444444444', -- Rohit Verma
    ARRAY['Frontend React Engineer', 'DevOps / Docker Specialist'],
    2, 4, 'https://github.com/techbridge/ai-reviewer', 'recruiting'
)
ON CONFLICT (id) DO NOTHING;

