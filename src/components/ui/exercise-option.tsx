import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ExerciseOptionState = "idle" | "correct" | "incorrect" | "disabled";

const states: Record<ExerciseOptionState, string> = {
  idle: "border border-[var(--border)] bg-white text-[var(--sumi)] hover:-translate-y-0.5 hover:border-[var(--nazumo-purple)] hover:bg-[var(--accent-soft)] active:scale-[.98]",
  correct: "answer-correct bg-[var(--success)] text-[var(--sumi)] ring-2 ring-[var(--sumi)]/10",
  incorrect: "answer-incorrect bg-[var(--momo)] text-[var(--sumi)] ring-2 ring-[var(--error)]/30",
  disabled: "bg-white text-[var(--muted)] opacity-45",
};

export function ExerciseOption({ state = "idle", children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { state?: ExerciseOptionState; children: ReactNode }) {
  return <button type="button" className={`answer-option-in min-h-[4.25rem] touch-manipulation rounded-[1.25rem] px-4 text-lg font-bold transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 sm:min-h-18 ${states[state]} ${className}`} {...props}>{children}</button>;
}
