"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { TradingSurfaceNav } from "@/components/trading/TradingSurfaceNav";
import { VaultEligibilityPanel } from "@/components/vault-eligibility-panel";
import { DEMO_TOKEN } from "@/lib/constants";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";
import { useTradingStore } from "@/store/trading";

function PerpsIntentPanel() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [intentText, setIntentText] = useState("");
  const [parsed, setParsed] = useState<{
    side: "LONG" | "SHORT";
    leverage: number;
    asset: string;
    collateral: number;
    collateralToken: string;
  } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const intentMutation = useMutation({
    mutationFn: () => {
      if (!parsed) throw new Error("No parsed intent");
      return standrApi.openPerpsPosition({
        trader: traderAddress,
        index_token: parsed.asset,
        collateral_token: parsed.collateralToken,
        collateral_amount: String(parsed.collateral),
        position_size: String(parsed.collateral * parsed.leverage),
        side: parsed.side,
        entry_price: 2200,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["perps-positions", traderAddress] });
      void queryClient.invalidateQueries({ queryKey: ["funding", DEMO_TOKEN] });
      void queryClient.invalidateQueries({ queryKey: ["perps-analytics", DEMO_TOKEN] });
      setIntentText("");
      setParsed(null);
      setParseError(null);
    },
  });

  function handleIntentChange(value: string) {
    setIntentText(value);
    setParseError(null);

    if (!value.trim()) {
      setParsed(null);
      return;
    }

    const pattern =
      /^open\s+(long|short)\s+(\d+)x?\s+([a-zA-Z0-9]+)\s+with\s+(\d+(?:\.\d+)?)\s*([a-zA-Z0-9]+)(?:\s+collateral)?$/i;
    const match = value.trim().match(pattern);

    if (!match) {
      setParseError("Format: open long 5x ETH with 1000 USDC");
      setParsed(null);
      return;
    }

    const side = match[1].toUpperCase() as "LONG" | "SHORT";
    const leverage = Number(match[2]);
    const asset = match[3].toUpperCase();
    const collateral = Number(match[4]);
    const collateralToken = match[5].toUpperCase();

    if (leverage < 1 || leverage > 30) {
      setParseError("Leverage must be between 1 and 30");
      setParsed(null);
      return;
    }

    if (collateral <= 0) {
      setParseError("Collateral must be positive");
      setParsed(null);
      return;
    }

    setParsed({ side, leverage, asset, collateral, collateralToken });
  }

  return (
    <Panel title="Perps Intent Panel" subtitle="Natural language perps position opening">
      <div className="space-y-3">
        <label className="block text-sm text-muted">
          Intent
          <input
            type="text"
            value={intentText}
            onChange={(e) => handleIntentChange(e.target.value)}
            placeholder="e.g., open long 5x ETH with 1000 USDC"
            className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
          />
        </label>

        {parseError && <p className="text-sm text-danger">{parseError}</p>}

        {parsed && (
          <div className="rounded-xl border border-line bg-canvas p-3 text-sm">
            <p className="font-semibold text-ink">Preview:</p>
            <p className="mt-1 text-muted">
              Side: <span className="text-ink">{parsed.side}</span>
            </p>
            <p className="text-muted">
              Leverage: <span className="text-ink">{parsed.leverage}x</span>
            </p>
            <p className="text-muted">
              Asset: <span className="text-ink">{parsed.asset}</span>
            </p>
            <p className="text-muted">
              Collateral: <span className="text-ink">{parsed.collateral} {parsed.collateralToken}</span>
            </p>
            <p className="text-muted">
              Position Size: <span className="text-ink">{parsed.collateral * parsed.leverage}</span>
            </p>
          </div>
        )}

        <button
          type="button"
          disabled={!parsed || intentMutation.isPending}
          onClick={() => intentMutation.mutate()}
          className="rounded-xl border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {intentMutation.isPending ? "Opening..." : "Confirm Intent"}
        </button>

        {intentMutation.data?.tx_hash && (
          <p className="text-xs text-muted">Tx: {intentMutation.data.tx_hash}</p>
        )}
        {intentMutation.isError && (
          <p className="text-sm text-danger">
            {intentMutation.error instanceof Error ? intentMutation.error.message : "Intent execution failed"}
          </p>
        )}
      </div>
    </Panel>
  );
}

