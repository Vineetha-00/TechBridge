const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Get curated learning resources
 */
exports.getResources = async (req, res) => {
    try {
        const { category, type, search } = req.query;

        let list = [...fallbackData.learning_resources];

        if (category && category !== 'All') {
            list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
        }
        if (type && type !== 'All') {
            list = list.filter(r => r.resource_type.toLowerCase() === type.toLowerCase());
        }
        if (search) {
            const s = search.toLowerCase();
            list = list.filter(r =>
                r.title.toLowerCase().includes(s) ||
                (r.description && r.description.toLowerCase().includes(s)) ||
                (r.tags && r.tags.some(t => t.toLowerCase().includes(s)))
            );
        }

        res.json({ success: true, resources: list });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve resources.' });
    }
};

/**
 * Submit a helpful learning resource
 */
exports.createResource = async (req, res) => {
    try {
        const { title, description, category, resource_type, url, tags = [], difficulty = 'all_levels', is_free = true } = req.body;

        if (!title || !url || !category) {
            return res.status(400).json({ success: false, message: 'Title, URL, and category are required.' });
        }

        const newResource = {
            id: `res-${Date.now()}`,
            title,
            description,
            category,
            resource_type: resource_type || 'website',
            url,
            tags: Array.isArray(tags) ? tags : [tags],
            difficulty,
            is_free: Boolean(is_free),
            likes_count: 0,
            submitted_by: req.user?.id
        };

        fallbackData.learning_resources.push(newResource);

        res.status(201).json({
            success: true,
            message: 'Resource added to the hub!',
            resource: newResource
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create resource.' });
    }
};

