"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

function getRequiredValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Field "${key}" is required.`);
  }
  return value.trim();
}

function encodeError(message: string) {
  return `/login?error=${encodeURIComponent(message)}`;
}

function getSafeNext(formData: FormData) {
  const next = formData.get("next");
  return typeof next === "string" && next.startsWith("/") ? next : "/admin";
}

export async function loginWithPassword(formData: FormData) {
  const supabase = await createClient();
  const email = getRequiredValue(formData, "email");
  const password = getRequiredValue(formData, "password");
  const next = getSafeNext(formData);

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(encodeError("Email atau password tidak valid."));
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user?.app_metadata?.is_admin) {
    await supabase.auth.signOut();
    redirect(encodeError("Akun ini tidak memiliki akses admin."));
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function sendMagicLink(formData: FormData) {
  const supabase = await createClient();
  const email = getRequiredValue(formData, "email");
  const next = getSafeNext(formData);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${env.siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirect(`${encodeError("Gagal mengirim magic link.")}&next=${encodeURIComponent(next)}`);
  }

  redirect(`/login?message=${encodeURIComponent("Magic link berhasil dikirim. Cek email Anda.")}&next=${encodeURIComponent(next)}`);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
