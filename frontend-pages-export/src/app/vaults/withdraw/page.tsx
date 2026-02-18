"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function VaultWithdrawPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [shares, setShares] = useState(100);

  const { data: balance } = useQuery({
    queryKey: ["vault-balance", traderAddress],
    queryFn: () => standrApi.getYieldBalance(traderAddress),
  });

  const previewQuery = useQuery({
    queryKey: ["withdraw-preview", shares],
    queryFn: () => standrApi.erc4626PreviewWithdraw({ assets: shares }),
    enabled: shares > 0,
  });

  const convertSharesQuery = useQuery({
    queryKey: ["convert-shares", shares],
    queryFn: () => standrApi.convertShares(shares),
    enabled: shares > 0,
  });

  const withdrawMutation = useMutation({
    mutationFn: () =>
      standrApi.withdrawFromYield({
        address: traderAddress,
        shares,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vault-balance", traderAddress] });
    },
  });

  return (
    <PageFrame
      title="Withdraw from Vault"
      description="Estimate redemption value, then execute share withdrawal."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Current Balance" subtitle={`Trader ${traderAddress}`}>
          <div className="rounded-xl border border-line bg-canvas p-3">
            <p className="text-sm text-muted">Vault balance</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{balance?.balance ?? "loading"}</p>
          </div>

          {balance?.rewards && balance.rewards.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Pending Rewards</p>
              <ul className="mt-2 space-y-1">
                {balance.rewards.map((reward) => (
                  <li
                    key={reward.reward_token}
                    className="flex justify-between rounded-lg border border-line bg-canvas px-3 py-2 text-sm"
                  >
                    <span className="text-muted">{reward.reward_token}</span>
                    <span className="font-semibold text-ink">{reward.pending_amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Panel>

        <Panel title="Withdraw Flow" subtitle="/api/v1/yield/convert-shares + /withdraw">
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              withdrawMutation.mutate();
            }}
          >
            <label className="block text-sm text-muted">
              Shares to Withdraw
              <input
                type="number"
                value={shares}
                min={0.0001}
                onChange={(event) => setShares(Number(event.target.value))}
                className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
              />
            </label>

            {(previewQuery.data || convertSharesQuery.data) && shares > 0 ? (
              <div className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">Withdraw Preview</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">You redeem</span>
                    <span className="font-semibold text-ink">{shares.toLocaleString()} shares</span>
                  </div>
                  {convertSharesQuery.data && (
                    <div className="flex justify-between">
                      <span className="text-muted">Estimated value</span>
                      <span className="font-semibold text-cyan-100">
                        {convertSharesQuery.data.value.toFixed(6)} assets
                      </span>
                    </div>
                  )}
                  {previewQuery.data && (
                    <div className="flex justify-between">
                      <span className="text-muted">Shares needed</span>
                      <span className="font-semibold text-ink">
                        {previewQuery.data.shares.toFixed(6)}
                      </span>
                    </div>
                  )}
                  {balance && (
                    <div className="flex justify-between">
                      <span className="text-muted">Remaining balance</span>
                      <span className="font-semibold text-ink">
                        {(Number(balance.balance) - shares).toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={withdrawMutation.isPending || shares <= 0}
              className="w-full rounded-xl border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:opacity-60"
            >
              {withdrawMutation.isPending ? "Withdrawing..." : "Withdraw"}
            </button>
          </form>

          {withdrawMutation.isError ? (
            <p className="mt-2 text-sm text-danger">
              {withdrawMutation.error instanceof Error
                ? withdrawMutation.error.message
                : "withdraw failed"}
            </p>
          ) : null}
          {withdrawMutation.data ? (
            <div className="mt-2 rounded-xl border border-line bg-canvas p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Withdrawal Successful</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Remaining shares</span>
                  <span className="font-semibold text-accent">{withdrawMutation.data.shares.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Value withdrawn</span>
                  <span className="font-semibold text-ink">{withdrawMutation.data.value.toFixed(4)}</span>
                </div>
              </div>
            </div>
          ) : null}
        </Panel>
      </section>
    </PageFrame>
  );
}
