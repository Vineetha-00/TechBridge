// Comprehensive in-memory repository for development, testing, and fallback
const fallbackData = {
    colleges: [
        { id: 'col-1', name: 'National Institute of Technology (NIT)', code: 'NIT-01', city: 'Warangal', state: 'Telangana' },
        { id: 'col-2', name: 'Indian Institute of Information Technology (IIIT)', code: 'IIIT-H', city: 'Hyderabad', state: 'Telangana' },
        { id: 'col-3', name: 'Vellore Institute of Technology', code: 'VIT-V', city: 'Vellore', state: 'Tamil Nadu' },
        { id: 'col-4', name: 'Birla Institute of Technology and Science', code: 'BITS-P', city: 'Pilani', state: 'Rajasthan' }
    ],

    users: [
        {
            id: 'usr-admin',
            email: 'admin@techbridge.edu',
            full_name: 'Dr. Ramesh Kumar (Admin)',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            bio: 'Head of CSE Department & TechBridge Administrator.',
            role: 'admin',
            college_name: 'National Institute of Technology (NIT)',
            academic_year: 4,
            branch: 'Computer Science and Engineering',
            is_verified: true,
            verification_status: 'approved',
            skills: ['Distributed Systems', 'Mentorship Ethics', 'Department Affairs'],
            interests: ['Education Tech', 'Student Placement Governance'],
            is_open_to_mentor: false
        },
        {
            id: 'usr-placed-1',
            email: 'aravind.placed@google.com',
            full_name: 'Aravind Sharma',
            avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
            bio: 'SDE-1 at Google. Ex-Intern at Microsoft. Passionate about DSA, distributed systems and helping juniors crack tier-1 tech interviews.',
            role: 'placed_graduate',
            college_name: 'Indian Institute of Information Technology (IIIT)',
            academic_year: 4,
            branch: 'Computer Science and Engineering',
            placed_company: 'Google',
            job_designation: 'Software Development Engineer I',
            package_lpa: 42.50,
            linkedin_url: 'https://linkedin.com/in/aravind-tech',
            github_url: 'https://github.com/aravind-dev',
            is_verified: true,
            verification_status: 'approved',
            skills: ['C++', 'Data Structures & Algorithms', 'System Design', 'Go', 'Distributed Systems'],
            interests: ['FAANG Interview Prep', 'Resume Reviews', 'Competitive Programming'],
            is_open_to_mentor: true,
            mentor_topics: ['Google Interview Strategy', 'Mastering LeetCode', 'System Design Basics', 'Off-campus Opportunities']
        },
        {
            id: 'usr-placed-2',
            email: 'sneha.reddy@microsoft.com',
            full_name: 'Sneha Reddy',
            avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            bio: 'Software Engineer at Microsoft Cloud & AI. Final year mentor with 50+ junior 1-on-1 sessions.',
            role: 'placed_graduate',
            college_name: 'National Institute of Technology (NIT)',
            academic_year: 4,
            branch: 'Computer Science and Engineering',
            placed_company: 'Microsoft',
            job_designation: 'Software Engineer',
            package_lpa: 38.00,
            linkedin_url: 'https://linkedin.com/in/sneha-reddy',
            github_url: 'https://github.com/sneha-codes',
            is_verified: true,
            verification_status: 'approved',
            skills: ['Java', 'Spring Boot', 'Azure', 'Microservices', 'PostgreSQL', 'Docker'],
            interests: ['Backend Engineering', 'Women in Tech Mentorship', 'Cloud Architecture'],
            is_open_to_mentor: true,
            mentor_topics: ['Backend Engineering Career Path', 'Azure Cloud Fundamentals', 'Mock Interviews', 'College to Corporate Transition']
        },
        {
            id: 'usr-final-1',
            email: 'rohit.finalyear@nitw.ac.in',
            full_name: 'Rohit Verma',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            bio: 'Final Year CSE student. Upcoming SDE at Amazon. Open source contributor and Hackathon winner.',
            role: 'final_year',
            college_name: 'National Institute of Technology (NIT)',
            academic_year: 4,
            branch: 'Computer Science and Engineering',
            placed_company: 'Amazon',
            job_designation: 'SDE Intern / PPO',
            package_lpa: 28.50,
            linkedin_url: 'https://linkedin.com/in/rohit-verma',
            github_url: 'https://github.com/rohit-v',
            is_verified: true,
            verification_status: 'approved',
            skills: ['React.js', 'Node.js', 'Python', 'AWS', 'DSA in Python'],
            interests: ['Full Stack Web Development', 'Hackathons', 'Open Source'],
            is_open_to_mentor: true,
            mentor_topics: ['Full Stack Roadmaps', 'Hackathon Winning Strategies', 'Amazon Online Assessments']
        },
        {
            id: 'usr-third-1',
            email: 'priya.thirdyear@vit.ac.in',
            full_name: 'Priya Patel',
            avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
            bio: '3rd Year CSE student exploring AI/ML, PyTorch and deep learning computer vision projects.',
            role: 'third_year',
            college_name: 'Vellore Institute of Technology',
            academic_year: 3,
            branch: 'Computer Science and Engineering',
            is_verified: true,
            verification_status: 'approved',
            skills: ['Python', 'Machine Learning', 'PyTorch', 'Data Analysis', 'SQL'],
            interests: ['Research Papers', 'AI Projects', 'Internship Hunt for 3rd Year'],
            is_open_to_mentor: true,
            mentor_topics: ['Machine Learning Roadmap for Beginners', 'Project Selection']
        },
        {
            id: 'usr-second-1',
            email: 'karthik.secondyear@bits.ac.in',
            full_name: 'Karthik Nair',
            avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            bio: '2nd Year CSE student focusing on core CS fundamentals: OS, DBMS, Computer Networks and DSA in Java.',
            role: 'second_year',
            college_name: 'Birla Institute of Technology and Science',
            academic_year: 2,
            branch: 'Computer Science and Engineering',
            is_verified: true,
            verification_status: 'approved',
            skills: ['Java', 'Data Structures', 'C', 'MySQL', 'Git'],
            interests: ['Competitive Programming', 'Core CS Subjects', 'Web Dev Basics'],
            is_open_to_mentor: false
        },
        {
            id: 'usr-first-1',
            email: 'rahul.firstyear@nitw.ac.in',
            full_name: 'Rahul Gupta',
            avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
            bio: '1st Year CSE student enthusiastic about learning programming, curious about web development and AI.',
            role: 'first_year',
            college_name: 'National Institute of Technology (NIT)',
            academic_year: 1,
            branch: 'Computer Science and Engineering',
            is_verified: true,
            verification_status: 'approved',
            skills: ['C Language', 'HTML5', 'Basic Python'],
            interests: ['Where to Start Programming', 'Finding Right Mentor', 'Choosing Languages'],
            is_open_to_mentor: false
        }
    ],

    discussions: [
        {
            id: 'disc-1',
            author_id: 'usr-first-1',
            author_name: 'Rahul Gupta',
            author_role: 'first_year',
            author_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
            title: 'Should I learn C++ or Java for Data Structures & Algorithms and campus placements?',
            content: 'I just completed my 1st semester with basic C. I see seniors recommending C++ for competitive programming speed, but some placed seniors swear by Java for enterprise placements and Spring Boot. Which one provides better long-term return on investment?',
            category: 'DSA',
            tags: ['DSA', 'C++', 'Java', 'Beginners', 'Placements'],
            views_count: 420,
            likes_count: 32,
            answers_count: 2,
            is_resolved: true,
            has_verified_senior_answer: true,
            created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
            id: 'disc-2',
            author_id: 'usr-second-1',
            author_name: 'Karthik Nair',
            author_role: 'second_year',
            author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            title: 'How many LeetCode questions are actually enough before applying for 3rd-year summer internships?',
            content: 'There is a lot of anxiety around numbers (some say 500+, some say 150). Could seniors who cracked top internships at Google, Microsoft, Amazon share what pattern recognition strategy worked for you rather than blindly grinding?',
            category: 'Placements',
            tags: ['LeetCode', 'Internships', 'Strategy', 'Preparation'],
            views_count: 680,
            likes_count: 58,
            answers_count: 2,
            is_resolved: true,
            has_verified_senior_answer: true,
            created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
            id: 'disc-3',
            author_id: 'usr-third-1',
            author_name: 'Priya Patel',
            author_role: 'third_year',
            author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
            title: 'What makes a Web Development or AI project stand out on a resume for tier-1 companies?',
            content: 'Almost everyone has a todo app or a weather app or a basic Titanic ML model. What differentiates a mediocre project from an impressive resume capstone?',
            category: 'Projects',
            tags: ['Resume', 'WebDev', 'MachineLearning', 'Projects'],
            views_count: 310,
            likes_count: 41,
            answers_count: 1,
            is_resolved: false,
            has_verified_senior_answer: true,
            created_at: new Date(Date.now() - 86400000 * 1).toISOString()
        }
    ],

    answers: [
        {
            id: 'ans-1',
            discussion_id: 'disc-1',
            author_id: 'usr-placed-1',
            author_name: 'Aravind Sharma',
            author_role: 'placed_graduate',
            author_company: 'Google',
            author_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
            content: `Here is the factual breakdown from having interviewed and practiced across both:

1. STL in C++ (Standard Template Library) is extremely concise. In competitive programming contests (Codeforces, CodeChef), C++ is king because of typing speed and minimal boilerplate.
2. Java has strict OOP, excellent garbage collection, and is the industry standard for backend microservices in Amazon, banks, and enterprise SaaS.
3. In campus and off-campus technical interviews (Google, Microsoft, Amazon, Uber), interviewers DO NOT care whether you pick C++ or Java. They only evaluate your problem-solving, time/space complexity analysis, and clean edge-case handling.

Recommendation: Pick C++ if you love raw algorithms and fast STL syntax. Pick Java if you intend to build backend web services alongside your DSA. Never juggle both simultaneously in your first year — master one first.`,
            is_helpful: true,
            is_accepted: true,
            likes_count: 47,
            created_at: new Date(Date.now() - 86400000 * 2.5).toISOString()
        },
        {
            id: 'ans-2',
            discussion_id: 'disc-1',
            author_id: 'usr-placed-2',
            author_name: 'Sneha Reddy',
            author_role: 'placed_graduate',
            author_company: 'Microsoft',
            author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            content: `Agree with Aravind! At Microsoft, many candidates used Java, C++, or even Python. What gave Java candidates a slight edge in my personal opinion during managerial rounds was that they could seamlessly write Object-Oriented Design (Low Level Design) classes and interfaces during round 2. Pick one and stick with it for at least 6 months!`,
            is_helpful: true,
            is_accepted: false,
            likes_count: 29,
            created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
            id: 'ans-3',
            discussion_id: 'disc-2',
            author_id: 'usr-final-1',
            author_name: 'Rohit Verma',
            author_role: 'final_year',
            author_company: 'Amazon PPO',
            author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            content: `Focus on the 75 Blind / NeetCode 150 patterns instead of grinding 600 random questions. 
Specifically:
- Two Pointers & Sliding Window (20 problems)
- Trees & Binary Search (25 problems)
- Dynamic Programming patterns (0/1 Knapsack, Longest Common Subsequence) (25 problems)
- Graph BFS/DFS & Disjoint Set Union (20 problems)
If you solve 150 to 200 questions where you can explain the intuition out loud without looking at solutions, you are in the top 10% of applicants.`,
            is_helpful: true,
            is_accepted: true,
            likes_count: 53,
            created_at: new Date(Date.now() - 86400000 * 1.5).toISOString()
        }
    ],

    comments: [
        {
            id: 'comm-1',
            answer_id: 'ans-1',
            author_id: 'usr-first-1',
            author_name: 'Rahul Gupta',
            content: 'Thank you Aravind bhaiya! That clarifies so much confusion. Going to start with C++ STL thoroughly.',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        }
    ],

    conversations: [
        {
            id: 'conv-1',
            participants: ['usr-first-1', 'usr-placed-1'],
            last_message_text: 'Sure Rahul, share your resume draft and I will review it this Saturday.',
            last_message_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            unread: 0
        }
    ],

    messages: [
        {
            id: 'msg-1',
            conversation_id: 'conv-1',
            sender_id: 'usr-first-1',
            message_text: 'Hello Aravind bhaiya, I saw your answer on C++ vs Java. I wanted to ask how you structured your 1st year holidays?',
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            is_read: true
        },
        {
            id: 'msg-2',
            conversation_id: 'conv-1',
            sender_id: 'usr-placed-1',
            message_text: 'Hey Rahul! In 1st year holidays I focused entirely on mastering arrays, pointers, and building one small terminal project in C++. Keep it consistent for 2 hours daily.',
            created_at: new Date(Date.now() - 3600000 * 4.5).toISOString(),
            is_read: true
        },
        {
            id: 'msg-3',
            conversation_id: 'conv-1',
            sender_id: 'usr-placed-1',
            message_text: 'Sure Rahul, share your resume draft and I will review it this Saturday.',
            created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            is_read: true
        }
    ],

    mentorship_requests: [
        {
            id: 'req-1',
            mentee_id: 'usr-first-1',
            mentee_name: 'Rahul Gupta',
            mentee_role: 'first_year',
            mentor_id: 'usr-placed-1',
            mentor_name: 'Aravind Sharma',
            topic: 'Google Interview Strategy & 1st Year Roadmap',
            message: 'Looking for guidance on how to pace DSA over the next 3 semesters without burning out.',
            status: 'accepted',
            created_at: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
            id: 'req-2',
            mentee_id: 'usr-second-1',
            mentee_name: 'Karthik Nair',
            mentee_role: 'second_year',
            mentor_id: 'usr-placed-2',
            mentor_name: 'Sneha Reddy',
            topic: 'Backend Engineering with Java & Spring Boot',
            message: 'Need advice on transition from console Java to Spring Boot microservices and Azure.',
            status: 'pending',
            created_at: new Date(Date.now() - 86400000 * 1).toISOString()
        }
    ],

    mentorship_sessions: [
        {
            id: 'ses-1',
            request_id: 'req-1',
            mentor_id: 'usr-placed-1',
            mentee_id: 'usr-first-1',
            mentor_name: 'Aravind Sharma',
            mentee_name: 'Rahul Gupta',
            scheduled_time: new Date(Date.now() + 86400000 * 2).toISOString(),
            duration_minutes: 45,
            meeting_link: 'https://meet.google.com/tb-mentor-aravind',
            notes: 'Discussion on 1st-year roadmap, STL syntax habits, and basic git repo setup.',
            status: 'scheduled'
        }
    ],

    roadmaps: [
        {
            id: 'rd-1',
            title: 'First-Year CSE Starter Blueprint',
            slug: 'first-year-cse-starter',
            description: 'Comprehensive foundation for newcomers: mastering C/C++ programming fundamentals, Linux command line, Git & GitHub, and problem-solving thinking.',
            category: 'year_wise',
            target_year: 1,
            estimated_months: 6,
            prerequisites: ['Basic Computer Literacy', 'High School Math'],
            icon_name: 'Terminal',
            is_featured: true,
            milestones: [
                {
                    id: 'm-1-1',
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
                    id: 'm-1-2',
                    milestone_order: 2,
                    title: 'Developer Tooling: Git, GitHub and Linux Basics',
                    description: 'Learn how modern software engineers collaborate, track versions, and navigate Unix terminals.',
                    objectives: ['Learn common Bash commands', 'Understand Git commit, branch, merge, and PRs', 'Create clean GitHub README portfolios'],
                    recommended_topics: ['Linux Terminal Navigation', 'Package Managers', 'Git Version Control', 'SSH Keys and Remote Repositories'],
                    suggested_resources: [
                        { title: 'Missing Semester of Your CS Education (MIT)', url: 'https://missing.csail.mit.edu' }
                    ],
                    suggested_projects: [
                        { title: 'First Open Source Portfolio Repo', description: 'Host a markdown portfolio on GitHub with Git version history.' }
                    ]
                }
            ]
        },
        {
            id: 'rd-2',
            title: 'Second-Year Core CS & DSA Mastery',
            slug: 'second-year-dsa-core-cs',
            description: 'Structured roadmap covering Object-Oriented Programming (Java/C++), Standard Data Structures, Algorithmic Analysis, and Operating Systems.',
            category: 'year_wise',
            target_year: 2,
            estimated_months: 8,
            prerequisites: ['Basic C/C++ or Java Programming', 'Loops & Functions'],
            icon_name: 'Code2',
            is_featured: true,
            milestones: [
                {
                    id: 'm-2-1',
                    milestone_order: 1,
                    title: 'Linear Data Structures & Time Complexity',
                    description: 'Master Big-O notation, memory layout of arrays, linked lists, stacks, and queues.',
                    objectives: ['Calculate Time and Space Complexity', 'Implement Singly and Doubly Linked Lists', 'Solve Stack and Queue problems'],
                    recommended_topics: ['Big-O, Big-Theta', 'Dynamic Arrays', 'Singly/Doubly Linked Lists', 'Stack implementation using Arrays/Nodes'],
                    suggested_resources: [
                        { title: 'NeetCode DSA Roadmap', url: 'https://neetcode.io/roadmap' },
                        { title: 'Striver A2Z DSA Sheet', url: 'https://takeuforward.org' }
                    ],
                    suggested_projects: [
                        { title: 'Infix to Postfix Converter & Expression Evaluator', description: 'Build an arithmetic formula evaluator utilizing stacks.' }
                    ]
                },
                {
                    id: 'm-2-2',
                    milestone_order: 2,
                    title: 'Trees, Graphs, and Recursion',
                    description: 'Conquer hierarchical data structures, binary search trees, graph traversals (BFS/DFS), and recursion.',
                    objectives: ['Understand tree traversals (Inorder, Preorder, Postorder)', 'Grasp Binary Search Trees and balancing', 'Master Graph representations and BFS/DFS'],
                    recommended_topics: ['Binary Trees and BST', 'Recursion and Backtracking', 'Graph BFS & DFS', 'Shortest Path (Dijkstra)'],
                    suggested_resources: [
                        { title: 'VisuAlgo Visual Data Structures', url: 'https://visualgo.net' }
                    ],
                    suggested_projects: [
                        { title: 'Maze Pathfinding Visualizer', description: 'Visualize BFS and DFS searching paths through a custom grid.' }
                    ]
                }
            ]
        },
        {
            id: 'rd-3',
            title: 'Modern Full-Stack Web Development',
            slug: 'full-stack-web-dev',
            description: 'From semantic HTML/CSS and JavaScript ES6+ to React, Node.js, Express, PostgreSQL, REST APIs, authentication and cloud deployment.',
            category: 'career',
            target_year: null,
            estimated_months: 6,
            prerequisites: ['Basic Programming Knowledge'],
            icon_name: 'Globe',
            is_featured: true,
            milestones: [
                {
                    id: 'm-3-1',
                    milestone_order: 1,
                    title: 'Modern JavaScript & Frontend Foundations',
                    description: 'Master ES6+ syntax, asynchronous JS (Promises, async/await), DOM manipulation, and React.js fundamentals.',
                    objectives: ['Understand JS Closures & Event Loop', 'Build component-based UIs with React', 'Manage State with Hooks'],
                    recommended_topics: ['ES6 Syntax', 'Fetch API', 'React Hooks (useState, useEffect, useContext)', 'Tailwind CSS styling'],
                    suggested_resources: [
                        { title: 'The Odin Project', url: 'https://www.theodinproject.com' },
                        { title: 'Full Stack Open (University of Helsinki)', url: 'https://fullstackopen.com/en/' }
                    ],
                    suggested_projects: [
                        { title: 'Interactive Task & Habit Tracker', description: 'A responsive React SPA with local persistence, filtering, and tag management.' }
                    ]
                },
                {
                    id: 'm-3-2',
                    milestone_order: 2,
                    title: 'Node.js, Express & Database Engineering',
                    description: 'Build robust REST APIs, handle JWT / OAuth authentication, connect relational databases with PostgreSQL and Prisma/Supabase.',
                    objectives: ['Build RESTful endpoints with Express', 'Implement JWT auth & role middleware', 'Design normalized relational schemas'],
                    recommended_topics: ['Express Routing & Middleware', 'PostgreSQL Schema & Queries', 'Authentication & Cookies', 'CORS & Security Headers'],
                    suggested_resources: [
                        { title: 'Supabase Official Docs & Tutorials', url: 'https://supabase.com/docs' }
                    ],
                    suggested_projects: [
                        { title: 'E-Commerce / Community Discussion API', description: 'Production-ready REST API with role permissions, pagination, and relational data.' }
                    ]
                }
            ]
        },
        {
            id: 'rd-4',
            title: 'Artificial Intelligence & Machine Learning Track',
            slug: 'ai-machine-learning-track',
            description: 'Mathematics for ML (Linear Algebra, Calculus, Statistics), Python data stack (NumPy, Pandas), Scikit-Learn, Deep Learning with PyTorch, and GenAI basics.',
            category: 'skill_based',
            target_year: null,
            estimated_months: 7,
            prerequisites: ['Python Programming', 'High School Calculus and Statistics'],
            icon_name: 'Cpu',
            is_featured: true,
            milestones: [
                {
                    id: 'm-4-1',
                    milestone_order: 1,
                    title: 'Data Analysis & Classical Machine Learning',
                    description: 'Master NumPy vectorization, Pandas data cleaning, Exploratory Data Analysis, and Scikit-Learn algorithms.',
                    objectives: ['Clean and visualize real-world datasets', 'Implement Regression and Classification', 'Evaluate models using Precision/Recall/F1'],
                    recommended_topics: ['NumPy & Pandas', 'Matplotlib & Seaborn', 'Linear Regression & Logistic Regression', 'Decision Trees & Random Forests'],
                    suggested_resources: [
                        { title: 'Kaggle Learn Courses', url: 'https://www.kaggle.com/learn' }
                    ],
                    suggested_projects: [
                        { title: 'House Price / Student Performance Predictor', description: 'End-to-end ML pipeline with data cleaning, feature engineering, and model evaluation.' }
                    ]
                }
            ]
        }
    ],

    technology_updates: [
        {
            id: 'tech-1',
            title: 'Node.js 22 Promoted to Long Term Support (LTS)',
            description: 'Node.js 22 includes built-in WebSocket client, V8 12.4 engine updates, enhanced ESM support with --experimental-require-module, and improved crypto performance.',
            category: 'Languages & Frameworks',
            source_url: 'https://nodejs.org/en/blog/release/v22.0.0',
            source_name: 'Node.js Foundation',
            is_verified: true,
            published_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
            id: 'tech-2',
            title: 'PostgreSQL 17 Released with Enhanced Query Performance and JSON Features',
            description: 'PostgreSQL 17 features memory management enhancements for vacuuming, enhanced query optimization for subqueries, and standard JSON_TABLE features.',
            category: 'Languages & Frameworks',
            source_url: 'https://www.postgresql.org/about/news/postgresql-17-released-2722/',
            source_name: 'PostgreSQL Global Development Group',
            is_verified: true,
            published_at: new Date(Date.now() - 86400000 * 4).toISOString()
        },
        {
            id: 'tech-3',
            title: 'Google DeepMind Releases Gemini 1.5 Flash and Pro Upgrades',
            description: 'Massive context window improvements up to 2 million tokens, breakthrough multimodal audio/video processing, and high efficiency for developer API workflows.',
            category: 'AI & Emerging',
            source_url: 'https://deepmind.google/technologies/gemini/',
            source_name: 'Google DeepMind',
            is_verified: true,
            published_at: new Date(Date.now() - 86400000 * 6).toISOString()
        },
        {
            id: 'tech-4',
            title: 'Smart India Hackathon (SIH) 2025 Registrations Announced',
            description: 'National level competition by Ministry of Education inviting college student teams to solve real-world problems for government ministries and tech corporations.',
            category: 'Hackathons & Events',
            source_url: 'https://www.sih.gov.in',
            source_name: 'Ministry of Education Innovation Cell',
            is_verified: true,
            published_at: new Date(Date.now() - 86400000 * 7).toISOString()
        },
        {
            id: 'tech-5',
            title: 'Tech Hiring Shift: Rise of Cloud-Native and AI-Integrated Engineering Roles',
            description: 'Industry survey shows strong hiring demand for engineers who combine core CS fundamentals with hands-on containerization (Docker/K8s) and LLM application development.',
            category: 'Job Market',
            source_url: 'https://spectrum.ieee.org',
            source_name: 'IEEE Spectrum',
            is_verified: true,
            published_at: new Date(Date.now() - 86400000 * 9).toISOString()
        }
    ],

    learning_resources: [
        {
            id: 'res-1',
            title: 'CS50: Introduction to Computer Science',
            description: 'Harvard University renowned introductory course on computer science and programming fundamentals taught by David J. Malan.',
            category: 'Video Lectures',
            resource_type: 'course',
            url: 'https://cs50.harvard.edu/x/',
            tags: ['C', 'Python', 'Algorithms', 'Harvard'],
            difficulty: 'all_levels',
            is_free: true,
            likes_count: 85
        },
        {
            id: 'res-2',
            title: 'Striver A2Z DSA Course and Sheet',
            description: 'Most comprehensive structured DSA guide with step-by-step video solutions, problem links, and curated topics from basics to dynamic programming.',
            category: 'Tutorials',
            resource_type: 'website',
            url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
            tags: ['DSA', 'C++', 'Java', 'InterviewPrep'],
            difficulty: 'all_levels',
            is_free: true,
            likes_count: 142
        },
        {
            id: 'res-3',
            title: 'The Odin Project - Full Stack JavaScript',
            description: 'Free, open source, project-driven web development curriculum covering modern JavaScript, React, Node.js, and databases with hands-on Git workflows.',
            category: 'Free Courses',
            resource_type: 'course',
            url: 'https://www.theodinproject.com/',
            tags: ['JavaScript', 'React', 'Node.js', 'WebDev'],
            difficulty: 'all_levels',
            is_free: true,
            likes_count: 119
        },
        {
            id: 'res-4',
            title: 'LeetCode Practice Arena',
            description: 'The global gold standard platform for practicing coding interview questions, company-tagged tests, and biweekly contests.',
            category: 'Coding Platforms',
            resource_type: 'website',
            url: 'https://leetcode.com',
            tags: ['Coding', 'Interviews', 'Algorithms'],
            difficulty: 'all_levels',
            is_free: true,
            likes_count: 210
        },
        {
            id: 'res-5',
            title: 'System Design Primer (GitHub Repository)',
            description: 'Learn how to design large-scale distributed systems. Trusted by over 250,000 developers worldwide for tech interview prep.',
            category: 'Interview Prep',
            resource_type: 'github',
            url: 'https://github.com/donnemartin/system-design-primer',
            tags: ['SystemDesign', 'DistributedSystems', 'Architecture'],
            difficulty: 'intermediate',
            is_free: true,
            likes_count: 310
        }
    ],

    opportunities: [
        {
            id: 'opp-1',
            title: 'Google Summer Student Software Engineering Intern 2025',
            company_name: 'Google India',
            company_logo_url: 'https://www.google.com/favicon.ico',
            opportunity_type: 'internship',
            location: 'Bangalore / Hyderabad',
            stipend_or_salary: 'INR 1,10,000 / month',
            eligibility_criteria: 'Enrolled in a Bachelor or Master program in Computer Science or related STEM field. Graduating in 2026. Strong foundation in algorithms and software engineering.',
            eligible_batches: ['2026'],
            required_skills: ['C++', 'Java', 'Python', 'Algorithms', 'Data Structures'],
            application_deadline: '2025-04-30',
            official_apply_link: 'https://careers.google.com/jobs',
            is_verified: true
        },
        {
            id: 'opp-2',
            title: 'Microsoft Software Engineering Full-time College Graduate',
            company_name: 'Microsoft IDC',
            company_logo_url: 'https://www.microsoft.com/favicon.ico',
            opportunity_type: 'placement',
            location: 'Hyderabad / Noida / Bangalore',
            stipend_or_salary: 'INR 45,00,000 CTC (Base + Stocks + Bonus)',
            eligibility_criteria: 'B.Tech / M.Tech in CSE / IT with minimum 7.5 CGPA. Zero active backlogs. Passing out batch 2025.',
            eligible_batches: ['2025'],
            required_skills: ['Problem Solving', 'Data Structures', 'OOP', 'OS Concepts', 'System Architecture'],
            application_deadline: '2025-05-15',
            official_apply_link: 'https://careers.microsoft.com',
            is_verified: true
        },
        {
            id: 'opp-3',
            title: 'Amazon SDE 6-Month Intern & Off-Campus Drive',
            company_name: 'Amazon Development Centre',
            company_logo_url: 'https://www.amazon.com/favicon.ico',
            opportunity_type: 'internship',
            location: 'Chennai / Bangalore',
            stipend_or_salary: 'INR 80,000 / month',
            eligibility_criteria: 'Penultimate or Final year engineering students. Must clear online assessment and 2 rounds of DSA interviews.',
            eligible_batches: ['2025', '2026'],
            required_skills: ['DSA', 'OOP', 'Code Quality', 'Debugging'],
            application_deadline: '2025-03-31',
            official_apply_link: 'https://amazon.jobs',
            is_verified: true
        }
    ],

    interview_experiences: [
        {
            id: 'exp-1',
            opportunity_id: 'opp-1',
            author_id: 'usr-placed-1',
            author_name: 'Aravind Sharma',
            company_name: 'Google',
            role_applied: 'Software Engineering Intern',
            rounds_description: [
                { round: 1, title: 'Online Assessment', detail: '2 questions on Graph Shortest Path and Dynamic Programming (2D grid).' },
                { round: 2, title: 'Technical Interview 1', detail: 'Tree serialization and Binary Search on custom data structure.' },
                { round: 3, title: 'Technical Interview 2', detail: 'Design an LRU-like cache with TTL expiration. Heavy emphasis on edge cases.' }
            ],
            questions_asked: ['Implement Trie with wildcards', 'Shortest distance in directed acyclic graph', 'Space complexity optimization for sliding window'],
            preparation_tips: 'Speak your thought process aloud before writing code. Test your code with empty inputs and max constraints.',
            outcome: 'Selected'
        }
    ],

    project_ideas: [
        {
            id: 'prj-1',
            title: 'AI-Powered Code Reviewer & Security Linter Bot',
            description: 'A GitHub App that runs automated AST analysis and calls an LLM to review pull requests, detect security vulnerabilities, and suggest optimized refactorings with diffs.',
            difficulty: 'advanced',
            required_technologies: ['Node.js', 'TypeScript', 'GitHub REST/GraphQL API', 'Gemini API', 'Docker'],
            domain: 'AI/ML'
        },
        {
            id: 'prj-2',
            title: 'Collaborative Real-time Canvas & Whiteboard for Devs',
            description: 'A multi-user visual whiteboard for sketching system architecture diagrams, with live cursor tracking, WebSockets, and export to mermaid markdown.',
            difficulty: 'intermediate',
            required_technologies: ['React.js', 'Canvas API / Fabric.js', 'Socket.io / WebSockets', 'Express.js', 'PostgreSQL'],
            domain: 'Web'
        },
        {
            id: 'prj-3',
            title: 'Campus Peer-to-Peer Notes & Question Paper Exchange',
            description: 'A decentralized student repository for verified semester notes, syllabus blueprints, previous question papers, and upvoting quality study notes.',
            difficulty: 'beginner',
            required_technologies: ['React.js', 'Tailwind CSS', 'Node.js', 'Supabase Storage', 'PostgreSQL'],
            domain: 'Web'
        }
    ],

    project_teams: [
        {
            id: 'team-1',
            project_id: 'prj-1',
            title: 'AI Code Reviewer Core Team',
            description: 'Building an open source AI GitHub action that gives smart line-by-line PR feedback. We need a frontend engineer for the analytics dashboard and a backend developer.',
            creator_id: 'usr-final-1',
            creator_name: 'Rohit Verma',
            open_roles: ['Frontend React Engineer', 'DevOps / Docker Specialist'],
            current_members: 2,
            max_members: 4,
            github_repo_url: 'https://github.com/techbridge/ai-reviewer',
            status: 'recruiting'
        }
    ],

    verification_requests: [
        {
            id: 'vreq-1',
            user_id: 'usr-first-1',
            user_name: 'Rahul Gupta',
            email: 'rahul.firstyear@nitw.ac.in',
            role_requested: 'first_year',
            id_card_document_url: 'https://placehold.co/600x400/png?text=NITW+Student+ID+Card',
            college_email: 'rahul.firstyear@nitw.ac.in',
            status: 'approved',
            admin_notes: 'Verified against institute roll number sheet.',
            created_at: new Date(Date.now() - 86400000 * 7).toISOString()
        },
        {
            id: 'vreq-2',
            user_id: 'usr-placed-1',
            user_name: 'Aravind Sharma',
            email: 'aravind.placed@google.com',
            role_requested: 'placed_graduate',
            company_name: 'Google',
            offer_letter_url: 'https://placehold.co/600x400/png?text=Google+Employment+Verification',
            id_card_document_url: 'https://placehold.co/600x400/png?text=Google+Badge',
            status: 'approved',
            admin_notes: 'Corporate email & official offer verification confirmed.',
            created_at: new Date(Date.now() - 86400000 * 14).toISOString()
        }
    ],

    reports: [
        {
            id: 'rep-1',
            reporter_id: 'usr-second-1',
            reporter_name: 'Karthik Nair',
            content_type: 'discussion',
            content_id: 'disc-spam-example',
            reason: 'Irrelevant promotional commercial course spam link',
            status: 'resolved',
            admin_action_taken: 'Post removed and user warned.',
            created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        }
    ],

    notifications: [
        {
            id: 'notif-1',
            user_id: 'usr-first-1',
            title: 'Mentorship Session Confirmed',
            message: 'Aravind Sharma (Google SDE) scheduled a 45-minute 1-on-1 session with you for this Saturday.',
            link_url: '/mentorship',
            notification_type: 'mentorship',
            is_read: false,
            created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
            id: 'notif-2',
            user_id: 'usr-first-1',
            title: 'Senior Answered Your Question',
            message: 'Aravind Sharma answered your question: "Should I learn C++ or Java for DSA and placements?"',
            link_url: '/discussions/disc-1',
            notification_type: 'discussion',
            is_read: true,
            created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        }
    ]
};

module.exports = fallbackData;
