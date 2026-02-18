"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { VaultEligibilityPanel } from "@/components/vault-eligibility-panel";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";
import { formatPercentFromBps } from "@/lib/utils";

export default function VaultDepositPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();

  const { data: vaults } = useQuery({
    queryKey: ["vaults-deposit"],
    queryFn: standrApi.getVaults,
  });
  const { data: balance } = useQuery({
    queryKey: ["vault-balance", traderAddress],
    queryFn: () => standrApi.getYieldBalance(traderAddress),
  });

  const [selectedVault, setSelectedVault] = useState("");
  const [amount, setAmount] = useState(1000);

  const previewQuery = useQuery({
    queryKey: ["deposit-preview", amount],
    queryFn: () => standrApi.erc4626PreviewDeposit({ assets: amount }),
    enabled: amount > 0,
  });

  const shareValueQuery = useQuery({
    queryKey: ["share-value-preview", selectedVault || vaults?.[0]?.vault_address, previewQuery.data?.shares],
    queryFn: () =>
      standrApi.getYieldShareValue({
        base_token: selectedVault || vaults?.[0]?.vault_address || "",
        shares: previewQuery.data?.shares ?? 0,
      }),
    enabled: !!previewQuery.data?.shares && previewQuery.data.shares > 0,
  });

  const depositMutation = useMutation({
    mutationFn: () =>
      standrApi.depositToYield({
        address: traderAddress,
        vault_address: selectedVault || vaults?.[0]?.vault_address || "",
        amount,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vault-balance", traderAddress] });
      void queryClient.invalidateQueries({ queryKey: ["vaults-deposit"] });
    },
  });

  const selectedVaultData = vaults?.find((v) => v.vault_address === selectedVault) ?? vaults?.[0];

  return (
    <PageFrame
      title="Deposit to Vault"
      description="Choose a vault, submit deposit, and observe in-memory share updates."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Available Vaults" subtitle="Yield adapter surface">
          <ul className="space-y-2">
            {vaults?.map((vault) => (
              <li key={vault.vault_address} className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm">
                <p className="font-medium text-ink">{vault.name}</p>
                <p className="text-muted">
                  {vault.strategy} | APY {formatPercentFromBps(vault.apy_bps)} | Tier {vault.risk_tier}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Current balance: {balance?.balance ?? "loading"}</p>
        </Panel>

        <Panel title="Deposit Action" subtitle="POST /api/v1/yield/deposit">
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              depositMutation.mutate();
            }}
          >
            <label className="block text-sm text-muted">
              Vault
              <select
                value={selectedVault || vaults?.[0]?.vault_address || ""}
                onChange={(event) => setSelectedVault(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
              >
                {(vaults ?? []).map((vault) => (
                  <option key={vault.vault_address} value={vault.vault_address}>
                    {vault.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-muted">
              Amount
              <input
                type="number"
                min={0.0001}
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
              />
            </label>

            {previewQuery.data && amount > 0 ? (
              <div className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">Deposit Preview</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">You deposit</span>
                    <span className="font-semibold text-ink">{amount.toLocaleString()} assets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">You receive</span>
                    <span className="font-semibold text-cyan-100">
                      {previewQuery.data.shares.toFixed(6)} shares
                    </span>
                  </div>
                  {shareValueQuery.data && (
                    <div className="flex justify-between">
                      <span className="text-muted">Share value</span>
                      <span className="font-semibold text-ink">{shareValueQuery.data.value.toFixed(6)}</span>
                    </div>
                  )}
                  {selectedVaultData && (
                    <div className="flex justify-between">
                      <span className="text-muted">Est. APY</span>
                      <span className="font-semibold text-cyan-100">
                        {formatPercentFromBps(selectedVaultData.apy_bps)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={depositMutation.isPending}
              className="w-full rounded-xl border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:opacity-60"
            >
              {depositMutation.isPending ? "Depositing..." : "Deposit"}
            </button>
          </form>
          {depositMutation.isError ? (
            <p className="mt-2 text-sm text-danger">
              {depositMutation.error instanceof Error
                ? depositMutation.error.message
                : "deposit failed"}
            </p>
          ) : null}
          {depositMutation.data ? (
            <div className="mt-2 rounded-xl border border-line bg-canvas p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Deposit Successful</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Shares received</span>
                  <span className="font-semibold text-accent">{depositMutation.data.shares.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Value</span>
                  <span className="font-semibold text-ink">{depositMutation.data.value.toFixed(4)}</span>
                </div>
              </div>
            </div>
          ) : null}
        </Panel>
      </section>
      <VaultEligibilityPanel />
    </PageFrame>
  );
}
