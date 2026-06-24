// src/lib/supabaseClient.js
// ─────────────────────────────────────────────────────────────────────────────
// Install:  npm install @supabase/supabase-js
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://helhpaybcjrxljizblve.supabase.co";
const SUPABASE_ANON =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbGhwYXliY2pyeGxqaXpibHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDk2MTYsImV4cCI6MjA5NzE4NTYxNn0.DFezWDYmgO0RXQ5TpLIVTll5sS7mGgOPW07uHOhPa8c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
