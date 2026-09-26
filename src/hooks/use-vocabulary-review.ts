"use client";

import { useEffect, useState } from "react";
import { loadProgress, replaceProgress } from "@/lib/progress/browser";
import { PROGRESS_EVENT } from "@/lib/progress/repository";
import {
  attachVocabularyReview,
  countDueVocabulary,
  createVocabularyReviewState,
  mergeVocabularyReviews,
  readVocabularyReviewState,
  vocabularyReviewFromProgress,
} from "@/lib/vocabulary/review";

export function useVocabularyReview() {
  const [due, setDue] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => {
      const progress = loadProgress();
      let local = createVocabularyReviewState();
      try {
        local = readVocabularyReviewState(window.localStorage);
      } catch {
        // ProgressRepository already provides an in-memory fallback if storage is blocked.
      }

      const merged = progress
        ? mergeVocabularyReviews(local, vocabularyReviewFromProgress(progress))
        : local;
      if (progress && JSON.stringify(merged.items) !== JSON.stringify(progress.vocabularyReview ?? {})) {
        replaceProgress(attachVocabularyReview(progress, merged));
      }
      setDue(countDueVocabulary(merged));
    };

    const initialRead = window.setTimeout(refresh, 0);
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return due;
}
