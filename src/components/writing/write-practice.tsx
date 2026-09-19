"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Ten } from "@/components/brand/ten";
import { Button } from "@/components/ui/button";
import { WritingCanvas } from "@/components/writing/writing-canvas";
import { hiraganaCharacters } from "@/data/hiragana";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";
import { selectProgressiveCharacters } from "@/lib/practice/selection";

export function WritePractice() {
  const snapshot = useLearningSnapshot();
  const [index, setIndex] = useState(0);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const studied = useMemo(() => snapshot ? selectProgressiveCharacters(snapshot, hiraganaCharacters) : [], [snapshot]);
  if (!snapshot) return <p className="text-sm text-[var(--muted)]">Preparando el lienzo…</p>;
  if (studied.length === 0) return <section className="max-w-md text-center"><Ten mood="pointing" className="mx-auto" /><h1 className="mt-6 text-3xl font-extrabold">Conoce primero un carácter</h1><p className="mt-3 text-[var(--muted)]">La práctica de escritura solo utiliza kana que ya hayas estudiado.</p><Link href="/hiragana/unit/1" className="mt-7 inline-flex min-h-12 items-center rounded-[var(--radius-button)] bg-[var(--kaku-purple)] px-5 text-sm font-bold text-white">Empezar hiragana</Link></section>;
  const current = studied[index % studied.length];
  const next = () => { setIndex((value) => (value + 1) % studied.length); setHasStrokes(false); setRevealed(false); };
  return <section className="w-full max-w-xl py-4"><header className="mb-5 flex items-center justify-between"><Link href="/practice" className="text-sm font-semibold text-[var(--muted)]">Salir</Link><span className="text-xs font-bold uppercase tracking-[.12em] text-[var(--kaku-purple)]">Escribir</span></header><div className="mb-5 text-center"><p className="text-sm text-[var(--muted)]">Escribe el carácter</p><h1 className="mt-1 text-4xl font-extrabold uppercase tracking-[.12em]">{current.romaji}</h1></div><WritingCanvas key={current.character} character={current.character} onStrokeChange={setHasStrokes} />{revealed ? <div className="mt-5 rounded-[var(--radius-card)] bg-[var(--yuzu)] p-5 text-center"><p className="text-sm font-semibold">Compara tu trazo</p><p lang="ja" className="font-japanese mt-2 text-6xl font-bold">{current.character}</p><Button onClick={next} className="mt-4 w-full">Siguiente carácter</Button></div> : <Button onClick={() => setRevealed(true)} disabled={!hasStrokes} className="mt-5 w-full">Comprobar</Button>}</section>;
}
