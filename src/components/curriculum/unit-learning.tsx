"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PracticeSession } from "@/components/practice/practice-session";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { HiraganaUnit } from "@/data/hiragana-curriculum";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";
import { introduceCharacter, recordUnitAttempt } from "@/lib/progress/storage";
import type { UnitAttempt } from "@/lib/progress/types";
import type { PracticeCompletionResult } from "@/lib/practice/types";

type UnitScreen = "lesson" | "practice" | "result";

export function UnitLearning({ unit }: { unit: HiraganaUnit }) {
  const snapshot = useLearningSnapshot();
  const [screen, setScreen] = useState<UnitScreen>("lesson");
  const [characterIndex, setCharacterIndex] = useState(0);
  const [attempt, setAttempt] = useState<UnitAttempt | null>(null);
  const [practiceKey, setPracticeKey] = useState(0);
  const current = unit.characters[characterIndex];

  useEffect(() => {
    if (screen === "lesson" && current) introduceCharacter(current.character, unit.id);
  }, [current, screen, unit.id]);

  const handleComplete = useCallback((result: PracticeCompletionResult) => {
    const savedAttempt = recordUnitAttempt(unit, result.recognitionCorrect, result.typingCorrect);
    if (savedAttempt) setAttempt(savedAttempt);
    setScreen("result");
  }, [unit]);

  if (!snapshot) return <div className="flex min-h-[30rem] items-center justify-center text-sm text-[var(--muted)]">Cargando unidad…</div>;
  const accessible = snapshot.completedUnitIds.includes(unit.id) || unit.id <= snapshot.currentUnitId;
  if (!accessible) return <section className="mx-auto max-w-xl py-24 text-center"><p className="text-sm font-bold text-[var(--nazumo-purple)]">Unidad {unit.id}</p><h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em]">Todavía no está disponible</h1><p className="mt-4 text-[var(--muted)]">Completa primero la unidad anterior.</p><ButtonLink href="/hiragana" className="mt-8">Volver a las unidades</ButtonLink></section>;

  if (screen === "practice") return <div className="flex min-h-[calc(100dvh-8rem-env(safe-area-inset-top))] items-start justify-center py-4 sm:items-center sm:py-8"><PracticeSession key={practiceKey} characters={unit.characters} sessionSize={unit.characters.length} onComplete={handleComplete} embedded /></div>;

  if (screen === "result" && attempt) {
    const percentage = Math.round(attempt.accuracy * 100);
    return <section className="mx-auto max-w-2xl py-16 text-center"><p className="text-sm font-bold text-[var(--nazumo-purple)]">Unidad {unit.id}</p><h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">{attempt.passed ? "Unidad aprendida" : "Vamos a repasarlos otra vez"}</h1><p className="mt-5 text-lg text-[var(--muted)]">{attempt.recognitionCorrect} / {unit.characters.length} reconocidos · {attempt.typingCorrect} / {unit.characters.length} recordados</p><div className="mx-auto my-10 flex size-36 items-center justify-center rounded-full bg-[var(--yuzu)] text-3xl font-extrabold text-[var(--sumi)]">{percentage}%</div><div className="grid gap-3 sm:grid-cols-2">{attempt.passed ? <ButtonLink href="/hiragana">Continuar aprendiendo</ButtonLink> : <Button type="button" onClick={() => { setPracticeKey((key) => key + 1); setScreen("practice"); }}>Practicar de nuevo</Button>}<ButtonLink href={`/hiragana/unit/${unit.id}/write`} variant="neutral" className="border border-[var(--border)]">Practicar escritura</ButtonLink><ButtonLink href="/hiragana" variant="neutral" className="border border-[var(--border)] sm:col-span-2">Volver a las unidades</ButtonLink></div></section>;
  }

  return (
    <section className="mx-auto max-w-2xl py-10 sm:py-16">
      <header className="flex items-center justify-between gap-3"><Link href="/hiragana" className="min-h-11 py-3 text-sm font-semibold text-[var(--muted)] hover:text-[var(--sumi)]">← Unidades</Link><ButtonLink href={`/hiragana/unit/${unit.id}/write`} variant="neutral" className="min-h-11 border border-[var(--border)] px-4 py-2 text-xs">Practicar escritura</ButtonLink><span className="text-sm font-semibold tabular-nums text-[var(--muted)]">{characterIndex + 1} / {unit.characters.length}</span></header>
      <ProgressBar className="mt-3 text-[var(--nazumo-purple)]" value={characterIndex + 1} max={unit.characters.length} label="Progreso de la lección" />
      <Card key={current.character} className="mt-8 animate-[question-in_.2s_ease-out] border border-[var(--border)] p-7 text-center shadow-[0_24px_80px_rgba(55,21,143,.06)] sm:p-12">
        <p className="text-sm font-bold text-[var(--nazumo-purple)]">Unidad {unit.id} · Conoce los kana</p>
        <div className="font-japanese my-10 text-[10rem] leading-none tracking-[-0.08em] sm:text-[13rem]">{current.character}</div>
        <p className="text-2xl font-extrabold tracking-[0.08em]">{current.romaji}</p>
        {current.example && <div className="mt-9 rounded-[var(--radius-button)] bg-[var(--rice)] p-5"><p className="font-japanese text-3xl">{current.example}</p><p className="mt-2 text-sm text-[var(--muted)]">{current.exampleReading} · {current.exampleMeaning}</p></div>}
        <Button type="button" onClick={() => { if (characterIndex < unit.characters.length - 1) setCharacterIndex((index) => index + 1); else setScreen("practice"); }} className="mt-8 w-full">{characterIndex < unit.characters.length - 1 ? "Siguiente carácter" : "Empezar práctica"}</Button>
      </Card>
    </section>
  );
}
