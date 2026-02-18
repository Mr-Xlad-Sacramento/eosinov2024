"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { RiskDisclosureModal } from "@/components/analyzer/RiskDisclosureModal";
import { standrApi } from "@/lib/api/standr";
import { DEMO_TOKEN } from "@/lib/constants";
import { useVaultStrategyOptions } from "@/lib/hooks/use-vault-strategy-options";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";
import { useTradingStore } from "@/store/trading";

export function ApproveTradePanel({
  analysisId,
  defaultTradeType,
}: {
  analysisId: string;
  defaultTradeType: "spot" | "perps";
}) {
  const router = useRouter();
  const { traderAddress } = useTraderAddress();

  const collateralSource = useTradingStore((state) => state.collateralSource);
  const selectedVaultStrategy = useTradingStore((state) => state.selectedVaultStrategy);
  const setCollateralSource = useTradingStore((state) => state.setCollateralSource);
  const setSelectedVaultStrategy = useTradingStore((state) => state.setSelectedVaultStrategy);
  const setAnalysisContext = useTradingStore((state) => state.setAnalysisContext);
  const setTradeRequestId = useTradingStore((state) => state.setTradeRequestId);

  const [tradeType, setTradeType] = useState<"spot" | "perps">(defaultTradeType);
  const [spotAmountIn, setSpotAmountIn] = useState("1000000");
  const [spotMinAmountOut, setSpotMinAmountOut] = useState("900000");
  const [perpsCollateralAmount, setPerpsCollateralAmount] = useState("2500000");
  const [perpsPositionSize, setPerpsPositionSize] = useState("7500000");
  const [perpsSide, setPerpsSide] = useState<"LONG" | "SHORT">("LONG");
  const [perpsEntryPrice, setPerpsEntryPrice] = useState("2200");
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const strategyOptions = useVaultStrategyOptions();

  useEffect(() => {
    if (collateralSource !== "vault" || selectedVaultStrategy) {
      return;
    }

    if (strategyOptions.defaultStrategy) {
      setSelectedVaultStrategy(strategyOptions.defaultStrategy);
      return;
    }

    if (strategyOptions.options.length > 0) {
      setSelectedVaultStrategy(strategyOptions.options[0].strategy);
    }
  }, [
    collateralSource,
    selectedVaultStrategy,
    setSelectedVaultStrategy,
    strategyOptions.defaultStrategy,
    strategyOptions.options,
  ]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload =
        tradeType === "spot"
          ? {
              token_in: DEMO_TOKEN,
              token_out: "0x0000000000000000000000000000000000000002",
              amount_in: spotAmountIn,
              min_amount_out: spotMinAmountOut,
            }
          : {
              index_token: DEMO_TOKEN,
              collateral_token: DEMO_TOKEN,
              collateral_amount: perpsCollateralAmount,
              position_size: perpsPositionSize,
              side: perpsSide,
              entry_price: Number(perpsEntryPrice),
            };

      const idempotencyKey = [
        analysisId,
        traderAddress.toLowerCase(),
        tradeType,
        collateralSource,
        selectedVaultStrategy ?? "none",
        JSON.stringify(payload),
      ].join("|");

      return standrApi.createAnalyzerTradeRequest(
        {
          analysis_id: analysisId,
          wallet_address: traderAddress,
          trade_type: tradeType,
          collateral_source: collateralSource,
          selected_vault_strategy: collateralSource === "vault" ? selectedVaultStrategy : null,
          risk_disclaimer_accepted: true,
          execution_payload: payload,
        },
        idempotencyKey,
      );
    },
    onSuccess: (data) => {
      setError(null);
      setAnalysisContext({
        analysisId,
        analysisTradeType: tradeType,
        recommendedVaultStrategy: selectedVaultStrategy,
      });
      setTradeRequestId(data.trade_request_id);
      setShowRiskModal(false);
      router.push(`/analyze/trade-request/${data.trade_request_id}`);
    },
    onError: (requestError) => {
      const message = requestError instanceof Error ? requestError.message : "approval failed";
      setError(message);
      setShowRiskModal(false);
    },
  });

  const canSubmit = useMemo(() => {
    if (tradeType === "spot") {
      return Number(spotAmountIn) > 0 && Number(spotMinAmountOut) > 0;
    }

    if (tradeType === "perps") {
      const perpsReady =
        Number(perpsCollateralAmount) > 0 && Number(perpsPositionSize) > 0 && Number(perpsEntryPrice) > 0;

      if (collateralSource === "vault") {
        return perpsReady && !!selectedVaultStrategy;
      }

      return perpsReady;
    }

    return false;
  }, [
    collateralSource,
    perpsCollateralAmount,
    perpsEntryPrice,
    perpsPositionSize,
    selectedVaultStrategy,
    spotAmountIn,
    spotMinAmountOut,
    tradeType,
  ]);

  function handleApprove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setError("Please complete all required fields before approving execution.");
      return;
    }

    setError(null);
    setShowRiskModal(true);
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45";

  return (
    <section className="space-y-4 rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.34)]">
      <h2 className="text-lg font-semibold">Approve STANDR DEX to Trade</h2>
      <p className="text-sm text-muted">
        Approval creates an idempotent trade request. Repeated retries return the same request
        instead of creating duplicate orders.
      </p>

      <form className="space-y-4" onSubmit={handleApprove}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm text-muted">
            <span>Trade Type</span>
            <select
              value={tradeType}
              onChange={(event) => setTradeType(event.target.value as "spot" | "perps")}
              className={inputClass}
            >
              <option value="spot">Spot</option>
              <option value="perps">Perps</option>
            </select>
          </label>

          <label className="space-y-1 text-sm text-muted">
            <span>Collateral Source</span>
            <select
              value={collateralSource}
              onChange={(event) => setCollateralSource(event.target.value as "wallet" | "vault")}
              className={inputClass}
            >
              <option value="wallet">Wallet</option>
              <option value="vault">Vault</option>
            </select>
          </label>
        </div>

        {collateralSource === "vault" ? (
          <label className="space-y-1 text-sm text-muted">
            <span>Vault Strategy</span>
            <select
              value={selectedVaultStrategy ?? ""}
              onChange={(event) =>
                setSelectedVaultStrategy(event.target.value.length > 0 ? event.target.value : null)
              }
              className={inputClass}
            >
              <option value="">Select vault strategy</option>
              {strategyOptions.options.map((option) => (
                <option key={option.strategy} value={option.strategy}>
                  {option.label}
                </option>
              ))}
            </select>
            {strategyOptions.isLoading ? (
              <span className="text-xs text-muted">Loading vault strategies...</span>
            ) : null}
            {strategyOptions.isError ? (
              <span className="text-xs text-danger">
                {strategyOptions.errorMessage}{" "}
                <button
                  type="button"
                  className="underline underline-offset-2"
                  onClick={() => void strategyOptions.refetch()}
                >
                  Retry
                </button>
              </span>
            ) : null}
          </label>
        ) : null}

        {tradeType === "spot" ? (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm text-muted">
              <span>Amount In</span>
              <input
                value={spotAmountIn}
                onChange={(event) => setSpotAmountIn(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="space-y-1 text-sm text-muted">
              <span>Minimum Amount Out</span>
              <input
                value={spotMinAmountOut}
                onChange={(event) => setSpotMinAmountOut(event.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm text-muted">
              <span>Collateral Amount</span>
              <input
                value={perpsCollateralAmount}
                onChange={(event) => setPerpsCollateralAmount(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="space-y-1 text-sm text-muted">
              <span>Position Size</span>
              <input
                value={perpsPositionSize}
                onChange={(event) => setPerpsPositionSize(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="space-y-1 text-sm text-muted">
              <span>Side</span>
              <select
                value={perpsSide}
                onChange={(event) => setPerpsSide(event.target.value as "LONG" | "SHORT")}
                className={inputClass}
              >
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
            </label>
            <label className="space-y-1 text-sm text-muted">
              <span>Entry Price</span>
              <input
                value={perpsEntryPrice}
                onChange={(event) => setPerpsEntryPrice(event.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        )}

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
        >
          {mutation.isPending ? "Submitting..." : "Approve STANDR DEX to Trade"}
        </button>
      </form>

      <RiskDisclosureModal
        open={showRiskModal}
        loading={mutation.isPending}
        onCancel={() => setShowRiskModal(false)}
        onConfirm={() => mutation.mutate()}
      />
    </section>
  );
}
