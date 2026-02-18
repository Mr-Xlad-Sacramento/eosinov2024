"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { protocolApi } from "@/components/protocol/api";
import { WsMonitor } from "@/components/ws-monitor";
import { standrApi } from "@/lib/api/standr";

export default function AdminMonitoringPage() {
  const [batchId, setBatchId] = useState("batch-1");
  const [emergencyTrigger, setEmergencyTrigger] = useState("oracle-drift");
  const [emergencySeverity, setEmergencySeverity] = useState("high");

  const healthQuery = useQuery({ queryKey: ["admin-health"], queryFn: standrApi.health });
  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: standrApi.getOverview,
    refetchInterval: 10_000,
  });
  const routesQuery = useQuery({
    queryKey: ["admin-bridge-routes"],
    queryFn: standrApi.getBridgeRoutes,
    refetchInterval: 15_000,
  });
  const anomalySignalsQuery = useQuery({
    queryKey: ["admin-risk-anomaly-signals"],
    queryFn: standrApi.getRiskAnomalySignals,
    refetchInterval: 15_000,
  });
  const automationQuery = useQuery({
    queryKey: ["admin-automation-jobs"],
    queryFn: protocolApi.listAutomationJobs,
    refetchInterval: 15_000,
  });
  const hooksQuery = useQuery({
    queryKey: ["admin-hooks"],
    queryFn: protocolApi.listHooks,
    refetchInterval: 15_000,
  });
  const batchResultQuery = useQuery({
    queryKey: ["admin-batch-result", batchId],
    queryFn: () => standrApi.getBatchAuctionResult(batchId),
    enabled: batchId.trim().length > 0,
    refetchInterval: 15_000,
  });
  const batchProofQuery = useQuery({
    queryKey: ["admin-batch-proof", batchId],
    queryFn: () => standrApi.getBatchAuctionProof(batchId),
    enabled: batchId.trim().length > 0,
    refetchInterval: 15_000,
  });
  const emergencyBundleMutation = useMutation({
    mutationFn: () =>
      standrApi.prepareRiskEmergencyBundle({
        trigger: emergencyTrigger,
        severity: emergencySeverity,
      }),
  });

  return (
    <PageFrame
      title="Monitoring"
      description="Admin-only control plane for automation, hooks, cross-chain routing, settlement readiness, and protocol telemetry."
    >
      <section className="grid gap-4 xl:grid-cols-2">
        <Panel title="Backend Health" subtitle="/health response">
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-line bg-canvas p-3 font-mono text-xs text-ink">
            {JSON.stringify(healthQuery.data ?? {}, null, 2)}
          </pre>
        </Panel>
        <WsMonitor />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel title="Internal Modules" subtitle="Vincent Automation + Hook Registry">
          <h3 className="text-xs uppercase tracking-[0.14em] text-muted">Automation Jobs</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {(automationQuery.data ?? []).map((job) => (
              <li key={job.job_id} className="rounded-xl border border-line bg-canvas px-3 py-2">
                {job.name} ({job.status}) | success {(job.success_rate_bps / 100).toFixed(2)}%
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">Hook Registry</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {(hooksQuery.data ?? []).map((hook) => (
              <li key={hook.hook_id} className="rounded-xl border border-line bg-canvas px-3 py-2">
                {hook.name} [{hook.scope}] {hook.enabled ? "enabled" : "disabled"}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Cross-Chain Operations" subtitle="Bridge route health and settlement visibility">
          <h3 className="text-xs uppercase tracking-[0.14em] text-muted">Active Routes</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {(routesQuery.data ?? []).map((route) => (
              <li key={route.route_id} className="rounded-xl border border-line bg-canvas px-3 py-2">
                {route.priority}. {route.bridge} ({route.route_id}) {route.healthy ? "healthy" : "degraded"}
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">Settlement Status</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {(overviewQuery.data?.bridge_transfers ?? []).map((transfer) => (
              <li key={transfer.transfer_id} className="rounded-xl border border-line bg-canvas px-3 py-2">
                {transfer.transfer_id}: {transfer.source_chain_id} to {transfer.destination_chain_id} ({transfer.status})
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">Risk Alerts</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {(overviewQuery.data?.risk_alerts ?? []).map((alert) => (
              <li key={`${alert.level}-${alert.created_at}`}>
                {alert.level}: {alert.message}
              </li>
            ))}
            {(overviewQuery.data?.risk_alerts ?? []).length === 0 ? <li>None</li> : null}
          </ul>
          <h3 className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">Anomaly Signals</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {(anomalySignalsQuery.data?.signals ?? []).map((signal) => (
              <li key={signal.signal_id} className="rounded-xl border border-line bg-canvas px-3 py-2">
                {signal.level.toUpperCase()} [{signal.component}] {signal.message}
              </li>
            ))}
            {(anomalySignalsQuery.data?.signals ?? []).length === 0 ? <li>None</li> : null}
          </ul>

          <h3 className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">Emergency Bundle</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <input
              value={emergencyTrigger}
              onChange={(event) => setEmergencyTrigger(event.target.value)}
              className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink"
              placeholder="trigger reason"
            />
            <select
              value={emergencySeverity}
              onChange={(event) => setEmergencySeverity(event.target.value)}
              className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink"
            >
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="critical">critical</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => emergencyBundleMutation.mutate()}
            disabled={emergencyBundleMutation.isPending}
            className="mt-2 rounded-xl border border-line bg-panel-strong px-3 py-2 text-xs font-semibold text-ink disabled:opacity-60"
          >
            {emergencyBundleMutation.isPending ? "Preparing..." : "Prepare Emergency Bundle"}
          </button>
          {emergencyBundleMutation.data ? (
            <p className="mt-2 text-xs text-muted">
              Bundle {emergencyBundleMutation.data.bundle_id} | multisig{" "}
              {String(emergencyBundleMutation.data.requires_multisig)}
            </p>
          ) : null}
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel title="Oracle + Protocol Stats" subtitle="Operator telemetry">
          <p className="text-sm text-muted">
            Oracle healthy: {String(overviewQuery.data?.oracle.healthy ?? false)}
          </p>
          <p className="text-sm text-muted">Stale feeds: {overviewQuery.data?.oracle.stale_feeds ?? "n/a"}</p>
          <p className="text-sm text-muted">
            Stale threshold: {overviewQuery.data?.oracle.stale_threshold_secs ?? "n/a"}s
          </p>
          <p className="mt-2 text-sm text-muted">
            Network synced: {String(overviewQuery.data?.network.synced ?? false)}
          </p>
          <p className="text-sm text-muted">Latest block: {overviewQuery.data?.network.latest_block ?? "n/a"}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/analytics/oracle-health"
              className="rounded-xl border border-line bg-panel-strong px-3 py-2 text-xs font-semibold text-ink"
            >
              Detailed Oracle Health
            </Link>
            <Link
              href="/analytics/protocol-stats"
              className="rounded-xl border border-line bg-panel-strong px-3 py-2 text-xs font-semibold text-ink"
            >
              Detailed Protocol Stats
            </Link>
            <Link
              href="/admin/coverage"
              className="rounded-xl border border-line bg-panel-strong px-3 py-2 text-xs font-semibold text-ink"
            >
              Contract Coverage
            </Link>
          </div>
        </Panel>

        <Panel title="Batch Auction Operations" subtitle="Execution and proof lifecycle">
          <p className="text-sm text-muted">
            Submit Batch Auction groups many compatible intents into one clearing cycle so execution can get better pricing,
            deterministic matching, and proofable settlement.
          </p>
          <p className="mt-2 text-sm text-muted">
            Users should not manually submit these from frontend. The operator service triggers batches when intent flow volume
            and liquidity conditions justify it.
          </p>
          <label className="mt-4 block text-sm text-muted">
            Inspect batch id
            <input
              value={batchId}
              onChange={(event) => setBatchId(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
            />
          </label>
          <p className="mt-3 text-xs text-muted">
            Match status: {batchResultQuery.data?.status ?? "n/a"} | matched orders: {batchResultQuery.data?.matched_orders ?? 0}
          </p>
          <p className="text-xs text-muted">
            Proof status: {batchProofQuery.data?.state ?? "n/a"} | ready {String(batchProofQuery.data?.proof_ready ?? false)}
          </p>
        </Panel>
      </section>
    </PageFrame>
  );
}
