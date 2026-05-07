const requiredClientEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

for (const [key, value] of Object.entries(requiredClientEnv)) {
  if (!value) {
    console.warn(`[env] Missing required environment variable: ${key}`);
  }
}

export const env = {
  siteUrl: requiredClientEnv.NEXT_PUBLIC_SITE_URL ?? "",
  supabaseUrl: requiredClientEnv.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: requiredClientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};
