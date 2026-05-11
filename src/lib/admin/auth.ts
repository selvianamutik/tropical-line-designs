import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function isAdminMetadata(appMetadata: unknown) {
  return typeof appMetadata === "object"
    && appMetadata !== null
    && "is_admin" in appMetadata
    && appMetadata.is_admin === true;
}

export async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user || !isAdminMetadata(data.user.app_metadata)) {
    redirect("/login");
  }

  return { supabase, user: data.user };
}
