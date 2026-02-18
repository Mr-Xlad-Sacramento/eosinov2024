"use client";

import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { VaultEligibilityPanel } from "@/components/vault-eligibility-panel";
import { standrApi } from "@/lib/api/standr";

export default function PortfolioRiskPage() {
  const { data: tier } = useQuery({
    queryKey: ["portfolio-risk-tier"],
    queryFn: () => standrApi.getRiskTier("BTC_ETH"),
  });

  return (
    <PageFrame
      title="Risk"
      description="Perps tier constraints and vault-collateral guardrails enforced before execution."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Current Tier" subtitle="Perps risk profile">
          <p className="text-sm text-muted">Tier: {tier?.tier ?? "loading"}</p>
          <p className="text-sm text-muted">Max leverage: {tier?.max_leverage ?? "-"}x</p>
          <p className="text-sm text-muted">
            Maintenance margin: {tier ? tier.maintenance_margin_bps / 100 : 0}%
          </p>
        </Panel>
        <VaultEligibilityPanel />
      </section>
    </PageFrame>
  );
}
