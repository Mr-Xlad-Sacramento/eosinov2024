"use client";

import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { standrApi } from "@/lib/api/standr";
import { useStandRCore } from "@/lib/hooks/contracts";
import { usePerpsCore } from "@/lib/hooks/contracts";

export default function ProtocolStatsPage() {
  const { data: health } = useQuery({ queryKey: ["protocol-health"], queryFn: standrApi.health });
  const { data: metrics } = useQuery({ queryKey: ["protocol-metrics"], queryFn: standrApi.metrics });
  const { data: protocolMetrics } = useQuery({
    queryKey: ["protocol-metrics-detailed"],
    queryFn: () => standrApi.getProtocolMetrics(),
  });
  const { data: tvl } = useQuery({ queryKey: ["protocol-tvl"], queryFn: standrApi.getTvl });
  const { data: volume24h } = useQuery({ queryKey: ["protocol-volume"], queryFn: standrApi.getVolume24h });
  const { data: apyHistory } = useQuery({
    queryKey: ["yield-apy-history"],
    queryFn: standrApi.getYieldApyHistory,
  });
  const { data: yieldSources } = useQuery({
    queryKey: ["yield-sources"],
    queryFn: standrApi.getYieldSourceDistribution,
  });

  const core = useStandRCore();
  const perps = usePerpsCore();

  const avgFundingRate = protocolMetrics?.funding_rates && protocolMetrics.funding_rates.length > 0
    ? protocolMetrics.funding_rates.reduce((sum, r) => sum + r.current_rate_bps_per_hour, 0) / protocolMetrics.funding_rates.length / 100
    : 0;

  const totalFees = protocolMetrics?.fee_stats
    ? (Number(protocolMetrics.fee_stats.maker_fees_24h_usd || 0) + Number(protocolMetrics.fee_stats.taker_fees_24h_usd || 0))
    : 0;

  return (
    <PageFrame
      title="Protocol Stats"
      description="Health and metrics channels for operational observability and alerts."
    >
      <section className="grid gap-4 lg:grid-cols-4">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Total TVL</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            ${tvl?.tvl ?? protocolMetrics?.tvl ?? "0"}
          </p>
          <p className="mt-1 text-xs text-muted">All protocols</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">24h Volume</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            ${volume24h?.volume ?? protocolMetrics?.daily_volume ?? "0"}
          </p>
          <p className="mt-1 text-xs text-muted">Trading volume</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Open Interest</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            ${protocolMetrics?.open_interest ?? "0"}
          </p>
          <p className="mt-1 text-xs text-muted">Perps positions</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Avg Funding Rate</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {avgFundingRate.toFixed(3)}%
          </p>
          <p className="mt-1 text-xs text-muted">Per hour average</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Panel title="On-Chain State" subtitle="Live contract reads">
          <div className="space-y-2 text-sm text-muted">
            <p>Core owner: <span className="font-mono text-ink">{core.owner ?? "..."}</span></p>
            <p>Limit orders queued: <span className="text-ink">{core.limitOrderQueue?.length ?? "..."}</span></p>
            <p>Perps TVL: <span className="text-ink">{perps.tvl !== undefined ? formatUnits(perps.tvl, 18) : "..."}</span></p>
            <p>Insurance fund: <span className="text-ink">{perps.insuranceFund !== undefined ? formatUnits(perps.insuranceFund, 18) : "..."}</span></p>
            {perps.insuranceFundHealth ? (
              <p>IF health ratio: <span className="text-ink">{formatUnits(perps.insuranceFundHealth.healthRatio, 18)}</span></p>
            ) : null}
            {(core.isError || perps.isError) && (
              <p className="text-red-400">Contract read error (wallet may not be connected)</p>
            )}
          </div>
        </Panel>
        <Panel title="Health" subtitle="Gateway + chain connectivity">
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-line bg-canvas p-3 font-mono text-xs text-ink">
            {JSON.stringify(health ?? {}, null, 2)}
          </pre>
        </Panel>
        <Panel title="Metrics" subtitle="Prometheus snapshot">
          <pre className="max-h-[360px] overflow-auto rounded-xl border border-line bg-canvas p-3 font-mono text-[11px] text-ink">
            {metrics ?? "loading"}
          </pre>
        </Panel>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Yield Analytics</h2>
          <p className="mt-1 text-sm text-muted">APY history and yield source distribution</p>

          <div className="mt-4">
            <h3 className="text-sm uppercase tracking-[0.14em] text-muted">APY History (Recent)</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(apyHistory ?? []).slice(-6).map((point) => (
                <div
                  key={point.timestamp}
                  className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-xs"
                >
                  <p className="text-muted">{new Date(point.timestamp * 1000).toLocaleDateString()}</p>
                  <p className="text-lg font-semibold text-ink">{(point.apy_bps / 100).toFixed(2)}%</p>
                </div>
              ))}
              {!apyHistory || apyHistory.length === 0 ? (
                <p className="text-xs text-muted">No APY history available</p>
              ) : null}
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-sm uppercase tracking-[0.14em] text-muted">Yield Source Distribution</h3>
            <div className="mt-3 space-y-2">
              {(yieldSources ?? []).map((source) => (
                <div
                  key={source.source}
                  className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">{source.source}</span>
                    <span className="font-semibold text-ink">{(source.weight_bps / 100).toFixed(2)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#0b1018]">
                    <div
                      className="h-full bg-cyan-400/60"
                      style={{ width: `${source.weight_bps / 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {!yieldSources || yieldSources.length === 0 ? (
                <p className="text-xs text-muted">No yield sources configured</p>
              ) : null}
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Protocol Metrics Detail</h2>
          <p className="mt-1 text-sm text-muted">Comprehensive protocol statistics</p>

          {protocolMetrics ? (
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2">
                  <p className="text-xs text-muted">Total Fees (24h)</p>
                  <p className="text-lg font-semibold text-ink">
                    ${totalFees.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2">
                  <p className="text-xs text-muted">Funding Markets</p>
                  <p className="text-lg font-semibold text-ink">
                    {protocolMetrics.funding_rates?.length ?? 0}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-[#0b1018]/90 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-muted">Fee Breakdown</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Maker Fees</span>
                    <span className="text-ink">${protocolMetrics.fee_stats.maker_fees_24h_usd ?? "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Taker Fees</span>
                    <span className="text-ink">${protocolMetrics.fee_stats.taker_fees_24h_usd ?? "0"}</span>
                  </div>
                </div>
              </div>

              {protocolMetrics.funding_rates && protocolMetrics.funding_rates.length > 0 ? (
                <div className="rounded-xl border border-line bg-[#0b1018]/90 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">Funding Rates by Market</p>
                  <div className="mt-2 space-y-1 text-sm">
                    {protocolMetrics.funding_rates.map((rate) => (
                      <div key={rate.market} className="flex justify-between">
                        <span className="text-muted">{rate.market}</span>
                        <span className="text-ink">{(rate.current_rate_bps_per_hour / 100).toFixed(3)}%/hr</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Loading protocol metrics...</p>
          )}
        </article>
      </section>
    </PageFrame>
  );
}
