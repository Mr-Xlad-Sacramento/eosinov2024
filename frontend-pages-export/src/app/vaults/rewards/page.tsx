"use client";

import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function VaultRewardsPage() {
  const { traderAddress } = useTraderAddress();
  const { data: balance } = useQuery({
    queryKey: ["vault-rewards", traderAddress],
    queryFn: () => standrApi.getYieldBalance(traderAddress),
  });

  return (
    <PageFrame
      title="Vault Rewards"
      description="Track pending reward balances and payout assets."
    >
      <Panel title="Pending Rewards" subtitle={`Account ${traderAddress}`}>
        <ul className="space-y-2">
          {balance?.rewards.map((reward) => (
            <li key={reward.reward_token} className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm">
              {reward.reward_token}: {reward.pending_amount}
            </li>
          ))}
        </ul>
      </Panel>
    </PageFrame>
  );
}
