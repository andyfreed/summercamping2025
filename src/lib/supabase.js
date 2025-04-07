import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
    Error: Missing Supabase environment variables
    Make sure you have a .env file with:
    REACT_APP_SUPABASE_URL=your-supabase-url
    REACT_APP_SUPABASE_ANON_KEY=your-anon-key
    
    Current values:
    URL: ${supabaseUrl || 'missing'}
    Key: ${supabaseAnonKey ? 'present' : 'missing'}
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 