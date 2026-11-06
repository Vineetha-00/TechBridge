# TechBridge
### AI-Powered Student Guidance, Mentorship and Experience-Sharing Platform

> **Core Philosophy:** *"Connect with experience. Learn with direction. Build your future."*

TechBridge is an end-to-end full-stack web application designed specifically for Computer Science & Engineering (CSE) students. It connects beginners with seniors, final-year peers, and placed graduates at top tech companies (Google, Microsoft, Amazon), while leveraging an integrated AI Guidance Engine to synthesize conflicting advice into actionable learning roadmaps.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, Lucide React, React Router 6 |
| **Backend** | Node.js, Express.js, Axios, CORS, Dotenv |
| **Database & Auth** | Supabase (PostgreSQL, Supabase Auth, Row Level Security) |
| **AI Integration** | Google Gemini 1.5 Flash API + Deterministic CSE Fallback Engine |
| **Security** | Row Level Security (RLS) policies, JWT middleware, Role-Based Access Control |

---

## 📁 Project Directory Structure

```text
TechBridge/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js          # Supabase client initialization & connection checks
│   │   │   └── ai.js                # External AI (Gemini) configuration
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, login, profile updates, ID proof upload
│   │   │   ├── userController.js    # Mentors directory, student summary, colleges list
│   │   │   ├── discussionController.js # Questions, answers, comments, helpful marking
│   │   │   ├── chatController.js    # 1-on-1 private messaging, blocking, history
│   │   │   ├── mentorshipController.js # Mentorship requests & scheduled video calls
│   │   │   ├── aiController.js      # AI Career guidance & Senior Advice Synthesizer
│   │   │   ├── roadmapController.js # Year-wise & skill roadmaps, progress saving
│   │   │   ├── techUpdateController.js # Verified releases & tech industry updates
│   │   │   ├── resourceController.js # Curated tutorials, books, LeetCode sheets
│   │   │   ├── opportunityController.js # Internships, job drives, interview experiences
│   │   │   ├── projectController.js # Project ideas library & peer team collaboration
│   │   │   └── adminController.js   # User verification queue, moderation & metrics
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification & demo session injector
│   │   │   ├── roleMiddleware.js    # Role-Based Access Control (Admin, Placed, etc.)
│   │   │   └── errorHandler.js      # Centralized error handler
│   │   ├── routes/                  # Express route routers for all modules
│   │   ├── services/
│   │   │   └── aiService.js         # Gemini API connector & Senior Advice comparator
│   │   ├── utils/
│   │   │   └── fallbackData.js      # Out-of-the-box seed store for instant testing
│   │   └── server.js                # Master Express server entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/                      # Static assets and favicons
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Navbar.jsx       # Header, role switcher, notifications, theme toggle
│   │   │       ├── Sidebar.jsx      # Navigation sidebar for all student modules
│   │   │       ├── Footer.jsx       # Platform footer
│   │   │       └── Badge.jsx        # Role & verification badges
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Active user session & demo role switching
│   │   │   ├── ThemeContext.jsx     # Dark mode / Light mode manager
│   │   │   └── NotificationContext.jsx # Real-time alerts & unread badges
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Landing page with core philosophy & metrics
│   │   │   ├── LoginPage.jsx        # Sign in with 1-click test credentials
│   │   │   ├── RegisterPage.jsx     # Multi-role student & placed senior onboarding
│   │   │   ├── StudentDashboardPage.jsx # Module B: Personalized student dashboard
│   │   │   ├── DiscussionsPage.jsx  # Module C: Senior-junior Q&A forum
│   │   │   ├── DiscussionDetailPage.jsx # Verified answer views & comment threads
│   │   │   ├── ChatPage.jsx         # Module C: Private 1-on-1 chat with blocking
│   │   │   ├── MentorshipPage.jsx   # Module C: Senior discovery & 1-on-1 bookings
│   │   │   ├── AICareerGuidancePage.jsx # Module D: Chatbot & Advice Synthesizer
│   │   │   ├── LearningRoadmapsPage.jsx # Module E: Year 1-4 & skill roadmap cards
│   │   │   ├── RoadmapDetailPage.jsx # Milestone progress bar & interactive checkboxes
│   │   │   ├── TechUpdatesPage.jsx  # Module F: Verified technology updates & sources
│   │   │   ├── ResourcesHubPage.jsx # Module G: Curated tutorials & practice sheets
│   │   │   ├── OpportunitiesPage.jsx # Module H: Off-campus drives & interview rounds
│   │   │   ├── ProjectHubPage.jsx   # Module I: Project idea library & team builder
│   │   │   ├── ProfilePage.jsx      # Student profile & ID document verification
│   │   │   ├── AdminDashboardPage.jsx # Module 5: Admin verification queue & moderation
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   ├── api.js               # Central Axios client with auth interceptor
│   │   │   └── supabaseClient.js    # Supabase JavaScript client
│   │   ├── styles/
│   │   │   └── index.css            # Tailwind directives & typography
│   │   ├── utils/
│   │   │   └── constants.js         # Roles, categories, demo account presets
│   │   ├── App.jsx                  # Master React Router mapping
│   │   └── main.jsx                 # Application root mounting
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── 01_schema.sql                # Complete PostgreSQL tables, enums, indexes, triggers
│   ├── 02_policies.sql              # Supabase Row Level Security (RLS) policies
│   └── 03_seed_data.sql             # Real sample data (Colleges, Google SDEs, questions)
│
├── .env.example                     # Global template for environment variables
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide (For Beginners)

Both the backend and frontend are fully implemented and can be launched immediately.

### Prerequisites:
- **Node.js**: v18+ (Node.js LTS is installed in your workspace)
- **Git**

---

### Step 1: Start the Backend API Server

Open PowerShell or terminal in the project directory:

```powershell
cd "c:\Users\kolli\OneDrive\Desktop\Smart Education\backend"
npm start
```

*The backend will boot on port 5000:*
```text
🚀 TechBridge Backend API Server is running on port 5000
🔗 Health Check: http://localhost:5000/api/health
```

---

### Step 2: Start the React Frontend

Open a second PowerShell or terminal window:

```powershell
cd "c:\Users\kolli\OneDrive\Desktop\Smart Education\frontend"
npm run dev
```

*Vite will start your application:*
```text
  VITE v6.4.5  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 🧪 Testing User Roles with One Click

