"use client";

import Link from "next/link";
import { useState } from "react";
import { vocabulary } from "@/data/vocabulary";

export function VocabularyPage() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = vocabulary[index];
  const next = () => { setIndex((current) => (current + 1) % vocabulary.length); setRevealed(false); };
  return <div className="mx-auto max-w-4xl pb-12 pt-4 sm:pt-9 animate-page-in">
    <Link href="/" className="text-sm font-semibold text-[var(--nazumo-purple)]">← Inicio</Link>
    <header className="mt-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--nazumo-purple)]">Vocabulario en contexto</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.06em] sm:text-6xl">Palabras para llevar.</h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">Descubre palabras cotidianas dentro de frases. Léelas en voz alta y fíjate en el hiragana que ya conoces.</p></header>
    <section aria-live="polite" className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_55px_rgba(52,24,114,.09)]">
      <div className="flex items-center justify-between bg-[var(--nazumo-lavender)]/55 px-6 py-4"><span className="text-xs font-bold uppercase tracking-[.1em] text-[var(--nazumo-purple)]">{item.category}</span><span className="text-xs font-semibold text-[var(--muted)]">{index + 1} / {vocabulary.length}</span></div>
      <div key={index} className="animate-question-in p-6 sm:p-10"><p lang="ja" className="font-japanese text-6xl font-bold tracking-wide sm:text-8xl">{item.japanese}</p><p className="mt-3 text-base font-semibold text-[var(--nazumo-purple)]">{item.reading}</p>
        {revealed ? <div className="mt-7 rounded-2xl bg-[var(--nazumo-cream)] p-5 animate-feedback-in"><p className="text-xl font-extrabold">{item.meaning}</p><p lang="ja" className="font-japanese mt-4 text-2xl font-bold">{item.example}</p><p className="mt-1 text-sm text-[var(--nazumo-purple)]">{item.exampleReading}</p><p className="mt-2 text-sm text-[var(--muted)]">{item.exampleMeaning}</p></div> : <div className="mt-7 flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] px-5 text-center text-sm text-[var(--muted)]">¿Qué crees que significa? Piensa un momento antes de revelar.</div>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">{!revealed ? <button onClick={() => setRevealed(true)} className="min-h-12 flex-1 rounded-full bg-[var(--nazumo-purple)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5">Revelar significado</button> : <button onClick={next} className="min-h-12 flex-1 rounded-full bg-[var(--nazumo-purple)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5">Siguiente palabra →</button>}<Link href="/hiragana" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--nazumo-cream)] px-6 text-sm font-bold">Repasar hiragana</Link></div>
      </div>
    </section>
    <section className="mt-8 grid gap-3 sm:grid-cols-3">{[["Lee", "Sigue el orden de los trazos y pronuncia cada sílaba."], ["Observa", "Busca el hiragana conocido dentro de cada palabra."], ["Recuerda", "Intenta decir el significado antes de pasar a la siguiente."]].map(([title, body], i) => <article key={title} className="animate-card-in rounded-2xl bg-[var(--nazumo-lavender)]/35 p-5" style={{ animationDelay: `${i * 90}ms` }}><span className="flex size-8 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[var(--nazumo-purple)]">{i + 1}</span><h2 className="mt-4 font-extrabold">{title}</h2><p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{body}</p></article>)}</section>
  </div>;
}
