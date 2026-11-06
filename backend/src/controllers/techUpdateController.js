const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Get verified technology updates with optional category filtering
 */
exports.getTechUpdates = async (req, res) => {
    try {
        const { category, search } = req.query;

        let updates = [...fallbackData.technology_updates];

        if (category && category !== 'All') {
            updates = updates.filter(u => u.category.toLowerCase() === category.toLowerCase());
        }
        if (search) {
            const s = search.toLowerCase();
            updates = updates.filter(u =>
                u.title.toLowerCase().includes(s) ||
                u.description.toLowerCase().includes(s) ||
                (u.source_name && u.source_name.toLowerCase().includes(s))
            );
        }

        res.json({ success: true, updates });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve technology updates.' });
    }
};

/**
 * Create a new technology update (Admin or verified seniors)
 */
exports.createTechUpdate = async (req, res) => {
    try {
        const { title, description, category, source_url, source_name } = req.body;

        if (!title || !description || !source_url) {
            return res.status(400).json({ success: false, message: 'Title, description, and original source link are required.' });
        }

        const newUpdate = {
            id: `tech-${Date.now()}`,
            title,
            description,
            category: category || 'Languages & Frameworks',
            source_url,
            source_name: source_name || 'Official Tech Blog',
            is_verified: true,
            published_at: new Date().toISOString()
        };

        fallbackData.technology_updates.unshift(newUpdate);

        res.status(201).json({
            success: true,
            message: 'Technology update published successfully!',
            update: newUpdate
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create technology update.' });
    }
};
