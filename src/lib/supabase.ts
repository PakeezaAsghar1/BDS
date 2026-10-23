import { createClient } from '@supabase/supabase-js';

// Supabase project credentials provided for BDS UET Narowal
export const SUPABASE_PROJECT_ID = 'zrmajldxzdkokgayhsbg';
export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_rgD41DrRslYnHqLKXhvMwA_xi2EkmHq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const checkSupabaseConnection = async (): Promise<{
  connected: boolean;
  tablesInitialized: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase.from('donors').select('id').limit(1);
    if (!error) {
      return { connected: true, tablesInitialized: true };
    }
    // PGRST205 indicates table does not exist in schema cache yet
    if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
      return { connected: true, tablesInitialized: false, error: 'Database tables not yet created in Supabase.' };
    }
    return { connected: true, tablesInitialized: false, error: error.message };
  } catch (err: any) {
    return { connected: false, tablesInitialized: false, error: err?.message || 'Connection failed' };
  }
};
