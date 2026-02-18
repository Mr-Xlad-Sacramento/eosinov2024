"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { TradingSurfaceNav } from "@/components/trading/TradingSurfaceNav";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function OptionsTradePage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();

  const [seriesId, setSeriesId] = useState("ETH-C-2500-30D");
  const [size, setSize] = useState(1);
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [premiumPaid, setPremiumPaid] = useState("100");
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [quoteResult, setQuoteResult] = useState<string>("No quote requested yet.");
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const { data: series } = useQuery({
    queryKey: ["options-series"],
    queryFn: standrApi.getOptionSeries,
  });
  const { data: positions } = useQuery({
    queryKey: ["options-positions", traderAddress],
    queryFn: () => standrApi.getOptionPositions(traderAddress),
  });

  const openMutation = useMutation({
    mutationFn: () =>
      standrApi.openOptionPosition({
        owner: traderAddress,
        series_id: seriesId,
        size,
        premium_paid: premiumPaid,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["options-positions", traderAddress] });
    },
  });

  const closeMutation = useMutation({
    mutationFn: (positionId: string) => standrApi.closeOptionPosition({ position_id: positionId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["options-positions", traderAddress] });
    },
  });

  const exerciseMutation = useMutation({
    mutationFn: (positionId: string) =>
      standrApi.exerciseOptionPosition({ position_id: positionId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["options-positions", traderAddress] });
    },
  });

  const selectedSeries = useMemo(
    () => series?.find((item) => item.series_id === seriesId),
    [series, seriesId],
  );

  const positionToUpdate = selectedPositionId || positions?.[0]?.position_id || "";

  async function onQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuoteError(null);
    try {
      const quote = await standrApi.getOptionQuote({
        series_id: seriesId,
        side,
        size,
      });
      setQuoteResult(
        `${quote.side} ${quote.size} @ ${quote.premium_bps} bps premium (est. cost ${quote.estimated_cost})`,
      );
      setPremiumPaid(quote.estimated_cost);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      setQuoteError(message);
      setQuoteResult("Quote failed.");
    }
  }

  return (
    <PageFrame
      title="Options Trading"
      description="Quote, open, close, and exercise options positions through backend APIs."
    >
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <TradingSurfaceNav />
        <div className="space-y-4">
          <section className="grid gap-4 lg:grid-cols-2">
            <Panel title="Series + Quote" subtitle="/api/v1/options">
              <form className="space-y-3" onSubmit={onQuote}>
                <label className="block text-sm text-muted">
                  Series
                  <select
                    value={seriesId}
                    onChange={(event) => setSeriesId(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                  >
                    {(series ?? []).map((item) => (
                      <option key={item.series_id} value={item.series_id}>
                        {item.series_id}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-sm text-muted">
                    Side
                    <select
                      value={side}
                      onChange={(event) => setSide(event.target.value as "BUY" | "SELL")}
                      className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                    >
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </label>
                  <label className="text-sm text-muted">
                    Size
                    <input
                      type="number"
                      min={1}
                      value={size}
                      onChange={(event) => setSize(Number(event.target.value))}
                      className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="rounded-xl border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  Get quote
                </button>
              </form>
              <p className="mt-3 text-sm text-muted">{quoteResult}</p>
              {quoteError ? <p className="mt-2 text-sm text-danger">{quoteError}</p> : null}
              {selectedSeries ? (
                <p className="mt-2 text-xs text-muted">
                  Selected {selectedSeries.option_type} strike {selectedSeries.strike_price} expiring at{" "}
                  {new Date(selectedSeries.expiry_unix * 1000).toLocaleString()}
                </p>
              ) : null}
            </Panel>

            <Panel title="Position Actions" subtitle={`Trader ${traderAddress}`}>
              <div className="space-y-3">
                <label className="block text-sm text-muted">
                  Premium Paid (for open)
                  <input
                    value={premiumPaid}
                    onChange={(event) => setPremiumPaid(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => openMutation.mutate()}
                  disabled={openMutation.isPending}
                  className="rounded-xl border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {openMutation.isPending ? "Opening..." : "Open Position"}
                </button>
                {openMutation.isError ? (
                  <p className="text-sm text-danger">
                    {openMutation.error instanceof Error ? openMutation.error.message : "open failed"}
                  </p>
                ) : null}

                <label className="block text-sm text-muted">
                  Position ID (close/exercise)
                  <input
                    value={selectedPositionId}
                    onChange={(event) => setSelectedPositionId(event.target.value)}
                    placeholder={positions?.[0]?.position_id ?? "position id"}
                    className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => closeMutation.mutate(positionToUpdate)}
                    disabled={!positionToUpdate || closeMutation.isPending}
                    className="rounded-xl border border-line bg-panel px-3 py-2 text-xs font-semibold text-ink disabled:opacity-50"
                  >
                    {closeMutation.isPending ? "Closing..." : "Close"}
                  </button>
                  <button
                    type="button"
                    onClick={() => exerciseMutation.mutate(positionToUpdate)}
                    disabled={!positionToUpdate || exerciseMutation.isPending}
                    className="rounded-xl border border-line bg-panel px-3 py-2 text-xs font-semibold text-ink disabled:opacity-50"
                  >
                    {exerciseMutation.isPending ? "Exercising..." : "Exercise"}
                  </button>
                </div>
                {closeMutation.isError ? (
                  <p className="text-sm text-danger">
                    {closeMutation.error instanceof Error ? closeMutation.error.message : "close failed"}
                  </p>
                ) : null}
                {exerciseMutation.isError ? (
                  <p className="text-sm text-danger">
                    {exerciseMutation.error instanceof Error
                      ? exerciseMutation.error.message
                      : "exercise failed"}
                  </p>
                ) : null}
              </div>
            </Panel>
          </section>

          <Panel title="Open Positions" subtitle="Backend state">
            <ul className="space-y-2 text-sm text-muted">
              {(positions ?? []).map((position) => (
                <li key={position.position_id} className="rounded-xl border border-line bg-canvas px-3 py-2">
                  {position.position_id}: {position.series_id} size {position.size} premium{" "}
                  {position.premium_paid} ({position.state})
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </PageFrame>
  );
}
