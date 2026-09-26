export type TenMood = "idle" | "happy" | "thinking" | "pointing";

export function Ten({ mood = "idle", size = 72, className = "" }: { mood?: TenMood; size?: number; className?: string }) {
  const mouth = mood === "happy" ? "M29 39c3 5 9 5 12 0" : mood === "thinking" ? "M31 41h8" : "M32 40c2 2 4 2 6 0";
  const moodLabel = { idle: "tranquilo", happy: "feliz", thinking: "pensando", pointing: "señalando" }[mood];
  return <svg width={size} height={size} viewBox="0 0 72 72" className={`overflow-visible ${className}`} role="img" aria-label={`Ten, ${moodLabel}`}><path className="ten-bob" d="M36 5c17 0 29 11 29 28 0 18-10 32-29 34C17 66 6 53 7 35 8 17 19 6 36 5Z" fill="var(--yuzu)"/><circle cx="28" cy="31" r="2.5" fill="var(--sumi)"/><circle cx="44" cy="31" r="2.5" fill="var(--sumi)"/><path d={mouth} fill="none" stroke="var(--sumi)" strokeWidth="2.5" strokeLinecap="round"/>{mood === "pointing" && <><path d="M61 40c9-2 11-8 8-12" fill="none" stroke="var(--sumi)" strokeWidth="3" strokeLinecap="round"/><circle cx="69" cy="26" r="3" fill="var(--yuzu)" stroke="var(--sumi)" strokeWidth="2"/></>}</svg>;
}
