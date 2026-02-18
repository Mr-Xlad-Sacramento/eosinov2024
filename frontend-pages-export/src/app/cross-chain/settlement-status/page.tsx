"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

function statusColor(status: string): string {
  const lower = status.toLowerCase();
  if (lower === "verified" || lower === "completed" || lower === "ready" || lower === "healthy") {
    return "text-emerald-400";
  }
  if (lower === "pending" || lower === "generating" || lower === "submitted" || lower === "in_transit") {
    return "text-amber-400";
  }
  if (lower === "failed" || lower === "error" || lower === "stale") {
    return "text-red-400";
  }
  return "text-slate-400";
}

function statusDot(status: string): string {
  const lower = status.toLowerCase();
  if (lower === "verified" || lower === "completed" || lower === "ready" || lower === "healthy") {
    return "bg-emerald-400";
  }
  if (lower === "pending" || lower === "generating" || lower === "submitted" || lower === "in_transit") {
    return "bg-amber-400";
  }
  if (lower === "failed" || lower === "error" || lower === "stale") {
    return "bg-red-400";
  }
  return "bg-slate-400";
}

export default function CrossChainSettlementStatusPage() {
  const { traderAddress } = useTraderAddress();
  const [transferId, setTransferId] = useState("");
  const [chainId, setChainId] = useState("137");
  const [token, setToken] = useState("USDC");

  const overviewQuery = useQuery({
    queryKey: ["settlement-overview"],
    queryFn: standrApi.getOverview,
    refetchInterval: 15_000,
  });

  const snapshotsQuery = useQuery({
    queryKey: ["settlement-snapshots", traderAddress],
    queryFn: () => standrApi.getUserSnapshots(traderAddress),
  });

  const transferStatusMutation = useMutation({
    mutationFn: () => standrApi.getBridgeStatus(transferId),
  });

  const balanceMutation = useMutation({
    mutationFn: () =>
      standrApi.getCrossChainBalance(traderAddress, Number(chainId) || 0, token),
  });

  const network = overviewQuery.data?.network ?? null;
  const oracle = overviewQuery.data?.oracle ?? null;
  const proof = overviewQuery.data?.proof ?? null;
  const bridgeTransfers = overviewQuery.data?.bridge_transfers ?? [];
  const riskAlerts = overviewQuery.data?.risk_alerts ?? [];

  const networkReady = network?.synced ?? false;
  const oracleHealthy = oracle?.healthy ?? false;
  const proverOnline = proof?.prover_online ?? false;
  const proofReady = proof?.proof_ready ?? false;

  const overallHealth =
    networkReady && oracleHealthy && proverOnline
      ? "healthy"
      : networkReady || oracleHealthy
        ? "degraded"
        : "offline";

  return (
    <PageFrame
      title="Settlement Status"
      description="Monitor settlement proof verification, bridge transfer tracking, and network readiness in real time."
    >
      {/* --- Network readiness indicators --- */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Overall Settlement</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded-full ${statusDot(overallHealth)}`} />
            <span className={`text-lg font-semibold capitalize ${statusColor(overallHealth)}`}>
              {overallHealth}
            </span>
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Network Sync</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded-full ${networkReady ? "bg-emerald-400" : "bg-red-400"}`} />
            <span className={`text-lg font-semibold ${networkReady ? "text-emerald-400" : "text-red-400"}`}>
              {networkReady ? "Synced" : "Not synced"}
            </span>
          </div>
          {network ? (
            <div className="mt-2 space-y-0.5 text-xs text-muted">
              <p>Block: {network.latest_block.toLocaleString()}</p>
              <p>Peers: {network.connected_peers}</p>
              <p>Gas: {network.gas_price_gwei} gwei</p>
            </div>
          ) : null}
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Oracle Health</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded-full ${oracleHealthy ? "bg-emerald-400" : "bg-red-400"}`} />
            <span className={`text-lg font-semibold ${oracleHealthy ? "text-emerald-400" : "text-red-400"}`}>
              {oracleHealthy ? "Healthy" : "Degraded"}
            </span>
          </div>
          {oracle ? (
            <div className="mt-2 space-y-0.5 text-xs text-muted">
              <p>Stale feeds: {oracle.stale_feeds}</p>
              <p>Threshold: {oracle.stale_threshold_secs}s</p>
              <p>Checked: {oracle.checked_at}</p>
            </div>
          ) : null}
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">ZK Prover</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded-full ${proverOnline ? "bg-emerald-400" : "bg-red-400"}`} />
            <span className={`text-lg font-semibold ${proverOnline ? "text-emerald-400" : "text-red-400"}`}>
              {proverOnline ? "Online" : "Offline"}
            </span>
          </div>
          {proof ? (
            <div className="mt-2 space-y-0.5 text-xs text-muted">
              <p>State: {proof.state}</p>
              <p>Proof ready: {proof.proof_ready ? "Yes" : "No"}</p>
              {proof.proof_hash ? <p className="font-mono truncate">Hash: {proof.proof_hash}</p> : null}
            </div>
          ) : null}
        </article>
      </section>

      {/* --- Settlement proof verification + Bridge transfers --- */}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Settlement Proof Verification</h2>

          {proof ? (
            <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-4">
              <div className="flex items-center gap-3">
                <span className={`inline-block h-4 w-4 rounded-full ${statusDot(proof.state)}`} />
                <span className={`text-base font-semibold capitalize ${statusColor(proof.state)}`}>
                  {proof.state}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted">Batch ID</p>
                  <p className="font-mono text-ink">{proof.batch_id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Proof Ready</p>
                  <p className={proofReady ? "text-emerald-400" : "text-amber-400"}>
                    {proofReady ? "Verified" : "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Prover Status</p>
                  <p className={proverOnline ? "text-emerald-400" : "text-red-400"}>
                    {proverOnline ? "Online" : "Offline"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Updated At</p>
                  <p className="text-ink">
                    {new Date(proof.updated_at * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
              {proof.proof_hash ? (
                <div className="mt-3">
                  <p className="text-xs text-muted">Proof Hash</p>
                  <p className="font-mono text-xs text-ink break-all">{proof.proof_hash}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">
              {overviewQuery.isLoading ? "Loading proof status..." : "No proof data available."}
            </p>
          )}

          {riskAlerts.length > 0 ? (
            <>
              <h3 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">Risk Alerts</h3>
              <ul className="mt-2 space-y-2">
                {riskAlerts.map((alert, idx) => (
                  <li
                    key={`${alert.level}-${idx}`}
                    className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-sm"
                  >
                    <span className={`font-semibold uppercase ${statusColor(alert.level === "critical" ? "failed" : alert.level)}`}>
                      {alert.level}
                    </span>
                    <p className="mt-1 text-xs text-muted">{alert.message}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Bridge Transfer Tracking</h2>
          <ul className="mt-3 space-y-2">
            {bridgeTransfers.map((transfer) => (
              <li
                key={transfer.transfer_id}
                className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-ink">{transfer.transfer_id}</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-block h-2 w-2 rounded-full ${statusDot(transfer.status)}`} />
                    <span className={`text-xs font-semibold capitalize ${statusColor(transfer.status)}`}>
                      {transfer.status}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Chain {transfer.source_chain_id} &rarr; Chain {transfer.destination_chain_id}
                </p>
              </li>
            ))}
            {bridgeTransfers.length === 0 ? (
              <li className="text-sm text-muted">No bridge transfers found.</li>
            ) : null}
          </ul>

          <h3 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">Lookup Transfer</h3>
          <label className="mt-2 block text-sm text-muted">
            Transfer ID
            <input
              value={transferId}
              onChange={(event) => setTransferId(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              placeholder="transfer_001"
            />
          </label>
          <button
            type="button"
            onClick={() => transferStatusMutation.mutate()}
            disabled={!transferId}
            className="mt-3 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 disabled:opacity-60"
          >
            Check Status
          </button>
          {transferStatusMutation.data ? (
            <div className="mt-4 rounded-xl border border-line bg-[#0b1018]/90 p-3 text-sm text-muted">
              <p className="font-semibold text-ink">Transfer Detail</p>
              <div className="mt-2 space-y-1 text-xs">
                <p>
                  Status:{" "}
                  <span className={`font-semibold capitalize ${statusColor(transferStatusMutation.data.status)}`}>
                    {transferStatusMutation.data.status}
                  </span>
                </p>
                <p>Source TX: <span className="font-mono text-ink">{transferStatusMutation.data.source_tx}</span></p>
                {transferStatusMutation.data.destination_tx ? (
                  <p>Dest TX: <span className="font-mono text-ink">{transferStatusMutation.data.destination_tx}</span></p>
                ) : null}
                <p>
                  Confirmations: {transferStatusMutation.data.confirmations_current} / {transferStatusMutation.data.confirmations_required}
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-[#0b1018] border border-line">
                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all"
                    style={{
                      width: `${Math.min(100, transferStatusMutation.data.confirmations_required > 0 ? (transferStatusMutation.data.confirmations_current / transferStatusMutation.data.confirmations_required) * 100 : 0)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </article>
      </section>

      {/* --- Snapshot history + Balance lookup --- */}
      <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Snapshot Timeline</h2>
          <ul className="mt-3 space-y-2">
            {(snapshotsQuery.data ?? []).map((snapshot) => (
              <li
                key={snapshot.snapshot_id}
                className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-3 text-sm"
              >
                <p className="font-mono text-xs text-ink">{snapshot.snapshot_id}</p>
                <p className="mt-1 text-xs text-muted">
                  {new Date(snapshot.timestamp * 1000).toLocaleString()}
                </p>
                <p className="text-sm text-muted">Total Value: ${snapshot.total_value_usd}</p>
                <p className="text-xs text-muted">{snapshot.balances.length} balances tracked</p>
              </li>
            ))}
            {(snapshotsQuery.data ?? []).length === 0 ? (
              <li className="text-sm text-muted">No snapshots available yet.</li>
            ) : null}
          </ul>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Balance Lookup</h2>
          <label className="mt-3 block text-sm text-muted">
            Chain ID
            <input
              value={chainId}
              onChange={(event) => setChainId(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <label className="mt-3 block text-sm text-muted">
            Token
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <button
            type="button"
            onClick={() => balanceMutation.mutate()}
            className="mt-3 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100"
          >
            Query Balance
          </button>
          {balanceMutation.data ? (
            <div className="mt-4 rounded-xl border border-line bg-[#0b1018]/90 p-3 text-sm text-muted">
              <p className="font-semibold text-ink">Result</p>
              <p>Chain: {balanceMutation.data.chain_id}</p>
              <p>Token: {balanceMutation.data.token}</p>
              <p>Balance: {balanceMutation.data.balance}</p>
              <p>Value: ${balanceMutation.data.value_usd}</p>
            </div>
          ) : null}
        </article>
      </section>
    </PageFrame>
  );
}
