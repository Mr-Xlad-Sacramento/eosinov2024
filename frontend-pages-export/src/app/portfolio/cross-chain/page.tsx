"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function PortfolioCrossChainPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();

  const aggregate3Query = useQuery({
    queryKey: ["portfolio-cross-chain-aggregate3", traderAddress],
    queryFn: () => standrApi.getCrossChainPortfolioAggregate3(traderAddress),
  });

  const totalValueQuery = useQuery({
    queryKey: ["portfolio-cross-chain-total-value", traderAddress],
    queryFn: () => standrApi.getCrossChainTotalValue(traderAddress),
  });

  const snapshotQuery = useQuery({
    queryKey: ["portfolio-cross-chain-latest-snapshot", traderAddress],
    queryFn: () => standrApi.getLatestSnapshot(traderAddress),
  });

  const chainsQuery = useQuery({
    queryKey: ["portfolio-cross-chain-chains"],
    queryFn: standrApi.listCrossChainChains,
  });

  const refreshMutation = useMutation({
    mutationFn: () =>
      standrApi.createPortfolioSnapshot({
        user: traderAddress,
        tokens_by_chain: [
          { chain_id: 137, tokens: ["USDC", "ETH"] },
          { chain_id: 42161, tokens: ["USDC"] },
        ],
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["portfolio-cross-chain-aggregate3", traderAddress],
      });
      await queryClient.invalidateQueries({
        queryKey: ["portfolio-cross-chain-total-value", traderAddress],
      });
      await queryClient.invalidateQueries({
        queryKey: ["portfolio-cross-chain-latest-snapshot", traderAddress],
      });
    },
  });

  const calls = aggregate3Query.data?.calls ?? [];
  const balances = snapshotQuery.data?.balances ?? [];

  return (
    <PageFrame
      title="Portfolio Cross-Chain"
      description="Aggregated chain balances and pseudo-aggregate3 telemetry from the multichain backend."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Tracked Chains</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{chainsQuery.data?.length ?? 0}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Aggregate3 Calls</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{calls.length}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Total Value</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            ${totalValueQuery.data?.total_value_usd ?? "0.00"}
          </p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Aggregate3 Response</h2>
            <button
              type="button"
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 disabled:opacity-60"
            >
              {refreshMutation.isPending ? "Refreshing..." : "Refresh Snapshot"}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted">
            Snapshot ID: {aggregate3Query.data?.snapshot_id ?? "none"} | Generated:{" "}
            {aggregate3Query.data
              ? new Date(aggregate3Query.data.generated_at * 1000).toLocaleString()
              : "n/a"}
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-[0.12em] text-muted">
                  <th className="px-3 py-2">Target</th>
                  <th className="px-3 py-2">Success</th>
                  <th className="px-3 py-2">Return Data</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call) => (
                  <tr key={`${call.target}-${call.return_data}`} className="border-b border-line/50">
                    <td className="px-3 py-2 font-mono text-xs text-ink">{call.target}</td>
                    <td className="px-3 py-2 text-xs text-muted">{call.success ? "true" : "false"}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted">{call.return_data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Latest Balances</h2>
          <ul className="mt-3 space-y-2">
            {balances.map((balance) => (
              <li
                key={`${balance.chain_id}-${balance.token}`}
                className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-sm"
              >
                <p className="font-semibold text-ink">
                  Chain {balance.chain_id} - {balance.token}
                </p>
                <p className="text-xs text-muted">Balance: {balance.balance}</p>
                <p className="text-xs text-muted">Value: ${balance.value_usd}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid gap-2">
            <Link
              href="/cross-chain"
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm font-semibold text-ink"
            >
              Cross-Chain Console
            </Link>
            <Link
              href="/cross-chain/bridge"
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm font-semibold text-ink"
            >
              Bridge Routes
            </Link>
          </div>
        </article>
      </section>
    </PageFrame>
  );
}
