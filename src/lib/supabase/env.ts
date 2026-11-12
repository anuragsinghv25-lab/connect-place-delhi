// Supabase public config. Both values are safe to expose to the browser;
// Row Level Security in the database is what protects data.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_KEY);
