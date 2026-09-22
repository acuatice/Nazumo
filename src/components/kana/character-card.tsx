import type { ButtonHTMLAttributes } from "react";

export type CharacterVisualState = "new" | "learning" | "mastered" | "review";

const stateStyles: Record<CharacterVisualState, string> = {
  new: "bg-white text-[var(--sumi)]/25",
  learning: "bg-[var(--accent-soft)] text-[var(--nazumo-purple)]",
  mastered: "bg-[var(--nazumo-purple)] text-[var(--yuzu)]",
  review: "bg-[var(--momo)] text-[var(--sumi)]",
};

const stateLabels: Record<CharacterVisualState, string> = {
  new: "No aprendido",
  learning: "Aprendiendo",
  mastered: "Aprendido",
  review: "Necesita repaso",
};

export function CharacterCard({ character, state, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { character: string; state: CharacterVisualState }) {
  return <button type="button" className={`font-japanese group relative aspect-square min-h-14 touch-manipulation rounded-[var(--radius-control)] text-[clamp(2rem,8vw,3.5rem)] font-medium transition duration-150 active:scale-[.96] focus-visible:outline-2 focus-visible:outline-offset-2 ${stateStyles[state]} ${className}`} {...props}><span className="transition-transform duration-150 group-hover:scale-105">{character}</span>{state === "review" && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[var(--error)]" aria-hidden="true" />}<span className="sr-only">Estado: {stateLabels[state]}</span></button>;
}
