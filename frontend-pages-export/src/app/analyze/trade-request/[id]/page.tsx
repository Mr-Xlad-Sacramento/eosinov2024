"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";

export default function AnalyzerTradeRequestPage() {
  const params = useParams<{ id: string }>();
  const tradeRequestId = params.id;
  const queryClient = useQueryClient();

  const tradeRequestQuery = useQuery({
    queryKey: ["analyzer-trade-request", tradeRequestId],
    queryFn: () => standrApi.getAnalyzerTradeRequest(tradeRequestId),
  });

  const executeMutation = useMutation({
    mutationFn: () => standrApi.executeAnalyzerTradeRequest(tradeRequestId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["analyzer-trade-request", tradeRequestId],
      });
    },
  });

  const execution = useMemo(() => {
    const fromQuery = tradeRequestQuery.data?.execution;
    if (fromQuery && typeof fromQuery === "object") {
      return fromQuery as Record<string, unknown>;
    }

    const fromMutation = executeMutation.data?.execution;
    if (fromMutation && typeof fromMutation === "object") {
      return fromMutation as Record<string, unknown>;
    }

    return null;
  }, [executeMutation.data?.execution, tradeRequestQuery.data?.execution]);

  if (tradeRequestQuery.isLoading) {
    return (
      <PageFrame title="Trade Request" description="Loading request...">
        <p className="text-sm text-muted">Fetching trade request details...</p>
      </PageFrame>
    );
  }

  if (tradeRequestQuery.isError || !tradeRequestQuery.data) {
    return (
      <PageFrame title="Trade Request" description="Request unavailable">
        <p className="text-sm text-danger">
          {tradeRequestQuery.error instanceof Error
            ? tradeRequestQuery.error.message
            : "Failed to load trade request"}
        </p>
        <Link href="/analyze/coin" className="text-sm text-cyan-300 underline">
          Back to analyzer
        </Link>
      </PageFrame>
    );
  }

  const request = tradeRequestQuery.data;
  const canExecute = request.status !== "executed" && request.status !== "executing";

  return (
    <PageFrame
      title="Approved Trade Request"
      description="Execute this approved request. Replays are idempotent and return the existing execution result."
    >
      <section className="space-y-3 rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
        <p className="text-sm text-muted">
          Request ID: <span className="font-medium text-ink">{request.trade_request_id}</span>
        </p>
        <p className="text-sm text-muted">
          Analysis ID: <span className="font-medium text-ink">{request.analysis_id}</span>
        </p>
        <p className="text-sm text-muted">
          Trade Type: <span className="font-medium text-ink">{request.trade_type}</span>
        </p>
        <p className="text-sm text-muted">
          Status: <span className="font-medium text-ink">{request.status}</span>
        </p>
        <p className="text-sm text-muted">
          Collateral: <span className="font-medium text-ink">{request.collateral_source}</span>
          {request.selected_vault_strategy
            ? ` (${request.selected_vault_strategy})`
            : ""}
        </p>
        <p className="text-sm text-muted">Expires at: {new Date(request.expires_at * 1000).toLocaleString()}</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canExecute || executeMutation.isPending}
            onClick={() => executeMutation.mutate()}
            className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
          >
            {executeMutation.isPending ? "Executing..." : "Execute Trade Request"}
          </button>

          <Link href={`/analyze/report/${request.analysis_id}`} className="text-sm text-cyan-300 underline">
            Back to report
          </Link>
        </div>

        {executeMutation.isError ? (
          <p className="text-sm text-danger">
            {executeMutation.error instanceof Error
              ? executeMutation.error.message
              : "Execution failed"}
          </p>
        ) : null}
      </section>

      {execution ? (
        <section className="space-y-2 rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Execution Result</h2>
          <pre className="overflow-x-auto rounded-xl border border-line bg-[#0b1018] p-3 text-xs text-muted">
            {JSON.stringify(execution, null, 2)}
          </pre>
        </section>
      ) : null}
    </PageFrame>
  );
}
