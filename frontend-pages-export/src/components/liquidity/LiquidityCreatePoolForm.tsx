"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { BadgeCheck, Percent, Sparkles } from "lucide-react";

import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export function LiquidityCreatePoolForm() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();

  const [token0Symbol, setToken0Symbol] = useState("WETH");
  const [token0Address, setToken0Address] = useState("0x0000000000000000000000000000000000000004");
  const [token1Symbol, setToken1Symbol] = useState("POL");
  const [token1Address, setToken1Address] = useState("0x0000000000000000000000000000000000000001");
  const [aprBps, setAprBps] = useState("540");

  const idempotencyKey = useMemo(
    () =>
      [
        traderAddress.toLowerCase(),
        token0Symbol.toUpperCase(),
        token1Symbol.toUpperCase(),
        token0Address.toLowerCase(),
        token1Address.toLowerCase(),
        aprBps,
      ].join("|"),
    [aprBps, token0Address, token0Symbol, token1Address, token1Symbol, traderAddress],
  );

  const pairLabel = useMemo(
    () => `${token0Symbol.trim().toUpperCase() || "TOKEN0"}/${token1Symbol.trim().toUpperCase() || "TOKEN1"}`,
    [token0Symbol, token1Symbol],
  );
  const aprPercent = useMemo(() => (Number(aprBps || "0") / 100).toFixed(2), [aprBps]);
  const canSubmit = useMemo(
    () =>
      token0Symbol.trim().length > 0 &&
      token1Symbol.trim().length > 0 &&
      token0Address.trim().length > 0 &&
      token1Address.trim().length > 0 &&
      Number(aprBps) >= 0,
    [aprBps, token0Address, token0Symbol, token1Address, token1Symbol],
  );

  const mutation = useMutation({
    mutationFn: () =>
      standrApi.createLiquidityPool(
        {
          wallet_address: traderAddress,
          token0_symbol: token0Symbol,
          token1_symbol: token1Symbol,
          token0_address: token0Address,
          token1_address: token1Address,
          apr_bps: Number(aprBps),
        },
        idempotencyKey,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["liquidity-pools"] });
      await queryClient.invalidateQueries({ queryKey: ["liquidity-positions", traderAddress] });
    },
  });

  const inputClass =
    "w-full rounded-xl border border-line bg-[#0b101a] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#101522] via-[#10141d] to-[#0c1017] p-5 shadow-[0_20px_45px_rgba(2,6,23,0.38)]">
      <div className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Create Pool</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Pool configuration</h2>
            <p className="mt-1 text-sm text-slate-300">
              Publish a pair with deterministic replay protection and backend-managed routing support.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-[#0b1018]/90 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Preview</p>
            <p className="mt-1 text-lg font-semibold text-cyan-100">{pairLabel}</p>
            <p className="mt-1 text-xs text-slate-300">
              <Percent size={12} className="mr-1 inline-flex" />
              Base APR {aprPercent}%
            </p>
          </div>
        </div>

        <form
          className="mt-5 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <label className="space-y-1 text-sm text-muted">
            Token 0 Symbol
            <input
              value={token0Symbol}
              onChange={(event) => setToken0Symbol(event.target.value.toUpperCase())}
              className={inputClass}
              placeholder="WETH"
            />
          </label>
          <label className="space-y-1 text-sm text-muted">
            Token 1 Symbol
            <input
              value={token1Symbol}
              onChange={(event) => setToken1Symbol(event.target.value.toUpperCase())}
              className={inputClass}
              placeholder="USDC"
            />
          </label>
          <label className="space-y-1 text-sm text-muted">
            Token 0 Address
            <input
              value={token0Address}
              onChange={(event) => setToken0Address(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="space-y-1 text-sm text-muted">
            Token 1 Address
            <input
              value={token1Address}
              onChange={(event) => setToken1Address(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="space-y-1 text-sm text-muted md:col-span-2">
            APR (bps)
            <input
              type="number"
              min={0}
              value={aprBps}
              onChange={(event) => setAprBps(event.target.value)}
              className={inputClass}
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={mutation.isPending || !canSubmit}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Sparkles size={14} />
              {mutation.isPending ? "Creating..." : "Create Pool"}
            </button>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <BadgeCheck size={12} />
              Idempotency-protected submit
            </span>
          </div>
        </form>

        {mutation.isError ? (
          <p className="mt-3 text-sm text-danger">
            {mutation.error instanceof Error ? mutation.error.message : "Pool creation failed"}
          </p>
        ) : null}
        {mutation.data ? (
          <div className="mt-3 rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
            <p>
              {mutation.data.message} ({mutation.data.idempotent ? "idempotent replay" : "new"})
            </p>
            <Link
              href={`/liquidity/pools/${mutation.data.pool.pool_id}`}
              className="inline-flex items-center gap-1 underline underline-offset-2"
            >
              Open pool details
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
