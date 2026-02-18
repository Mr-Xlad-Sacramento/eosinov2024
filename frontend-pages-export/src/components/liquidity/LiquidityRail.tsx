"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Droplets, Layers3, MoveRight, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const RAIL_LINKS = [
  {
    href: "/liquidity/pools",
    label: "Pools",
    description: "Discover and provide liquidity",
    icon: Droplets,
  },
  {
    href: "/liquidity/create",
    label: "Create Pool",
    description: "Launch a new LP market",
    icon: Layers3,
  },
  {
    href: "/liquidity/transfer",
    label: "Transfer Liquidity",
    description: "Move LP shares securely",
    icon: MoveRight,
  },
];

export function LiquidityRail() {
  const pathname = usePathname();

  return (
    <aside className="rounded-3xl border border-line bg-[#090c12]/95 p-4 shadow-[0_18px_50px_rgba(2,6,23,0.45)]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">STANDR DEX Liquidity</p>
      <h2 className="mt-2 text-xl font-semibold text-ink">Liquidity Workspace</h2>
      <p className="mt-1 text-xs text-muted">
        Swap.coffee inspired LP navigation with focused actions.
      </p>

      <nav className="mt-5 space-y-2">
        {RAIL_LINKS.map((item) => {
          const active =
            pathname === item.href || (item.href === "/liquidity/pools" && pathname.startsWith("/liquidity/pools/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group block rounded-2xl border px-3 py-3 transition",
                active
                  ? "border-cyan-400/40 bg-cyan-500/10"
                  : "border-line bg-panel/70 hover:border-cyan-300/25 hover:bg-panel-strong/70",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <item.icon
                    size={15}
                    className={active ? "text-cyan-300" : "text-muted group-hover:text-cyan-200"}
                  />
                  <span className={cn("text-sm font-semibold", active ? "text-cyan-200" : "text-ink")}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className={active ? "text-cyan-200" : "text-muted group-hover:text-cyan-200"}
                />
              </div>
              <p className={cn("mt-1 text-xs", active ? "text-cyan-100/85" : "text-muted")}>
                {item.description}
              </p>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-line bg-gradient-to-br from-panel-strong to-[#111827] p-3">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-cyan-200">
          <ShieldCheck size={13} />
          Safety
        </div>
        <p className="mt-2 text-xs text-muted">
          Slippage caps and transfer checks are enforced by backend policy modules before settlement.
        </p>
      </div>
    </aside>
  );
}
