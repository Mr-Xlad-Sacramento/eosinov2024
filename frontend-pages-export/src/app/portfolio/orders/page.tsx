"use client";

import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function PortfolioOrdersPage() {
  const { traderAddress } = useTraderAddress();
  const { data: intents } = useQuery({
    queryKey: ["portfolio-orders", traderAddress],
    queryFn: () => standrApi.getIntents(traderAddress),
  });

  return (
    <PageFrame
      title="Orders"
      description="Intent book view used as order lifecycle source pending dedicated order endpoint exposure."
    >
      <Panel title="Order-like Intents" subtitle="Status mapped from intent engine">
        <ul className="space-y-2">
          {intents?.map((intent) => (
            <li key={intent.intent_id} className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm">
              {intent.intent_id.slice(0, 12)}... | {intent.status}
            </li>
          ))}
        </ul>
      </Panel>
    </PageFrame>
  );
}
