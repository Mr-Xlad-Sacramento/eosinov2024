"use client";

import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { standrApi } from "@/lib/api/standr";
import { useMultiSourceOracle, useOracleStats } from "@/lib/hooks/contracts";
import { DEMO_TOKEN } from "@/lib/constants";

export default function OracleHealthPage() {
  const { data: overview } = useQuery({
    queryKey: ["oracle-health"],
    queryFn: standrApi.getOverview,
    refetchInterval: 10_000,
  });

  const oracle = useMultiSourceOracle();
  const oracleStats = useOracleStats(DEMO_TOKEN as `0x${string}`);

  return (
    <PageFrame
      title="Oracle Health"
      description="Oracle watcher status with stale feed counters and threshold controls."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Watcher Status" subtitle="Realtime health check">
          <p className="text-sm text-muted">Healthy: {String(overview?.oracle.healthy ?? false)}</p>
          <p className="text-sm text-muted">Stale feeds: {overview?.oracle.stale_feeds ?? "n/a"}</p>
          <p className="text-sm text-muted">
            Stale threshold: {overview?.oracle.stale_threshold_secs ?? "n/a"}s
          </p>
          <p className="text-sm text-muted">Checked at: {overview?.oracle.checked_at ?? "n/a"}</p>
        </Panel>
        <Panel title="On-Chain Oracle" subtitle="Contract reads">
          <div className="space-y-2 text-sm text-muted">
            <p>Paused: <span className="text-ink">{oracle.paused !== undefined ? String(oracle.paused) : "..."}</span></p>
            {oracleStats.stats ? (
              <>
                <p>Pyth Lazer hits: <span className="text-ink">{oracleStats.stats.pythLazerHits.toString()}</span></p>
                <p>Pyth hits: <span className="text-ink">{oracleStats.stats.pythHits.toString()}</span></p>
                <p>Chainlink hits: <span className="text-ink">{oracleStats.stats.chainlinkHits.toString()}</span></p>
                <p>TWAP hits: <span className="text-ink">{oracleStats.stats.twapHits.toString()}</span></p>
                <p>Total queries: <span className="text-ink">{oracleStats.stats.totalQueries.toString()}</span></p>
              </>
            ) : (
              <p>{oracleStats.isError ? "Contract read error" : "Loading..."}</p>
            )}
          </div>
        </Panel>
      </section>
    </PageFrame>
  );
}
