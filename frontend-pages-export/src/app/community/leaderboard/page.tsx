"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { WiringBadges } from "@/components/wiring-badges";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function CommunityLeaderboardPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [profileAddress, setProfileAddress] = useState<string>(traderAddress);
  const [strategyName, setStrategyName] = useState("Momentum");
  const [allocationBps, setAllocationBps] = useState("2500");
  const [maxAllocation, setMaxAllocation] = useState("1000000");
  const [copyTradeId, setCopyTradeId] = useState("trade_001");
  const [batchFollowers, setBatchFollowers] = useState(
    "0x0000000000000000000000000000000000001010;0x0000000000000000000000000000000000002020",
  );

  const leaderboardQuery = useQuery({
    queryKey: ["community-leaderboard"],
    queryFn: standrApi.getSocialLeaderboard,
  });
  const profileQuery = useQuery({
    queryKey: ["community-profile", profileAddress],
    queryFn: () => standrApi.getTraderProfile(profileAddress),
    enabled: profileAddress.length > 0,
  });
  const strategiesQuery = useQuery({
    queryKey: ["community-strategies", profileAddress],
    queryFn: () => standrApi.listStrategies(profileAddress),
    enabled: profileAddress.length > 0,
  });
  const followingQuery = useQuery({
    queryKey: ["community-following", traderAddress],
    queryFn: () => standrApi.listFollowing(traderAddress),
  });
  const wiringQuery = useQuery({
    queryKey: ["wiring-report"],
    queryFn: standrApi.getWiringReport,
  });

  const registerMutation = useMutation({
    mutationFn: () => standrApi.registerTrader({ trader: traderAddress, is_public: true }),
  });
  const createStrategyMutation = useMutation({
    mutationFn: () =>
      standrApi.createStrategy({
        trader: traderAddress,
        name: strategyName,
        description: "Community-published strategy",
        strategy_type: "copy",
        strategy_data: "{\"engine\":\"momentum\"}",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["community-strategies", traderAddress] });
      setProfileAddress(traderAddress);
    },
  });
  const followMutation = useMutation({
    mutationFn: () =>
      standrApi.followTrader({
        follower: traderAddress,
        trader: profileAddress,
        allocation_bps: Number(allocationBps) || 0,
        max_allocation: maxAllocation,
        auto_execute: true,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["community-following", traderAddress] });
    },
  });
  const unfollowMutation = useMutation({
    mutationFn: () => standrApi.unfollowTrader({ follower: traderAddress, trader: profileAddress }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["community-following", traderAddress] });
    },
  });
  const copyMutation = useMutation({
    mutationFn: () =>
      standrApi.copyTrade({
        original_trade_id: copyTradeId,
        trader: profileAddress,
        follower: traderAddress,
      }),
  });
  const batchCopyMutation = useMutation({
    mutationFn: () =>
      standrApi.batchCopyTrade({
        original_trade_id: copyTradeId,
        trader: profileAddress,
        followers: batchFollowers
          .split(";")
          .map((value) => value.trim())
          .filter(Boolean),
      }),
  });

  const wiringMode = wiringQuery.data?.execution_mode ?? "simulation";
  const batchCopyWiring =
    wiringQuery.data?.bindings.find((binding) => binding.feature_key === "social.batchCopyTrade") ?? null;

  return (
    <PageFrame
      title="Community Leaderboard"
      description="Track trader rankings, publish strategies, and configure copy-trading relations."
    >
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Leaderboard</h2>
          {leaderboardQuery.isLoading ? (
            <p className="mt-3 text-sm text-muted">Loading leaderboard...</p>
          ) : leaderboardQuery.isError ? (
            <p className="mt-3 text-sm text-danger">
              {leaderboardQuery.error instanceof Error ? leaderboardQuery.error.message : "Failed to load leaderboard"}
            </p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-[#0b1018]/90 p-1">
              <table className="min-w-full text-sm">
                <thead className="border-b border-line text-left text-xs uppercase tracking-[0.12em] text-muted">
                  <tr>
                    <th className="px-2 py-2">Trader</th>
                    <th className="px-2 py-2">PnL 30d</th>
                    <th className="px-2 py-2">Win Rate</th>
                    <th className="px-2 py-2">Volume 30d</th>
                  </tr>
                </thead>
                <tbody>
                  {(leaderboardQuery.data ?? []).map((trader) => (
                    <tr key={trader.trader} className="border-b border-line/60 last:border-b-0">
                      <td className="px-2 py-2 font-mono text-xs">{trader.trader}</td>
                      <td className="px-2 py-2">{trader.pnl_30d}</td>
                      <td className="px-2 py-2">{(trader.win_rate_bps / 100).toFixed(2)}%</td>
                      <td className="px-2 py-2">{trader.volume_30d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="space-y-4">
          <div className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
            <h2 className="text-lg font-semibold">Trader Profile</h2>
            <label className="mt-3 block space-y-1 text-sm text-muted">
              Wallet Address
              <input
                value={profileAddress}
                onChange={(event) => setProfileAddress(event.target.value)}
                className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            {profileQuery.data ? (
              <ul className="mt-3 space-y-1 text-sm text-muted">
                <li>Trader: <span className="font-mono text-xs">{profileQuery.data.trader}</span></li>
                <li>PnL 30d: {profileQuery.data.pnl_30d}</li>
                <li>Win rate: {(profileQuery.data.win_rate_bps / 100).toFixed(2)}%</li>
                <li>Volume 30d: {profileQuery.data.volume_30d}</li>
              </ul>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => followMutation.mutate()}
                className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100"
              >
                Follow Trader
              </button>
              <button
                type="button"
                onClick={() => unfollowMutation.mutate()}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
              >
                Unfollow
              </button>
            </div>
            <label className="mt-3 block text-sm text-muted">
              Allocation bps
              <input
                value={allocationBps}
                onChange={(event) => setAllocationBps(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <label className="mt-3 block text-sm text-muted">
              Max allocation
              <input
                value={maxAllocation}
                onChange={(event) => setMaxAllocation(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <label className="mt-3 block text-sm text-muted">
              Original trade ID
              <input
                value={copyTradeId}
                onChange={(event) => setCopyTradeId(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <button
              type="button"
              onClick={() => copyMutation.mutate()}
              className="mt-3 rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-xs font-semibold text-ink"
            >
              Copy Trade
            </button>
            <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/80 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">Batch Copy Trade</p>
              <WiringBadges binding={batchCopyWiring} executionMode={wiringMode} />
              <textarea
                value={batchFollowers}
                onChange={(event) => setBatchFollowers(event.target.value)}
                className="mt-2 h-16 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
                placeholder="followers separated by ;"
              />
              <button
                type="button"
                onClick={() => batchCopyMutation.mutate()}
                className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
              >
                Execute Batch Copy
              </button>
              {batchCopyMutation.data ? (
                <p className="mt-2 text-xs text-muted">
                  Created copied trades: {batchCopyMutation.data.length}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
            <h2 className="text-lg font-semibold">Strategy Publisher</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => registerMutation.mutate()}
                className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100"
              >
                Register As Trader
              </button>
            </div>
            <label className="mt-3 block text-sm text-muted">
              Strategy Name
              <input
                value={strategyName}
                onChange={(event) => setStrategyName(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <button
              type="button"
              onClick={() => createStrategyMutation.mutate()}
              className="mt-3 rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-xs font-semibold text-ink"
            >
              Create Strategy
            </button>
            <ul className="mt-3 space-y-2">
              {(strategiesQuery.data ?? []).map((strategy) => (
                <li key={strategy.strategy_id} className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-xs text-muted">
                  <p className="font-semibold text-ink">{strategy.name}</p>
                  <p>{strategy.strategy_type}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              Active follows: {(followingQuery.data ?? []).filter((item) => item.is_active).length}
            </p>
          </div>
        </article>
      </section>
    </PageFrame>
  );
}
