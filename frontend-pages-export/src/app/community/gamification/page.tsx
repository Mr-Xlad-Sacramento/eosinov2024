"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function CommunityGamificationPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState("perps_open");
  const [weight, setWeight] = useState("100");
  const [leaderboardLimit, setLeaderboardLimit] = useState("10");

  const profileQuery = useQuery({
    queryKey: ["community-gamification-profile", traderAddress],
    queryFn: () => standrApi.getGamificationProfile(traderAddress),
  });
  const achievementsQuery = useQuery({
    queryKey: ["community-gamification-achievements", traderAddress],
    queryFn: () => standrApi.getAchievements(traderAddress),
  });
  const seasonQuery = useQuery({
    queryKey: ["community-gamification-season"],
    queryFn: standrApi.getCurrentSeason,
  });
  const seasonPointsQuery = useQuery({
    queryKey: ["community-gamification-season-points", traderAddress],
    queryFn: () => standrApi.getSeasonPoints(traderAddress),
  });
  const seasonLeaderboardQuery = useQuery({
    queryKey: ["community-gamification-season-leaderboard", leaderboardLimit],
    queryFn: () => standrApi.getSeasonLeaderboard(Number(leaderboardLimit) || 10),
  });

  const triggerMutation = useMutation({
    mutationFn: () =>
      standrApi.triggerGamificationActivity({
        trader: traderAddress,
        activity,
        weight: Number(weight) || 0,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["community-gamification-profile", traderAddress],
      });
      await queryClient.invalidateQueries({
        queryKey: ["community-gamification-achievements", traderAddress],
      });
      await queryClient.invalidateQueries({
        queryKey: ["community-gamification-season-points", traderAddress],
      });
      await queryClient.invalidateQueries({
        queryKey: ["community-gamification-season-leaderboard", leaderboardLimit],
      });
    },
  });

  return (
    <PageFrame
      title="Gamification"
      description="Track seasonal points, trigger activity rewards, and view leaderboard progression."
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Level</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{profileQuery.data?.level ?? 0}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">XP</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{profileQuery.data?.xp ?? 0}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Streak</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{profileQuery.data?.streak_days ?? 0} days</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Season Points</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{seasonPointsQuery.data?.season_points ?? 0}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Season</h2>
          {seasonQuery.data ? (
            <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-3 text-sm text-muted">
              <p className="font-semibold text-ink">{seasonQuery.data.name}</p>
              <p>ID: {seasonQuery.data.season_id}</p>
              <p>Active: {seasonQuery.data.active ? "Yes" : "No"}</p>
              <p>
                Window: {new Date(seasonQuery.data.start_unix * 1000).toLocaleDateString()} -{" "}
                {new Date(seasonQuery.data.end_unix * 1000).toLocaleDateString()}
              </p>
            </div>
          ) : null}

          <h3 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">Trigger Activity</h3>
          <label className="mt-2 block text-sm text-muted">
            Activity
            <select
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            >
              <option value="perps_open">perps_open</option>
              <option value="perps_close">perps_close</option>
              <option value="cross_chain">cross_chain</option>
              <option value="vault_deposit">vault_deposit</option>
              <option value="referral">referral</option>
              <option value="copy_trade">copy_trade</option>
            </select>
          </label>
          <label className="mt-3 block text-sm text-muted">
            Weight
            <input
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <button
            type="button"
            onClick={() => triggerMutation.mutate()}
            className="mt-3 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100"
          >
            Trigger Points
          </button>
          {triggerMutation.data ? (
            <p className="mt-3 text-sm text-muted">
              Awarded {triggerMutation.data.points_awarded} points. Season total:{" "}
              {triggerMutation.data.season_points}
            </p>
          ) : null}
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Season Leaderboard</h2>
          <label className="mt-3 block text-sm text-muted">
            Limit
            <input
              value={leaderboardLimit}
              onChange={(event) => setLeaderboardLimit(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <ul className="mt-3 space-y-2">
            {(seasonLeaderboardQuery.data ?? []).map((entry) => (
              <li
                key={`${entry.trader}-${entry.rank}`}
                className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-sm text-muted"
              >
                <p className="font-mono text-xs text-ink">#{entry.rank} {entry.trader}</p>
                <p>Points: {entry.points}</p>
                <p>Streak: {entry.streak_days} days</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">Achievements</h3>
          <div className="mt-2 grid gap-2">
            {(achievementsQuery.data ?? []).map((achievement) => (
              <article
                key={achievement.code}
                className={`rounded-xl border px-3 py-2 text-xs ${
                  achievement.unlocked
                    ? "border-success/35 bg-success/10 text-success"
                    : "border-line bg-[#0b1018]/90 text-muted"
                }`}
              >
                <p className="font-semibold">{achievement.title}</p>
                <p className="mt-1 uppercase tracking-[0.1em]">{achievement.code}</p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </PageFrame>
  );
}

