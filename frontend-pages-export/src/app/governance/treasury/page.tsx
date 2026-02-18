"use client";

import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";

function unixToDate(unix: number): string {
  return new Date(unix * 1000).toLocaleString();
}

export default function GovernanceTreasuryPage() {
  const transfersQuery = useQuery({
    queryKey: ["governance-treasury-transfers"],
    queryFn: standrApi.getTreasuryTransfers,
  });

  return (
    <PageFrame
      title="Treasury Transfers"
      description="Review treasury transfer queue and timelock execution windows."
    >
      <section className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
        {transfersQuery.isLoading ? (
          <p className="text-sm text-muted">Loading treasury transfers...</p>
        ) : null}
        {transfersQuery.isError ? (
          <p className="text-sm text-danger">
            {transfersQuery.error instanceof Error
              ? transfersQuery.error.message
              : "Failed to load treasury transfers"}
          </p>
        ) : null}
        {!transfersQuery.isLoading && !transfersQuery.isError ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-line text-left text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-2 py-2">Transfer</th>
                  <th className="px-2 py-2">Token</th>
                  <th className="px-2 py-2">To</th>
                  <th className="px-2 py-2">Amount</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Execute After</th>
                </tr>
              </thead>
              <tbody>
                {(transfersQuery.data ?? []).map((transfer) => (
                  <tr key={transfer.transfer_id} className="border-b border-line/60">
                    <td className="px-2 py-2">{transfer.transfer_id}</td>
                    <td className="px-2 py-2">{transfer.token}</td>
                    <td className="px-2 py-2">{transfer.to}</td>
                    <td className="px-2 py-2">{transfer.amount}</td>
                    <td className="px-2 py-2">{transfer.status}</td>
                    <td className="px-2 py-2">{unixToDate(transfer.execute_after_unix)}</td>
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
