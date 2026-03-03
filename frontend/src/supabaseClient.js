import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qywtvgqugmixncscvmqr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5d3R2Z3F1Z21peG5jc2N2bXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDkzNjQsImV4cCI6MjA3MTYyNTM2NH0.d6mAsmYebOpfg_FbnNY_sAWKzBabJN1EbwuOjor7krA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
