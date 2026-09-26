"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconName } from "@/components/ui/icon";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { NazumoLogo } from "@/components/brand/nazumo-logo";
import { useLearnerProfile } from "@/components/account/profile-store";
import { useAuthenticatedLearner } from "@/hooks/use-authenticated-learner";

const links = [
  { href: "/", label: "Inicio", icon: "home" as IconName },
  { href: "/hiragana", label: "Aprender", icon: "learn" as IconName },
  { href: "/practice", label: "Práctica", icon: "practice" as IconName },
  { href: "/progress", label: "Progreso", icon: "progress" as IconName },
];

export function Navigation() {
  const pathname = usePathname();
  const profile = useLearnerProfile();
  const account = useAuthenticatedLearner();
  const learnerName = account?.name || profile?.name;
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/hiragana" && pathname.startsWith("/learn"));
  if (pathname.startsWith("/practice") || pathname.endsWith("/write")) return null;
  return <>
    <header className="sticky top-0 z-30 -mx-4 flex h-[4.25rem] items-center justify-between border-b border-black/[.035] bg-[var(--background)]/90 px-4 backdrop-blur-xl min-[375px]:-mx-5 min-[375px]:px-5 sm:-mx-8 sm:px-8 lg:-mx-10 lg:h-24 lg:px-10">
      <Link href="/" aria-label="nazumo, inicio"><NazumoLogo /></Link>
      <nav className="hidden items-center gap-1 rounded-full border border-black/[.04] bg-white p-1.5 shadow-sm md:flex">
        {links.map((link) => <Link key={link.href} href={link.href} className={`rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[.98] ${isActive(link.href) ? "bg-[var(--nazumo-purple)] text-white" : "text-[var(--muted)] hover:bg-[var(--rice)] hover:text-[var(--sumi)]"}`}>{link.label}</Link>)}
      </nav>
      <Link href="/cuenta" aria-label={learnerName ? `Perfil de ${learnerName}` : "Crear perfil"} className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-[var(--nazumo-lavender)] text-xs font-bold text-[var(--nazumo-purple)] ring-2 ring-white transition hover:scale-105">{learnerName ? learnerName.slice(0, 1).toUpperCase() : "日"}</Link>
    </header>
    <BottomNavigation items={links} isActive={isActive} />
  </>;
}
