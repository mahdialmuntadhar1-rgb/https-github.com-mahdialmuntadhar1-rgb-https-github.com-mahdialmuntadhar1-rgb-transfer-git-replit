import { createClient } from '@supabase/supabase-js';

// Use environment variables with hardcoded fallbacks from the project identity 
// to ensure the app works immediately in the preview environment.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://hsadukhmcclwixuntqwu.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzYWR1a2htY2Nsd2l4dW50cXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODMzNjgsImV4cCI6MjA4ODY1OTM2OH0.XWDbzIPZNPk6j1GXixcIJKUb4lp48ipC7jExG2Q09Ns';

if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  console.warn('Supabase URL is missing or using placeholder. Please set VITE_SUPABASE_URL in your environment.');
}

// Ensure we have a valid string for createClient to prevent "supabaseUrl is required" error
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
