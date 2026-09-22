"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PracticeSession } from "@/components/practice/practice-session";
import { hiraganaCharacters } from "@/data/hiragana";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";
import { QUICK_PRACTICE_SIZE, selectProgressiveCharacters } from "@/lib/practice/selection";

export function ReviewPractice() {
  const snapshot = useLearningSnapshot();
  const studied = useMemo(
    () => snapshot ? selectProgressiveCharacters(snapshot, hiraganaCharacters) : [],
    [snapshot],
  );
  if (!snapshot) return <div className="text-sm text-[var(--muted)]">Preparando repaso…</div>;
  if (studied.length === 0) return <section className="max-w-lg text-center"><h1 className="text-4xl font-extrabold tracking-[-0.04em]">Conoce tus primeros caracteres</h1><p className="mt-4 text-[var(--muted)]">La práctica solo utiliza kana que ya hayas estudiado.</p><Link href="/hiragana/unit/1" className="mt-8 inline-flex min-h-13 items-center rounded-[var(--radius-button)] bg-[var(--nazumo-purple)] px-6 text-sm font-bold text-white">Empezar hiragana</Link></section>;
  return <PracticeSession characters={studied} sessionSize={Math.min(QUICK_PRACTICE_SIZE, studied.length)} />;
}
