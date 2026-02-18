"use client";

import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { standrApi } from "@/lib/api/standr";

export default function PortfolioHistoryPage() {
  const { data: overview } = useQuery({
    queryKey: ["portfolio-history-overview"],
    queryFn: standrApi.getOverview,
  });

  return (
    <PageFrame
      title="History"
      description="Governance and risk timeline events for post-trade analysis."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Governance Actions" subtitle="analytics.overview feed">
          <ul className="space-y-2 text-sm text-muted">
            {overview?.governance_actions.map((action) => (
              <li key={action.action_id}>
                {action.action_id}: {action.kind} ({action.status})
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Risk Alerts" subtitle="Timeline markers">
          <ul className="space-y-2 text-sm text-muted">
            {overview?.risk_alerts.map((alert) => (
              <li key={`${alert.level}-${alert.created_at}`}>
                {alert.created_at}: {alert.level} - {alert.message}
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </PageFrame>
  );
}
