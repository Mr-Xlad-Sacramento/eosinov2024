"use client";

import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { standrApi } from "@/lib/api/standr";
import { DEMO_ADDRESS } from "@/lib/constants";

export default function AdminEmergencyPage() {
  const { data: overview } = useQuery({ queryKey: ["admin-emergency"], queryFn: standrApi.getOverview });
  const { data: proposals } = useQuery({
    queryKey: ["admin-emergency-proposals"],
    queryFn: standrApi.getGovernanceProposals,
  });
  const [selectedProposal, setSelectedProposal] = useState("gov-1");
  const [voteResult, setVoteResult] = useState("No emergency vote submitted.");
  const [voteError, setVoteError] = useState<string | null>(null);

  async function onVote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVoteError(null);
    try {
      const receipt = await standrApi.submitVote({
        proposal_id: selectedProposal,
        voter: DEMO_ADDRESS,
        support: true,
        vote_power: "1000",
      });
      setVoteResult(`Submitted vote tx ${receipt.tx_hash}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      setVoteError(message);
      setVoteResult("Emergency vote failed.");
    }
  }

  return (
    <PageFrame
      title="Emergency"
      description="Emergency controls and active governance queue for incident response."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Emergency Checklist" subtitle="Operator runbook excerpt">
          <ul className="space-y-2 text-sm text-muted">
            <li>Pause affected product surfaces.</li>
            <li>Validate oracle integrity and stale feed counts.</li>
            <li>Drain unsafe routes and switch to conservative execution mode.</li>
          </ul>
        </Panel>

        <Panel title="Governance Queue" subtitle="Actions visible to emergency operators">
          <ul className="space-y-2 text-sm text-muted">
            {overview?.governance_actions.map((action) => (
              <li key={action.action_id}>
                {action.action_id}: {action.kind} ({action.status})
              </li>
            ))}
          </ul>
          <form className="mt-3 space-y-2" onSubmit={onVote}>
            <label className="block text-xs text-muted">
              Proposal
              <select
                value={selectedProposal}
                onChange={(event) => setSelectedProposal(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink"
              >
                {(proposals ?? []).map((proposal) => (
                  <option key={proposal.proposal_id} value={proposal.proposal_id}>
                    {proposal.proposal_id}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="rounded-xl border border-accent bg-accent px-3 py-1.5 text-xs font-semibold text-white"
            >
              Submit emergency approval vote
            </button>
          </form>
          <p className="mt-2 text-sm text-muted">{voteResult}</p>
          {voteError ? <p className="text-sm text-danger">{voteError}</p> : null}
        </Panel>
      </section>
    </PageFrame>
  );
}
