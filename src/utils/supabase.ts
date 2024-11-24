import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

// Create a Supabase client without auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Don't persist as we're using Clerk
  }
});

// Create a custom hook for authenticated Supabase client
export const useSupabaseClient = () => {
  const { getToken } = useAuth();

  const getSupabaseClient = async () => {
    const token = await getToken();
    
    return createClient(supabaseUrl, token);
  };

  return { getSupabaseClient };
};