TechBridge features **6 user roles** with distinct capabilities:
1. `first_year`: 1st-Year CSE Student (foundation focus)
2. `second_year`: 2nd-Year CSE Student (core CS & DSA)
3. `third_year`: 3rd-Year CSE Student (internship preparation)
4. `final_year`: Final-Year CSE Student (campus placements)
5. `placed_graduate`: Placed Senior (Google, Microsoft, Amazon mentors)
6. `admin`: Department Administrator (governance & moderation)

### Quick Role Switcher:
At the top right of the navigation bar, click the **"Role: [Current Role]"** dropdown button to instantly switch between demo personas:
- **Rahul Gupta** (1st Year CSE Student)
- **Aravind Sharma** (SDE-1 @ Google India, Verified Mentor)
- **Sneha Reddy** (Software Engineer @ Microsoft Cloud)
- **Rohit Verma** (Final Year, Amazon PPO)
- **Dr. Ramesh Kumar** (Platform Administrator)

---

## 🗄️ Supabase PostgreSQL Setup Instructions

To connect your own free Supabase cloud database:

1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and name it `techbridge`.
3. Go to the **SQL Editor** tab in the Supabase Dashboard.
4. Copy and run the scripts in order:
   - Run `database/01_schema.sql` (creates all tables, enums, and foreign keys).
   - Run `database/02_policies.sql` (enables Row Level Security and permission policies).
   - Run `database/03_seed_data.sql` (seeds colleges, roadmaps, questions, and opportunities).
5. In your Supabase Project Settings, navigate to **API** and copy:
   - **Project URL**
   - **anon public key**
   - **service_role secret key**
6. Paste these into your `backend/.env` and `frontend/.env` files:
   ```ini
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-public-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   ```

