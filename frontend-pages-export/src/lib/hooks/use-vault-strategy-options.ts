"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { standrApi } from "@/lib/api/standr";
import { formatPercentFromBps } from "@/lib/utils";

export type VaultStrategyOption = {
  strategy: string;
  label: string;
};

export function useVaultStrategyOptions() {
  const vaultsQuery = useQuery({
    queryKey: ["vault-strategy-options", "vaults"],
    queryFn: standrApi.getVaults,
  });
  const eligibilityQuery = useQuery({
    queryKey: ["vault-strategy-options", "eligibility"],
    queryFn: standrApi.getVaultEligibility,
  });

  const options = useMemo(() => {
    const byStrategy = new Map<string, VaultStrategyOption>();

    for (const vault of vaultsQuery.data ?? []) {
      byStrategy.set(vault.strategy, {
        strategy: vault.strategy,
        label: `${vault.name} | ${formatPercentFromBps(vault.apy_bps)} APY | Tier ${vault.risk_tier}`,
      });
    }

    for (const policy of eligibilityQuery.data?.policies ?? []) {
      if (!byStrategy.has(policy.strategy)) {
        byStrategy.set(policy.strategy, {
          strategy: policy.strategy,
          label: `${policy.strategy} | ${policy.notes}`,
        });
      }
    }

    return Array.from(byStrategy.values()).sort((a, b) => a.strategy.localeCompare(b.strategy));
  }, [eligibilityQuery.data?.policies, vaultsQuery.data]);

  const errorMessage = useMemo(() => {
    const candidates = [vaultsQuery.error, eligibilityQuery.error];
    for (const candidate of candidates) {
      if (candidate instanceof Error) {
        return candidate.message;
      }
    }
    return "Unable to load vault strategies right now.";
  }, [eligibilityQuery.error, vaultsQuery.error]);

  return {
    options,
    defaultStrategy: eligibilityQuery.data?.default_margin_vault?.strategy ?? null,
    isLoading: vaultsQuery.isLoading || eligibilityQuery.isLoading,
    hasAnyData:
      (vaultsQuery.data?.length ?? 0) > 0 || (eligibilityQuery.data?.policies.length ?? 0) > 0,
    isError: vaultsQuery.isError && eligibilityQuery.isError,
    errorMessage,
    refetch: async () => {
      await Promise.all([vaultsQuery.refetch(), eligibilityQuery.refetch()]);
    },
  };
}

