"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export function PredictionAnalyzeForm({
  onCreated,
}: {
  onCreated: (analysisId: string) => void;
}) {
  const { traderAddress } = useTraderAddress();
  const [url, setUrl] = useState("");
  const [minLiquidityUsd, setMinLiquidityUsd] = useState("10000");
  const [minVolumeUsd, setMinVolumeUsd] = useState("5000");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      standrApi.createPredictionAnalyzerReport({
        wallet_address: traderAddress,
        url: url.trim(),
        min_liquidity_usd: Number(minLiquidityUsd),
        min_volume_24h_usd: Number(minVolumeUsd),
      }),
    onSuccess: (data) => {
      setError(null);
      onCreated(data.analysis_id);
    },
    onError: (requestError) => {
      const message = requestError instanceof Error ? requestError.message : "analysis failed";
      setError(message);
    },
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!url.trim().startsWith("http")) {
      setError("Please provide a valid market URL.");
      return;
    }

    if (Number(minLiquidityUsd) <= 0 || Number(minVolumeUsd) <= 0) {
      setError("Minimum liquidity and volume must be positive numbers.");
      return;
    }

    mutation.mutate();
  }

  return (
    <form
      className="space-y-4 rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.34)]"
      onSubmit={onSubmit}
    >
      <label className="space-y-1 text-sm text-muted">
        <span>Prediction Market URL</span>
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
          placeholder="https://polymarket.com/event/... or https://kalshi.com/markets/..."
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-muted">
          <span>Minimum Liquidity (USD)</span>
          <input
            type="number"
            min={1}
            value={minLiquidityUsd}
            onChange={(event) => setMinLiquidityUsd(event.target.value)}
            className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
          />
        </label>

        <label className="space-y-1 text-sm text-muted">
          <span>Minimum 24h Volume (USD)</span>
          <input
            type="number"
            min={1}
            value={minVolumeUsd}
            onChange={(event) => setMinVolumeUsd(event.target.value)}
            className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
          />
        </label>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
      >
        <span>{mutation.isPending ? "Analyzing..." : "Analyze Market"}</span>
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
