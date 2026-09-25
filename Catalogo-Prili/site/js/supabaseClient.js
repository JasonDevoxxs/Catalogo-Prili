import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import CONFIG from './config.js';

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);

export default supabase;
