"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const PROTOCOL_ROUTES = [
  { label: "Accounts", href: "/protocol/accounts" },
  { label: "Arbitrage", href: "/protocol/arbitrage" },
  { label: "Bonding", href: "/protocol/bonding" },
  { label: "POL Vault", href: "/protocol/pol-vault" },
  { label: "LP Profiles", href: "/protocol/lp-profiles" },
  { label: "Rental", href: "/protocol/rental" },
];

export function ProtocolSectionNav() {
  const router = useRouter();
  const pathname = usePathname();
  const warmed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const timers: number[] = [];
    for (const [index, route] of PROTOCOL_ROUTES.entries()) {
      if (warmed.current.has(route.href)) {
        continue;
      }
      const timer = window.setTimeout(() => {
        try {
          router.prefetch(route.href);
          warmed.current.add(route.href);
        } catch {
          // Best-effort only.
        }
      }, 120 + index * 120);
      timers.push(timer);
    }

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [router]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#0f1421] via-[#0f131b] to-[#0b0f15] p-3 shadow-[0_16px_40px_rgba(2,6,23,0.4)]">
      <div className="pointer-events-none absolute -right-20 -top-16 h-52 w-52 rounded-full bg-cyan-500/8 blur-3xl" />
      <div className="relative z-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-cyan-300">Protocol Shortcuts</p>
        <div className="flex flex-wrap gap-2">
          {PROTOCOL_ROUTES.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-100"
                    : "border-line bg-panel/80 text-muted hover:border-cyan-300/30 hover:text-cyan-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
