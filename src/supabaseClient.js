// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Solo para ayudarte a debuggear en desarrollo
  // NO rompe la app si falta, pero te avisa en consola
  console.warn(
    "[supabaseClient] Faltan REACT_APP_SUPABASE_URL o REACT_APP_SUPABASE_ANON_KEY en .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
