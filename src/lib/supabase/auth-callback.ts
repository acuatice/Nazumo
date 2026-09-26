import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function finishEmailAuth(request: NextRequest, isPasswordRecovery = false) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const supabase = await createSupabaseServerClient();
  const errorPath = isPasswordRecovery ? "/cuenta?auth=reset-error" : "/cuenta?auth=confirmation-error";
  if (!code || !supabase) return NextResponse.redirect(new URL(errorPath, url));
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL(errorPath, url));
  const destination = new URL("/cuenta", url);
  destination.searchParams.set("auth", isPasswordRecovery ? "reset-ready" : "confirmed");
  if (isPasswordRecovery) destination.searchParams.set("mode", "reset");
  return NextResponse.redirect(destination);
}