*Note: If credentials are not yet entered, TechBridge runs seamlessly in local mode using `backend/src/utils/fallbackData.js`, so you can develop and test immediately.*

---

## 🤖 External AI (Google Gemini) Setup

TechBridge features an integrated AI Career Guidance Advisor and a unique **Senior Advice Synthesizer & Fact-Checker**.

To connect your free Google Gemini API key:
1. Visit [Google AI Studio](https://aistudio.google.com/) and click **Get API Key**.
2. Create a free API key.
3. Open `backend/.env` and insert your key:
   ```ini
   GEMINI_API_KEY=AIzaSy...your-gemini-key
   AI_MODEL=gemini-1.5-flash
   ```
4. Restart the backend (`npm start`).

*Note: If no API key is provided, the backend automatically engages its built-in intelligent CSE Guidance Engine, providing accurate year-by-year benchmarks and senior advice comparisons.*

---

## 🎯 Major Features Walkthrough

### 1. Student Dashboard (`/dashboard`)
- Personalized welcome banner tailored to your academic year.
- Real-time profile summary with verification badge.
- Recent discussions with verified senior answers.
- Recommended mentors with one-click connect.

### 2. Senior-Junior Interaction (`/discussions` & `/chat`)
- **Discussion Forum**: Filter by category (`DSA`, `Placements`, `WebDev`, `AI/ML`), search questions, post answers, upvote, and mark answers as helpful.
- **Private Chat**: 1-on-1 messaging with real-time bubble updates, conversation history, and student safety tools (block user and report content).

### 3. Mentorship System (`/mentorship`)
- Discover verified seniors and filter by company (Google, Microsoft, Amazon).
- Submit 1-on-1 guidance requests with custom topics.
- Accept or decline requests and schedule video call sessions with Google Meet links.

### 4. AI Career Advisor & Advice Synthesizer (`/ai-guidance`)
- **AI Chatbot**: Tailored career recommendations taking into account academic year, existing skills, and career goals.
- **Senior Advice Synthesizer (Unique Feature)**: When you hear conflicting advice from seniors (e.g. C++ vs Java), paste both viewpoints. The AI will:
  1. Extract **common recommendations** where seniors agree.
  2. Explain **differences and tradeoffs** objectively.
  3. Classify statements into **verified facts** vs. **personal opinions**.
  4. Generate a **personalized step-by-step action plan**.

### 5. Interactive Learning Roadmaps (`/roadmaps`)
- 1st-Year Starter, 2nd-Year Core CS & DSA, 3rd-Year Internships, 4th-Year Placements, and Full-Stack tracks.
- Check off milestones to see your personal progress bar update and persist!

### 6. Technology Updates (`/tech-updates`)
- Verified releases (Node.js 22 LTS, PostgreSQL 17, Gemini 1.5, Smart India Hackathon) linked to legitimate official sources.

### 7. Curated Resources Hub (`/resources`)
- Tutorials, free courses, LeetCode sheets, and system design primers with difficulty filters.

### 8. Internships & Placement Opportunities (`/opportunities`)
- Verified hiring drives with eligibility criteria, eligible batches, deadlines, and official application portals.
- Real interview experiences with round-by-round walkthroughs.

### 9. Project Hub & Team Formation (`/projects`)
- Difficulty-rated project idea library.
- Collaborative teams recruiting frontend, backend, and ML developers with GitHub repo links.

### 10. Administrator Governance (`/admin`)
- Accessible when switched to the **Administrator** role.
- Student ID & placed graduate verification queue with 1-click Approve / Reject.
- User permission and role management.
- Content moderation and incident reporting.

---

## 🚀 Deployment Instructions

### Deploy Frontend (Vercel / Netlify)
1. Push your repository to GitHub.
2. Link the repository on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set the root directory to `frontend`.
4. Build command: `npm run build`, Output directory: `dist`.
5. Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`.

### Deploy Backend (Railway / Render)
1. Set the root directory to `backend`.
2. Start command: `node src/server.js`.
3. Add environment variables from `backend/.env.example`.

---

## 📜 License
MIT License. Created for Computer Science & Engineering students worldwide.
