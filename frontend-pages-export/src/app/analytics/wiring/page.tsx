"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";

function statusTone(status: string): string {
  switch (status) {
    case "verified":
      return "border-emerald-400/40 bg-emerald-500/15 text-emerald-100";
    case "route_present_simulation":
      return "border-amber-400/40 bg-amber-500/15 text-amber-100";
    default:
      return "border-rose-400/40 bg-rose-500/15 text-rose-100";
  }
}

export default function AnalyticsWiringPage() {
  const wiringQuery = useQuery({
    queryKey: ["analytics-wiring-report"],
    queryFn: standrApi.getWiringReport,
  });

  const unresolved = useMemo(
    () =>
      (wiringQuery.data?.bindings ?? []).filter(
        (item) => item.validation.status !== "verified",
      ),
    [wiringQuery.data?.bindings],
  );

  return (
    <PageFrame
      title="Wiring Report"
      description="Simulation-first contract/function mapping with ABI verification status."
    >
      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-3xl border border-line bg-panel p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Execution Mode</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {wiringQuery.data?.execution_mode ?? "simulation"}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-panel p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Verified</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {wiringQuery.data?.verified_count ?? 0}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-panel p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Unresolved</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {wiringQuery.data?.missing_count ?? unresolved.length}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-panel p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Total Bindings</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {wiringQuery.data?.bindings.length ?? 0}
          </p>
        </article>
      </section>

      <section className="rounded-3xl border border-line bg-panel">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-lg font-semibold">Binding Status</h2>
          <p className="text-xs text-muted">Unresolved items are listed first.</p>
        </div>
        {wiringQuery.isLoading ? (
          <p className="px-4 py-4 text-sm text-muted">Loading wiring report...</p>
        ) : wiringQuery.isError ? (
          <p className="px-4 py-4 text-sm text-danger">
            {wiringQuery.error instanceof Error
              ? wiringQuery.error.message
              : "Failed to load wiring report."}
          </p>
        ) : (
          <div className="overflow-x-auto p-3">
            <table className="min-w-full text-sm">
              <thead className="border-b border-line text-left text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-2 py-2">Feature</th>
                  <th className="px-2 py-2">Domain</th>
                  <th className="px-2 py-2">Route</th>
                  <th className="px-2 py-2">Contract</th>
                  <th className="px-2 py-2">Function</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...(unresolved ?? []),
                  ...((wiringQuery.data?.bindings ?? []).filter(
                    (item) => item.validation.status === "verified",
                  ) ?? []),
                ].map((item) => (
                  <tr key={item.feature_key} className="border-b border-line/50 last:border-b-0">
                    <td className="px-2 py-2">{item.feature_key}</td>
                    <td className="px-2 py-2">{item.domain}</td>
                    <td className="px-2 py-2 font-mono text-xs">
                      {item.backend_method} {item.backend_route}
                    </td>
                    <td className="px-2 py-2">{item.contract_name}</td>
                    <td className="px-2 py-2 font-mono text-xs">{item.function_signature}</td>
                    <td className="px-2 py-2">
                      <span
                        className={`inline-block rounded-full border px-2 py-1 text-[11px] font-semibold ${statusTone(item.validation.status)}`}
                      >
                        {item.validation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageFrame>
  );
}
