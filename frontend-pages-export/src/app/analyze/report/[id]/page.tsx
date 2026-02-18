"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { ApproveTradePanel } from "@/components/analyzer/ApproveTradePanel";
import { ModelConsensusPanel } from "@/components/analyzer/ModelConsensusPanel";
import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";
import { useTradingStore } from "@/store/trading";

export default function AnalyzeReportPage() {
  const params = useParams<{ id: string }>();
  const analysisId = params.id;

  const setAnalysisContext = useTradingStore((state) => state.setAnalysisContext);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analyzer-report", analysisId],
    queryFn: () => standrApi.getAnalyzerReport(analysisId),
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setAnalysisContext({
      analysisId: data.analysis_id,
      analysisTradeType: data.report.trade_type ?? null,
      recommendedVaultStrategy:
        data.report.trade_type === "perps" ? "katana-stable" : null,
    });
  }, [data, setAnalysisContext]);

  if (isLoading) {
    return (
      <PageFrame title="Analyzer Report" description="Loading report...">
        <p className="text-sm text-muted">Fetching analysis report...</p>
      </PageFrame>
    );
  }

  if (isError || !data) {
    return (
      <PageFrame title="Analyzer Report" description="Report unavailable">
        <p className="text-sm text-danger">
          {error instanceof Error ? error.message : "Failed to load report"}
        </p>
        <Link href="/analyze/coin" className="text-sm text-cyan-300 underline">
          Back to analyzer
        </Link>
      </PageFrame>
    );
  }

  const report = data.report;
  const defaultTradeType = report.trade_type ?? "spot";

  return (
    <PageFrame
      title="Analyzer Report"
      description="Review the report, confirm risk terms, and create an idempotent trade request."
    >
      <section className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="mt-2 text-sm text-muted">{report.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
          <span className="rounded-full border border-line bg-[#0b1018] px-2 py-1">Kind: {report.kind}</span>
          {report.symbol_or_pair ? (
            <span className="rounded-full border border-line bg-[#0b1018] px-2 py-1">
              Pair: {report.symbol_or_pair}
            </span>
          ) : null}
          {report.platform ? (
            <span className="rounded-full border border-line bg-[#0b1018] px-2 py-1">
              Platform: {report.platform}
            </span>
          ) : null}
          <span className="rounded-full border border-line bg-[#0b1018] px-2 py-1">
            Recommendation: {report.recommendation}
          </span>
        </div>
      </section>

      <ModelConsensusPanel report={report} />

      <ApproveTradePanel analysisId={analysisId} defaultTradeType={defaultTradeType} />
    </PageFrame>
  );
}
