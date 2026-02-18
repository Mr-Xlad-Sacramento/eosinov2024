"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { protocolApi } from "@/components/protocol/api";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function ProtocolLpProfilesPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [pairsInput, setPairsInput] = useState("WETH/POL,USDT/USDC");
  const [rebateBps, setRebateBps] = useState("100");

  const profileQuery = useQuery({
    queryKey: ["protocol-lp-profile", traderAddress],
    queryFn: () => protocolApi.getLpProfile(traderAddress),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      protocolApi.updateLpProfile({
        wallet_address: traderAddress,
        preferred_pairs: pairsInput
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
        fee_rebate_bps: Number(rebateBps),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-lp-profile", traderAddress] });
    },
  });

  return (
    <PageFrame
      title="Liquidity Provider Profiles"
      description="Inspect and update LP profile preferences and rebate settings."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Reputation</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {profileQuery.data?.reputation_score ?? 0}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">TVL</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            ${profileQuery.data?.total_value_locked_usd.toFixed(2) ?? "0.00"}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Fee Rebate</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {((profileQuery.data?.fee_rebate_bps ?? 0) / 100).toFixed(2)}%
          </p>
        </article>
      </section>

      <section className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
        <h2 className="text-lg font-semibold">Update Profile</h2>
        <div className="mt-3 space-y-3">
          <label className="block space-y-1 text-sm text-muted">
            Preferred Pairs (comma-separated)
            <input
              value={pairsInput}
              onChange={(event) => setPairsInput(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <label className="block space-y-1 text-sm text-muted">
            Fee Rebate (bps)
            <input
              type="number"
              min={0}
              value={rebateBps}
              onChange={(event) => setRebateBps(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <button
            type="button"
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
          >
            {updateMutation.isPending ? "Updating..." : "Update profile"}
          </button>
        </div>
      </section>
    </PageFrame>
  );
}
