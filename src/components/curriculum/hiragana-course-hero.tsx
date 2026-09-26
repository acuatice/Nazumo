"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";

export function HiraganaCourseHero() {
  const snapshot = useLearningSnapshot();
  const learned = snapshot?.learnedIds.length ?? 0;
  const unit = snapshot?.currentUnitId ?? 1;
  return <div className="relative z-10 mt-24 rounded-[1.65rem] bg-white p-5 shadow-[0_18px_45px_rgba(73,35,143,.12)] sm:mt-28 sm:flex sm:items-end sm:justify-between sm:gap-8 sm:p-7"><div className="flex-1"><p className="text-xl font-extrabold tracking-[-.035em]">{learned === 0 ? "Empieza tu viaje" : "Sigue aprendiendo"}</p><p className="mt-1 max-w-sm text-sm leading-relaxed text-[var(--muted)]">Aprende a reconocer, escribir y recordar hiragana paso a paso.</p><ProgressBar value={learned} max={46} label="Progreso de hiragana" className="mt-4" /><p className="mt-2 text-xs text-[var(--muted)]">Unidad {unit} · {learned} de 46 aprendidos</p></div><Link href={`/hiragana/unit/${unit}`} aria-label={`Continuar con la unidad ${unit}`} className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--sumi)] px-5 text-sm font-bold text-white transition active:scale-[.98] sm:mt-0">Continuar <span aria-hidden="true">›</span></Link></div>;
}
