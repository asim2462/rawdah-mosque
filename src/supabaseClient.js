import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://frwyssxujgnkajwyzstx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyd3lzc3h1amdua2Fqd3l6c3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNjA2MDYsImV4cCI6MjA2OTYzNjYwNn0.u2GnHkGkUJG854PZu-l-fHCiuNm05VslwgT2Z9rBeD0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)