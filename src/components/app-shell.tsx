import type { ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { ProgressDebugPanel } from "@/components/progress/progress-debug-panel";
import { MotionFrame } from "@/components/motion-frame";
import { ProgressCloudSync } from "@/components/account/progress-cloud-sync";

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto min-h-[100dvh] max-w-[1280px] px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] min-[375px]:px-5 sm:px-8 lg:px-10 lg:pb-14"><ProgressCloudSync /><Navigation /><main className="min-w-0"><MotionFrame>{children}</MotionFrame></main>{process.env.NODE_ENV === "development" ? <ProgressDebugPanel /> : null}</div>;
}
