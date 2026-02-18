"use client";

import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { standrApi } from "@/lib/api/standr";

export default function AdminParamsPage() {
  const { data: eligibility } = useQuery({
    queryKey: ["admin-eligibility"],
    queryFn: standrApi.getVaultEligibility,
  });
  const { data: proposals } = useQuery({
    queryKey: ["admin-governance-proposals"],
    queryFn: standrApi.getGovernanceProposals,
  });
  const { data: transfers } = useQuery({
    queryKey: ["admin-treasury-transfers"],
    queryFn: standrApi.getTreasuryTransfers,
  });

  return (
    <PageFrame
      title="Protocol Params"
      description="Policy-oriented parameters from risk service and governance action queue."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Vault Eligibility Matrix" subtitle="Backend-enforced policy">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="px-2 py-2">Strategy</th>
                <th className="px-2 py-2">Tier</th>
                <th className="px-2 py-2">Perps Margin</th>
                <th className="px-2 py-2">Cap</th>
              </tr>
            </thead>
            <tbody>
              {eligibility?.policies.map((policy) => (
                <tr key={policy.strategy} className="border-b border-line/60">
                  <td className="px-2 py-2">{policy.strategy}</td>
                  <td className="px-2 py-2">{policy.tier}</td>
                  <td className="px-2 py-2">{policy.perps_margin_allowed ? "Allowed" : "Not allowed"}</td>
                  <td className="px-2 py-2">{(policy.capped_margin_bps / 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Governance Parameter Queue" subtitle="/api/v1/governance">
          <ul className="space-y-2 text-sm text-muted">
            {(proposals ?? []).map((proposal) => (
              <li key={proposal.proposal_id} className="rounded-xl border border-line bg-canvas px-3 py-2">
                {proposal.proposal_id} {proposal.title} ({proposal.state}) votes {proposal.for_votes}/
                {proposal.against_votes}
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      <Panel title="Treasury Transfer Queue" subtitle="Timelocked transfers">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="px-2 py-2">Transfer</th>
              <th className="px-2 py-2">Token</th>
              <th className="px-2 py-2">Amount</th>
              <th className="px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {(transfers ?? []).map((transfer) => (
              <tr key={transfer.transfer_id} className="border-b border-line/60">
                <td className="px-2 py-2">{transfer.transfer_id}</td>
                <td className="px-2 py-2">{transfer.token}</td>
                <td className="px-2 py-2">{transfer.amount}</td>
                <td className="px-2 py-2">{transfer.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </PageFrame>
  );
}
