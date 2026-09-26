import { NextResponse, type NextRequest } from "next/server";
import { isSyncableProgressState } from "@/lib/progress/sync-validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const responseHeaders = { "Cache-Control": "private, no-store, max-age=0" };

async function getAuthenticatedClient() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  return error || !user ? null : { supabase, user };
}

export async function GET() {
  const auth = await getAuthenticatedClient();
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: responseHeaders });
  const { data, error } = await auth.supabase.from("learner_progress").select("state").eq("user_id", auth.user.id).maybeSingle();
  if (error) return NextResponse.json({ error: "unavailable" }, { status: 503, headers: responseHeaders });
  return NextResponse.json({ state: data?.state ?? null }, { headers: responseHeaders });
}

export async function PUT(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "forbidden" }, { status: 403, headers: responseHeaders });
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > 256_000) return NextResponse.json({ error: "too_large" }, { status: 413, headers: responseHeaders });
  const auth = await getAuthenticatedClient();
  if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: responseHeaders });
  let payload: unknown;
  try {
    const body = await request.text();
    if (body.length > 256_000) return NextResponse.json({ error: "too_large" }, { status: 413, headers: responseHeaders });
    payload = JSON.parse(body) as unknown;
  } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400, headers: responseHeaders }); }
  if (typeof payload !== "object" || payload === null || !("state" in payload) || !isSyncableProgressState(payload.state)) {
    return NextResponse.json({ error: "invalid_progress" }, { status: 400, headers: responseHeaders });
  }
  const { error } = await auth.supabase.from("learner_progress").upsert({ user_id: auth.user.id, state: payload.state }, { onConflict: "user_id" });
  if (error) return NextResponse.json({ error: "unavailable" }, { status: 503, headers: responseHeaders });
  return NextResponse.json({ saved: true }, { headers: responseHeaders });
}
