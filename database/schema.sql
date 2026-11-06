-- ====================================================================
-- TECHBRIDGE DATABASE SCHEMA (PostgreSQL / Supabase)
-- "Connect with experience. Learn with direction. Build your future."
-- ====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. ENUMS FOR ROLES, STATUSES, AND CATEGORIES
-- ====================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'first_year',
        'second_year',
        'third_year',
        'final_year',
        'placed_graduate',
        'admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM (
        'pending',
        'approved',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mentorship_request_status AS ENUM (
        'pending',
        'accepted',
        'rejected',
        'completed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE opportunity_type AS ENUM (
        'internship',
        'placement',
        'hackathon',
        'fellowship'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_difficulty AS ENUM (
        'beginner',
        'intermediate',
        'advanced'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM (
        'pending',
        'reviewed',
        'dismissed',
        'resolved'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ====================================================================
-- 2. COLLEGES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50),
    city VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 3. USERS & PROFILES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role user_role NOT NULL DEFAULT 'first_year',
    college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
    college_name VARCHAR(255),
    academic_year INT CHECK (academic_year BETWEEN 1 AND 4),
    branch VARCHAR(100) DEFAULT 'Computer Science and Engineering',
    student_id_number VARCHAR(100),
    college_email VARCHAR(255),
    
    -- Specific to placed graduates
    placed_company VARCHAR(150),
    job_designation VARCHAR(150),
    package_lpa NUMERIC(5,2),
    offer_letter_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    
    -- Skills and Interests (array of strings)
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    
    -- Verification details
    is_verified BOOLEAN DEFAULT FALSE,
    id_card_url TEXT,
    verification_status verification_status DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Mentorship settings
    is_open_to_mentor BOOLEAN DEFAULT FALSE,
    mentor_topics TEXT[] DEFAULT '{}',
    max_mentees INT DEFAULT 3,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for profile searches and role filtering
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_college ON profiles(college_id);
CREATE INDEX IF NOT EXISTS idx_profiles_mentor ON profiles(is_open_to_mentor);

-- ====================================================================
-- 4. VERIFICATION REQUESTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_requested user_role NOT NULL,
    id_card_document_url TEXT NOT NULL,
    college_email VARCHAR(255),
    company_name VARCHAR(150),
    offer_letter_url TEXT,
    status verification_status DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(status);

-- ====================================================================
-- 5. DISCUSSION FORUM (Questions, Answers, Comments, Likes)
-- ====================================================================
CREATE TABLE IF NOT EXISTS discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'Web Dev', 'DSA', 'Placements', 'AI/ML'
    tags TEXT[] DEFAULT '{}',
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    answers_count INT DEFAULT 0,
    is_resolved BOOLEAN DEFAULT FALSE,
    has_verified_senior_answer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions(category);
CREATE INDEX IF NOT EXISTS idx_discussions_author ON discussions(author_id);
CREATE INDEX IF NOT EXISTS idx_discussions_created ON discussions(created_at DESC);

CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_helpful BOOLEAN DEFAULT FALSE,
    is_accepted BOOLEAN DEFAULT FALSE,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answers_discussion ON answers(discussion_id);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discussion_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, discussion_id)
);

CREATE TABLE IF NOT EXISTS answer_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    answer_id UUID NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, answer_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, discussion_id)
);

-- ====================================================================
-- 6. PRIVATE CHAT (Conversations, Participants, Messages)
-- ====================================================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_text TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    unread_count INT DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_participants_user ON conversation_participants(user_id);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, created_at ASC);

-- ====================================================================
-- 7. MENTORSHIP SYSTEM
-- ====================================================================
CREATE TABLE IF NOT EXISTS mentorship_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    topic VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status mentorship_request_status DEFAULT 'pending',
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mentor_requests_mentor ON mentorship_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_requests_mentee ON mentorship_requests(mentee_id);

CREATE TABLE IF NOT EXISTS mentorship_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES mentorship_requests(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 45,
    meeting_link TEXT,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 8. LEARNING ROADMAPS & STUDENT PROGRESS
-- ====================================================================
CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'career', 'year_wise', 'skill_based', 'ai_personalized'
    target_year INT, -- 1, 2, 3, 4 (null if generic)
    estimated_months INT,
    prerequisites TEXT[] DEFAULT '{}',
    icon_name VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roadmap_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    milestone_order INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    objectives TEXT[] DEFAULT '{}',
    recommended_topics TEXT[] DEFAULT '{}',
    suggested_resources JSONB DEFAULT '[]'::jsonb,
    suggested_projects JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestones_roadmap ON roadmap_milestones(roadmap_id, milestone_order ASC);

CREATE TABLE IF NOT EXISTS student_roadmap_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    completed_milestones UUID[] DEFAULT '{}',
    current_milestone_id UUID REFERENCES roadmap_milestones(id) ON DELETE SET NULL,
    progress_percentage NUMERIC(5,2) DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, roadmap_id)
);

