// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Faltan variables de entorno REACT_APP_SUPABASE_URL o REACT_APP_SUPABASE_ANON_KEY"
  );
}

/**
 * Cliente único de Supabase para toda la app.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
