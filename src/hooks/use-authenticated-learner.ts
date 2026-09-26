"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export interface AuthenticatedLearner { name: string; email: string }

export function useAuthenticatedLearner() {
  const [learner, setLearner] = useState<AuthenticatedLearner | null>(null);
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    let active = true;
    const applyUser = (user: { email?: string; user_metadata?: Record<string, unknown> } | null) => {
      if (!active) return;
      const fullName = user?.user_metadata?.full_name;
      setLearner(user ? { name: typeof fullName === "string" ? fullName : "", email: user.email ?? "" } : null);
    };
    void supabase.auth.getUser().then(({ data }) => applyUser(data.user));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => applyUser(session?.user ?? null));
    return () => { active = false; subscription.subscription.unsubscribe(); };
  }, []);
  return learner;
}
