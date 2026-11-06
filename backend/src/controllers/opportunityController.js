const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Get internship and placement opportunities
 */
exports.getOpportunities = async (req, res) => {
    try {
        const { type, search, batch } = req.query;

        let list = [...fallbackData.opportunities];

        if (type && type !== 'All') {
            list = list.filter(o => o.opportunity_type.toLowerCase() === type.toLowerCase());
        }
        if (batch) {
            list = list.filter(o => o.eligible_batches && o.eligible_batches.includes(batch));
        }
        if (search) {
            const s = search.toLowerCase();
            list = list.filter(o =>
                o.title.toLowerCase().includes(s) ||
                o.company_name.toLowerCase().includes(s) ||
                o.eligibility_criteria.toLowerCase().includes(s)
            );
        }

        res.json({ success: true, opportunities: list });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve opportunities.' });
    }
};

/**
 * Post a new opportunity (Admin or verified placed graduates)
 */
exports.createOpportunity = async (req, res) => {
    try {
        const {
            title,
            company_name,
            opportunity_type = 'internship',
            location,
            stipend_or_salary,
            eligibility_criteria,
            eligible_batches = [],
            required_skills = [],
            application_deadline,
            official_apply_link
        } = req.body;

        if (!title || !company_name || !official_apply_link || !eligibility_criteria) {
            return res.status(400).json({
                success: false,
                message: 'Title, company name, official application link, and eligibility criteria are required.'
            });
        }

        const newOpp = {
            id: `opp-${Date.now()}`,
            title,
            company_name,
            company_logo_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(company_name)}`,
            opportunity_type,
            location: location || 'Remote / Hybrid',
            stipend_or_salary,
            eligibility_criteria,
            eligible_batches: Array.isArray(eligible_batches) ? eligible_batches : [eligible_batches],
            required_skills: Array.isArray(required_skills) ? required_skills : [required_skills],
            application_deadline,
            official_apply_link,
            is_verified: req.user?.role === 'admin' || req.user?.role === 'placed_graduate'
        };

        fallbackData.opportunities.unshift(newOpp);

        res.status(201).json({
            success: true,
            message: 'Opportunity listed successfully!',
            opportunity: newOpp
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create opportunity.' });
    }
};

/**
 * Get interview experiences
 */
exports.getInterviewExperiences = async (req, res) => {
    try {
        const { company } = req.query;
        let list = [...fallbackData.interview_experiences];

        if (company) {
            list = list.filter(e => e.company_name.toLowerCase().includes(company.toLowerCase()));
        }

        res.json({ success: true, experiences: list });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load interview experiences.' });
    }
};

/**
 * Share a new interview experience (Seniors / Placed Graduates)
 */
exports.createInterviewExperience = async (req, res) => {
    try {
        const { company_name, role_applied, rounds_description, questions_asked = [], preparation_tips, outcome } = req.body;

        if (!company_name || !role_applied) {
            return res.status(400).json({ success: false, message: 'Company name and role applied are required.' });
        }

        const newExp = {
            id: `exp-${Date.now()}`,
            author_id: req.user.id,
            author_name: req.user.full_name,
            company_name,
            role_applied,
            rounds_description: rounds_description || [],
            questions_asked: Array.isArray(questions_asked) ? questions_asked : [questions_asked],
            preparation_tips,
            outcome: outcome || 'Selected',
            created_at: new Date().toISOString()
        };

        fallbackData.interview_experiences.unshift(newExp);

        res.status(201).json({
            success: true,
            message: 'Interview experience published! Thank you for helping your juniors.',
            experience: newExp
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to submit interview experience.' });
    }
};
