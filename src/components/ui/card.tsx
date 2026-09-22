import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <article className={`rounded-[var(--radius-card)] bg-white ${className}`} {...props} />;
}

export function HeroCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[var(--radius-hero)] bg-[var(--nazumo-purple)] text-white ${className}`}>{children}</section>;
}
