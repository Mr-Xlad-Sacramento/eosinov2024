"use client";

import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { standrApi } from "@/lib/api/standr";

export default function VaultStrategyPage() {
  const { data: vaults } = useQuery({ queryKey: ["vault-strategy"], queryFn: standrApi.getVaults });

  return (
    <PageFrame
      title="Vault Strategy"
      description="Compare strategy types and risk tiers before assigning collateral source."
    >
      <Panel title="Strategy Matrix" subtitle="Tier-aware policy mirror">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="px-2 py-2">Vault</th>
              <th className="px-2 py-2">Strategy</th>
              <th className="px-2 py-2">Tier</th>
              <th className="px-2 py-2">Perps Margin</th>
            </tr>
          </thead>
          <tbody>
            {vaults?.map((vault) => (
              <tr key={vault.vault_address} className="border-b border-line/60">
                <td className="px-2 py-2">{vault.name}</td>
                <td className="px-2 py-2">{vault.strategy}</td>
                <td className="px-2 py-2">{vault.risk_tier}</td>
                <td className="px-2 py-2">{vault.risk_tier === 1 ? "Allowed" : vault.risk_tier === 2 ? "Capped" : "Blocked"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </PageFrame>
  );
}
