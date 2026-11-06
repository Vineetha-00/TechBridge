const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Get project ideas and collaborative teams
 */
exports.getProjects = async (req, res) => {
    try {
        const { difficulty, domain, search } = req.query;

        let ideas = [...fallbackData.project_ideas];

        if (difficulty && difficulty !== 'All') {
            ideas = ideas.filter(p => p.difficulty === difficulty.toLowerCase());
        }
        if (domain && domain !== 'All') {
            ideas = ideas.filter(p => p.domain?.toLowerCase() === domain.toLowerCase());
        }
        if (search) {
            const s = search.toLowerCase();
            ideas = ideas.filter(p =>
                p.title.toLowerCase().includes(s) ||
                p.description.toLowerCase().includes(s) ||
                p.required_technologies.some(t => t.toLowerCase().includes(s))
            );
        }

        res.json({
            success: true,
            ideas,
            teams: fallbackData.project_teams
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve projects.' });
    }
};

/**
 * Create a new collaborative project team
 */
exports.createProjectTeam = async (req, res) => {
    try {
        const { title, description, open_roles = [], max_members = 4, github_repo_url } = req.body;
        const user = req.user;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Title and description are required.' });
        }

        const newTeam = {
            id: `team-${Date.now()}`,
            title,
            description,
            creator_id: user.id,
            creator_name: user.full_name,
            open_roles: Array.isArray(open_roles) ? open_roles : [open_roles],
            current_members: 1,
            max_members: Number(max_members) || 4,
            github_repo_url,
            status: 'recruiting',
            created_at: new Date().toISOString()
        };

        fallbackData.project_teams.unshift(newTeam);

        res.status(201).json({
            success: true,
            message: 'Project team created! Other students can now request to collaborate.',
            team: newTeam
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create team.' });
    }
};

/**
 * Send collaboration request to join a project team
 */
exports.joinTeamRequest = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { role_applied_for, pitch_message } = req.body;
        const applicant = req.user;

        const team = fallbackData.project_teams.find(t => t.id === teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found.' });
        }

        // Notify team creator
        fallbackData.notifications.push({
            id: `notif-${Date.now()}`,
            user_id: team.creator_id,
            title: 'New Project Collaboration Request',
            message: `${applicant.full_name} applied for "${role_applied_for}" in team "${team.title}".`,
            link_url: '/projects',
            notification_type: 'system',
            is_read: false,
            created_at: new Date().toISOString()
        });

        res.status(201).json({
            success: true,
            message: `Collaboration request sent to ${team.creator_name}!`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to submit collaboration request.' });
    }
};

