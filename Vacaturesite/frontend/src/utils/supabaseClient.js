// Supabase client setup voor React
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tesqycomyyifqcwdpetp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3F5Y29teXlpZnFjd2RwZXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjE0MTAsImV4cCI6MjA3MTkzNzQxMH0.aPtjfcDLL0F70OFDIuJdG13kUZQz2e7FYHNrCW77EnU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
