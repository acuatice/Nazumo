import type { NextRequest } from "next/server";
import { finishEmailAuth } from "@/lib/supabase/auth-callback";

export function GET(request: NextRequest) {
  return finishEmailAuth(request, true);
}
