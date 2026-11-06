const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Get Mentors (placed graduates, final year, third year seniors who are open to mentorship)
 */
exports.getMentors = async (req, res) => {
    try {
        const { role, company, skill, search } = req.query;

        if (isSupabaseConfigured) {
            let query = supabase
                .from('profiles')
                .select('*')
                .eq('is_open_to_mentor', true);

            if (role) query = query.eq('role', role);
            if (company) query = query.ilike('placed_company', `%${company}%`);

            const { data, error } = await query;
            if (error) throw error;
            return res.json({ success: true, mentors: data });
        }

        let mentors = fallbackData.users.filter(u => u.is_open_to_mentor);

        if (role) {
            mentors = mentors.filter(m => m.role === role);
        }
        if (company) {
            mentors = mentors.filter(m => m.placed_company && m.placed_company.toLowerCase().includes(company.toLowerCase()));
        }
        if (skill) {
            mentors = mentors.filter(m => m.skills && m.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
        }
        if (search) {
            const s = search.toLowerCase();
            mentors = mentors.filter(m =>
                m.full_name.toLowerCase().includes(s) ||
                (m.bio && m.bio.toLowerCase().includes(s)) ||
                (m.placed_company && m.placed_company.toLowerCase().includes(s))
            );
        }

        res.json({ success: true, mentors });
    } catch (err) {
        console.error('getMentors error:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve mentors.' });
    }
};

/**
 * Get specific user profile by ID
 */
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isSupabaseConfigured) {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
            if (error) return res.status(404).json({ success: false, message: 'User not found.' });
            return res.json({ success: true, user: data });
        }

        const user = fallbackData.users.find(u => u.id === id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching user.' });
    }
};

/**
 * Get list of colleges
 */
exports.getColleges = async (req, res) => {
    try {
        if (isSupabaseConfigured) {
            const { data, error } = await supabase.from('colleges').select('*');
            if (error) throw error;
            return res.json({ success: true, colleges: data });
        }
        res.json({ success: true, colleges: fallbackData.colleges });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching colleges.' });
    }
};

/**
 * Get student dashboard summary
 */
exports.getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user?.id || 'usr-first-1';
        const user = req.user;

        const recentDiscussions = fallbackData.discussions.slice(0, 3);
        const recommendedMentors = fallbackData.users.filter(u => u.is_open_to_mentor).slice(0, 3);
        const trendingTech = fallbackData.technology_updates.slice(0, 3);
        const userNotifications = fallbackData.notifications.filter(n => n.user_id === userId);

        res.json({
            success: true,
            user,
            recentDiscussions,
            recommendedMentors,
            trendingTech,
            notifications: userNotifications,
            stats: {
                activeDiscussions: fallbackData.discussions.length,
                availableMentors: fallbackData.users.filter(u => u.is_open_to_mentor).length,
                verifiedOpportunities: fallbackData.opportunities.length,
                roadmapsCount: fallbackData.roadmaps.length
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error generating dashboard summary.' });
    }
};
