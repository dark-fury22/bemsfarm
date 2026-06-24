// config/supabaseClient.js
// ─────────────────────────────────────────────────────────────────────────────
// Replace your old pg pool with this everywhere in the backend.
// Install first:  npm install @supabase/supabase-js
// ─────────────────────────────────────────────────────────────────────────────

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://helhpaybcjrxljizblve.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // ← use SERVICE key on backend (not anon)
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbGhwYXliY2pyeGxqaXpibHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MDk2MTYsImV4cCI6MjA5NzE4NTYxNn0.DFezWDYmgO0RXQ5TpLIVTll5sS7mGgOPW07uHOhPa8c";

// Backend admin client — bypasses Row Level Security (use for server-side only)
const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY, // fallback to anon if service key not set yet
  {
    auth: { autoRefreshToken: false, persistSession: false },
  },
);

// Frontend-safe client — respects RLS (export this for reference, main use is in frontend)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = { supabase, supabaseAdmin };
