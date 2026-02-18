"use client";

import Link from "next/link";
import { ArrowUpRight, MoveRight, PlusCircle } from "lucide-react";

function asUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100_000 ? 0 : 2,
  }).format(value);
}

export function LiquidityHero({
  totalPools,
  activePools,
  myPools,
  totalTvlUsd,
  avgAprBps,
}: {
  totalPools: number;
  activePools: number;
  myPools: number;
  totalTvlUsd: number;
  avgAprBps: number;
}) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#10131b] via-[#111826] to-[#0d1118] p-6 shadow-[0_25px_55px_rgba(2,6,23,0.45)]">
      <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-cyan-400/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Liquidity Engine</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-ink md:text-4xl">
            Provide liquidity and earn protocol-native yield
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Discover active pools, track TVL momentum, and deploy liquidity with transfer-safe workflows.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/liquidity/transfer"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
            >
              Transfer liquidity
              <MoveRight size={14} />
            </Link>
            <Link
              href="/liquidity/create"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel-strong/80 px-4 py-2 text-sm font-semibold text-ink transition hover:border-cyan-300/35"
            >
              Create pool
              <PlusCircle size={14} />
            </Link>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-line bg-[#0e1320]/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Total Liquidity</p>
            <p className="mt-2 text-xl font-semibold text-ink">{asUsd(totalTvlUsd)}</p>
            <p className="mt-1 text-xs text-cyan-200">
              Average APR {(avgAprBps / 100).toFixed(2)}%
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-[#0e1320]/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Coverage</p>
            <p className="mt-2 text-xl font-semibold text-ink">
              {activePools}/{totalPools} active
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-cyan-200">
              My pools {myPools}
              <ArrowUpRight size={12} />
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
