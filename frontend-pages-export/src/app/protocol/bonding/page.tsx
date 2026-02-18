"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { protocolApi } from "@/components/protocol/api";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

function unixToDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString();
}

export default function ProtocolBondingPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [marketId, setMarketId] = useState("bond_pol_1");
  const [amountUsd, setAmountUsd] = useState("250");

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: ["protocol-hooks"],
      queryFn: protocolApi.listHooks,
      staleTime: 60_000,
    });
  }, [queryClient]);

  const marketsQuery = useQuery({
    queryKey: ["protocol-bond-markets"],
    queryFn: protocolApi.listBondMarkets,
  });
  const positionsQuery = useQuery({
    queryKey: ["protocol-bond-positions", traderAddress],
    queryFn: () => protocolApi.listBondPositions(traderAddress),
  });

  const buyMutation = useMutation({
    mutationFn: () =>
      protocolApi.buyBond({
        wallet_address: traderAddress,
        market_id: marketId,
        amount_usd: Number(amountUsd),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-bond-markets"] });
      await queryClient.invalidateQueries({ queryKey: ["protocol-bond-positions", traderAddress] });
    },
  });

  return (
    <PageFrame
      title="Bonding Marketplace"
      description="Open discounted bond positions and monitor vesting outcomes."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Buy Bond</h2>
          <div className="mt-3 space-y-3">
            <select
              value={marketId}
              onChange={(event) => setMarketId(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            >
              {(marketsQuery.data ?? []).map((market) => (
                <option key={market.market_id} value={market.market_id}>
                  {market.market_id} | price {market.price_usd.toFixed(2)} | discount {(market.discount_bps / 100).toFixed(2)}%
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
              onClick={() => buyMutation.mutate()}
              disabled={buyMutation.isPending}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
            >
              {buyMutation.isPending ? "Buying..." : "Buy bond"}
            </button>
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">My Bond Positions</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(positionsQuery.data ?? []).map((position) => (
              <li key={position.position_id} className="rounded-xl border border-line bg-canvas/60 p-3">
                <p className="font-semibold text-ink">{position.position_id}</p>
                <p className="text-xs text-muted">
                  Market {position.market_id} | In ${position.amount_in_usd.toFixed(2)} | Payout {position.payout_amount.toFixed(4)}
                </p>
                <p className="text-xs text-muted">Vesting ends {unixToDate(position.vesting_end_unix)}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </PageFrame>
  );
}
