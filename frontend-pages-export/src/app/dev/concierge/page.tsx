"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { standrApi } from "@/lib/api/standr";

export default function DevConciergePage() {
  const [search, setSearch] = useState("");
  const [selectedContract, setSelectedContract] = useState("");

  const addressesQuery = useQuery({
    queryKey: ["dev-concierge-addresses"],
    queryFn: standrApi.getContractAddresses,
    refetchInterval: 30_000,
  });

  const contracts = useMemo(
    () => addressesQuery.data?.contracts ?? [],
    [addressesQuery.data?.contracts],
  );
  const filteredContracts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return contracts;
    }
    return contracts.filter((entry) => entry.name.toLowerCase().includes(term));
  }, [contracts, search]);

  const activeContract = useMemo(() => {
    if (
      selectedContract &&
      filteredContracts.some((entry) => entry.name === selectedContract)
    ) {
      return selectedContract;
    }
    return filteredContracts[0]?.name ?? "";
  }, [filteredContracts, selectedContract]);

  const abiQuery = useQuery({
    queryKey: ["dev-concierge-abi", activeContract],
    queryFn: () => standrApi.getContractAbi(activeContract),
    enabled: activeContract.length > 0,
  });

  return (
    <PageFrame
      title="Contracts Concierge"
      description="Developer console for contract address inventory and ABI inspection."
    >
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Contracts Inventory" subtitle="Configured and discovered contracts">
          <div className="mb-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contract name"
              className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink"
            />
          </div>

          <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted">
            <span className="rounded-full border border-line px-2 py-1">
              configured {addressesQuery.data?.configured_count ?? 0}
            </span>
            <span className="rounded-full border border-line px-2 py-1">
              total {addressesQuery.data?.total_count ?? 0}
            </span>
            <span className="rounded-full border border-line px-2 py-1">
              mode {addressesQuery.data?.source_mode ?? "n/a"}
            </span>
          </div>

          <ul className="max-h-[520px] space-y-2 overflow-auto pr-1">
            {filteredContracts.map((entry) => (
              <li key={entry.name}>
                <button
                  type="button"
                  onClick={() => setSelectedContract(entry.name)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    activeContract === entry.name
                      ? "border-accent/50 bg-accent-soft/40 text-ink"
                      : "border-line bg-canvas text-muted hover:border-line/80 hover:text-ink"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{entry.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        entry.configured
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {entry.configured ? "configured" : "missing"}
                    </span>
                  </div>
                  <p className="mt-1 break-all font-mono text-[11px] text-muted">
                    {entry.address ?? "no address configured"}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="ABI Inspector" subtitle="Selected contract ABI payload">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="rounded-full border border-line px-2 py-1">
              contract {activeContract || "none"}
            </span>
            <span className="rounded-full border border-line px-2 py-1">
              mode {abiQuery.data?.source_mode ?? "n/a"}
            </span>
          </div>

          {abiQuery.isLoading ? (
            <p className="text-sm text-muted">Loading ABI...</p>
          ) : abiQuery.error ? (
            <p className="text-sm text-red-300">Unable to load ABI for {activeContract}.</p>
          ) : abiQuery.data ? (
            <pre className="max-h-[560px] overflow-auto rounded-xl border border-line bg-canvas p-3 font-mono text-xs text-ink">
              {JSON.stringify(abiQuery.data.abi, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted">Select a contract to inspect its ABI.</p>
          )}
        </Panel>
      </section>
    </PageFrame>
  );
}
