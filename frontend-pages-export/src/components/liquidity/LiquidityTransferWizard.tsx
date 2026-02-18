"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, MoveRight, ShieldCheck, Wallet } from "lucide-react";

import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";
import { cn } from "@/lib/utils";

type TransferStep = 1 | 2 | 3;

const STEP_LABELS: Array<{ step: TransferStep; title: string; subtitle: string }> = [
  { step: 1, title: "Wallet", subtitle: "Confirm sender" },
  { step: 2, title: "Position", subtitle: "Select LP source" },
  { step: 3, title: "Transfer", subtitle: "Execute movement" },
];

export function LiquidityTransferWizard() {
  const { traderAddress, isConnected } = useTraderAddress();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<TransferStep>(1);
  const [selectedPoolId, setSelectedPoolId] = useState("");
  const [toWalletAddress, setToWalletAddress] = useState("0x000000000000000000000000000000000000bEEF");
  const [shares, setShares] = useState("");

  const positionsQuery = useQuery({
    queryKey: ["liquidity-positions", traderAddress],
    queryFn: () => standrApi.getLiquidityPositions(traderAddress),
  });

  const selectedPosition = useMemo(
    () => positionsQuery.data?.find((position) => position.pool_id === selectedPoolId) ?? null,
    [positionsQuery.data, selectedPoolId],
  );

  const requestedShares = Number(shares || "0");
  const exceedsShares = !!selectedPosition && requestedShares > selectedPosition.shares;
  const canTransfer =
    selectedPoolId.length > 0 && toWalletAddress.trim().length > 0 && requestedShares > 0 && !exceedsShares;

  const mutation = useMutation({
    mutationFn: () =>
      standrApi.transferLiquidity({
        from_wallet_address: traderAddress,
        to_wallet_address: toWalletAddress,
        pool_id: selectedPoolId,
        shares: requestedShares,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["liquidity-positions", traderAddress] });
      setShares("");
      setStep(1);
    },
  });

  return (
    <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#101522] via-[#10131b] to-[#0c1017] p-5 shadow-[0_20px_45px_rgba(2,6,23,0.38)]">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative z-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Transfer Flow</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">LP transfer wizard</h2>
        <p className="mt-1 text-sm text-slate-300">
          Move liquidity shares with step-by-step validation to reduce routing and ownership mistakes.
        </p>

        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {STEP_LABELS.map((item) => {
            const active = step === item.step;
            const completed = step > item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  if (item.step === 1 || item.step <= step) {
                    setStep(item.step);
                  }
                }}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-left transition",
                  active
                    ? "border-cyan-400/45 bg-cyan-500/15"
                    : completed
                      ? "border-emerald-400/30 bg-emerald-500/10"
                      : "border-line bg-[#0b1018]/85",
                )}
              >
                <p className="text-xs text-muted">Step {item.step}</p>
                <p className={cn("mt-1 text-sm font-semibold", active ? "text-cyan-100" : "text-ink")}>
                  {item.title}
                </p>
                <p className="text-xs text-muted">{item.subtitle}</p>
              </button>
            );
          })}
        </div>

        {step === 1 ? (
          <div className="mt-4 space-y-3 rounded-2xl border border-line bg-[#0b1018]/85 p-4">
            <div className="inline-flex items-center gap-1 rounded-full border border-line bg-panel/75 px-2 py-1 text-xs text-cyan-100">
              <Wallet size={12} />
              Sender wallet
            </div>
            <p className="font-mono text-xs text-slate-300">{traderAddress}</p>
            <p className="text-sm text-muted">
              {isConnected
                ? "Wallet connected. Continue to select the LP position."
                : "No wallet connected. Demo wallet is active for preview and testing."}
            </p>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              Continue
              <MoveRight size={14} />
            </button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-4 space-y-3 rounded-2xl border border-line bg-[#0b1018]/85 p-4">
            <p className="text-sm text-muted">Select the position whose LP shares you want to transfer.</p>
            {positionsQuery.isLoading ? <p className="text-sm text-muted">Loading positions...</p> : null}
            {!positionsQuery.isLoading && (positionsQuery.data?.length ?? 0) === 0 ? (
              <div className="rounded-xl border border-warning/35 bg-warning/10 px-3 py-2 text-sm text-warning">
                No positions found for this wallet.
                <Link href="/liquidity/pools" className="ml-2 underline underline-offset-2">
                  Add liquidity first
                </Link>
              </div>
            ) : null}
            {(positionsQuery.data ?? []).map((position) => (
              <button
                key={position.position_id}
                type="button"
                onClick={() => setSelectedPoolId(position.pool_id)}
                className={cn(
                  "block w-full rounded-xl border px-3 py-2 text-left transition",
                  selectedPoolId === position.pool_id
                    ? "border-cyan-400/45 bg-cyan-500/15"
                    : "border-line bg-panel/70 hover:border-cyan-300/30",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-ink">{position.pool_id}</p>
                  <span className="text-xs text-cyan-100">{position.shares.toFixed(6)} shares</span>
                </div>
                <p className="mt-1 text-xs text-muted">Current value ${position.current_value_usd.toFixed(2)}</p>
              </button>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-line bg-panel-strong px-4 py-2 text-sm font-semibold text-ink"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!selectedPoolId}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 disabled:opacity-60"
              >
                Continue
                <MoveRight size={14} />
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <form
            className="mt-4 space-y-3 rounded-2xl border border-line bg-[#0b1018]/85 p-4"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
          >
            <label className="space-y-1 text-sm text-muted">
              Destination wallet
              <input
                value={toWalletAddress}
                onChange={(event) => setToWalletAddress(event.target.value)}
                className="w-full rounded-xl border border-line bg-panel-strong px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <label className="space-y-1 text-sm text-muted">
              Shares
              <input
                type="number"
                min={0.000001}
                step={0.000001}
                value={shares}
                onChange={(event) => setShares(event.target.value)}
                className="w-full rounded-xl border border-line bg-panel-strong px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            {selectedPosition ? (
              <p className="text-xs text-muted">
                Available shares on selected pool: {selectedPosition.shares.toFixed(6)}
              </p>
            ) : null}
            {exceedsShares ? (
              <p className="text-xs text-warning">Requested shares exceed available balance.</p>
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-line bg-panel-strong px-4 py-2 text-sm font-semibold text-ink"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || !canTransfer}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={14} />
                {mutation.isPending ? "Transferring..." : "Transfer liquidity"}
              </button>
            </div>
          </form>
        ) : null}

        {mutation.isError ? (
          <p className="mt-3 text-sm text-danger">
            {mutation.error instanceof Error ? mutation.error.message : "Transfer failed"}
          </p>
        ) : null}
        {mutation.data ? (
          <div className="mt-3 rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
            <p>
              {mutation.data.message} ({mutation.data.idempotent ? "idempotent replay" : "executed"})
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs">
              <BadgeCheck size={12} />
              Transfer state committed
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
