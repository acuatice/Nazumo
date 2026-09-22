"use client";

import { useState } from "react";
import type { CharacterVisualState } from "@/components/kana/character-card";
import { CharacterGrid } from "@/components/kana/character-grid";
import { KanaDetail } from "@/components/kana/kana-detail";
import { ProgressBar } from "@/components/ui/progress-bar";
import { hiraganaCharacters } from "@/data/hiragana";
import { useLearningSnapshot } from "@/hooks/use-learning-snapshot";
import { getInitialLearningState, getKanaRows } from "@/lib/kana";
import type { KanaCharacter } from "@/lib/types";

export function KanaCollection() {
  const snapshot = useLearningSnapshot();
  const [selected, setSelected] = useState<KanaCharacter | null>(null);
  const rows = getKanaRows(hiraganaCharacters);
  const learned = snapshot?.learnedIds.length ?? 0;

  const stateFor = (kana: KanaCharacter): CharacterVisualState => {
    const id = `hiragana:${kana.character}`;
    if (snapshot?.reviewIds.includes(id)) return "review";
    if (snapshot?.learnedIds.includes(id)) return "mastered";
    if (snapshot?.introducedIds.includes(id)) return "learning";
    return "new";
  };

  return <>
    <header className="mb-8"><p className="text-sm font-semibold text-[var(--nazumo-purple)]">Colección de kana</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-0.055em] sm:text-6xl">Hiragana</h1><div className="mt-7 flex items-center justify-between text-sm"><span><strong>{learned}</strong> de 46 aprendidos</span><span className="text-[var(--muted)]">{Math.round((learned / 46) * 100)}%</span></div><ProgressBar value={learned} max={46} label="Hiragana aprendidos" className="mt-3 text-[var(--nazumo-purple)]" /></header>
    <CharacterGrid rows={rows} stateFor={stateFor} onSelect={setSelected} />
    <div className="mt-7 flex flex-wrap gap-4 text-xs text-[var(--muted)]"><Legend color="bg-white" label="No aprendido" /><Legend color="bg-[var(--accent-soft)]" label="Aprendiendo" /><Legend color="bg-[var(--nazumo-purple)]" label="Aprendido" /><Legend color="bg-[var(--momo)]" label="Repaso" /></div>
    {selected && <KanaDetail kana={selected} state={stateFor(selected) === "mastered" ? "learned" : stateFor(selected) === "review" ? "needs-review" : stateFor(selected) === "learning" ? "learning" : getInitialLearningState()} onClose={() => setSelected(null)} />}
  </>;
}

function Legend({ color, label }: { color: string; label: string }) { return <span className="flex items-center gap-2"><span className={`size-3 rounded-full ${color}`} />{label}</span>; }
