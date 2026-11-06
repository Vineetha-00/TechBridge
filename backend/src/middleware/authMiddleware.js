const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Authentication Middleware.
 * Validates Supabase JWT or header-based user context in development.
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const mockUserId = req.headers['x-user-id'];

        // 1. If Supabase is configured and Bearer token is provided
        if (isSupabaseConfigured && authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
            }

            // Retrieve profile from Supabase
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            req.user = profile || {
                id: user.id,
                email: user.email,
                role: 'first_year',
                full_name: user.user_metadata?.full_name || 'Student'
            };
            return next();
        }

        // 2. Development / Fallback mode support (Header or default student)
        if (mockUserId) {
            const matchedUser = fallbackData.users.find(u => u.id === mockUserId);
            if (matchedUser) {
                req.user = matchedUser;
                return next();
            }
        }

        // Default test authenticated user (Rahul Gupta, 1st Year)
        req.user = fallbackData.users.find(u => u.role === 'first_year') || fallbackData.users[0];
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        res.status(500).json({ success: false, message: 'Internal authentication error.' });
    }
};

/**
 * Optional authentication: attaches user if present, but doesn't block unauthenticated requests.
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const mockUserId = req.headers['x-user-id'];

        if (isSupabaseConfigured && authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { data: { user } } = await supabase.auth.getUser(token);
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                req.user = profile || user;
            }
        } else if (mockUserId) {
            req.user = fallbackData.users.find(u => u.id === mockUserId);
        }
        next();
    } catch {
        next();
    }
};

module.exports = {
    authenticate,
    optionalAuth
};