-- ====================================================================
-- 9. TECHNOLOGY UPDATES
-- ====================================================================
CREATE TABLE IF NOT EXISTS technology_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Languages & Frameworks', 'AI & Emerging', 'Industry Trends', 'Job Market', 'Hackathons & Events'
    source_url TEXT NOT NULL,
    source_name VARCHAR(150),
    is_verified BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tech_updates_cat ON technology_updates(category);

-- ====================================================================
-- 10. RESOURCES HUB
-- ====================================================================
CREATE TABLE IF NOT EXISTS learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- 'Tutorials', 'Documentation', 'Free Courses', 'Coding Platforms', 'Books', 'Video Lectures', 'Interview Prep'
    resource_type VARCHAR(50) NOT NULL, -- 'website', 'pdf', 'video', 'course', 'github'
    url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    difficulty VARCHAR(50) DEFAULT 'all_levels',
    is_free BOOLEAN DEFAULT TRUE,
    submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_cat ON learning_resources(category);

-- ====================================================================
-- 11. INTERNSHIP & PLACEMENT OPPORTUNITIES
-- ====================================================================
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    company_logo_url TEXT,
    opportunity_type opportunity_type NOT NULL,
    location VARCHAR(150),
    stipend_or_salary VARCHAR(100),
    eligibility_criteria TEXT NOT NULL,
    eligible_batches TEXT[] DEFAULT '{}',
    required_skills TEXT[] DEFAULT '{}',
    application_deadline DATE,
    official_apply_link TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    posted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interview_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    role_applied VARCHAR(150) NOT NULL,
    rounds_description JSONB DEFAULT '[]'::jsonb,
    questions_asked TEXT[] DEFAULT '{}',
    preparation_tips TEXT,
    outcome VARCHAR(50), -- 'Selected', 'Rejected', 'Pending'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 12. PROJECT IDEAS & COLLABORATION
-- ====================================================================
CREATE TABLE IF NOT EXISTS project_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty project_difficulty NOT NULL,
    required_technologies TEXT[] DEFAULT '{}',
    domain VARCHAR(100), -- 'Web', 'Mobile', 'AI/ML', 'Blockchain', 'IoT', 'Cloud'
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES project_ideas(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    open_roles TEXT[] DEFAULT '{}',
    current_members INT DEFAULT 1,
    max_members INT DEFAULT 4,
    github_repo_url TEXT,
    status VARCHAR(50) DEFAULT 'recruiting', -- 'recruiting', 'in_progress', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_collaboration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES project_teams(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_applied_for VARCHAR(100) NOT NULL,
    pitch_message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 13. NOTIFICATIONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    notification_type VARCHAR(50), -- 'mentorship', 'chat', 'discussion', 'verification', 'system'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- ====================================================================
-- 14. REPORTS & MODERATION
-- ====================================================================
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- 'discussion', 'answer', 'message', 'user'
    content_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status report_status DEFAULT 'pending',
    admin_action_taken TEXT,
    resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 15. AI GUIDANCE HISTORY & ADVICE SYNTHESIS
-- ====================================================================
CREATE TABLE IF NOT EXISTS ai_guidance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_title VARCHAR(200) DEFAULT 'Career Advisory Session',
    student_context JSONB DEFAULT '{}'::jsonb,
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS senior_advice_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    senior_advices JSONB NOT NULL, -- Array of { senior_id, senior_name, advice_text, role }
    common_recommendations TEXT[] DEFAULT '{}',
    differences_explained TEXT,
    personalized_action_plan TEXT,
    facts_vs_opinions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TRIGGERS TO UPDATE updated_at TIMESTAMP
-- ====================================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_discussions_timestamp BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_answers_timestamp BEFORE UPDATE ON answers FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_conversations_timestamp BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_mentorship_requests_timestamp BEFORE UPDATE ON mentorship_requests FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_project_teams_timestamp BEFORE UPDATE ON project_teams FOR EACH ROW EXECUTE FUNCTION update_timestamp();
