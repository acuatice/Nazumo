"use client";

import { ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function MotionFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const immersive = pathname.startsWith("/practice") || pathname.endsWith("/write");
  return <ViewTransition name="nazumo-route" default="nazumo-route">{immersive ? <div className="min-h-[calc(100dvh-1rem)]">{children}</div> : <div className="min-h-[calc(100dvh-5rem)]">{children}</div>}</ViewTransition>;
}
