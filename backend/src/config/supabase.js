const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

let supabase = null;
let supabaseAdmin = null;
let isSupabaseConfigured = false;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http') && !supabaseUrl.includes('your-project-id')) {
    try {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
        isSupabaseConfigured = true;
        console.log('✅ Supabase Client initialized successfully.');
    } catch (err) {
        console.warn('⚠️ Error initializing Supabase client:', err.message);
    }
} else {
    console.log('ℹ️ Supabase credentials not fully configured in backend/.env. Running in hybrid/mock storage mode.');
}

module.exports = {
    supabase,
    supabaseAdmin,
    isSupabaseConfigured
};
