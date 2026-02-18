"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CircleDot, Percent, ShieldCheck } from "lucide-react";

import { LiquidityRail } from "@/components/liquidity/LiquidityRail";
import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";
import { cn } from "@/lib/utils";

type ActionTab = "add" | "remove";

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 10_000 ? 0 : 2,
  }).format(value);
}

export default function LiquidityPoolDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const poolIdParam = params.id;
  const poolId = (Array.isArray(poolIdParam) ? poolIdParam[0] : poolIdParam) ?? "";
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<ActionTab>("add");
  const [addAmount, setAddAmount] = useState("1000");
  const [removeShares, setRemoveShares] = useState("0");

  const poolQuery = useQuery({
    queryKey: ["liquidity-pool", poolId],
    queryFn: () => standrApi.getLiquidityPool(poolId),
    enabled: poolId.length > 0,
  });
  const positionsQuery = useQuery({
    queryKey: ["liquidity-positions", traderAddress],
    queryFn: () => standrApi.getLiquidityPositions(traderAddress),
  });

  const myPosition = useMemo(
    () => positionsQuery.data?.find((position) => position.pool_id === poolId) ?? null,
    [poolId, positionsQuery.data],
  );

  const addValue = Number(addAmount || "0");
  const removeValue = Number(removeShares || "0");
  const removeExceeds = !!myPosition && removeValue > myPosition.shares;

  const addMutation = useMutation({
    mutationFn: () => {
      if (!poolId) {
        throw new Error("Pool ID is missing.");
      }
      return standrApi.addLiquidity(
        {
          wallet_address: traderAddress,
          pool_id: poolId,
          amount_usd: addValue,
        },
        [traderAddress.toLowerCase(), poolId, addAmount, "add"].join("|"),
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["liquidity-pool", poolId] });
      await queryClient.invalidateQueries({ queryKey: ["liquidity-pools"] });
      await queryClient.invalidateQueries({ queryKey: ["liquidity-positions", traderAddress] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => {
      if (!poolId) {
        throw new Error("Pool ID is missing.");
      }
      return standrApi.removeLiquidity(
        {
          wallet_address: traderAddress,
          pool_id: poolId,
          shares: removeValue,
        },
        [traderAddress.toLowerCase(), poolId, removeShares, "remove"].join("|"),
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["liquidity-pool", poolId] });
      await queryClient.invalidateQueries({ queryKey: ["liquidity-pools"] });
      await queryClient.invalidateQueries({ queryKey: ["liquidity-positions", traderAddress] });
    },
  });

  return (
    <PageFrame
      title="LP/Vaults - Pool Details"
      description="Inspect pool metrics and manage add/remove liquidity with protected execution controls."
    >
      <div className="grid gap-4 lg:grid-cols-[245px_minmax(0,1fr)]">
        <LiquidityRail />

        <section className="space-y-4">
          {poolQuery.isLoading ? <p className="text-sm text-muted">Loading pool...</p> : null}
          {poolQuery.isError ? (
            <p className="text-sm text-danger">
              {poolQuery.error instanceof Error ? poolQuery.error.message : "Failed to load pool"}
            </p>
          ) : null}

          {poolQuery.data ? (
            <article className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#111729] via-[#11151f] to-[#0d1118] p-5">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Pool Overview</p>
                    <h2 className="mt-2 text-3xl font-semibold text-ink">
                      {poolQuery.data.token0_symbol}/{poolQuery.data.token1_symbol}
                    </h2>
                    <p className="mt-1 font-mono text-xs text-muted">{poolQuery.data.pool_id}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-3 py-1",
                        poolQuery.data.active
                          ? "border-emerald-400/35 bg-emerald-500/15 text-emerald-200"
                          : "border-line bg-panel/80 text-muted",
                      )}
                    >
                      <CircleDot size={12} />
                      {poolQuery.data.active ? "Active" : "Closed"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-panel/80 px-3 py-1 text-cyan-100">
                      <Percent size={12} />
                      {(poolQuery.data.apr_bps / 100).toFixed(2)}% APR
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          {poolQuery.data ? (
            <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <article className="rounded-3xl border border-line bg-[#0f131d]/92 p-5">
                <h3 className="text-lg font-semibold text-ink">Market Metrics</h3>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <div className="rounded-2xl border border-line bg-panel/70 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted">TVL</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{formatUsd(poolQuery.data.tvl_usd)}</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-panel/70 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted">24h Volume</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{formatUsd(poolQuery.data.volume_24h_usd)}</p>
                  </div>
                  <div className="rounded-2xl border border-line bg-panel/70 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Total Shares</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{poolQuery.data.total_shares.toFixed(2)}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-line bg-[#0f131d]/92 p-5">
                <h3 className="text-lg font-semibold text-ink">My Position</h3>
                {myPosition ? (
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    <li>Shares: {myPosition.shares.toFixed(6)}</li>
                    <li>Deposited: {formatUsd(myPosition.deposited_usd)}</li>
                    <li>Current Value: {formatUsd(myPosition.current_value_usd)}</li>
                    <li>Fees Earned: {formatUsd(myPosition.fees_earned_usd)}</li>
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">No position found for the connected wallet.</p>
                )}
              </article>
            </section>
          ) : null}

          <section className="rounded-3xl border border-line bg-[#0f131d]/92 p-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab("add")}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                  tab === "add"
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-100"
                    : "border-line bg-panel text-muted",
                )}
              >
                Add Liquidity
              </button>
              <button
                type="button"
                onClick={() => setTab("remove")}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                  tab === "remove"
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-100"
                    : "border-line bg-panel text-muted",
                )}
              >
                Remove Liquidity
              </button>
            </div>

            {tab === "add" ? (
              <form
                className="mt-4 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  addMutation.mutate();
                }}
              >
                <label className="space-y-1 text-sm text-muted">
                  Amount (USD)
                  <input
                    type="number"
                    min={0.0001}
                    value={addAmount}
                    onChange={(event) => setAddAmount(event.target.value)}
                    className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                  />
                </label>
                <button
                  type="submit"
                  disabled={addMutation.isPending || addValue <= 0}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <ShieldCheck size={14} />
                  {addMutation.isPending ? "Adding..." : "Add Liquidity"}
                </button>
              </form>
            ) : (
              <form
                className="mt-4 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  removeMutation.mutate();
                }}
              >
                <label className="space-y-1 text-sm text-muted">
                  Shares
                  <input
                    type="number"
                    min={0.000001}
                    step={0.000001}
                    value={removeShares}
                    onChange={(event) => setRemoveShares(event.target.value)}
                    className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                  />
                </label>
                {removeExceeds ? (
                  <p className="text-xs text-warning">Requested shares exceed your current position.</p>
                ) : null}
                <button
                  type="submit"
                  disabled={removeMutation.isPending || removeValue <= 0 || removeExceeds}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <ShieldCheck size={14} />
                  {removeMutation.isPending ? "Removing..." : "Remove Liquidity"}
                </button>
              </form>
            )}

            {addMutation.isError ? (
              <p className="mt-2 text-sm text-danger">
                {addMutation.error instanceof Error ? addMutation.error.message : "Add liquidity failed"}
              </p>
            ) : null}
            {removeMutation.isError ? (
              <p className="mt-2 text-sm text-danger">
                {removeMutation.error instanceof Error ? removeMutation.error.message : "Remove liquidity failed"}
              </p>
            ) : null}
          </section>

          <Link
            href="/liquidity/pools"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel-strong px-4 py-2 text-sm font-semibold text-ink transition hover:border-cyan-300/35"
          >
            <ArrowLeft size={14} />
            Back to pools
          </Link>
        </section>
      </div>
    </PageFrame>
  );
}
