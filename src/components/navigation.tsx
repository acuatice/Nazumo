"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconName } from "@/components/ui/icon";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { NazumoLogo } from "@/components/brand/nazumo-logo";
import { useLearnerProfile } from "@/components/account/profile-store";

const links = [
  { href: "/", label: "Inicio", icon: "home" as IconName },
  { href: "/hiragana", label: "Aprender", icon: "learn" as IconName },
  { href: "/practice", label: "Práctica", icon: "practice" as IconName },
  { href: "/progress", label: "Progreso", icon: "progress" as IconName },
];

export function Navigation() {
  const pathname = usePathname();
  const profile = useLearnerProfile();
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/hiragana" && pathname.startsWith("/learn"));
  if (pathname.startsWith("/practice") || pathname.endsWith("/write")) return null;
  return <>
    <header className="flex h-20 items-center justify-between lg:h-24">
      <Link href="/" aria-label="nazumo, inicio"><NazumoLogo /></Link>
      <nav className="hidden items-center gap-1 rounded-full border border-black/[.04] bg-white p-1.5 shadow-sm md:flex">
        {links.map((link) => <Link key={link.href} href={link.href} className={`rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[.98] ${isActive(link.href) ? "bg-[var(--kaku-purple)] text-white" : "text-[var(--muted)] hover:bg-[var(--rice)] hover:text-[var(--sumi)]"}`}>{link.label}</Link>)}
      </nav>
      <Link href="/cuenta" aria-label={profile ? `Perfil de ${profile.name}` : "Crear perfil"} className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-[var(--nazumo-lavender)] text-xs font-bold text-[var(--nazumo-purple)] transition hover:scale-105">{profile ? profile.name.slice(0, 1).toUpperCase() : "日"}</Link>
    </header>
    <BottomNavigation items={links} isActive={isActive} />
  </>;
}
