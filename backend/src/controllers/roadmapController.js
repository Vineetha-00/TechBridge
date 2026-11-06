const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

// In-memory student progress storage
const studentProgressStore = {};

/**
 * Get all roadmaps with filters (career, year_wise, skill_based)
 */
exports.getRoadmaps = async (req, res) => {
    try {
        const { category, year } = req.query;

        if (isSupabaseConfigured) {
            let query = supabase.from('roadmaps').select('*, milestones:roadmap_milestones(*)');
            if (category) query = query.eq('category', category);
            if (year) query = query.eq('target_year', Number(year));

            const { data, error } = await query;
            if (error) throw error;
            return res.json({ success: true, roadmaps: data });
        }

        let roadmaps = [...fallbackData.roadmaps];

        if (category) {
            roadmaps = roadmaps.filter(r => r.category === category);
        }
        if (year) {
            roadmaps = roadmaps.filter(r => r.target_year === Number(year));
        }

        res.json({ success: true, roadmaps });
    } catch (err) {
        console.error('getRoadmaps error:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve roadmaps.' });
    }
};

/**
 * Get single roadmap by slug with milestones
 */
exports.getRoadmapBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user?.id || 'usr-first-1';

        const roadmap = fallbackData.roadmaps.find(r => r.slug === slug);
        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'Roadmap not found.' });
        }

        const userProgress = studentProgressStore[`${userId}_${roadmap.id}`] || {
            completed_milestones: [],
            progress_percentage: 0
        };

        res.json({
            success: true,
            roadmap,
            userProgress
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching roadmap.' });
    }
};

/**
 * Toggle milestone completion status
 */
exports.toggleMilestoneProgress = async (req, res) => {
    try {
        const { roadmapId, milestoneId } = req.body;
        const userId = req.user.id;

        const key = `${userId}_${roadmapId}`;
        const current = studentProgressStore[key] || { completed_milestones: [], progress_percentage: 0 };

        const roadmap = fallbackData.roadmaps.find(r => r.id === roadmapId);
        const totalMilestones = roadmap?.milestones?.length || 2;

        let updatedCompleted;
        if (current.completed_milestones.includes(milestoneId)) {
            updatedCompleted = current.completed_milestones.filter(m => m !== milestoneId);
        } else {
            updatedCompleted = [...current.completed_milestones, milestoneId];
        }

        const percentage = Math.round((updatedCompleted.length / totalMilestones) * 100);

        studentProgressStore[key] = {
            completed_milestones: updatedCompleted,
            progress_percentage: percentage,
            last_activity: new Date().toISOString()
        };

        res.json({
            success: true,
            message: 'Milestone progress updated!',
            progress: studentProgressStore[key]
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update progress.' });
    }
};

