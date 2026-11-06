export const USER_ROLES = {
  first_year: {
    key: 'first_year',
    label: '1st Year CSE',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    description: 'Freshman building foundational logic, C/C++ programming & CS basics.'
  },
  second_year: {
    key: 'second_year',
    label: '2nd Year CSE',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    description: 'Sophomore mastering DSA, Object-Oriented Design, OS & DBMS.'
  },
  third_year: {
    key: 'third_year',
    label: '3rd Year CSE',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    description: 'Junior preparing for summer internship OAs, capstone projects & full-stack.'
  },
  final_year: {
    key: 'final_year',
    label: 'Final Year CSE',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    description: 'Senior preparing for campus placements, system design & offer negotiation.'
  },
  placed_graduate: {
    key: 'placed_graduate',
    label: 'Placed Graduate',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    description: 'Industry engineer sharing interview patterns, corporate realities & referrals.'
  },
  admin: {
    key: 'admin',
    label: 'Administrator',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    description: 'Platform moderator ensuring student safety, verification and mentorship quality.'
  }
};

export const DISCUSSION_CATEGORIES = [
  'All',
  'DSA',
  'Placements',
  'Web Development',
  'AI / ML',
  'Core CS (OS/DBMS/CN)',
  'Open Source & Git',
  'Internships'
];

export const TECH_UPDATE_CATEGORIES = [
  'All',
  'Languages & Frameworks',
  'AI & Emerging',
  'Industry Trends',
  'Job Market',
  'Hackathons & Events'
];

export const RESOURCE_CATEGORIES = [
  'All',
  'Tutorials',
  'Documentation',
  'Free Courses',
  'Coding Platforms',
  'Books',
  'Video Lectures',
  'Interview Prep'
];

export const DEMO_ACCOUNTS = [
  {
    id: 'usr-first-1',
    name: 'Rahul Gupta',
    role: 'first_year',
    roleLabel: '1st Year Student',
    email: 'rahul.firstyear@nitw.ac.in',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    note: 'Curious beginner seeking guidance on C++ vs Java & DSA.'
  },
  {
    id: 'usr-placed-1',
    name: 'Aravind Sharma',
    role: 'placed_graduate',
    roleLabel: 'SDE-1 @ Google',
    email: 'aravind.placed@google.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    note: 'Verified Mentor & SDE at Google India.'
  },
  {
    id: 'usr-placed-2',
    name: 'Sneha Reddy',
    role: 'placed_graduate',
    roleLabel: 'Software Engineer @ Microsoft',
    email: 'sneha.reddy@microsoft.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    note: 'Cloud & AI Engineer at Microsoft.'
  },
  {
    id: 'usr-final-1',
    name: 'Rohit Verma',
    role: 'final_year',
    roleLabel: 'Final Year (Amazon PPO)',
    email: 'rohit.finalyear@nitw.ac.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    note: 'Upcoming SDE at Amazon & Full Stack lead.'
  },
  {
    id: 'usr-admin',
    name: 'Dr. Ramesh Kumar',
    role: 'admin',
    roleLabel: 'Platform Administrator',
    email: 'admin@techbridge.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    note: 'Admin with verification, moderation & analytics access.'
  }
];

