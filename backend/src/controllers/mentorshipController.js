const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Get mentorship requests (as mentee or mentor)
 */
exports.getRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('mentorship_requests')
                .select(`
                    *,
                    mentor:profiles!mentor_id(id, full_name, avatar_url, role, placed_company),
                    mentee:profiles!mentee_id(id, full_name, avatar_url, role, academic_year)
                `)
                .or(`mentee_id.eq.${userId},mentor_id.eq.${userId}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return res.json({ success: true, requests: data });
        }

        const requests = fallbackData.mentorship_requests.filter(
            r => r.mentee_id === userId || r.mentor_id === userId
        );

        res.json({ success: true, requests });
    } catch (err) {
        console.error('getRequests error:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve mentorship requests.' });
    }
};

/**
 * Send a new mentorship request to a senior
 */
exports.sendRequest = async (req, res) => {
    try {
        const mentee = req.user;
        const { mentor_id, topic, message } = req.body;

        if (!mentor_id || !topic || !message) {
            return res.status(400).json({ success: false, message: 'Mentor ID, topic, and message are required.' });
        }

        const mentor = fallbackData.users.find(u => u.id === mentor_id);

        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('mentorship_requests')
                .insert([
                    {
                        mentee_id: mentee.id,
                        mentor_id,
                        topic,
                        message,
                        status: 'pending'
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            return res.status(201).json({ success: true, message: 'Mentorship request sent!', request: data });
        }

        const newReq = {
            id: `req-${Date.now()}`,
            mentee_id: mentee.id,
            mentee_name: mentee.full_name,
            mentee_role: mentee.role,
            mentor_id,
            mentor_name: mentor?.full_name || 'Senior Mentor',
            topic,
            message,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        fallbackData.mentorship_requests.unshift(newReq);

        // Notify mentor
        fallbackData.notifications.push({
            id: `notif-${Date.now()}`,
            user_id: mentor_id,
            title: 'New Mentorship Request',
            message: `${mentee.full_name} requested guidance on "${topic}".`,
            link_url: '/mentorship',
            notification_type: 'mentorship',
            is_read: false,
            created_at: new Date().toISOString()
        });

        res.status(201).json({
            success: true,
            message: 'Mentorship request sent successfully!',
            request: newReq
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send mentorship request.' });
    }
};

/**
 * Accept or reject a mentorship request
 */
exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejection_reason } = req.body; // 'accepted' or 'rejected'

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be accepted or rejected.' });
        }

        const reqObj = fallbackData.mentorship_requests.find(r => r.id === id);
        if (reqObj) {
            reqObj.status = status;
            if (rejection_reason) reqObj.rejection_reason = rejection_reason;

            // Notify mentee
            fallbackData.notifications.push({
                id: `notif-${Date.now()}`,
                user_id: reqObj.mentee_id,
                title: `Mentorship Request ${status.toUpperCase()}`,
                message: `${req.user.full_name} has ${status} your request for "${reqObj.topic}".`,
                link_url: '/mentorship',
                notification_type: 'mentorship',
                is_read: false,
                created_at: new Date().toISOString()
            });

            return res.json({ success: true, message: `Request ${status}.`, request: reqObj });
        }

        res.status(404).json({ success: false, message: 'Mentorship request not found.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update request.' });
    }
};

/**
 * Schedule a mentorship session
 */
exports.scheduleSession = async (req, res) => {
    try {
        const { request_id, scheduled_time, duration_minutes = 45, meeting_link, notes } = req.body;

        const reqObj = fallbackData.mentorship_requests.find(r => r.id === request_id);

        const newSession = {
            id: `ses-${Date.now()}`,
            request_id,
            mentor_id: req.user.id,
            mentee_id: reqObj ? reqObj.mentee_id : 'usr-first-1',
            mentor_name: req.user.full_name,
            mentee_name: reqObj ? reqObj.mentee_name : 'Student',
            scheduled_time,
            duration_minutes,
            meeting_link: meeting_link || 'https://meet.google.com/tb-mentor-session',
            notes: notes || '1-on-1 Academic & Career Mentorship Session',
            status: 'scheduled',
            created_at: new Date().toISOString()
        };

        fallbackData.mentorship_sessions.push(newSession);

        res.status(201).json({
            success: true,
            message: 'Session scheduled successfully!',
            session: newSession
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to schedule session.' });
    }
};

/**
 * Get all scheduled sessions for user
 */
exports.getSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const sessions = fallbackData.mentorship_sessions.filter(
            s => s.mentor_id === userId || s.mentee_id === userId
        );
        res.json({ success: true, sessions });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve sessions.' });
    }
};

