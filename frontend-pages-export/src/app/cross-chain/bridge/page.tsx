"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";
import type { QuoteMatrixRoute } from "@/lib/types/domain";

function formatEta(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export default function CrossChainBridgePage() {
  const { traderAddress } = useTraderAddress();
  const [orderId, setOrderId] = useState("order_001");
  const [mempoolType, setMempoolType] = useState("flashbots");
  const [privateOrderId, setPrivateOrderId] = useState("");

  const [sourceChain, setSourceChain] = useState("137");
  const [destChain, setDestChain] = useState("1135");
  const [tokenIn, setTokenIn] = useState("USDC");
  const [tokenOut, setTokenOut] = useState("USDC");
  const [amountIn, setAmountIn] = useState("1000");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [transferId, setTransferId] = useState("");

  const servicesQuery = useQuery({
    queryKey: ["cross-chain-bridge-services"],
    queryFn: standrApi.listPrivateMempoolServices,
  });

  const quoteMatrixMutation = useMutation({
    mutationFn: () =>
      standrApi.getBridgeQuoteMatrix({
        source_chain_id: Number(sourceChain) || 0,
        destination_chain_id: Number(destChain) || 0,
        token_in: tokenIn,
        token_out: tokenOut,
        amount_in: amountIn,
      }),
    onSuccess: (result) => {
      setSelectedRouteId(result.best_route_id);
    },
  });
  const quoteMutation = useMutation({
    mutationFn: () =>
      standrApi.getBridgeQuote({
        source_chain_id: Number(sourceChain) || 0,
        destination_chain_id: Number(destChain) || 0,
        token_in: tokenIn,
        token_out: tokenOut,
        amount_in: amountIn,
      }),
  });
  const bridgeSubmitMutation = useMutation({
    mutationFn: () =>
      standrApi.submitBridgeTransfer({
        route_id: selectedRouteId || quoteMutation.data?.route_id || "",
      }),
    onSuccess: (result) => setTransferId(result.transfer_id),
  });
  const statusQuery = useQuery({
    queryKey: ["cross-chain-bridge-status", transferId],
    queryFn: () => standrApi.getBridgeStatus(transferId),
    enabled: transferId.trim().length > 0,
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      standrApi.submitPrivateOrder({
        user: traderAddress,
        order_id: orderId,
        mempool_type: mempoolType,
      }),
    onSuccess: (result) => setPrivateOrderId(result.private_order_id),
  });

  const executeMutation = useMutation({
    mutationFn: () => standrApi.executePrivateOrder({ private_order_id: privateOrderId }),
  });

  const matrixRoutes = quoteMatrixMutation.data?.routes ?? [];
  const bestRouteId = quoteMatrixMutation.data?.best_route_id ?? null;

  function routeRowClass(route: QuoteMatrixRoute): string {
    const base = "cursor-pointer transition";
    if (!route.healthy) return `${base} opacity-50`;
    if (route.route_id === selectedRouteId) {
      return `${base} border-cyan-400/60 bg-cyan-500/10`;
    }
    return `${base} border-line bg-[#0b1018]/90 hover:border-cyan-400/30`;
  }

  return (
    <PageFrame
      title="Private Order Console"
      description="Compare bridge routes, submit and execute private mempool orders for MEV protection."
    >
      {/* --- Route comparison matrix --- */}
      <section className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
        <h2 className="text-lg font-semibold">Bridge Route Comparison</h2>
        <p className="mt-1 text-xs text-muted">
          Compare routes across providers to find the best cost, speed, and output.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <label className="block text-sm text-muted">
            Source Chain
            <input
              value={sourceChain}
              onChange={(e) => setSourceChain(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              placeholder="137"
            />
          </label>
          <label className="block text-sm text-muted">
            Dest Chain
            <input
              value={destChain}
              onChange={(e) => setDestChain(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              placeholder="1135"
            />
          </label>
          <label className="block text-sm text-muted">
            Token In
            <input
              value={tokenIn}
              onChange={(e) => setTokenIn(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <label className="block text-sm text-muted">
            Token Out
            <input
              value={tokenOut}
              onChange={(e) => setTokenOut(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <label className="block text-sm text-muted">
            Amount
            <input
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => quoteMatrixMutation.mutate()}
          disabled={quoteMatrixMutation.isPending}
          className="mt-4 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-5 py-2 text-sm font-semibold text-cyan-100 disabled:opacity-60"
        >
          {quoteMatrixMutation.isPending ? "Fetching routes..." : "Compare Routes"}
        </button>

        {quoteMatrixMutation.isError ? (
          <p className="mt-3 text-sm text-red-400">
            Failed to fetch routes. Check that source and destination chains differ.
          </p>
        ) : null}

        {matrixRoutes.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-[0.12em] text-muted">
                  <th className="px-3 py-2">Provider</th>
                  <th className="px-3 py-2">Output</th>
                  <th className="px-3 py-2">Cost (USD)</th>
                  <th className="px-3 py-2">ETA</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Select</th>
                </tr>
              </thead>
              <tbody>
                {matrixRoutes.map((route) => (
                  <tr
                    key={route.route_id}
                    className={routeRowClass(route)}
                    onClick={() => route.healthy && setSelectedRouteId(route.route_id)}
                  >
                    <td className="px-3 py-3">
                      <span className="font-semibold text-ink">{route.provider}</span>
                      {route.route_id === bestRouteId ? (
                        <span className="ml-2 rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-400">
                          Best
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 font-mono text-ink">
                      {parseFloat(route.estimated_amount_out).toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                    </td>
                    <td className="px-3 py-3 text-muted">
                      ${parseFloat(route.cost_estimate_usd).toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                      })}
                    </td>
                    <td className="px-3 py-3 text-muted">{formatEta(route.eta_seconds)}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          route.healthy ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            route.healthy ? "bg-emerald-400" : "bg-red-400"
                          }`}
                        />
                        {route.healthy ? "Healthy" : "Down"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="radio"
                        name="selected-route"
                        checked={selectedRouteId === route.route_id}
                        disabled={!route.healthy}
                        onChange={() => setSelectedRouteId(route.route_id)}
                        className="accent-cyan-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedRouteId ? (
              <p className="mt-3 text-sm text-muted">
                Selected route:{" "}
                <span className="font-semibold text-ink">{selectedRouteId}</span>
              </p>
            ) : null}
          </div>
        ) : quoteMatrixMutation.isSuccess ? (
          <p className="mt-4 text-sm text-muted">No routes available for this pair.</p>
        ) : null}

        <div className="mt-5 rounded-xl border border-line bg-[#0b1018]/90 p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Direct Bridge Flow</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => quoteMutation.mutate()}
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
            >
              Get Direct Quote
            </button>
            <button
              type="button"
              onClick={() => bridgeSubmitMutation.mutate()}
              disabled={!selectedRouteId && !quoteMutation.data?.route_id}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100 disabled:opacity-60"
            >
              Submit Bridge Transfer
            </button>
          </div>
          {quoteMutation.data ? (
            <p className="mt-2 text-xs text-muted">
              Quote route {quoteMutation.data.route_id}: est out{" "}
              {quoteMutation.data.estimated_amount_out} in {formatEta(quoteMutation.data.eta_seconds)}
            </p>
          ) : null}
          {bridgeSubmitMutation.data ? (
            <p className="mt-2 text-xs text-muted">
              Submitted transfer {bridgeSubmitMutation.data.transfer_id} on route{" "}
              {selectedRouteId || quoteMutation.data?.route_id}
            </p>
          ) : null}
          {statusQuery.data ? (
            <p className="mt-2 text-xs text-muted">
              Transfer status: {statusQuery.data.status} ({statusQuery.data.confirmations_current}/
              {statusQuery.data.confirmations_required})
            </p>
          ) : null}
        </div>
      </section>

      {/* --- Private order + services --- */}
      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Submit Private Order</h2>
          <label className="mt-3 block text-sm text-muted">
            Order ID
            <input
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <label className="mt-3 block text-sm text-muted">
            Mempool Type
            <input
              value={mempoolType}
              onChange={(event) => setMempoolType(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <button
            type="button"
            onClick={() => submitMutation.mutate()}
            className="mt-4 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100"
          >
            Submit to Private Mempool
          </button>

          {submitMutation.data ? (
            <div className="mt-4 rounded-xl border border-line bg-[#0b1018]/90 p-3 text-sm text-muted">
              <p className="font-semibold text-ink">Submitted</p>
              <p>Private Order ID: {submitMutation.data.private_order_id}</p>
              <p>Status: {submitMutation.data.status}</p>
              <p>Created At: {new Date(submitMutation.data.created_at * 1000).toLocaleString()}</p>
            </div>
          ) : null}

          <h3 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">Execute Order</h3>
          <label className="mt-2 block text-sm text-muted">
            Private Order ID
            <input
              value={privateOrderId}
              onChange={(event) => setPrivateOrderId(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <button
            type="button"
            onClick={() => executeMutation.mutate()}
            disabled={!privateOrderId}
            className="mt-3 rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60"
          >
            Execute Private Order
          </button>

          {executeMutation.data ? (
            <div className="mt-4 rounded-xl border border-line bg-[#0b1018]/90 p-3 text-sm text-muted">
              <p className="font-semibold text-ink">Execution Result</p>
              <p>Status: {executeMutation.data.status}</p>
              <p>Amount Out: {executeMutation.data.executed_amount_out}</p>
              <p>Executed At: {new Date(executeMutation.data.executed_at * 1000).toLocaleString()}</p>
            </div>
          ) : null}
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Available Services</h2>
          <ul className="mt-3 space-y-2">
            {(servicesQuery.data ?? []).map((service) => (
              <li
                key={service.mempool_type}
                className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-sm"
              >
                <p className="font-semibold text-ink">{service.mempool_type}</p>
                <p className="font-mono text-xs text-muted">{service.service_address}</p>
                <p className="text-xs text-muted">{service.enabled ? "Enabled" : "Disabled"}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </PageFrame>
  );
}