export default function PerpsTradePage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();

  const leverage = useTradingStore((state) => state.leverage);
  const side = useTradingStore((state) => state.side);
  const setLeverage = useTradingStore((state) => state.setLeverage);
  const setSide = useTradingStore((state) => state.setSide);

  const [entryPrice, setEntryPrice] = useState(2200);
  const [collateralAmount, setCollateralAmount] = useState("2500000");
  const [positionSize, setPositionSize] = useState("7500000");
  const [closePositionId, setClosePositionId] = useState("");
  const [liqPrice, setLiqPrice] = useState<number | null>(null);
  const [liquidationError, setLiquidationError] = useState<string | null>(null);
  const [liquidationInputsText, setLiquidationInputsText] = useState<string | null>(null);

  const { data: funding } = useQuery({
    queryKey: ["funding", DEMO_TOKEN],
    queryFn: () => standrApi.getFunding(DEMO_TOKEN),
  });
  const { data: riskTier } = useQuery({
    queryKey: ["risk-tier", "BTC_ETH"],
    queryFn: () => standrApi.getRiskTier("BTC_ETH"),
  });
  const { data: positions } = useQuery({
    queryKey: ["perps-positions", traderAddress],
    queryFn: () => standrApi.getPositions(traderAddress),
  });
  const { data: perpsAnalytics } = useQuery({
    queryKey: ["perps-analytics", DEMO_TOKEN],
    queryFn: () => standrApi.getPerpsAnalytics({ asset: DEMO_TOKEN, window: "24h" }),
  });

  const selectedPositionId = closePositionId || positions?.[0]?.position_id || "";
  const { data: selectedPnl } = useQuery({
    queryKey: ["perps-pnl", selectedPositionId],
    queryFn: () => standrApi.getPnl(selectedPositionId),
    enabled: selectedPositionId.length > 0,
  });

  const openMutation = useMutation({
    mutationFn: () =>
      standrApi.openPerpsPosition({
        trader: traderAddress,
        index_token: DEMO_TOKEN,
        collateral_token: DEMO_TOKEN,
        collateral_amount: collateralAmount,
        position_size: positionSize,
        side,
        entry_price: entryPrice,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["perps-positions", traderAddress] });
      void queryClient.invalidateQueries({ queryKey: ["funding", DEMO_TOKEN] });
      void queryClient.invalidateQueries({ queryKey: ["perps-analytics", DEMO_TOKEN] });
    },
  });

  const closeMutation = useMutation({
    mutationFn: (positionId: string) =>
      standrApi.closePerpsPosition({ position_id: positionId, reduce_bps: 10_000 }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["perps-positions", traderAddress] });
      void queryClient.invalidateQueries({ queryKey: ["funding", DEMO_TOKEN] });
      void queryClient.invalidateQueries({ queryKey: ["perps-analytics", DEMO_TOKEN] });
      if (selectedPositionId) {
        void queryClient.invalidateQueries({ queryKey: ["perps-pnl", selectedPositionId] });
      }
    },
  });

  const sourceMode = funding?.source_mode ?? perpsAnalytics?.source_mode ?? riskTier?.source_mode ?? "simulation";
  const fundingSummary = useMemo(() => {
    if (!funding) {
      return "Funding feed loading";
    }
    return `${funding.current_rate_bps_per_hour} bps/hr (norm ${
      funding.normalized_rate_bps_per_hour?.toFixed(2) ?? "-"
    }) | OI L ${funding.long_oi} / S ${funding.short_oi}`;
  }, [funding]);

  async function onEstimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLiquidationError(null);
    try {
      const response = await standrApi.estimateLiquidation({
        entry_price: entryPrice,
        leverage,
        side,
        maintenance_margin_bps: riskTier?.maintenance_margin_bps,
      });
      setLiqPrice(response.liquidation_price);
      if (response.inputs) {
        setLiquidationInputsText(
          `MM ${response.inputs.maintenance_margin_bps} bps | threshold ${(response.inputs.liquidation_threshold_ratio * 100).toFixed(2)}%`,
        );
      } else {
        setLiquidationInputsText(null);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      setLiquidationError(message);
      setLiqPrice(null);
      setLiquidationInputsText(null);
    }
  }

  return (
    <PageFrame
      title="Perpetuals"
      description="Contract-faithful perps wiring with simulation/onchain source visibility and phase-1 analytics."
    >
      <div className="mb-4">
        <span className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
          source: {sourceMode}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <TradingSurfaceNav />

        <div className="space-y-4">
          <section className="grid gap-4 lg:grid-cols-2">
            <Panel title="Funding and Risk" subtitle="from /api/v1/perps + onchain adapter">
              <p className="text-sm text-muted">{fundingSummary}</p>
              <p className="mt-2 text-sm text-muted">
                Risk tier: {riskTier?.tier ?? "loading"} | max leverage {riskTier?.max_leverage ?? "-"}x
                {" | "}
                MM {(riskTier?.maintenance_margin_bps ?? 0) / 100}%
              </p>
              {funding?.raw ? (
                <p className="mt-2 text-xs text-muted">
                  Raw funding current/previous: {funding.raw.current_rate} / {funding.raw.previous_rate}
                </p>
              ) : null}
            </Panel>

            <Panel title="Liquidation Estimator" subtitle="contract-faithful calculation">
              <form className="space-y-3" onSubmit={onEstimate}>
                <label className="block text-sm text-muted">
                  Entry Price
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(event) => setEntryPrice(Number(event.target.value))}
                    className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                    min={1}
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="text-sm text-muted">
                    Leverage
                    <input
                      type="number"
                      value={leverage}
                      onChange={(event) => setLeverage(Number(event.target.value))}
                      className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                      min={1}
                      max={30}
                    />
                  </label>

                  <label className="text-sm text-muted">
                    Side
                    <select
                      value={side}
                      onChange={(event) => setSide(event.target.value as "LONG" | "SHORT")}
                      className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                    >
                      <option value="LONG">LONG</option>
                      <option value="SHORT">SHORT</option>
                    </select>
                  </label>
                </div>

                <button
                  type="submit"
                  className="rounded-xl border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  Estimate liquidation
                </button>
              </form>

              <p className="mt-3 text-sm text-muted">
                {liqPrice !== null ? `Estimated liquidation price: ${liqPrice.toFixed(2)}` : "No estimate yet"}
              </p>
              {liquidationInputsText ? <p className="mt-2 text-xs text-muted">{liquidationInputsText}</p> : null}
              {liquidationError ? <p className="mt-2 text-sm text-danger">{liquidationError}</p> : null}
            </Panel>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Panel title="Open Position" subtitle="POST /api/v1/perps/open">
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  openMutation.mutate();
                }}
              >
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-sm text-muted">
                    Collateral Amount
                    <input
                      value={collateralAmount}
                      onChange={(event) => setCollateralAmount(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                    />
                  </label>
                  <label className="text-sm text-muted">
                    Position Size
                    <input
                      value={positionSize}
                      onChange={(event) => setPositionSize(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={openMutation.isPending}
                  className="rounded-xl border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {openMutation.isPending ? "Opening..." : "Open Position"}
                </button>
              </form>
              {openMutation.data?.tx_hash ? (
                <p className="mt-2 text-xs text-muted">Tx: {openMutation.data.tx_hash}</p>
              ) : null}
              {openMutation.isError ? (
                <p className="mt-2 text-sm text-danger">
                  {openMutation.error instanceof Error ? openMutation.error.message : "open failed"}
                </p>
              ) : null}
            </Panel>

            <Panel title="Positions + Close" subtitle={`Trader ${traderAddress}`}>
              <label className="block text-sm text-muted">
                Position ID to close
                <input
                  value={closePositionId}
                  onChange={(event) => setClosePositionId(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
                  placeholder={positions?.[0]?.position_id ?? "select from list below"}
                />
              </label>
              <button
                type="button"
                disabled={!selectedPositionId || closeMutation.isPending}
                onClick={() => closeMutation.mutate(selectedPositionId)}
                className="mt-3 rounded-xl border border-line bg-panel px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50"
              >
                {closeMutation.isPending ? "Closing..." : "Close Selected Position"}
              </button>
              {closeMutation.data?.tx_hash ? (
                <p className="mt-2 text-xs text-muted">Tx: {closeMutation.data.tx_hash}</p>
              ) : null}
              {closeMutation.isError ? (
                <p className="mt-2 text-sm text-danger">
                  {closeMutation.error instanceof Error ? closeMutation.error.message : "close failed"}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-muted">
                Selected PnL: {selectedPnl ? `${selectedPnl.pnl} (${selectedPnl.pnl_percentage.toFixed(2)}%)` : "n/a"}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {(positions ?? []).map((position) => (
                  <li key={position.position_id} className="rounded-xl border border-line bg-canvas px-3 py-2">
                    {position.position_id.slice(0, 12)}... {position.side} size {position.position_size} ({position.status})
                  </li>
                ))}
              </ul>
            </Panel>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Panel title="Perps Analytics" subtitle="GET /api/v1/perps/analytics">
              <p className="text-sm text-muted">
                Avg leverage by asset: {perpsAnalytics ? `${perpsAnalytics.avg_leverage_x.toFixed(2)}x` : "loading"}
              </p>
              <p className="mt-2 text-sm text-muted">24h notional: {perpsAnalytics?.total_notional_24h ?? "loading"}</p>
              <p className="mt-2 text-sm text-muted">
                Aggregated PnL:{" "}
                {perpsAnalytics?.aggregated_pnl.value ??
                  perpsAnalytics?.aggregated_pnl.unavailable_reason ??
                  "loading"}
              </p>
            </Panel>
            <Panel title="Funding Context" subtitle="Per-market aggregate">
              <p className="text-sm text-muted">
                Funding: {perpsAnalytics?.funding_rate_bps_per_hour ?? "-"} bps/hr
              </p>
              <p className="mt-2 text-sm text-muted">
                OI Long/Short: {perpsAnalytics?.long_oi ?? "-"} / {perpsAnalytics?.short_oi ?? "-"}
              </p>
              <p className="mt-2 text-xs text-muted">
                As of: {perpsAnalytics?.as_of ? new Date(perpsAnalytics.as_of * 1000).toLocaleString() : "loading"}
              </p>
            </Panel>
          </section>

          <PerpsIntentPanel />

          <VaultEligibilityPanel />
        </div>
      </div>
    </PageFrame>
  );
}
