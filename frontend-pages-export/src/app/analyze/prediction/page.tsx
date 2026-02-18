"use client";

import { useRouter } from "next/navigation";

import { AnalyzerHero } from "@/components/analyzer/AnalyzerHero";
import { PredictionAnalyzeForm } from "@/components/analyzer/PredictionAnalyzeForm";
import { PageFrame } from "@/components/page-frame";

export default function AnalyzePredictionPage() {
  const router = useRouter();

  return (
    <PageFrame
      title="Prediction Analyzer"
      description="Validate prediction market requirements for Polymarket and Kalshi, then generate AI consensus."
    >
      <AnalyzerHero
        title="Prediction Market Analysis"
        subtitle="Paste a supported market URL and run requirements + multi-model analysis before any execution decision."
        disclaimer="Prediction reports include model uncertainty and may contain fallback data when providers are unavailable."
      />
      <PredictionAnalyzeForm onCreated={(analysisId) => router.push(`/analyze/report/${analysisId}`)} />
    </PageFrame>
  );
}
