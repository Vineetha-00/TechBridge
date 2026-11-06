-- ====================================================================
-- TECHBRIDGE ROW LEVEL SECURITY (RLS) POLICIES
-- Ensuring Role-Based Access Control and Secure Data Isolation
-- ====================================================================

-- 1. Enable RLS on all relevant tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_guidance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE senior_advice_comparisons ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- PROFILES POLICIES
-- ====================================================================
-- Any authenticated user can view user profiles
CREATE POLICY "Profiles are viewable by authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Users can insert their own profile upon registration
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can update their own profile, or admins can update any profile
CREATE POLICY "Users can update own profile or admins update any"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id OR is_admin())
WITH CHECK (auth.uid() = id OR is_admin());

-- ====================================================================
-- COLLEGES POLICIES
-- ====================================================================
CREATE POLICY "Colleges are readable by authenticated users"
ON colleges FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Colleges can be inserted or updated by admins"
ON colleges FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ====================================================================
-- VERIFICATION REQUESTS POLICIES
-- ====================================================================
-- Users can see their own verification requests; Admins can see all
CREATE POLICY "Users view own verification requests, admins view all"
ON verification_requests FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin());

-- Users can create a verification request
CREATE POLICY "Users can submit verification request"
ON verification_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only admins can update verification status (approve / reject)
CREATE POLICY "Only admins can update verification requests"
ON verification_requests FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ====================================================================
-- DISCUSSIONS & ANSWERS & COMMENTS POLICIES
-- ====================================================================
CREATE POLICY "Discussions are viewable by all authenticated users"
ON discussions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create discussions"
ON discussions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors or admins can update discussions"
ON discussions FOR UPDATE
TO authenticated
USING (auth.uid() = author_id OR is_admin());

CREATE POLICY "Authors or admins can delete discussions"
ON discussions FOR DELETE
TO authenticated
USING (auth.uid() = author_id OR is_admin());

-- Answers
CREATE POLICY "Answers are viewable by all authenticated users"
ON answers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can post answers"
ON answers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors or admins can update answers"
ON answers FOR UPDATE
TO authenticated
USING (auth.uid() = author_id OR is_admin());

CREATE POLICY "Authors or admins can delete answers"
ON answers FOR DELETE
TO authenticated
USING (auth.uid() = author_id OR is_admin());

-- Comments
CREATE POLICY "Comments viewable by all authenticated users"
ON comments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can post comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Likes & Bookmarks
CREATE POLICY "User likes and bookmarks manage own"
ON discussion_likes FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Answer likes manage own"
ON answer_likes FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Bookmarks manage own"
ON bookmarks FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- PRIVATE CHAT POLICIES (Strict Isolation)
-- ====================================================================
CREATE POLICY "Users can see conversations they belong to"
ON conversations FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM conversation_participants
        WHERE conversation_id = conversations.id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can view participants of their conversations"
ON conversation_participants FOR SELECT
TO authenticated
USING (
    conversation_id IN (
        SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert participants for new conversations"
ON conversation_participants FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can read messages in their conversations only"
ON messages FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM conversation_participants
        WHERE conversation_id = messages.conversation_id
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can send messages to their conversations"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM conversation_participants
        WHERE conversation_id = messages.conversation_id
        AND user_id = auth.uid()
    )
);

-- ====================================================================
-- MENTORSHIP POLICIES
-- ====================================================================
CREATE POLICY "Mentorship requests viewable by participants or admin"
ON mentorship_requests FOR SELECT
TO authenticated
USING (auth.uid() = mentee_id OR auth.uid() = mentor_id OR is_admin());

CREATE POLICY "Mentees can create mentorship requests"
ON mentorship_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Participants can update mentorship requests"
ON mentorship_requests FOR UPDATE
TO authenticated
USING (auth.uid() = mentee_id OR auth.uid() = mentor_id OR is_admin());

CREATE POLICY "Mentorship sessions viewable by participants or admin"
ON mentorship_sessions FOR SELECT
TO authenticated
USING (auth.uid() = mentee_id OR auth.uid() = mentor_id OR is_admin());

CREATE POLICY "Participants or admins can schedule/manage sessions"
ON mentorship_sessions FOR ALL
TO authenticated
USING (auth.uid() = mentor_id OR auth.uid() = mentee_id OR is_admin());

-- ====================================================================
-- ROADMAPS & PROGRESS
-- ====================================================================
CREATE POLICY "Roadmaps are viewable by everyone"
ON roadmaps FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Milestones are viewable by everyone"
ON roadmap_milestones FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Students manage their own roadmap progress"
ON student_roadmap_progress FOR ALL
TO authenticated
USING (auth.uid() = user_id OR is_admin())
WITH CHECK (auth.uid() = user_id OR is_admin());

-- ====================================================================
-- TECHNOLOGY UPDATES, RESOURCES & OPPORTUNITIES
-- ====================================================================
CREATE POLICY "Tech updates are viewable by all"
ON technology_updates FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins or verified seniors can manage tech updates"
ON technology_updates FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Resources are viewable by all"
ON learning_resources FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can suggest resources"
ON learning_resources FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Opportunities viewable by all"
ON opportunities FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Verified seniors or admins can post opportunities"
ON opportunities FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = posted_by OR is_admin());

CREATE POLICY "Interview experiences viewable by all"
ON interview_experiences FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authors can create interview experiences"
ON interview_experiences FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- ====================================================================
-- PROJECTS & COLLABORATION
-- ====================================================================
CREATE POLICY "Projects and teams viewable by all"
ON project_ideas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Project teams viewable by all"
ON project_teams FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create project teams"
ON project_teams FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update project teams"
ON project_teams FOR UPDATE
TO authenticated
USING (auth.uid() = creator_id OR is_admin());

CREATE POLICY "Collaboration requests viewable by team creator or applicant"
ON project_collaboration_requests FOR SELECT
TO authenticated
USING (
    auth.uid() = applicant_id OR
    EXISTS (SELECT 1 FROM project_teams WHERE id = team_id AND creator_id = auth.uid())
);

CREATE POLICY "Users can apply for collaboration"
ON project_collaboration_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = applicant_id);

-- ====================================================================
-- NOTIFICATIONS & REPORTS & AI SESSIONS
-- ====================================================================
CREATE POLICY "Users view and manage their own notifications"
ON notifications FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can report content"
ON reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Only admins view and manage reports"
ON reports FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Users manage their own AI sessions"
ON ai_guidance_sessions FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage their own advice comparisons"
ON senior_advice_comparisons FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

