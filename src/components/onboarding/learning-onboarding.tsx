"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "nazumo:learning-guide-seen";

const steps = [
  {
    eyebrow: "01 · Aprende",
    title: "Un carácter cada vez.",
    body: "Conoce cómo suena cada kana y míralo dentro de una palabra. Avanza a tu ritmo: lo nuevo aparece poco a poco.",
    sample: "あ",
    note: "a · como en あさ (mañana)",
    color: "bg-[var(--nazumo-lavender)]",
  },
  {
    eyebrow: "02 · Reconoce",
    title: "Encuentra su sonido.",
    body: "En Práctica verás un carácter y elegirás su rōmaji. Si dudas, te damos la respuesta para que puedas seguir aprendiendo.",
    sample: "い",
    note: "¿Cuál es su rōmaji? · i",
    color: "bg-[var(--nazumo-pink)]",
  },
  {
    eyebrow: "03 · Recuerda",
    title: "Recupéralo de memoria.",
    body: "Después, escribe el sonido sin pistas. Tus avances quedan guardados y los caracteres que cuestan vuelven a aparecer.",
    sample: "う → u",
    note: "Aprende · reconoce · recuerda",
    color: "bg-[var(--nazumo-lime)]",
  },
];

export function LearningOnboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const finish = useCallback(() => {
    try { window.localStorage.setItem(STORAGE_KEY, "true"); } catch { /* The guide still works when browser storage is unavailable. */ }
    setOpen(false);
    setStep(0);
  }, []);

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      try { setOpen(window.localStorage.getItem(STORAGE_KEY) !== "true"); }
      catch { setOpen(false); }
    }, 0);
    return () => window.clearTimeout(initialize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [finish, open]);

  const current = steps[step];

  return <>
    <button type="button" onClick={() => { setStep(0); setOpen(true); }} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--nazumo-purple)]/15 bg-white/75 px-4 text-sm font-bold text-[var(--nazumo-purple)] transition hover:-translate-y-0.5 hover:shadow-md active:scale-[.98]">
      <span aria-hidden="true" className="flex size-5 items-center justify-center rounded-full bg-[var(--nazumo-lavender)] text-xs">?</span>
      Cómo funciona
    </button>

    {open && createPortal(<div className="onboarding-overlay fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[var(--nazumo-ink)]/45 p-3 pt-[max(.75rem,env(safe-area-inset-top))] backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) finish(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="onboarding-title" aria-describedby="onboarding-description" className="onboarding-card relative my-auto w-full max-w-lg overflow-hidden rounded-[1.65rem] bg-white p-4 shadow-[0_30px_100px_rgba(29,27,45,.28)] min-[375px]:p-5 sm:rounded-[2rem] sm:p-8">
        <div className={`onboarding-art flex min-h-40 items-center justify-center overflow-hidden rounded-[1.5rem] ${current.color}`}>
          <span aria-hidden="true" className="onboarding-orbit onboarding-orbit-one" />
          <span aria-hidden="true" className="onboarding-orbit onboarding-orbit-two" />
          <span lang="ja" className="onboarding-kana font-japanese relative z-10 text-7xl font-bold tracking-tight text-[var(--nazumo-ink)] sm:text-8xl">{current.sample}</span>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs font-extrabold uppercase tracking-[.13em] text-[var(--nazumo-purple)]">{current.eyebrow}</p>
          <button type="button" onClick={finish} className="min-h-10 rounded-full px-3 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--nazumo-cream)] hover:text-[var(--nazumo-ink)]">Saltar guía</button>
        </div>
        <h2 id="onboarding-title" className="mt-2 text-3xl font-extrabold leading-tight tracking-[-.05em] sm:text-4xl">{current.title}</h2>
        <p id="onboarding-description" className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{current.body}</p>
        <p className="mt-4 inline-flex min-h-9 items-center rounded-full bg-[var(--nazumo-cream)] px-3 text-xs font-bold text-[var(--nazumo-ink)]">{current.note}</p>

        <div className="mt-7 flex items-center justify-between gap-4">
          <div role="group" className="flex items-center gap-2" aria-label={`Paso ${step + 1} de ${steps.length}`}>
            {steps.map((item, index) => <span key={item.eyebrow} className={`h-1.5 rounded-full transition-all duration-300 ${index === step ? "w-8 bg-[var(--nazumo-purple)]" : "w-1.5 bg-[var(--nazumo-lavender)]"}`} />)}
          </div>
          {step < steps.length - 1
            ? <button type="button" onClick={() => setStep((value) => value + 1)} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--nazumo-purple)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--nazumo-purple-deep)] active:scale-[.98]">Siguiente <span aria-hidden="true">→</span></button>
            : <Link href="/hiragana" onClick={finish} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--nazumo-purple)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--nazumo-purple-deep)] active:scale-[.98]">Empezar a aprender <span aria-hidden="true">→</span></Link>}
        </div>
      </section>
    </div>, document.body)}
  </>;
}
