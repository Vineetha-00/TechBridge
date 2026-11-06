const { supabase, isSupabaseConfigured } = require('../config/supabase');
const fallbackData = require('../utils/fallbackData');

/**
 * Register a new user (with academic details & role)
 */
exports.register = async (req, res) => {
    try {
        const {
            email,
            password,
            full_name,
            role = 'first_year',
            college_name,
            academic_year,
            branch = 'Computer Science and Engineering',
            student_id_number,
            college_email,
            placed_company,
            job_designation,
            package_lpa,
            skills = [],
            interests = []
        } = req.body;

        if (!email || !password || !full_name) {
            return res.status(400).json({ success: false, message: 'Email, password, and full name are required.' });
        }

        if (isSupabaseConfigured) {
            // Register user in Supabase Auth
            const { data: authUser, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name, role }
                }
            });

            if (authError) {
                return res.status(400).json({ success: false, message: authError.message });
            }

            const userId = authUser.user.id;

            // Insert Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: userId,
                        email,
                        full_name,
                        role,
                        college_name,
                        academic_year: Number(academic_year) || 1,
                        branch,
                        student_id_number,
                        college_email,
                        placed_company,
                        job_designation,
                        package_lpa: package_lpa ? Number(package_lpa) : null,
                        skills,
                        interests,
                        is_verified: role === 'admin' ? true : false,
                        verification_status: 'pending'
                    }
                ])
                .select()
                .single();

            if (profileError) {
                console.error('Error inserting profile in Supabase:', profileError);
            }

            return res.status(201).json({
                success: true,
                message: 'Registration successful! Verification request is pending review.',
                user: profile || authUser.user,
                token: authUser.session?.access_token
            });
        }

        // Mock Registration for Local Development
        const existing = fallbackData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

        const newUser = {
            id: `usr-${Date.now()}`,
            email,
            full_name,
            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
            bio: `${role.replace('_', ' ').toUpperCase()} student at ${college_name || 'CSE Institute'}.`,
            role,
            college_name: college_name || 'Engineering College',
            academic_year: Number(academic_year) || 1,
            branch,
            student_id_number,
            college_email,
            placed_company,
            job_designation,
            package_lpa,
            skills: Array.isArray(skills) ? skills : [skills],
            interests: Array.isArray(interests) ? interests : [interests],
            is_verified: false,
            verification_status: 'pending',
            is_open_to_mentor: ['third_year', 'final_year', 'placed_graduate'].includes(role)
        };

        fallbackData.users.push(newUser);

        // Auto create verification request
        fallbackData.verification_requests.push({
            id: `vreq-${Date.now()}`,
            user_id: newUser.id,
            user_name: newUser.full_name,
            email: newUser.email,
            role_requested: newUser.role,
            company_name: newUser.placed_company || null,
            status: 'pending',
            id_card_document_url: 'https://placehold.co/600x400/png?text=Submitted+ID+Document',
            created_at: new Date().toISOString()
        });

        res.status(201).json({
            success: true,
            message: 'Registered successfully! Log in to access your student dashboard.',
            user: newUser,
            token: `mock-jwt-token-${newUser.id}`
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required.' });
        }

        if (isSupabaseConfigured) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                return res.status(401).json({ success: false, message: error.message });
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            return res.json({
                success: true,
                message: 'Login successful.',
                user: profile || data.user,
                token: data.session.access_token
            });
        }

        // Mock Login
        const matched = fallbackData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!matched) {
            // Provide helpful test credentials hint
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. You can use demo accounts: rahul.firstyear@nitw.ac.in, aravind.placed@google.com, admin@techbridge.edu (any password).'
            });
        }

        res.json({
            success: true,
            message: 'Login successful.',
            user: matched,
            token: `mock-jwt-token-${matched.id}`
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};

/**
 * Get current user profile
 */
exports.getMe = async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return res.json({ success: true, message: 'Profile updated.', user: data });
        }

        // Update in-memory
        const idx = fallbackData.users.findIndex(u => u.id === userId);
        if (idx !== -1) {
            fallbackData.users[idx] = { ...fallbackData.users[idx], ...updates, updated_at: new Date().toISOString() };
            return res.json({ success: true, message: 'Profile updated.', user: fallbackData.users[idx] });
        }

        res.status(404).json({ success: false, message: 'User not found.' });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ success: false, message: 'Failed to update profile.' });
    }
};

/**
 * Submit Verification Documents (ID Card / Offer Letter)
 */
exports.submitVerification = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id_card_url, offer_letter_url, college_email, company_name } = req.body;

        const requestObj = {
            id: `vreq-${Date.now()}`,
            user_id: userId,
            user_name: req.user.full_name,
            email: req.user.email,
            role_requested: req.user.role,
            id_card_document_url: id_card_url || 'https://placehold.co/600x400/png?text=Verified+ID',
            offer_letter_url,
            college_email: college_email || req.user.college_email,
            company_name: company_name || req.user.placed_company,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        if (isSupabaseConfigured) {
            await supabase.from('verification_requests').insert([requestObj]);
            await supabase.from('profiles').update({ verification_status: 'pending' }).eq('id', userId);
        } else {
            fallbackData.verification_requests.push(requestObj);
        }

        res.json({
            success: true,
            message: 'Verification documents submitted! TechBridge administrators will review your profile.'
        });
    } catch (err) {
        console.error('Submit verification error:', err);
        res.status(500).json({ success: false, message: 'Submission failed.' });
    }
};

