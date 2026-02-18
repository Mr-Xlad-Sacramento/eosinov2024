"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

const EXCHANGES = ["binance", "coinbase", "kraken", "bybit", "okx"];

export function CoinAnalyzeForm({
  onCreated,
}: {
  onCreated: (analysisId: string) => void;
}) {
  const { traderAddress } = useTraderAddress();

  const [symbolOrPair, setSymbolOrPair] = useState("BTC/USDT");
  const [exchange, setExchange] = useState("binance");
  const [tradeType, setTradeType] = useState<"spot" | "perps">("spot");
  const [timeframe, setTimeframe] = useState("1d");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      standrApi.createCoinAnalyzerReport({
        wallet_address: traderAddress,
        symbol_or_pair: symbolOrPair.trim(),
        exchange,
        trade_type: tradeType,
        timeframe,
        include_news: true,
        include_onchain: true,
        include_social: true,
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

  const canSubmit = useMemo(() => {
    return symbolOrPair.trim().length > 0 && EXCHANGES.includes(exchange);
  }, [exchange, symbolOrPair]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setError("Please provide a valid symbol/pair and exchange.");
      return;
    }

    mutation.mutate();
  }

  return (
    <form
      className="space-y-4 rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.34)]"
      onSubmit={onSubmit}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-muted">
          <span>Coin / Pair</span>
          <input
            value={symbolOrPair}
            onChange={(event) => setSymbolOrPair(event.target.value)}
            className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            placeholder="BTC/USDT"
          />
        </label>

        <label className="space-y-1 text-sm text-muted">
          <span>Exchange</span>
          <select
            value={exchange}
            onChange={(event) => setExchange(event.target.value)}
            className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
          >
            {EXCHANGES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-muted">
          <span>Trade Type</span>
          <select
            value={tradeType}
            onChange={(event) => setTradeType(event.target.value as "spot" | "perps")}
            className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
          >
            <option value="spot">Spot</option>
            <option value="perps">Perps</option>
          </select>
        </label>

        <label className="space-y-1 text-sm text-muted">
          <span>Timeframe</span>
          <select
            value={timeframe}
            onChange={(event) => setTimeframe(event.target.value)}
            className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
          >
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>
        </label>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
      >
        <span>{mutation.isPending ? "Analyzing..." : "Analyze Coin"}</span>
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
