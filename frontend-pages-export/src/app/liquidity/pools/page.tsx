"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { LiquidityHero } from "@/components/liquidity/LiquidityHero";
import { LiquidityPoolsTable } from "@/components/liquidity/LiquidityPoolsTable";
import { LiquidityRail } from "@/components/liquidity/LiquidityRail";
import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

function uniqTokensFromPools(
  pools: Array<{ token0_symbol: string; token1_symbol: string }>,
): string[] {
  const seen = new Set<string>();
  for (const pool of pools) {
    seen.add(pool.token0_symbol.toUpperCase());
    seen.add(pool.token1_symbol.toUpperCase());
  }
  return Array.from(seen).slice(0, 6);
}

export default function LiquidityPoolsPage() {
  const { traderAddress } = useTraderAddress();
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState<"all" | "mine">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all");
  const [tokenFilter, setTokenFilter] = useState<string>("all");

  const poolsQuery = useQuery({
    queryKey: ["liquidity-pools"],
    queryFn: standrApi.getLiquidityPools,
  });
  const positionsQuery = useQuery({
    queryKey: ["liquidity-positions", traderAddress],
    queryFn: () => standrApi.getLiquidityPositions(traderAddress),
  });

  const pools = useMemo(() => poolsQuery.data ?? [], [poolsQuery.data]);
  const myPoolIds = useMemo(
    () => new Set((positionsQuery.data ?? []).map((position) => position.pool_id)),
    [positionsQuery.data],
  );

  const tokenChips = useMemo(() => uniqTokensFromPools(pools), [pools]);

  const filteredPools = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pools.filter((pool) => {
      if (scope === "mine" && !myPoolIds.has(pool.pool_id)) {
        return false;
      }
      if (statusFilter === "active" && !pool.active) {
        return false;
      }
      if (statusFilter === "closed" && pool.active) {
        return false;
      }
      if (
        tokenFilter !== "all" &&
        pool.token0_symbol.toUpperCase() !== tokenFilter &&
        pool.token1_symbol.toUpperCase() !== tokenFilter
      ) {
        return false;
      }
      if (!term) {
        return true;
      }
      return (
        pool.name.toLowerCase().includes(term) ||
        pool.pool_id.toLowerCase().includes(term) ||
        pool.token0_symbol.toLowerCase().includes(term) ||
        pool.token1_symbol.toLowerCase().includes(term)
      );
    });
  }, [myPoolIds, pools, scope, search, statusFilter, tokenFilter]);

  const activeCount = useMemo(() => pools.filter((pool) => pool.active).length, [pools]);
  const closedCount = useMemo(() => pools.filter((pool) => !pool.active).length, [pools]);
  const totalTvlUsd = useMemo(() => pools.reduce((sum, pool) => sum + pool.tvl_usd, 0), [pools]);
  const avgAprBps = useMemo(
    () => (pools.length ? pools.reduce((sum, pool) => sum + pool.apr_bps, 0) / pools.length : 0),
    [pools],
  );

  return (
    <PageFrame
      title="LP/Vaults - Liquidity"
      description="Institutional-grade liquidity workspace with premium pool discovery, filtering, and execution controls."
    >
      <div className="grid gap-4 lg:grid-cols-[245px_minmax(0,1fr)]">
        <LiquidityRail />

        <section className="space-y-4">
          <article className="rounded-3xl border border-line bg-[#0f131d]/90 p-3 shadow-[0_14px_45px_rgba(2,6,23,0.38)]">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[260px]">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by pool, wallet, token or ticker"
                  className="w-full rounded-xl border border-line bg-[#0b0f16] py-2 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-cyan-300/45"
                />
              </div>
              <div className="inline-flex items-center gap-1 rounded-xl border border-line bg-panel px-3 py-2 text-xs font-semibold text-cyan-200">
                <Sparkles size={12} />
                Liquidity Engine Live
              </div>
              <Link
                href="/liquidity/create"
                className="rounded-xl border border-cyan-400/35 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100"
              >
                Create Pool
              </Link>
            </div>
          </article>

          <LiquidityHero
            totalPools={pools.length}
            activePools={activeCount}
            myPools={positionsQuery.data?.length ?? 0}
            totalTvlUsd={totalTvlUsd}
            avgAprBps={avgAprBps}
          />

          <section className="space-y-3 rounded-3xl border border-line bg-[#0f131d]/90 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setScope("all")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  scope === "all"
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-200"
                    : "border-line bg-panel text-muted"
                }`}
              >
                All pools ({pools.length})
              </button>
              <button
                type="button"
                onClick={() => setScope("mine")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  scope === "mine"
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-200"
                    : "border-line bg-panel text-muted"
                }`}
              >
                My pools ({positionsQuery.data?.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  statusFilter === "active"
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-200"
                    : "border-line bg-panel text-muted"
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("closed")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  statusFilter === "closed"
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-200"
                    : "border-line bg-panel text-muted"
                }`}
              >
                Closed ({closedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  statusFilter === "all"
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-200"
                    : "border-line bg-panel text-muted"
                }`}
              >
                All status
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTokenFilter("all")}
                className={`rounded-full border px-3 py-1 text-xs ${
                  tokenFilter === "all"
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-100"
                    : "border-line bg-panel text-muted"
                }`}
              >
                All tokens
              </button>
              {tokenChips.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => setTokenFilter(token)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    tokenFilter === token
                      ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-100"
                      : "border-line bg-panel text-muted"
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>
          </section>

          {poolsQuery.isLoading ? (
            <p className="text-sm text-muted">Loading pools...</p>
          ) : poolsQuery.isError ? (
            <p className="text-sm text-danger">
              {poolsQuery.error instanceof Error ? poolsQuery.error.message : "Failed to load pools"}
            </p>
          ) : (
            <LiquidityPoolsTable pools={filteredPools} />
          )}

          <div className="flex flex-wrap gap-2">
            <Link
              href="/liquidity/create"
              className="rounded-xl border border-line bg-panel-strong px-4 py-2 text-sm font-semibold text-ink"
            >
              Create pool
            </Link>
            <Link
              href="/liquidity/transfer"
              className="rounded-xl border border-line bg-panel-strong px-4 py-2 text-sm font-semibold text-ink"
            >
              Transfer liquidity
            </Link>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
