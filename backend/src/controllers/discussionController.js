const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Get all discussions with filters and search
 */
exports.getDiscussions = async (req, res) => {
    try {
        const { category, search, tag } = req.query;

        if (isSupabaseConfigured) {
            let query = supabase
                .from('discussions')
                .select(`
                    *,
                    author:profiles!author_id(id, full_name, role, avatar_url, placed_company)
                `)
                .order('created_at', { ascending: false });

            if (category && category !== 'All') query = query.eq('category', category);
            if (search) query = query.ilike('title', `%${search}%`);

            const { data, error } = await query;
            if (error) throw error;
            return res.json({ success: true, discussions: data });
        }

        let list = [...fallbackData.discussions];

        if (category && category !== 'All') {
            list = list.filter(d => d.category.toLowerCase() === category.toLowerCase());
        }
        if (tag) {
            list = list.filter(d => d.tags && d.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
        }
        if (search) {
            const s = search.toLowerCase();
            list = list.filter(d =>
                d.title.toLowerCase().includes(s) ||
                d.content.toLowerCase().includes(s)
            );
        }

        res.json({ success: true, discussions: list });
    } catch (err) {
        console.error('getDiscussions error:', err);
        res.status(500).json({ success: false, message: 'Failed to load discussions.' });
    }
};

/**
 * Get single discussion with all answers and comments
 */
exports.getDiscussionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isSupabaseConfigured) {
            const { data: discussion, error: dError } = await supabase
                .from('discussions')
                .select(`
                    *,
                    author:profiles!author_id(id, full_name, role, avatar_url, placed_company)
                `)
                .eq('id', id)
                .single();

            if (dError) return res.status(404).json({ success: false, message: 'Discussion not found.' });

            const { data: answers } = await supabase
                .from('answers')
                .select(`
                    *,
                    author:profiles!author_id(id, full_name, role, avatar_url, placed_company),
                    comments(*, author:profiles!author_id(id, full_name, avatar_url))
                `)
                .eq('discussion_id', id)
                .order('is_accepted', { ascending: false });

            return res.json({
                success: true,
                discussion: {
                    ...discussion,
                    answers: answers || []
                }
            });
        }

        const discussion = fallbackData.discussions.find(d => d.id === id);
        if (!discussion) return res.status(404).json({ success: false, message: 'Discussion not found.' });

        const answers = fallbackData.answers
            .filter(a => a.discussion_id === id)
            .map(a => ({
                ...a,
                comments: fallbackData.comments.filter(c => c.answer_id === a.id)
            }));

        res.json({
            success: true,
            discussion: {
                ...discussion,
                answers
            }
        });
    } catch (err) {
        console.error('getDiscussionById error:', err);
        res.status(500).json({ success: false, message: 'Error retrieving discussion.' });
    }
};

/**
 * Create a new discussion question
 */
exports.createDiscussion = async (req, res) => {
    try {
        const { title, content, category, tags = [] } = req.body;
        const author = req.user;

        if (!title || !content || !category) {
            return res.status(400).json({ success: false, message: 'Title, content and category are required.' });
        }

        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('discussions')
                .insert([
                    {
                        author_id: author.id,
                        title,
                        content,
                        category,
                        tags: Array.isArray(tags) ? tags : [tags]
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            return res.status(201).json({ success: true, message: 'Question posted!', discussion: data });
        }

        const newDiscussion = {
            id: `disc-${Date.now()}`,
            author_id: author.id,
            author_name: author.full_name,
            author_role: author.role,
            author_avatar: author.avatar_url,
            title,
            content,
            category,
            tags: Array.isArray(tags) ? tags : [tags],
            views_count: 1,
            likes_count: 0,
            answers_count: 0,
            is_resolved: false,
            has_verified_senior_answer: ['placed_graduate', 'final_year'].includes(author.role),
            created_at: new Date().toISOString()
        };

        fallbackData.discussions.unshift(newDiscussion);

        res.status(201).json({
            success: true,
            message: 'Question posted successfully!',
            discussion: newDiscussion
        });
    } catch (err) {
        console.error('createDiscussion error:', err);
        res.status(500).json({ success: false, message: 'Failed to create discussion.' });
    }
};

/**
 * Post an answer to a discussion
 */
exports.createAnswer = async (req, res) => {
    try {
        const { id: discussion_id } = req.params;
        const { content } = req.body;
        const author = req.user;

        if (!content) {
            return res.status(400).json({ success: false, message: 'Answer content cannot be empty.' });
        }

        const isSenior = ['placed_graduate', 'final_year', 'third_year'].includes(author.role);

        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('answers')
                .insert([
                    {
                        discussion_id,
                        author_id: author.id,
                        content,
                        is_helpful: isSenior
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            if (isSenior) {
                await supabase
                    .from('discussions')
                    .update({ has_verified_senior_answer: true })
                    .eq('id', discussion_id);
            }

            return res.status(201).json({ success: true, message: 'Answer published!', answer: data });
        }

        const newAnswer = {
            id: `ans-${Date.now()}`,
            discussion_id,
            author_id: author.id,
            author_name: author.full_name,
            author_role: author.role,
            author_company: author.placed_company || null,
            author_avatar: author.avatar_url,
            content,
            is_helpful: isSenior,
            is_accepted: false,
            likes_count: 0,
            created_at: new Date().toISOString()
        };

        fallbackData.answers.push(newAnswer);

        // Update discussion stats
        const disc = fallbackData.discussions.find(d => d.id === discussion_id);
        if (disc) {
            disc.answers_count = (disc.answers_count || 0) + 1;
            if (isSenior) {
                disc.has_verified_senior_answer = true;
            }
        }

        res.status(201).json({
            success: true,
            message: 'Answer published!',
            answer: newAnswer
        });
    } catch (err) {
        console.error('createAnswer error:', err);
        res.status(500).json({ success: false, message: 'Failed to publish answer.' });
    }
};

/**
 * Add a comment to an answer
 */
exports.createComment = async (req, res) => {
    try {
        const { answerId } = req.params;
        const { content } = req.body;
        const author = req.user;

        if (!content) {
            return res.status(400).json({ success: false, message: 'Comment content cannot be empty.' });
        }

        const newComment = {
            id: `comm-${Date.now()}`,
            answer_id: answerId,
            author_id: author.id,
            author_name: author.full_name,
            content,
            created_at: new Date().toISOString()
        };

        fallbackData.comments.push(newComment);

        res.status(201).json({
            success: true,
            comment: newComment
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add comment.' });
    }
};

/**
 * Toggle like on discussion
 */
exports.toggleLikeDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const disc = fallbackData.discussions.find(d => d.id === id);
        if (disc) {
            disc.likes_count = (disc.likes_count || 0) + 1;
            return res.json({ success: true, likes_count: disc.likes_count });
        }
        res.status(404).json({ success: false, message: 'Discussion not found.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error toggling like.' });
    }
};

/**
 * Mark an answer as accepted / helpful
 */
exports.markHelpful = async (req, res) => {
    try {
        const { answerId } = req.params;
        const answer = fallbackData.answers.find(a => a.id === answerId);
        if (answer) {
            answer.is_helpful = !answer.is_helpful;
            return res.json({ success: true, is_helpful: answer.is_helpful });
        }
        res.status(404).json({ success: false, message: 'Answer not found.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update helpful status.' });
    }
};
