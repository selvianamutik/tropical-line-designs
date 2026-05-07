import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
  console.warn(
    "[env] Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

// We use the service role key here for admin/backend tasks (bypasses RLS)
export const supabaseAdmin = createClient(
  env.supabaseUrl,
  env.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
