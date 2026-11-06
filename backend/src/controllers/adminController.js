const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Get Platform Analytics and Summary for Admin
 */
exports.getPlatformStats = async (req, res) => {
    try {
        const totalUsers = fallbackData.users.length;
        const pendingVerifications = fallbackData.verification_requests.filter(r => r.status === 'pending').length;
        const totalDiscussions = fallbackData.discussions.length;
        const verifiedAnswers = fallbackData.answers.filter(a => a.is_helpful || a.is_accepted).length;
        const totalOpportunities = fallbackData.opportunities.length;
        const pendingReports = fallbackData.reports.filter(r => r.status === 'pending').length;

        const roleBreakdown = {
            first_year: fallbackData.users.filter(u => u.role === 'first_year').length,
            second_year: fallbackData.users.filter(u => u.role === 'second_year').length,
            third_year: fallbackData.users.filter(u => u.role === 'third_year').length,
            final_year: fallbackData.users.filter(u => u.role === 'final_year').length,
            placed_graduate: fallbackData.users.filter(u => u.role === 'placed_graduate').length,
            admin: fallbackData.users.filter(u => u.role === 'admin').length
        };

        res.json({
            success: true,
            stats: {
                totalUsers,
                pendingVerifications,
                totalDiscussions,
                verifiedAnswers,
                totalOpportunities,
                pendingReports,
                roleBreakdown
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve stats.' });
    }
};

/**
 * Get all verification requests (Pending, Approved, Rejected)
 */
exports.getVerificationRequests = async (req, res) => {
    try {
        const { status } = req.query;
        let list = [...fallbackData.verification_requests];

        if (status) {
            list = list.filter(r => r.status === status);
        }

        res.json({ success: true, requests: list });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load verification requests.' });
    }
};

/**
 * Review Verification Request (Approve / Reject)
 */
exports.reviewVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_notes } = req.body; // 'approved' | 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be approved or rejected.' });
        }

        const vReq = fallbackData.verification_requests.find(r => r.id === id);
        if (!vReq) {
            return res.status(404).json({ success: false, message: 'Verification request not found.' });
        }

        vReq.status = status;
        vReq.admin_notes = admin_notes || `Reviewed by ${req.user.full_name}`;
        vReq.reviewed_at = new Date().toISOString();

        // Update target user profile
        const user = fallbackData.users.find(u => u.id === vReq.user_id);
        if (user) {
            user.verification_status = status;
            user.is_verified = (status === 'approved');

            // Notify user
            fallbackData.notifications.push({
                id: `notif-${Date.now()}`,
                user_id: user.id,
                title: `Verification Request ${status === 'approved' ? 'Approved ✅' : 'Rejected ❌'}`,
                message: status === 'approved'
                    ? 'Congratulations! Your student / senior credentials have been verified by TechBridge.'
                    : `Your verification request was rejected. Note: ${admin_notes || 'Please resubmit valid ID proof.'}`,
                link_url: '/profile',
                notification_type: 'verification',
                is_read: false,
                created_at: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            message: `Verification request ${status} successfully!`,
            request: vReq
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to review verification.' });
    }
};

/**
 * Manage Users: list, search, change roles
 */
exports.getAllUsers = async (req, res) => {
    try {
        const { role, search } = req.query;
        let list = [...fallbackData.users];

        if (role) {
            list = list.filter(u => u.role === role);
        }
        if (search) {
            const s = search.toLowerCase();
            list = list.filter(u =>
                u.full_name.toLowerCase().includes(s) ||
                u.email.toLowerCase().includes(s) ||
                (u.college_name && u.college_name.toLowerCase().includes(s))
            );
        }

        res.json({ success: true, users: list });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
    }
};

/**
 * Update user role (e.g. promote to admin or verify role)
 */
exports.updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const validRoles = ['first_year', 'second_year', 'third_year', 'final_year', 'placed_graduate', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role supplied.' });
        }

        const user = fallbackData.users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.role = role;

        res.json({
            success: true,
            message: `User role updated to ${role}.`,
            user
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update user role.' });
    }
};

/**
 * Get Content Moderation Reports
 */
exports.getReports = async (req, res) => {
    try {
        res.json({ success: true, reports: fallbackData.reports });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve reports.' });
    }
};

/**
 * Resolve Content Moderation Report
 */
exports.resolveReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, status = 'resolved' } = req.body;

        const report = fallbackData.reports.find(r => r.id === id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found.' });
        }

        report.status = status;
        report.admin_action_taken = action || 'Dismissed or resolved by administrator';
        report.resolved_at = new Date().toISOString();

        res.json({
            success: true,
            message: 'Report resolved successfully.',
            report
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to resolve report.' });
    }
};

