"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { standrApi } from "@/lib/api/standr";
import { useVaultStrategyOptions } from "@/lib/hooks/use-vault-strategy-options";
import { useTradingStore } from "@/store/trading";

function tierLabel(tier: number): string {
  if (tier === 1) {
    return "Tier 1";
  }
  if (tier === 2) {
    return "Tier 2";
  }
  return "Tier 3";
}

function tierStyle(tier: number): string {
  if (tier === 1) {
    return "border-success/35 bg-success/10 text-success";
  }
  if (tier === 2) {
    return "border-warning/35 bg-warning/10 text-warning";
  }
  return "border-danger/35 bg-danger/10 text-danger";
}

export function VaultEligibilityPanel({ compact = false }: { compact?: boolean }) {
  const { data: eligibility } = useQuery({
    queryKey: ["vault-eligibility"],
    queryFn: standrApi.getVaultEligibility,
  });
  const strategyOptions = useVaultStrategyOptions();

  const collateralSource = useTradingStore((state) => state.collateralSource);
  const selectedVaultStrategy = useTradingStore((state) => state.selectedVaultStrategy);
  const setCollateralSource = useTradingStore((state) => state.setCollateralSource);
  const setSelectedVaultStrategy = useTradingStore((state) => state.setSelectedVaultStrategy);

  const selectedPolicy = useMemo(
    () =>
      eligibility?.policies.find((policy) => policy.strategy === selectedVaultStrategy) ?? null,
    [eligibility?.policies, selectedVaultStrategy],
  );

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

  return (
    <article className="space-y-4 rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.34)]">
      <header>
        <h2 className="text-lg font-semibold">Earn While Trading</h2>
        <p className="mt-1 text-sm text-muted">
          Select collateral source and enforce tier policy before perps execution.
        </p>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setCollateralSource("wallet")}
          className={`rounded-xl border px-3 py-2 text-sm ${
            collateralSource === "wallet"
              ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-100"
              : "border-line bg-panel-strong text-muted"
          }`}
        >
          Wallet collateral
        </button>
        <button
          type="button"
          onClick={() => setCollateralSource("vault")}
          className={`rounded-xl border px-3 py-2 text-sm ${
            collateralSource === "vault"
              ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-100"
              : "border-line bg-panel-strong text-muted"
          }`}
        >
          Vault-backed collateral
        </button>
      </div>

      <label className="block space-y-1 text-sm text-muted" htmlFor="vault-strategy">
        <span>Collateral vault strategy</span>
        <select
          id="vault-strategy"
          className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
          value={selectedVaultStrategy ?? ""}
          onChange={(event) =>
            setSelectedVaultStrategy(event.target.value.length > 0 ? event.target.value : null)
          }
        >
          <option value="">Select a vault</option>
          {strategyOptions.options.map((option) => (
            <option key={option.strategy} value={option.strategy}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {strategyOptions.isLoading ? (
        <p className="text-xs text-muted">Loading vault strategies...</p>
      ) : null}

      {!strategyOptions.isLoading && !strategyOptions.hasAnyData ? (
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
          Vault strategies are unavailable at the moment.
          <button
            type="button"
            onClick={() => void strategyOptions.refetch()}
            className="ml-2 underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      ) : null}

      {strategyOptions.isError ? (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
          {strategyOptions.errorMessage}
          <button
            type="button"
            onClick={() => void strategyOptions.refetch()}
            className="ml-2 underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      ) : null}

      <ul className="space-y-2">
        {eligibility?.policies.map((policy) => (
          <li
            key={policy.strategy}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-ink">{policy.strategy}</p>
              <p className="text-xs text-muted">{policy.notes}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.1em] ${tierStyle(policy.tier)}`}
              >
                {tierLabel(policy.tier)}
              </span>
              <span className="rounded-full border border-line bg-panel-strong px-2 py-1 text-[11px] uppercase tracking-[0.1em] text-muted">
                Cap {(policy.capped_margin_bps / 100).toFixed(2)}%
              </span>
            </div>
          </li>
        ))}
      </ul>

      {collateralSource === "vault" && selectedPolicy && !selectedPolicy.perps_margin_allowed ? (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          Selected vault is blocked for perps margin. Fallback to wallet collateral or tier-1 strategy.
        </div>
      ) : null}

      <p className="rounded-xl border border-line bg-panel-strong/70 px-3 py-2 text-xs text-muted">
        Margin disclosure: Tier-1 vaults are allowed for perps margin. Tier-2 vaults are capped-margin only.
        Tier-3 vaults are spot-only and cannot be used as margin.
      </p>

      {!compact ? (
        <p className="text-xs text-muted">
          Risk checks are enforced in backend `risk_service` and mirrored in frontend policy controls.
        </p>
      ) : null}
    </article>
  );
}
