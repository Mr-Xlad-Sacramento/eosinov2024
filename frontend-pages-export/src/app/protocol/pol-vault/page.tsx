"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { protocolApi } from "@/components/protocol/api";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

function unixToDate(unix: number): string {
  if (unix <= 0) {
    return "-";
  }
  return new Date(unix * 1000).toLocaleString();
}

export default function ProtocolPolVaultPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [depositAmount, setDepositAmount] = useState("1000");
  const [withdrawShares, setWithdrawShares] = useState("100");

  const vaultQuery = useQuery({
    queryKey: ["protocol-pol-vault", traderAddress],
    queryFn: () => protocolApi.getPolVault(traderAddress),
  });

  const depositMutation = useMutation({
    mutationFn: () =>
      protocolApi.depositPolVault({
        wallet_address: traderAddress,
        amount_pol: Number(depositAmount),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-pol-vault", traderAddress] });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: () =>
      protocolApi.withdrawPolVault({
        wallet_address: traderAddress,
        shares: Number(withdrawShares),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-pol-vault", traderAddress] });
    },
  });

  return (
    <PageFrame
      title="POL Vault"
      description="Manage POL vault deposits, shares, and pending rewards."
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Deposited POL</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{vaultQuery.data?.deposited_pol.toFixed(2) ?? "0.00"}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Shares</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{vaultQuery.data?.shares.toFixed(2) ?? "0.00"}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Pending Rewards</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {vaultQuery.data?.pending_rewards_pol.toFixed(4) ?? "0.0000"}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Lock End</p>
          <p className="mt-2 text-sm font-semibold text-ink">{unixToDate(vaultQuery.data?.lock_end_unix ?? 0)}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Deposit POL</h2>
          <input
            type="number"
            min={1}
            value={depositAmount}
            onChange={(event) => setDepositAmount(event.target.value)}
            className="mt-3 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
          />
          <button
            type="button"
            onClick={() => depositMutation.mutate()}
            disabled={depositMutation.isPending}
            className="mt-3 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
          >
            {depositMutation.isPending ? "Depositing..." : "Deposit"}
          </button>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Withdraw Shares</h2>
          <input
            type="number"
            min={1}
            value={withdrawShares}
            onChange={(event) => setWithdrawShares(event.target.value)}
            className="mt-3 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
          />
          <button
            type="button"
            onClick={() => withdrawMutation.mutate()}
            disabled={withdrawMutation.isPending}
            className="mt-3 rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60"
          >
            {withdrawMutation.isPending ? "Withdrawing..." : "Withdraw"}
          </button>
        </article>
      </section>
    </PageFrame>
  );
}
