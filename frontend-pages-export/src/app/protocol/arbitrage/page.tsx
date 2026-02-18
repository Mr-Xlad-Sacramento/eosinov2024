"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { protocolApi } from "@/components/protocol/api";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function ProtocolArbitragePage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();

  const [poolId, setPoolId] = useState("arb_pool_1");
  const [amountUsd, setAmountUsd] = useState("500");

  const poolsQuery = useQuery({
    queryKey: ["protocol-arb-pools"],
    queryFn: protocolApi.listArbitragePools,
  });
  const positionsQuery = useQuery({
    queryKey: ["protocol-arb-positions", traderAddress],
    queryFn: () => protocolApi.listArbitragePositions(traderAddress),
  });

  const joinMutation = useMutation({
    mutationFn: () =>
      protocolApi.joinArbitragePool({
        wallet_address: traderAddress,
        pool_id: poolId,
        amount_usd: Number(amountUsd),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-arb-pools"] });
      await queryClient.invalidateQueries({ queryKey: ["protocol-arb-positions", traderAddress] });
    },
  });

  const exitMutation = useMutation({
    mutationFn: (targetPoolId: string) =>
      protocolApi.exitArbitragePool({
        wallet_address: traderAddress,
        pool_id: targetPoolId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-arb-pools"] });
      await queryClient.invalidateQueries({ queryKey: ["protocol-arb-positions", traderAddress] });
    },
  });

  const totalDeposited = useMemo(
    () => (positionsQuery.data ?? []).reduce((acc, item) => acc + item.deposited_usd, 0),
    [positionsQuery.data],
  );

  return (
    <PageFrame
      title="Cross-Chain Arbitrage"
      description="Join or exit arbitrage pools and track pool-backed positions."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Pools</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{poolsQuery.data?.length ?? 0}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">My Positions</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{positionsQuery.data?.length ?? 0}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Deposited</p>
          <p className="mt-2 text-2xl font-semibold text-ink">${totalDeposited.toFixed(2)}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Join Pool</h2>
          <div className="mt-3 space-y-3">
            <select
              value={poolId}
              onChange={(event) => setPoolId(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            >
              {(poolsQuery.data ?? []).map((pool) => (
                <option key={pool.pool_id} value={pool.pool_id}>
                  {pool.pool_id} | APR {(pool.apr_bps / 100).toFixed(2)}%
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={amountUsd}
              onChange={(event) => setAmountUsd(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
            <button
              type="button"
              onClick={() => joinMutation.mutate()}
              disabled={joinMutation.isPending}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
            >
              {joinMutation.isPending ? "Joining..." : "Join arbitrage pool"}
            </button>
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">My Arbitrage Positions</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(positionsQuery.data ?? []).map((position) => (
              <li key={position.pool_id} className="rounded-xl border border-line bg-canvas/60 p-3">
                <p className="font-semibold text-ink">{position.pool_id}</p>
                <p className="text-xs text-muted">
                  Shares {position.shares.toFixed(4)} | Deposited ${position.deposited_usd.toFixed(2)} | PnL $
                  {position.estimated_pnl_usd.toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => exitMutation.mutate(position.pool_id)}
                  className="mt-2 rounded-lg border border-line bg-panel-strong px-2 py-1 text-xs text-ink"
                >
                  Exit position
                </button>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </PageFrame>
  );
}
