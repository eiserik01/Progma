import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Tyto proměnné se nastavují v .env.local (lokálně) a v nastavení projektu
// na Vercelu (produkce) — viz README, sekce "Supabase — sdílená data a přihlašování".
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "Chybí VITE_SUPABASE_URL nebo VITE_SUPABASE_ANON_KEY — Progma Admin se nemůže připojit k databázi."
  );
}

// I bez konfigurace vytvoříme klienta s prázdnými hodnotami, ať aplikace při
// importu nespadne — AdminAuth pak zobrazí srozumitelnou hlášku místo appky.
export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder");
