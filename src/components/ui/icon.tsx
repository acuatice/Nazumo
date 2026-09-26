import type { SVGProps } from "react";

export type IconName = "arrow" | "home" | "learn" | "practice" | "progress" | "streak" | "close" | "undo" | "trash" | "check" | "volume";

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    learn: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23Z"/></>,
    practice: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    streak: <path d="M12 22c4 0 7-2.8 7-7.1 0-2.5-1.3-4.8-3.8-6.9.1 2-1.1 3.3-2.3 3.9.2-3.8-2-7.1-5.1-9.1.1 3-1.3 5-2.5 6.7C4.1 11 3 12.7 3 15c0 4.3 3.6 7 9 7Z"/>,
    progress: <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20V7"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    undo: <><path d="m9 7-5 5 5 5"/><path d="M20 17a7 7 0 0 0-7-7H4"/></>,
    trash: <><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="m6 7 1 14h10l1-14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    volume: <><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
