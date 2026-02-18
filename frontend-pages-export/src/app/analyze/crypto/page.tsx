"use client";

import { useRouter } from "next/navigation";

import { AnalyzerHero } from "@/components/analyzer/AnalyzerHero";
import { CoinAnalyzeForm } from "@/components/analyzer/CoinAnalyzeForm";
import { PageFrame } from "@/components/page-frame";
import { TradingSurfaceNav } from "@/components/trading/TradingSurfaceNav";

export default function AnalyzeCryptoPage() {
  const router = useRouter();

  return (
    <PageFrame
      title="Crypto Analyzer"
      description="Create a structured crypto report and move directly into explicit approval-driven execution."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section className="space-y-4">
          <AnalyzerHero
            title="AI Crypto Analysis"
            subtitle="Select pair, exchange, and execution type. The report is generated from multi-model consensus."
            disclaimer="STANDR DEX analysis is informational, not financial advice. Always do your own due diligence."
          />
          <CoinAnalyzeForm onCreated={(analysisId) => router.push(`/analyze/report/${analysisId}`)} />
        </section>
        <TradingSurfaceNav variant="analyze" />
      </div>
    </PageFrame>
  );
}
