"use client";

import Link from "next/link";
import { useState } from "react";
import { KanaDrawingCanvas } from "@/components/writing/kana-drawing-canvas";
import { KanaStrokeReference } from "@/components/writing/kana-stroke-reference";
import { Button, ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { HiraganaUnit } from "@/data/hiragana-curriculum";
import { hiraganaStrokeData } from "@/data/hiragana-strokes";
import { updateCharacterProgress } from "@/lib/progress/browser";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";
import { hasDrawableStroke } from "@/lib/drawing/model";
import type { DrawingLevel, DrawingStroke } from "@/lib/drawing/types";

const levels: { id: DrawingLevel; title: string; description: string }[] = [
  { id: "trace", title: "Calcar", description: "Sigue la forma y el orden de los trazos." },
  { id: "copy", title: "Copiar", description: "Observa el kana y cópialo en el papel." },
  { id: "memory", title: "Memoria", description: "Recuerda el kana solamente por su sonido." },
];

export function DrawingPracticeSession({ unit }: { unit: HiraganaUnit }) {
  const snapshot = useLearningSnapshot();
  const [level, setLevel] = useState<DrawingLevel>("trace"); const [index, setIndex] = useState(0); const [strokes, setStrokes] = useState<readonly DrawingStroke[]>([]); const [evaluating, setEvaluating] = useState(false); const [results, setResults] = useState<Record<string, boolean>>({}); const [sessionKey, setSessionKey] = useState(0);
  const current = unit.characters[index]; const data = current ? hiraganaStrokeData[current.character] : hiraganaStrokeData[unit.characters[0].character]; const complete = index >= unit.characters.length;
  const resetSession = (nextLevel = level) => { setLevel(nextLevel); setIndex(0); setStrokes([]); setEvaluating(false); setResults({}); setSessionKey((value) => value + 1); };
  const advance = (correct: boolean) => { updateCharacterProgress({ id: `hiragana:${current.character}`, prompt: current.character, acceptedAnswers: [current.romaji], displayAnswer: current.romaji, writingSystem: "hiragana", mode: "kana-to-romaji", group: current.group }, "drawing", correct); setResults((value) => ({ ...value, [current.character]: correct })); setStrokes([]); setEvaluating(false); setIndex((value) => value + 1); setSessionKey((value) => value + 1); };
  const check = () => { if (level === "trace") advance(true); else setEvaluating(true); };

  if (!snapshot) return <div className="flex min-h-[30rem] items-center justify-center text-sm text-[var(--muted)]">Preparando el papel…</div>;
  const accessible = snapshot.completedUnitIds.includes(unit.id) || unit.id <= snapshot.currentUnitId;
  if (!accessible) return <section className="mx-auto max-w-xl py-24 text-center"><h1 className="text-3xl font-extrabold">Esta unidad aún está bloqueada</h1><p className="mt-3 text-[var(--muted)]">Conoce primero los caracteres de las unidades anteriores.</p><ButtonLink href="/hiragana" className="mt-7">Volver a las unidades</ButtonLink></section>;
  if (complete) {
    const review = unit.characters.filter((kana) => results[kana.character] === false);
    return <section className="mx-auto w-full max-w-xl py-8 text-center"><p className="text-sm font-bold text-[var(--nazumo-purple)]">Unidad {unit.id}</p><h1 className="mt-4 text-4xl font-extrabold tracking-[-.05em]">Práctica de escritura completada</h1><div className="mt-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-5 text-left">{unit.characters.map((kana) => <div key={kana.character} className="flex min-h-12 items-center justify-between border-b border-[var(--border)] last:border-0"><span lang="ja" className="font-japanese text-3xl">{kana.character}</span><span className="font-bold" aria-label={results[kana.character] ? "Bien" : "Necesita práctica"}>{results[kana.character] ? "✓" : "↻"}</span></div>)}</div>{review.length ? <p className="mt-5 text-sm text-[var(--muted)]"><span lang="ja" className="font-japanese text-lg text-[var(--sumi)]">{review.map((kana) => kana.character).join("、")}</span> {review.length === 1 ? "volverá" : "volverán"} a aparecer en tus repasos.</p> : <p className="mt-5 text-sm text-[var(--muted)]">Todos los caracteres han quedado marcados como bien realizados.</p>}<div className="mt-8 grid gap-3 sm:grid-cols-2"><Button type="button" onClick={() => resetSession()}>Practicar de nuevo</Button><ButtonLink href={`/hiragana/unit/${unit.id}`} variant="neutral" className="border border-[var(--border)]">Volver a la unidad</ButtonLink></div></section>;
  }

  const enoughTraceStrokes = level !== "trace" || strokes.filter((stroke) => stroke.points.length > 1).length >= data.paths.length;
  return <section className="mx-auto w-full max-w-xl py-3 sm:py-8"><header className="mb-4 flex items-center justify-between"><Link href={`/hiragana/unit/${unit.id}`} className="min-h-11 py-3 text-sm font-semibold text-[var(--muted)]">Salir</Link><span className="text-xs font-bold uppercase tracking-[.12em] text-[var(--nazumo-purple)]">Dibujar · {index + 1} / {unit.characters.length}</span></header><ProgressBar value={index + 1} max={unit.characters.length} label="Progreso de la práctica de escritura" />
    <div className="my-4 grid grid-cols-3 gap-2" aria-label="Nivel de práctica">{levels.map((item) => <button key={item.id} type="button" aria-pressed={level === item.id} onClick={() => resetSession(item.id)} className={`min-h-12 rounded-[var(--radius-control)] px-2 text-sm font-bold transition ${level === item.id ? "bg-[var(--nazumo-purple)] text-white" : "border border-[var(--border)] bg-white text-[var(--muted)]"}`}>{item.title}</button>)}</div>
    <div className="mb-4 text-center"><p className="text-sm text-[var(--muted)]">{levels.find((item) => item.id === level)?.description}</p>{level === "memory" ? <h1 className="mt-1 text-3xl font-extrabold">Escribe «{current.romaji}»</h1> : <div className="mt-2 flex items-center justify-center gap-3"><span className="text-sm font-bold">{level === "trace" ? "Traza" : "Copia"}</span>{level === "copy" ? <KanaStrokeReference data={data} className="size-16 text-[var(--sumi)]" /> : <span lang="ja" className="font-japanese text-4xl">{current.character}</span>}</div>}</div>
    <KanaDrawingCanvas key={`${sessionKey}-${current.character}`} data={data} level={level} comparison={evaluating} onChange={setStrokes} />
    {evaluating ? <div className="mt-4 rounded-[var(--radius-card)] bg-[var(--accent-soft)] p-5 text-center" role="status"><p className="font-bold">¿Cómo te ha salido?</p><p className="mt-1 text-sm text-[var(--muted)]">La referencia violeta está superpuesta a tu dibujo.</p><div className="mt-4 grid grid-cols-2 gap-3"><Button type="button" onClick={() => advance(true)}>Bien</Button><Button type="button" onClick={() => advance(false)} variant="neutral" className="border border-[var(--border)]">Necesito practicar</Button></div></div> : <div className="mt-4"><Button type="button" onClick={check} disabled={!hasDrawableStroke(strokes) || !enoughTraceStrokes} className="w-full">Comprobar</Button>{level === "trace" && hasDrawableStroke(strokes) && !enoughTraceStrokes ? <p className="mt-2 text-center text-xs text-[var(--muted)]">Este kana tiene {data.paths.length} trazos. Completa todos antes de comprobar.</p> : null}</div>}
  </section>;
}
