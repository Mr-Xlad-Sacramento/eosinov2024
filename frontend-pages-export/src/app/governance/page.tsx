"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";

function unixToDate(unix: number): string {
  return new Date(unix * 1000).toLocaleString();
}

export default function GovernancePage() {
  const proposalsQuery = useQuery({
    queryKey: ["governance-overview-proposals"],
    queryFn: standrApi.getGovernanceProposals,
  });
  const treasuryQuery = useQuery({
    queryKey: ["governance-overview-treasury"],
    queryFn: standrApi.getTreasuryTransfers,
  });

  return (
    <PageFrame
      title="Governance"
      description="Browse proposals, submit votes, and monitor treasury transfer queue."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Proposals</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{proposalsQuery.data?.length ?? 0}</p>
          <p className="mt-1 text-sm text-muted">Total proposal records available.</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Treasury Transfers</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{treasuryQuery.data?.length ?? 0}</p>
          <p className="mt-1 text-sm text-muted">Pending and historical transfer queue.</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Integration Note</p>
          <p className="mt-2 text-sm text-muted">Governance calls are backend-managed API flows in this phase.</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest Proposals</h2>
            <Link
              href="/governance/proposals"
              className="rounded-lg border border-cyan-400/35 bg-cyan-500/12 px-3 py-1.5 text-xs font-semibold text-cyan-100"
            >
              Open proposals
            </Link>
          </div>
          {proposalsQuery.isLoading ? (
            <p className="mt-3 text-sm text-muted">Loading proposals...</p>
          ) : proposalsQuery.isError ? (
            <p className="mt-3 text-sm text-danger">
              {proposalsQuery.error instanceof Error ? proposalsQuery.error.message : "Failed to load proposals"}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {(proposalsQuery.data ?? []).slice(0, 5).map((proposal) => (
                <li
                  key={proposal.proposal_id}
                  className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-sm"
                >
                  <p className="font-semibold text-ink">{proposal.title}</p>
                  <p className="text-xs text-muted">
                    {proposal.proposal_id} | {proposal.state} | deadline {unixToDate(proposal.deadline_unix)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest Treasury Transfers</h2>
            <Link
              href="/governance/treasury"
              className="rounded-lg border border-cyan-400/35 bg-cyan-500/12 px-3 py-1.5 text-xs font-semibold text-cyan-100"
            >
              Open treasury
            </Link>
          </div>
          {treasuryQuery.isLoading ? (
            <p className="mt-3 text-sm text-muted">Loading treasury queue...</p>
          ) : treasuryQuery.isError ? (
            <p className="mt-3 text-sm text-danger">
              {treasuryQuery.error instanceof Error
                ? treasuryQuery.error.message
                : "Failed to load treasury transfers"}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {(treasuryQuery.data ?? []).slice(0, 5).map((transfer) => (
                <li
                  key={transfer.transfer_id}
                  className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-sm"
                >
                  <p className="font-semibold text-ink">{transfer.transfer_id}</p>
                  <p className="text-xs text-muted">
                    {transfer.token} {transfer.amount} | {transfer.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </PageFrame>
  );
}
