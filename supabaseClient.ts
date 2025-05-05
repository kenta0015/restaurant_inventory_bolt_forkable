import { createClient } from '@supabase/supabase-js';

// 🔥 Paste your own values here!
const supabaseUrl = 'https://nbxqroyabnzxlclfmlyc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHFyb3lhYm56eGxjbGZtbHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NjY5MTAsImV4cCI6MjA2MTU0MjkxMH0.Xqf54TQRp8FTy_JbsQJdSx5D1M6NA8JEfMFJYoHM0eA';

export const supabase = createClient(supabaseUrl, supabaseKey);
