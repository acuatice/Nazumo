"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Icon } from "@/components/ui/icon";
import { vocabulary, type VocabularyEntry } from "@/data/vocabulary";
import {
  countDueVocabulary,
  countKnownVocabulary,
  rateVocabularyItem,
  readVocabularyReviewState,
  selectVocabularyRound,
  writeVocabularyReviewState,
  type VocabularyReviewState,
  type VocabularyRating,
  attachVocabularyReview,
  mergeVocabularyReviews,
  recordVocabularyReviewActivity,
  vocabularyReviewFromProgress,
} from "@/lib/vocabulary/review";
import { loadProgress, replaceProgress } from "@/lib/progress/browser";
import { PROGRESS_EVENT } from "@/lib/progress/repository";

let memoryValue: string | null = null;
const memoryStorage = {
  getItem: () => memoryValue,
  setItem: (_key: string, value: string) => { memoryValue = value; },
};

function getReviewStorage() {
  try { return window.localStorage; }
  catch { return memoryStorage; }
}

export function VocabularyPage() {
  const [review, setReview] = useState<VocabularyReviewState | null>(null);
  const [round, setRound] = useState<readonly VocabularyEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [remembered, setRemembered] = useState(0);
  const [speechStatus, setSpeechStatus] = useState("");

  useEffect(() => {
    const initialize = () => {
      const state = readVocabularyReviewState(getReviewStorage());
      const progress = loadProgress();
      const merged = progress
        ? mergeVocabularyReviews(state, vocabularyReviewFromProgress(progress))
        : state;
      if (progress && JSON.stringify(merged.items) !== JSON.stringify(progress.vocabularyReview ?? {})) {
        replaceProgress(attachVocabularyReview(progress, merged));
      }
      writeVocabularyReviewState(getReviewStorage(), merged);
      setReview(merged);
      setRound(selectVocabularyRound(vocabulary, merged));
    };
    const timer = window.setTimeout(initialize, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleProgressChange = () => {
      const progress = loadProgress();
      if (!progress?.vocabularyReview) return;
      const cloudReview = vocabularyReviewFromProgress(progress);
      setReview((current) => {
        if (!current) return current;
        const merged = mergeVocabularyReviews(current, cloudReview);
        writeVocabularyReviewState(getReviewStorage(), merged);
        return merged;
      });
    };
    window.addEventListener(PROGRESS_EVENT, handleProgressChange);
    return () => window.removeEventListener(PROGRESS_EVENT, handleProgressChange);
  }, []);

  if (!review) return <div className="flex min-h-64 items-center justify-center text-sm text-[var(--muted)]">Preparando vocabulario…</div>;

  const currentReview = review;
  const due = countDueVocabulary(currentReview);
  const known = countKnownVocabulary(currentReview);
  const item = round[index];

  function startNextRound() {
    const nextRound = selectVocabularyRound(vocabulary, currentReview);
    setRound(nextRound);
    setIndex(0);
    setRemembered(0);
    setRevealed(false);
    setCompleted(false);
  }

  function rate(rating: VocabularyRating) {
    if (!item) return;
    const next = rateVocabularyItem(currentReview, item, rating);
    writeVocabularyReviewState(getReviewStorage(), next);
    const progress = loadProgress();
    if (progress) replaceProgress(recordVocabularyReviewActivity(progress, next));
    setReview(next);
    if (rating === "remembered") setRemembered((count) => count + 1);
    setRevealed(false);
    if (index + 1 >= round.length) setCompleted(true);
    else setIndex((current) => current + 1);
  }

  function speakJapanese(text: string) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setSpeechStatus("Este navegador no tiene voz japonesa disponible.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.82;
    utterance.onstart = () => setSpeechStatus("Pronunciación japonesa en curso.");
    utterance.onend = () => setSpeechStatus("");
    utterance.onerror = () => setSpeechStatus("No se pudo reproducir la voz japonesa en este dispositivo.");
    window.speechSynthesis.speak(utterance);
  }

  return <div className="mx-auto max-w-4xl pb-12 pt-4 sm:pt-9 animate-page-in">
    <Link href="/" className="text-sm font-semibold text-[var(--nazumo-purple)]">← Inicio</Link>
    <header className="mt-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--nazumo-purple)]">Vocabulario en contexto</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.06em] sm:text-6xl">Palabras para llevar.</h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">Repasa cinco palabras por tanda. Intenta recordar el significado y marca con sinceridad cuáles quieres volver a ver.</p></header>

    <section aria-label="Tu vocabulario" className="mt-5 grid grid-cols-3 gap-2.5">
      <Stat value={String(vocabulary.length)} label="palabras" />
      <Stat value={String(due)} label="para repasar" tone={due > 0 ? "active" : "default"} />
      <Stat value={`${known}/${vocabulary.length}`} label="consolidadas" />
    </section>

    {item && !completed ? <section aria-live="polite" className="mt-5 overflow-hidden rounded-[1.65rem] bg-white shadow-[0_18px_55px_rgba(52,24,114,.09)]">
      <div className="flex items-center justify-between gap-3 bg-[var(--nazumo-lavender)]/55 px-5 py-4 sm:px-6"><span className="truncate text-xs font-bold uppercase tracking-[.1em] text-[var(--nazumo-purple)]">{item.category}</span><span className="shrink-0 text-xs font-semibold text-[var(--muted)]">{index + 1} / {round.length}</span></div>
      <ProgressBar value={index + 1} max={round.length} label="Progreso de esta tanda" className="mx-5 mt-4 w-[calc(100%-2.5rem)] text-[var(--nazumo-purple)] sm:mx-6 sm:w-[calc(100%-3rem)]" />
      <div key={item.japanese} className="animate-question-in p-5 sm:p-8">
        <p lang="ja" className="font-japanese text-6xl font-bold tracking-wide sm:text-8xl">{item.japanese}</p>
        <p className="mt-3 text-base font-semibold text-[var(--nazumo-purple)]">{item.reading}</p>
        <button type="button" onClick={() => speakJapanese(item.japanese)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--nazumo-purple)]/20 bg-white px-4 text-sm font-bold text-[var(--nazumo-purple)] transition hover:bg-[var(--nazumo-lavender)]/30 active:scale-[.98]" aria-label={`Escuchar pronunciación japonesa de ${item.japanese}`}><Icon name="volume" className="size-4" />Escuchar japonés</button>
        <span className="sr-only" aria-live="polite">{speechStatus}</span>
        {revealed ? <div className="mt-6 rounded-2xl bg-[var(--nazumo-cream)] p-4 animate-feedback-in sm:p-5"><p className="text-xl font-extrabold">{item.meaning}</p><p lang="ja" className="font-japanese mt-4 text-2xl font-bold">{item.example}</p><p className="mt-1 text-sm text-[var(--nazumo-purple)]">{item.exampleReading}</p><p className="mt-2 text-sm text-[var(--muted)]">{item.exampleMeaning}</p></div> : <div className="mt-6 flex min-h-20 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] px-5 text-center text-sm text-[var(--muted)]">¿Qué significa? Piensa un momento antes de revelar.</div>}
        {!revealed ? <button type="button" onClick={() => setRevealed(true)} className="mt-5 min-h-12 w-full rounded-full bg-[var(--nazumo-purple)] px-6 text-sm font-bold text-white transition active:scale-[.99]">Revelar significado</button> : <div className="mt-5 grid grid-cols-2 gap-3"><button type="button" onClick={() => rate("forgot")} className="min-h-12 rounded-full border border-[var(--border)] bg-white px-3 text-sm font-bold text-[var(--sumi)] transition active:scale-[.99]">Me costó</button><button type="button" onClick={() => rate("remembered")} className="min-h-12 rounded-full bg-[var(--nazumo-purple)] px-3 text-sm font-bold text-white transition active:scale-[.99]">La recordaba</button></div>}
      </div>
    </section> : completed ? <section role="status" className="mt-5 rounded-[1.65rem] bg-[var(--nazumo-purple)] p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--nazumo-lime)]">Tanda terminada</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-.05em]">Buen trabajo.</h2><p className="mt-2 text-sm text-white/80">Recordaste {remembered} de {round.length} palabras. Las difíciles volverán antes; las que sabías esperarán más.</p><button type="button" onClick={startNextRound} className="mt-6 min-h-12 w-full rounded-full bg-white px-6 text-sm font-bold text-[var(--nazumo-purple)] transition active:scale-[.99]">Empezar otra tanda</button></section> : <section className="mt-5 rounded-[1.65rem] bg-white p-6 text-center shadow-[0_18px_55px_rgba(52,24,114,.09)] sm:p-8"><span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--nazumo-lime)] text-xl" aria-hidden="true">✓</span><h2 className="mt-4 text-2xl font-extrabold tracking-[-.04em]">No hay repasos pendientes.</h2><p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">Has trabajado las {vocabulary.length} palabras disponibles. Las siguientes aparecerán cuando toque repasarlas.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={startNextRound} className="min-h-12 rounded-full border border-[var(--border)] px-5 text-sm font-bold">Actualizar tanda</button><Link href="/hiragana" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--nazumo-purple)] px-5 text-sm font-bold text-white">Repasar hiragana</Link></div></section>}

    <section className="mt-6 grid gap-3 sm:grid-cols-3">{[["Lee", "Sigue el orden de los trazos y pronuncia cada sílaba."], ["Observa", "Busca el hiragana conocido dentro de cada palabra."], ["Recuerda", "Intenta decir el significado antes de pasar a la siguiente."]].map(([title, body], i) => <article key={title} className="animate-card-in rounded-2xl bg-[var(--nazumo-lavender)]/35 p-5" style={{ animationDelay: `${i * 90}ms` }}><span className="flex size-8 items-center justify-center rounded-full bg-white text-sm font-extrabold text-[var(--nazumo-purple)]">{i + 1}</span><h2 className="mt-4 font-extrabold">{title}</h2><p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{body}</p></article>)}</section>
  </div>;
}

function Stat({ value, label, tone = "default" }: { value: string; label: string; tone?: "default" | "active" }) {
  return <div className={`rounded-2xl p-3.5 ${tone === "active" ? "bg-[var(--nazumo-lime)]/60" : "bg-white"}`}><p className="text-xl font-extrabold tabular-nums">{value}</p><p className="mt-0.5 text-[10px] font-semibold text-[var(--muted)] min-[375px]:text-xs">{label}</p></div>;
}
