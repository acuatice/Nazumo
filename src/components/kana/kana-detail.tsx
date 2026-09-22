"use client";

import { useEffect } from "react";
import { IconButton } from "@/components/ui/icon-button";
import type { KanaCharacter, LearningState } from "@/lib/types";
import { learningStateLabels } from "@/lib/kana";

interface KanaDetailProps {
  kana: KanaCharacter;
  state: LearningState;
  onClose: () => void;
}

export function KanaDetail({ kana, state, onClose }: KanaDetailProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--sumi)]/35 p-3 backdrop-blur-[3px] sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="kana-detail-title" className="w-full max-w-md rounded-[var(--radius-hero)] bg-white p-6 shadow-[0_30px_100px_rgba(23,23,25,.24)] sm:p-8">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[var(--yuzu)] px-3 py-1.5 text-xs font-bold text-[var(--sumi)]">{learningStateLabels[state]}</span>
          <IconButton icon="close" label="Cerrar detalle del kana" onClick={onClose} />
        </div>

        <div className="py-10 text-center">
          <h2 id="kana-detail-title" className="font-japanese text-[8rem] font-normal leading-none tracking-[-0.08em]">{kana.character}</h2>
          <p className="mt-5 text-lg font-extrabold tracking-[0.12em] text-[var(--nazumo-purple)]">{kana.romaji}</p>
        </div>

        {kana.example && (
          <div className="rounded-[var(--radius-button)] bg-[var(--rice)] p-5">
            <p className="text-xs font-bold text-[var(--nazumo-purple)]">Ejemplo</p>
            <div className="mt-4 flex items-end justify-between gap-6">
              <div>
                <p className="font-japanese text-3xl leading-none">{kana.example}</p>
                {kana.exampleReading && kana.exampleReading !== kana.example && <p className="mt-2 text-sm text-[var(--muted)]">{kana.exampleReading}</p>}
              </div>
              <p className="text-right text-sm text-[var(--muted)]">{kana.exampleMeaning}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
