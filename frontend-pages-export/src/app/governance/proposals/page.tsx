"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

function unixToDate(unix: number): string {
  return new Date(unix * 1000).toLocaleString();
}

export default function GovernanceProposalsPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("STANDR DEX parameter update");
  const [deadlineSecs, setDeadlineSecs] = useState("86400");
  const [selectedProposalId, setSelectedProposalId] = useState("");
  const [support, setSupport] = useState(true);
  const [votePower, setVotePower] = useState("1000");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const proposalsQuery = useQuery({
    queryKey: ["governance-proposals-page"],
    queryFn: standrApi.getGovernanceProposals,
  });

  const createProposalMutation = useMutation({
    mutationFn: () =>
      standrApi.createGovernanceProposal({
        title,
        proposer: traderAddress,
        deadline_secs: Number(deadlineSecs),
      }),
    onSuccess: async (proposal) => {
      setError(null);
      setFeedback(`Created proposal ${proposal.proposal_id}`);
      setSelectedProposalId(proposal.proposal_id);
      await queryClient.invalidateQueries({ queryKey: ["governance-proposals-page"] });
    },
    onError: (requestError) => {
      setFeedback(null);
      setError(
        requestError instanceof Error ? requestError.message : "Failed to create proposal",
      );
    },
  });

  const voteMutation = useMutation({
    mutationFn: () =>
      standrApi.submitVote({
        proposal_id: selectedProposalId,
        voter: traderAddress,
        support,
        vote_power: votePower,
      }),
    onSuccess: (receipt) => {
      setError(null);
      setFeedback(`Vote submitted in tx ${receipt.tx_hash}`);
    },
    onError: (requestError) => {
      setFeedback(null);
      setError(requestError instanceof Error ? requestError.message : "Vote failed");
    },
  });

  const voteDisabled = useMemo(
    () => selectedProposalId.length === 0 || Number(votePower) <= 0,
    [selectedProposalId, votePower],
  );

  function handleCreateProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setError(null);
    createProposalMutation.mutate();
  }

  function handleVote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setError(null);
    if (voteDisabled) {
      setError("Select a proposal and provide positive vote power.");
      return;
    }
    voteMutation.mutate();
  }

  return (
    <PageFrame
      title="Governance Proposals"
      description="Create proposals and submit votes through backend governance routes."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Create Proposal</h2>
          <form className="mt-3 space-y-3" onSubmit={handleCreateProposal}>
            <label className="block space-y-1 text-sm text-muted">
              Title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <label className="block space-y-1 text-sm text-muted">
              Deadline (seconds from now)
              <input
                type="number"
                min={60}
                value={deadlineSecs}
                onChange={(event) => setDeadlineSecs(event.target.value)}
                className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <button
              type="submit"
              disabled={createProposalMutation.isPending}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
            >
              {createProposalMutation.isPending ? "Creating..." : "Create proposal"}
            </button>
          </form>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Vote on Proposal</h2>
          <form className="mt-3 space-y-3" onSubmit={handleVote}>
            <label className="block space-y-1 text-sm text-muted">
              Proposal
              <select
                value={selectedProposalId}
                onChange={(event) => setSelectedProposalId(event.target.value)}
                className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              >
                <option value="">Select proposal</option>
                {(proposalsQuery.data ?? []).map((proposal) => (
                  <option key={proposal.proposal_id} value={proposal.proposal_id}>
                    {proposal.proposal_id} | {proposal.state}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1 text-sm text-muted">
              Vote Power
              <input
                type="number"
                min={1}
                value={votePower}
                onChange={(event) => setVotePower(event.target.value)}
                className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSupport(true)}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  support
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-100"
                    : "border-line bg-[#0b1018] text-muted"
                }`}
              >
                For
              </button>
              <button
                type="button"
                onClick={() => setSupport(false)}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  !support
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-100"
                    : "border-line bg-[#0b1018] text-muted"
                }`}
              >
                Against
              </button>
            </div>
            <button
              type="submit"
              disabled={voteMutation.isPending || voteDisabled}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
            >
              {voteMutation.isPending ? "Submitting..." : "Submit vote"}
            </button>
          </form>
        </article>
      </section>

      {feedback ? (
        <p className="rounded-xl border border-success/35 bg-success/10 px-3 py-2 text-sm text-success">
          {feedback}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <section className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
        <h2 className="text-lg font-semibold">All Proposals</h2>
        {proposalsQuery.isLoading ? <p className="mt-3 text-sm text-muted">Loading proposals...</p> : null}
        {proposalsQuery.isError ? (
          <p className="mt-3 text-sm text-danger">
            {proposalsQuery.error instanceof Error
              ? proposalsQuery.error.message
              : "Failed to load proposals"}
          </p>
        ) : null}
        {!proposalsQuery.isLoading && !proposalsQuery.isError ? (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-line text-left text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">State</th>
                  <th className="px-2 py-2">For</th>
                  <th className="px-2 py-2">Against</th>
                  <th className="px-2 py-2">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {(proposalsQuery.data ?? []).map((proposal) => (
                  <tr key={proposal.proposal_id} className="border-b border-line/60">
                    <td className="px-2 py-2">{proposal.proposal_id}</td>
                    <td className="px-2 py-2">{proposal.title}</td>
                    <td className="px-2 py-2">{proposal.state}</td>
                    <td className="px-2 py-2">{proposal.for_votes}</td>
                    <td className="px-2 py-2">{proposal.against_votes}</td>
                    <td className="px-2 py-2">{unixToDate(proposal.deadline_unix)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </PageFrame>
  );
}
