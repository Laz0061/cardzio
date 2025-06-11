// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkjyktpxcbmqjfaapdju.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhranlrdHB4Y2JtcWpmYWFwZGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTI0MTIsImV4cCI6MjA2NDM4ODQxMn0.vcBWZ2EMv5hNs3byWo5nMc6Ilv4gK43Hgr_5ubabEys';


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

