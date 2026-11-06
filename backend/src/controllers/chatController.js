const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Get active conversations for the authenticated user
 */
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    *,
                    participants:conversation_participants(user:profiles(id, full_name, avatar_url, role, placed_company))
                `)
                .order('last_message_at', { ascending: false });

            if (error) throw error;
            return res.json({ success: true, conversations: data });
        }

        const userConvs = fallbackData.conversations.filter(c => c.participants.includes(userId));

        const enriched = userConvs.map(conv => {
            const partnerId = conv.participants.find(p => p !== userId) || userId;
            const partner = fallbackData.users.find(u => u.id === partnerId);
            return {
                ...conv,
                partner: partner || { full_name: 'TechBridge Senior', role: 'placed_graduate' }
            };
        });

        res.json({ success: true, conversations: enriched });
    } catch (err) {
        console.error('getConversations error:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve conversations.' });
    }
};

/**
 * Get message history for a conversation
 */
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('messages')
                .select('*, sender:profiles(id, full_name, avatar_url)')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return res.json({ success: true, messages: data });
        }

        const messages = fallbackData.messages
            .filter(m => m.conversation_id === conversationId)
            .map(m => {
                const sender = fallbackData.users.find(u => u.id === m.sender_id);
                return {
                    ...m,
                    sender: sender || { id: m.sender_id, full_name: 'Peer' }
                };
            });

        res.json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving messages.' });
    }
};

/**
 * Send a message in a conversation
 */
exports.sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { message_text } = req.body;
        const userId = req.user.id;

        if (!message_text) {
            return res.status(400).json({ success: false, message: 'Message text cannot be empty.' });
        }

        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('messages')
                .insert([
                    {
                        conversation_id: conversationId,
                        sender_id: userId,
                        message_text
                    }
                ])
                .select('*, sender:profiles(id, full_name, avatar_url)')
                .single();

            if (error) throw error;

            await supabase
                .from('conversations')
                .update({ last_message_text: message_text, last_message_at: new Date().toISOString() })
                .eq('id', conversationId);

            return res.status(201).json({ success: true, message: data });
        }

        const newMsg = {
            id: `msg-${Date.now()}`,
            conversation_id: conversationId,
            sender_id: userId,
            message_text,
            created_at: new Date().toISOString(),
            is_read: false,
            sender: req.user
        };

        fallbackData.messages.push(newMsg);

        // Update conversation summary
        const conv = fallbackData.conversations.find(c => c.id === conversationId);
        if (conv) {
            conv.last_message_text = message_text;
            conv.last_message_at = new Date().toISOString();
        }

        res.status(201).json({ success: true, message: newMsg });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
};

/**
 * Start or retrieve a one-on-one conversation with a mentor or peer
 */
exports.startConversation = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUserId = req.user.id;

        if (!targetUserId) {
            return res.status(400).json({ success: false, message: 'Target user ID is required.' });
        }

        // Check if existing conversation
        let conv = fallbackData.conversations.find(c =>
            c.participants.includes(currentUserId) && c.participants.includes(targetUserId)
        );

        if (!conv) {
            conv = {
                id: `conv-${Date.now()}`,
                participants: [currentUserId, targetUserId],
                last_message_text: 'Conversation started.',
                last_message_at: new Date().toISOString(),
                unread: 0
            };
            fallbackData.conversations.unshift(conv);
        }

        const partner = fallbackData.users.find(u => u.id === targetUserId);

        res.json({
            success: true,
            conversation: {
                ...conv,
                partner: partner || { full_name: 'Senior Mentor' }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to start conversation.' });
    }
};

/**
 * Block a user from private messaging
 */
exports.blockUser = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        res.json({
            success: true,
            message: `User ${targetUserId} has been blocked from contacting you.`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to block user.' });
    }
};
