"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { RecognitionOptions } from "@/components/practice/recognition-options";
import { TypingAnswer } from "@/components/practice/typing-answer";
import { hiraganaCharacters } from "@/data/hiragana";
import { usePracticeSession } from "@/hooks/use-practice-session";
import { createKanaToRomajiItems, DEFAULT_SESSION_SIZE } from "@/lib/practice/session";
import type { KanaCharacter } from "@/lib/types";
import type { PracticeCompletionResult } from "@/lib/practice/types";
import { Button } from "@/components/ui/button";
import { ExerciseFeedback } from "@/components/ui/exercise-feedback";

interface PracticeSessionProps {
  characters?: readonly KanaCharacter[];
  sessionSize?: number;
  onComplete?: (result: PracticeCompletionResult) => void;
  embedded?: boolean;
}

export function PracticeSession({ characters = hiraganaCharacters, sessionSize = DEFAULT_SESSION_SIZE, onComplete, embedded = false }: PracticeSessionProps) {
  const items = useMemo(() => createKanaToRomajiItems(characters, "hiragana"), [characters]);
  const inputRef = useRef<HTMLInputElement>(null);
  const completionReported = useRef(false);
  const practice = usePracticeSession(items, sessionSize, inputRef);

  useEffect(() => {
    if (practice.stage !== "complete") {
      completionReported.current = false;
      return;
    }
    if (!onComplete || completionReported.current) return;
    completionReported.current = true;
    onComplete({ recognitionCorrect: practice.recognitionScore, typingCorrect: practice.typingScore, totalCharacters: practice.session.length, needsReview: practice.needsReview });
  }, [onComplete, practice.needsReview, practice.recognitionScore, practice.session.length, practice.stage, practice.typingScore]);

  if (practice.stage === "loading") {
    return <div className="flex min-h-[32rem] items-center justify-center text-sm text-[var(--muted)]">Preparando práctica…</div>;
  }

  if (practice.stage === "transition") {
    return (
      <section className="w-full max-w-2xl rounded-[var(--radius-hero)] bg-white p-7 text-center nazumo-shadow sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--nazumo-purple)]">Reconocimiento completado</p>
        <div className="relative mx-auto my-7 h-36 w-52 overflow-hidden"><Image src="/brand/nazumo-character.png" alt="Personaje de Nazumo celebrando" fill sizes="208px" className="object-cover object-bottom mix-blend-multiply" /></div>
        <h1 className="mx-auto max-w-lg text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-4xl">¡Bien! Ahora vamos a recordarlos sin ayuda.</h1>
        <p className="mt-5 text-sm text-[var(--muted)]">Los mismos {practice.session.length} caracteres, en un orden nuevo.</p>
        <Button type="button" onClick={practice.beginTypingPhase} className="mt-9 w-full">Empezar recuerdo</Button>
      </section>
    );
  }

  if (practice.stage === "complete") {
    if (embedded) return null;
    const totalAnswers = practice.session.length * 2;
    const totalCorrect = practice.recognitionScore + practice.typingScore;
    const accuracy = totalAnswers === 0 ? 0 : Math.round((totalCorrect / totalAnswers) * 100);
    return (
      <section className="w-full max-w-2xl rounded-[var(--radius-hero)] bg-white p-7 text-center nazumo-shadow sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--nazumo-purple)]">Sesión completada</p>
        <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl">Buen trabajo.</h1>
        <div className="my-7 grid gap-3 text-left min-[375px]:grid-cols-2 sm:my-9">
          <div className="rounded-2xl bg-[var(--background)] p-5"><p className="text-sm text-[var(--muted)]">Reconocimiento</p><p className="mt-3 text-3xl font-medium tracking-[-0.04em]">{practice.recognitionScore} / {practice.session.length}</p></div>
          <div className="rounded-2xl bg-[var(--background)] p-5"><p className="text-sm text-[var(--muted)]">Escritura</p><p className="mt-3 text-3xl font-medium tracking-[-0.04em]">{practice.typingScore} / {practice.session.length}</p></div>
        </div>
        <p className="text-lg"><span className="font-medium">{accuracy}%</span> <span className="text-[var(--muted)]">precisión global</span></p>
        <div className="mt-8 border-t border-[var(--border)] pt-7 text-left">
          <p className="text-sm font-medium">Caracteres que necesitan repaso</p>
          {practice.needsReview.length > 0 ? <div className="mt-4 flex flex-wrap gap-2">{practice.needsReview.map((item) => <span key={item.id} className="rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-xl">{item.prompt}<span className="ml-2 text-xs text-[var(--muted)]">{item.displayAnswer}</span></span>)}</div> : <p className="mt-3 text-sm text-[var(--muted)]">Ninguno en esta sesión.</p>}
        </div>
        <div className="mt-9 grid gap-3 sm:grid-cols-2">
          <Button type="button" onClick={practice.startNewSession}>Practicar de nuevo</Button>
          <Link href="/" className="inline-flex min-h-13 items-center justify-center rounded-[var(--radius-button)] bg-[var(--rice)] px-6 text-sm font-bold transition active:scale-[.98]">Volver al inicio</Link>
        </div>
      </section>
    );
  }

  const current = practice.currentItem;
  if (!current) return null;
  const answeredQuestions = practice.currentIndex + (practice.interaction === "feedback" ? 1 : 0);
  const progress = (answeredQuestions / practice.phaseItems.length) * 100;
  const isRecognition = practice.stage === "recognition";

  return (
    <section className="w-full max-w-2xl rounded-[var(--radius-hero)] bg-white p-4 min-[375px]:p-5 sm:p-9 sm:nazumo-shadow">
      <header>
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Abandonar práctica" className="flex size-11 items-center justify-center rounded-full bg-[var(--background)] text-lg font-medium text-[var(--muted)] transition hover:text-[var(--sumi)] focus-visible:outline-2">×</Link>
          <div className="text-right"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--nazumo-purple)]">{isRecognition ? "Reconocer" : "Recordar"}</p><p className="mt-1 text-sm tabular-nums text-[var(--muted)]">{practice.currentIndex + 1} / {practice.phaseItems.length}</p></div>
        </div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--accent-soft)]" role="progressbar" aria-valuemin={0} aria-valuemax={practice.phaseItems.length} aria-valuenow={answeredQuestions} aria-label={`Progreso de la fase ${isRecognition ? "de reconocimiento" : "de escritura"}`}><div className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300 ease-out" style={{ width: `${progress}%` }} /></div>
      </header>

      <div key={`${practice.stage}:${current.id}`} className="animate-[question-in_.18s_ease-out] py-8 text-center min-[375px]:py-10 sm:py-14">
        <p className="text-sm font-bold text-[var(--sumi)]">{isRecognition ? "¿Cuál es su rōmaji?" : "Escribe su rōmaji"}</p>
        <div lang="ja" className="font-japanese mt-5 animate-[nazumo-pop_.2s_ease-out] text-[8.5rem] font-medium leading-none tracking-[-0.08em] sm:text-[11rem]">{current.prompt}</div>
      </div>

      {isRecognition ? (
        <>
          <RecognitionOptions options={practice.options} feedback={practice.feedback} onSelect={practice.selectOption} />
          <div className="min-h-20 py-4 text-center" aria-live="polite">
            {practice.feedback && <ExerciseFeedback correct={practice.feedback.isCorrect}>{!practice.feedback.isCorrect && <p className="mt-1 text-sm">La respuesta es <strong>{practice.feedback.correctAnswer}</strong></p>}</ExerciseFeedback>}
          </div>
          {!practice.feedback?.isCorrect && practice.interaction === "feedback" && <Button type="button" onClick={practice.moveNext} className="w-full">Continuar</Button>}
        </>
      ) : (
        <TypingAnswer prompt={current.prompt} answer={practice.answer} feedback={practice.feedback} interaction={practice.interaction} inputRef={inputRef} onAnswerChange={practice.setAnswer} onSubmit={practice.submitTypingAnswer} onContinue={practice.moveNext} />
      )}
    </section>
  );
}
