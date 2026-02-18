"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { DEMO_TOKEN } from "@/lib/constants";
import { standrApi } from "@/lib/api/standr";
import { asCurrency } from "@/lib/utils";

export default function AnalyticsMarketsPage() {
  const [chainId, setChainId] = useState(137);
  const [assetClass, setAssetClass] = useState("perps");
  const [market, setMarket] = useState(DEMO_TOKEN);

  const { data: protocolMetrics } = useQuery({
    queryKey: ["analytics-protocol-metrics", chainId, assetClass, market],
    queryFn: () =>
      standrApi.getProtocolMetrics({
        chain_id: chainId,
        asset_class: assetClass,
        market,
      }),
  });

  const { data: perpsAnalytics } = useQuery({
    queryKey: ["analytics-perps-analytics", market],
    queryFn: () => standrApi.getPerpsAnalytics({ asset: market, window: "24h" }),
  });

  const sourceMode = protocolMetrics?.source_mode ?? perpsAnalytics?.source_mode ?? "simulation";
  const currentFunding = useMemo(() => {
    if (protocolMetrics?.funding_rates?.length) {
      return protocolMetrics.funding_rates[0]?.current_rate_bps_per_hour ?? 0;
    }
    return perpsAnalytics?.funding_rate_bps_per_hour ?? 0;
  }, [perpsAnalytics?.funding_rate_bps_per_hour, protocolMetrics?.funding_rates]);

  return (
    <PageFrame
      title="Market Analytics"
      description="Protocol metrics and perps analytics with explicit simulation/onchain source tagging."
    >
      <section className="mb-4 rounded-2xl border border-line bg-panel p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
            source: {sourceMode}
          </span>
          <label className="text-sm text-muted">
            Chain ID
            <input
              type="number"
              value={chainId}
              onChange={(event) => setChainId(Number(event.target.value || 0))}
              className="ml-2 w-28 rounded-lg border border-line bg-canvas px-2 py-1 text-ink"
            />
          </label>
          <label className="text-sm text-muted">
            Asset Class
            <select
              value={assetClass}
              onChange={(event) => setAssetClass(event.target.value)}
              className="ml-2 rounded-lg border border-line bg-canvas px-2 py-1 text-ink"
            >
              <option value="perps">perps</option>
              <option value="yield">yield</option>
              <option value="all">all</option>
            </select>
          </label>
          <label className="text-sm text-muted">
            Market
            <input
              value={market}
              onChange={(event) => setMarket(event.target.value)}
              className="ml-2 w-[360px] rounded-lg border border-line bg-canvas px-2 py-1 text-ink"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Panel title="TVL">
          <p className="text-xl font-semibold">
            {protocolMetrics ? asCurrency(protocolMetrics.tvl) : "loading"}
          </p>
        </Panel>
        <Panel title="24h Volume">
          <p className="text-xl font-semibold">
            {protocolMetrics ? asCurrency(protocolMetrics.daily_volume) : "loading"}
          </p>
        </Panel>
        <Panel title="Open Interest">
          <p className="text-xl font-semibold">
            {protocolMetrics ? asCurrency(protocolMetrics.open_interest) : "loading"}
          </p>
        </Panel>
        <Panel title="Funding Rate">
          <p className="text-xl font-semibold">{currentFunding} bps/hr</p>
        </Panel>
        <Panel title="Fees">
          <p className="text-sm text-muted">
            {protocolMetrics?.fee_stats.unavailable_reason
              ? protocolMetrics.fee_stats.unavailable_reason
              : `${protocolMetrics?.fee_stats.maker_fees_24h_usd ?? "0"} / ${
                  protocolMetrics?.fee_stats.taker_fees_24h_usd ?? "0"
                }`}
          </p>
        </Panel>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Perps Analytics">
          <p className="text-sm text-muted">
            Avg leverage: {perpsAnalytics ? `${perpsAnalytics.avg_leverage_x.toFixed(2)}x` : "loading"}
          </p>
          <p className="mt-2 text-sm text-muted">
            Total notional 24h:{" "}
            {perpsAnalytics ? asCurrency(perpsAnalytics.total_notional_24h) : "loading"}
          </p>
          <p className="mt-2 text-sm text-muted">
            Aggregated PnL:{" "}
            {perpsAnalytics?.aggregated_pnl.value ??
              perpsAnalytics?.aggregated_pnl.unavailable_reason ??
              "loading"}
          </p>
        </Panel>

        <Panel title="Funding + OI">
          <p className="text-sm text-muted">
            Long OI: {perpsAnalytics?.long_oi ?? protocolMetrics?.open_interest ?? "loading"}
          </p>
          <p className="mt-2 text-sm text-muted">
            Short OI: {perpsAnalytics?.short_oi ?? "loading"}
          </p>
          <p className="mt-2 text-xs text-muted">
            As of:{" "}
            {protocolMetrics?.as_of
              ? new Date(protocolMetrics.as_of * 1000).toLocaleString()
              : perpsAnalytics?.as_of
                ? new Date(perpsAnalytics.as_of * 1000).toLocaleString()
                : "loading"}
          </p>
        </Panel>
      </section>
    </PageFrame>
  );
}
