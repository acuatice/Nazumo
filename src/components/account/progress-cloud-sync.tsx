"use client";

import { useEffect } from "react";
import { loadProgress, replaceProgress } from "@/lib/progress/browser";
import { isSyncableProgressState } from "@/lib/progress/sync-validation";
import { mergeProgressStates } from "@/lib/progress/merge";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const PROGRESS_EVENT = "kana-progress-change";

export function ProgressCloudSync() {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    let userId: string | null = null;
    let initialized = false;
    let busy = false;
    let queued = false;
    let applyingCloud = false;
    let timer: number | undefined;

    const synchronize = async () => {
      if (!userId) return;
      if (busy) { queued = true; return; }
      busy = true;
      try {
        const remoteResponse = await fetch("/api/learner-progress", { cache: "no-store" });
        if (!remoteResponse.ok) return;
        const remotePayload: unknown = await remoteResponse.json();
        const remoteState = typeof remotePayload === "object" && remotePayload !== null && "state" in remotePayload ? remotePayload.state : null;
        const loadedLocalState = loadProgress();
        const localState = isSyncableProgressState(loadedLocalState) ? loadedLocalState : null;
        const merged = isSyncableProgressState(remoteState)
          ? localState ? mergeProgressStates(localState, remoteState) : remoteState
          : localState;
        if (!merged) return;
        applyingCloud = true;
        const saved = replaceProgress(merged);
        applyingCloud = false;
        if (!saved) return;
        await fetch("/api/learner-progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state: saved }),
        });
      } catch {
        // Keep local progress usable while offline; the next update retries sync.
      } finally {
        applyingCloud = false;
        busy = false;
        if (queued && userId) {
          queued = false;
          void synchronize();
        }
      }
    };

    const handleProgress = () => {
      if (!userId || !initialized || applyingCloud) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void synchronize(), 700);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUserId = session?.user.id ?? null;
      if (initialized && nextUserId === userId) return;
      userId = nextUserId;
      initialized = true;
      if (userId) void synchronize();
    });

    window.addEventListener(PROGRESS_EVENT, handleProgress);
    window.addEventListener("online", handleProgress);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(PROGRESS_EVENT, handleProgress);
      window.removeEventListener("online", handleProgress);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return null;
}
