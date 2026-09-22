import type { ReactNode } from "react";

export function ExerciseFeedback({ correct, children }: { correct: boolean; children?: ReactNode }) {
  return <div className={`feedback-pop rounded-[var(--radius-control)] px-4 py-3 text-center ${correct ? "bg-[var(--success)]/18" : "bg-[var(--momo)]/55"}`} role="status"><p className="font-bold">{correct ? "¡Correcto!" : "Casi."}</p>{children}</div>;
}
