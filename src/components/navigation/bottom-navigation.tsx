import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";

export interface NavigationItem {
  href: string;
  label: string;
  icon: IconName;
}

export function BottomNavigation({ items, isActive }: { items: readonly NavigationItem[]; isActive: (href: string) => boolean }) {
  return <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-black/[.06] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_35px_rgba(38,20,74,.08)] backdrop-blur-xl md:hidden">{items.map((item) => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={`relative flex min-h-[4.55rem] flex-col items-center justify-center gap-1 text-[10px] font-semibold transition duration-150 active:scale-95 ${isActive(item.href) ? "text-[var(--nazumo-purple)]" : "text-[var(--muted)]"}`}><span className={`flex size-8 items-center justify-center rounded-full transition-colors ${isActive(item.href) ? "bg-[var(--accent-soft)]" : "bg-transparent"}`}><Icon name={item.icon} className="size-[19px]"/></span>{item.label}{isActive(item.href) ? <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--nazumo-purple)]" /> : null}</Link>)}</nav>;
}
