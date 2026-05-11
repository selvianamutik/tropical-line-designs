import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/admin";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Link login tidak valid.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Gagal memverifikasi magic link.")}`);
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user?.app_metadata?.is_admin) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Akun ini tidak memiliki akses admin.")}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
