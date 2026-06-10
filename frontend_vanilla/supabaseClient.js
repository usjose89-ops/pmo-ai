// Initialize Supabase Client
const SUPABASE_URL = 'https://jcmjepvpzygtsmpvudob.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uMXJqvOE50r3ZrxC1OFBMg_iP-b1D_h'; // Cloud key

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Make available globally
window.supabaseClient = supabase;
