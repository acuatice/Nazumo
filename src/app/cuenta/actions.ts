"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeEmail(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().toLowerCase().slice(0, 254) : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/cuenta?auth=unavailable");
  const email = safeEmail(formData.get("email"));
  const password = formData.get("password");
  if (!isValidEmail(email) || typeof password !== "string" || password.length < 8 || password.length > 128) redirect("/cuenta?auth=invalid");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/cuenta?auth=invalid");
  redirect("/cuenta?auth=signed-in");
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/cuenta?auth=unavailable");
  const nameValue = formData.get("name");
  const name = typeof nameValue === "string" ? nameValue.trim().slice(0, 40) : "";
  const email = safeEmail(formData.get("email"));
  const password = formData.get("password");
  if (name.length < 2 || !isValidEmail(email) || typeof password !== "string" || password.length < 8 || password.length > 128) redirect("/cuenta?auth=invalid");
  const origin = getSiteUrl((await headers()).get("origin"));
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name }, emailRedirectTo: `${origin}/auth/confirm` },
  });
  if (error) redirect("/cuenta?auth=signup-error");
  if (data.session) redirect("/cuenta?auth=created");
  redirect("/cuenta?auth=check-email");
}

function getSiteUrl(origin: string | null) {
  const value = process.env.NEXT_PUBLIC_SITE_URL ?? origin ?? "http://localhost:3000";
  try { return new URL(value).origin; } catch { return "http://localhost:3000"; }
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/cuenta?auth=unavailable");
  const email = safeEmail(formData.get("email"));
  if (!isValidEmail(email)) redirect("/cuenta?auth=invalid");
  const origin = (await headers()).get("origin");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl(origin)}/auth/recover`,
  });
  if (error) redirect("/cuenta?auth=reset-error");
  redirect("/cuenta?auth=reset-sent");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/cuenta?auth=unavailable");
  const password = formData.get("password");
  if (typeof password !== "string" || password.length < 8 || password.length > 128) redirect("/cuenta?auth=invalid");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/cuenta?mode=reset&auth=reset-error");
  redirect("/cuenta?auth=password-updated");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/cuenta?auth=signed-out");
}
