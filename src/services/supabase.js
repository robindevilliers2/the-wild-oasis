import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ftwqsgjcmvqqyvgfknio.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0d3FzZ2pjbXZxcXl2Z2ZrbmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MTkzMDQsImV4cCI6MjA1NzA5NTMwNH0.sAcFfx9PZlp5VD6Lu-CR6xu6fIOmhhO_ku2oMGLDBis";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
