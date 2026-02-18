"use client";

import { useQuery } from "@tanstack/react-query";

import { standrApi } from "@/lib/api/standr";

export function HealthStrip() {
  const { data, error } = useQuery({
    queryKey: ["health-strip"],
    queryFn: standrApi.health,
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  });

  if (error) {
    return (
      <div className="rounded-full border border-danger/35 bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
        Backend unavailable
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-muted">
        Backend check...
      </div>
    );
  }

  return (
    <div className="rounded-full border border-accent/35 bg-accent-soft/60 px-3 py-1 text-xs font-semibold text-blue-300">
      {data.status.toUpperCase()} | chain {data.chain_id} | artifacts {data.artifact_contracts_loaded}
    </div>
  );
}
