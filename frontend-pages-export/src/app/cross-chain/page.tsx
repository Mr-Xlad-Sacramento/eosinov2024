"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { WiringBadges } from "@/components/wiring-badges";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

function parseTokensByChain(raw: string): Array<{ chain_id: number; tokens: string[] }> {
  return raw
    .split(";")
    .map((group) => group.trim())
    .filter(Boolean)
    .map((group) => {
      const [chainPart, tokensPart] = group.split(":");
      const chainId = Number(chainPart);
      const tokens = (tokensPart ?? "")
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean);
      return { chain_id: Number.isFinite(chainId) ? chainId : 0, tokens };
    })
    .filter((entry) => entry.chain_id > 0);
}

export default function CrossChainDashboardPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [amountIn, setAmountIn] = useState("10000");
  const [preferredType, setPreferredType] = useState("flashbots");
  const [snapshotInput, setSnapshotInput] = useState("137:USDC,ETH;42161:USDC");
  const [decision, setDecision] = useState<{ shouldUse: boolean; type: string } | null>(null);
  const [chainId, setChainId] = useState("10");
  const [multicall3, setMulticall3] = useState("0x000000000000000000000000000000000000ca11");
  const [oracle, setOracle] = useState("0x0000000000000000000000000000000000000a11");
  const [serviceType, setServiceType] = useState("flashbots");
  const [serviceAddress, setServiceAddress] = useState("0x000000000000000000000000000000000000b00b");
  const [serviceEnabled, setServiceEnabled] = useState(true);

  const totalValueQuery = useQuery({
    queryKey: ["cross-chain-total-value", traderAddress],
    queryFn: () => standrApi.getCrossChainTotalValue(traderAddress),
  });
  const latestSnapshotQuery = useQuery({
    queryKey: ["cross-chain-latest-snapshot", traderAddress],
    queryFn: () => standrApi.getLatestSnapshot(traderAddress),
  });
  const servicesQuery = useQuery({
    queryKey: ["cross-chain-services"],
    queryFn: standrApi.listPrivateMempoolServices,
  });
  const chainsQuery = useQuery({
    queryKey: ["cross-chain-chains"],
    queryFn: standrApi.listCrossChainChains,
  });
  const wiringQuery = useQuery({
    queryKey: ["wiring-report"],
    queryFn: standrApi.getWiringReport,
  });

  const optInMutation = useMutation({
    mutationFn: (optedIn: boolean) =>
      standrApi.setPrivateMempoolOptIn({
        user: traderAddress,
        opted_in: optedIn,
        preferred_type: preferredType,
      }),
  });
  const decisionMutation = useMutation({
    mutationFn: () =>
      standrApi.shouldUsePrivateMempool({
        user: traderAddress,
        amount_in: Number(amountIn) || 0,
      }),
    onSuccess: (result) =>
      setDecision({
        shouldUse: result.should_use,
        type: result.recommended_type,
      }),
  });
  const createSnapshotMutation = useMutation({
    mutationFn: () =>
      standrApi.createPortfolioSnapshot({
        user: traderAddress,
        tokens_by_chain: parseTokensByChain(snapshotInput),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cross-chain-total-value", traderAddress],
      });
      await queryClient.invalidateQueries({
        queryKey: ["cross-chain-latest-snapshot", traderAddress],
      });
    },
  });
  const addChainMutation = useMutation({
    mutationFn: () =>
      standrApi.addCrossChainChain({
        chain_id: Number(chainId) || 0,
        multicall3,
        oracle,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cross-chain-chains"] });
    },
  });
  const setServiceMutation = useMutation({
    mutationFn: () =>
      standrApi.setPrivateMempoolService({
        mempool_type: serviceType,
        service_address: serviceAddress,
        enabled: serviceEnabled,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cross-chain-services"] });
    },
  });

  const serviceCount = servicesQuery.data?.length ?? 0;
  const chainCount = chainsQuery.data?.length ?? 0;
  const latestSnapshotBalances = latestSnapshotQuery.data?.balances ?? [];

  const bestService = useMemo(
    () =>
      (servicesQuery.data ?? [])
        .filter((service) => service.enabled)
        .sort((left, right) => left.mempool_type.localeCompare(right.mempool_type))[0] ?? null,
    [servicesQuery.data],
  );
  const wiringMode = wiringQuery.data?.execution_mode ?? "simulation";
  const setServiceWiring =
    wiringQuery.data?.bindings.find(
      (binding) => binding.feature_key === "multichain.private_mempool.set_service",
    ) ?? null;

  function onAddChain(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addChainMutation.mutate();
  }

  return (
    <PageFrame
      title="Cross-Chain & Private Mempool"
      description="Unified portfolio snapshots, private order routing, and chain/service configuration."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Total Portfolio Value</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            ${totalValueQuery.data?.total_value_usd ?? "0.00"}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Latest Snapshot</p>
          <p className="mt-2 text-sm font-mono text-ink">{latestSnapshotQuery.data?.snapshot_id ?? "None"}</p>
          <p className="mt-1 text-xs text-muted">{latestSnapshotBalances.length} tracked balances</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Private Mempool Services</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{serviceCount}</p>
          <p className="mt-1 text-xs text-muted">
            Preferred: {bestService?.mempool_type ?? "n/a"}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Configured Chains</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{chainCount}</p>
          <p className="mt-1 text-xs text-muted">Multichain aggregation endpoints</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Private Mempool Controls</h2>
          <div className="mt-3 space-y-3">
            <label className="block text-sm text-muted">
              Preferred service
              <input
                value={preferredType}
                onChange={(event) => setPreferredType(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => optInMutation.mutate(true)}
                className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100"
              >
                Enable Private Routing
              </button>
              <button
                type="button"
                onClick={() => optInMutation.mutate(false)}
                className="rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
              >
                Disable Private Routing
              </button>
            </div>
            <label className="block text-sm text-muted">
              Order amount (for route recommendation)
              <input
                value={amountIn}
                onChange={(event) => setAmountIn(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <button
              type="button"
              onClick={() => decisionMutation.mutate()}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100"
            >
              Check Recommendation
            </button>
            {decision ? (
              <p className="text-sm text-muted">
                Recommended: <span className="font-semibold text-ink">{decision.type}</span> (
                {decision.shouldUse ? "use private mempool" : "public path acceptable"})
              </p>
            ) : null}
          </div>

          <h3 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">Services</h3>
          <ul className="mt-3 space-y-2">
            {(servicesQuery.data ?? []).map((service) => (
              <li
                key={service.mempool_type}
                className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-sm"
              >
                <p className="font-semibold text-ink">{service.mempool_type}</p>
                <p className="font-mono text-xs text-muted">{service.service_address}</p>
                <p className="text-xs text-muted">{service.enabled ? "Enabled" : "Disabled"}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl border border-line bg-[#0b1018]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Set Service Configuration</p>
            <WiringBadges binding={setServiceWiring} executionMode={wiringMode} />
            <label className="mt-2 block text-sm text-muted">
              Service Type
              <input
                value={serviceType}
                onChange={(event) => setServiceType(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <label className="mt-2 block text-sm text-muted">
              Service Address
              <input
                value={serviceAddress}
                onChange={(event) => setServiceAddress(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={serviceEnabled}
                onChange={(event) => setServiceEnabled(event.target.checked)}
              />
              Enabled
            </label>
            <button
              type="button"
              onClick={() => setServiceMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
            >
              Set Mempool Service
            </button>
            {setServiceMutation.data ? (
              <p className="mt-2 text-xs text-muted">
                Saved {setServiceMutation.data.mempool_type} at {setServiceMutation.data.service_address}
              </p>
            ) : null}
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Portfolio Snapshots</h2>
          <label className="mt-3 block text-sm text-muted">
            Tokens by chain (`chain:token,token;chain:token`)
            <textarea
              value={snapshotInput}
              onChange={(event) => setSnapshotInput(event.target.value)}
              className="mt-1 h-24 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <button
            type="button"
            onClick={() => createSnapshotMutation.mutate()}
            className="mt-3 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100"
          >
            Create Snapshot
          </button>
          {latestSnapshotQuery.data ? (
            <div className="mt-4 rounded-xl border border-line bg-[#0b1018]/90 p-3 text-xs text-muted">
              <p className="font-semibold text-ink">Latest Snapshot Balances</p>
              <ul className="mt-2 space-y-1">
                {latestSnapshotBalances.map((balance) => (
                  <li key={`${balance.chain_id}-${balance.token}`}>
                    Chain {balance.chain_id} {balance.token}: {balance.balance} (${balance.value_usd})
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <h3 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">Add Chain</h3>
          <form className="mt-2 space-y-2" onSubmit={onAddChain}>
            <input
              value={chainId}
              onChange={(event) => setChainId(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink outline-none transition focus:border-cyan-300/45"
              placeholder="chain_id"
            />
            <input
              value={multicall3}
              onChange={(event) => setMulticall3(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink outline-none transition focus:border-cyan-300/45"
              placeholder="multicall3 address"
            />
            <input
              value={oracle}
              onChange={(event) => setOracle(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink outline-none transition focus:border-cyan-300/45"
              placeholder="oracle address"
            />
            <button
              type="submit"
              className="rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
            >
              Add Chain
            </button>
          </form>
          <div className="mt-4 grid gap-2">
            <Link
              href="/cross-chain/bridge"
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm font-semibold text-ink"
            >
              Private Order Console
            </Link>
            <Link
              href="/cross-chain/settlement-status"
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm font-semibold text-ink"
            >
              Snapshot History
            </Link>
          </div>
        </article>
      </section>
    </PageFrame>
  );
}
