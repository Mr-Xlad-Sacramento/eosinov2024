"use client";

import Link from "next/link";
import { ChevronRight, Dot } from "lucide-react";

import { LiquidityPoolDto } from "@/lib/types/domain";

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 10_000 ? 0 : 2,
  }).format(value);
}

function formatPercentFromBps(value: number): string {
  return `${(value / 100).toFixed(2)}%`;
}

function toneFromApr(aprBps: number): string {
  if (aprBps >= 2_000) {
    return "text-emerald-300";
  }
  if (aprBps >= 900) {
    return "text-cyan-300";
  }
  return "text-slate-300";
}

export function LiquidityPoolsTable({
  pools,
}: {
  pools: LiquidityPoolDto[];
}) {
  if (pools.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-[#0f1218]/85 p-6 text-sm text-muted">
        No pools match your current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-[#0f1218]/92 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
      <table className="min-w-full text-sm">
        <thead className="bg-[#121722]/80 text-left text-[11px] uppercase tracking-[0.14em] text-slate-400">
          <tr>
            <th className="px-4 py-3">Pool</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3 text-right">TVL</th>
            <th className="px-4 py-3 text-right">Vol (24h)</th>
            <th className="px-4 py-3 text-right">APR</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool) => (
            <tr
              key={pool.pool_id}
              className="border-t border-line/70 text-slate-300 transition hover:bg-[#151b28]/75"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/20 text-[11px] font-bold text-cyan-200">
                    {pool.token0_symbol.slice(0, 1)}
                  </div>
                  <div className="flex h-7 w-7 -translate-x-2 items-center justify-center rounded-full bg-blue-500/20 text-[11px] font-bold text-blue-100">
                    {pool.token1_symbol.slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{pool.token0_symbol}/{pool.token1_symbol}</p>
                    <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted">
                      <span className="rounded-full border border-line bg-panel-strong/70 px-2 py-0.5">
                        {pool.pool_id}
                      </span>
                      <Dot size={14} />
                      <span className={pool.active ? "text-emerald-300" : "text-slate-500"}>
                        {pool.active ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-cyan-200 underline decoration-cyan-400/35 underline-offset-4">
                {pool.source}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-ink">{formatUsd(pool.tvl_usd)}</td>
              <td className="px-4 py-3 text-right text-slate-200">{formatUsd(pool.volume_24h_usd)}</td>
              <td className={`px-4 py-3 text-right font-semibold ${toneFromApr(pool.apr_bps)}`}>
                {formatPercentFromBps(pool.apr_bps)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/liquidity/pools/${pool.pool_id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                >
                  Open
                  <ChevronRight size={13} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
