"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function PrivateMempoolSettingsPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [preferredType, setPreferredType] = useState("flashbots");
  const [serviceType, setServiceType] = useState("flashbots");
  const [serviceAddress, setServiceAddress] = useState(
    "0x000000000000000000000000000000000000b00b",
  );
  const [serviceEnabled, setServiceEnabled] = useState(true);
  const [decisionAmount, setDecisionAmount] = useState("10000");

  const servicesQuery = useQuery({
    queryKey: ["settings-private-mempool-services"],
    queryFn: standrApi.listPrivateMempoolServices,
  });

  const decisionMutation = useMutation({
    mutationFn: () =>
      standrApi.shouldUsePrivateMempool({
        user: traderAddress,
        amount_in: Number(decisionAmount) || 0,
      }),
  });

  const optInMutation = useMutation({
    mutationFn: (optedIn: boolean) =>
      standrApi.setPrivateMempoolOptIn({
        user: traderAddress,
        opted_in: optedIn,
        preferred_type: preferredType,
      }),
  });

  const setServiceMutation = useMutation({
    mutationFn: () =>
      standrApi.setPrivateMempoolService({
        mempool_type: serviceType,
        service_address: serviceAddress,
        enabled: serviceEnabled,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings-private-mempool-services"] });
    },
  });

  return (
    <PageFrame
      title="Private Mempool Settings"
      description="Configure opt-in strategy, service routing, and execution guidance for private order flow."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">User</p>
          <p className="mt-2 font-mono text-xs text-ink">{traderAddress}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Configured Services</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{servicesQuery.data?.length ?? 0}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Decision</p>
          <p className="mt-2 text-sm text-ink">
            {decisionMutation.data
              ? `${decisionMutation.data.should_use ? "Use private" : "Public path ok"} - ${
                  decisionMutation.data.recommended_type
                }`
              : "Run recommendation check"}
          </p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Routing Controls</h2>
          <label className="mt-3 block text-sm text-muted">
            Preferred Mempool Type
            <input
              value={preferredType}
              onChange={(event) => setPreferredType(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink"
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => optInMutation.mutate(true)}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100"
            >
              Opt In
            </button>
            <button
              type="button"
              onClick={() => optInMutation.mutate(false)}
              className="rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
            >
              Opt Out
            </button>
          </div>
          {optInMutation.data ? (
            <p className="mt-2 text-xs text-muted">
              Saved for {optInMutation.data.user}: preferred type {optInMutation.data.preferred_type}
            </p>
          ) : null}

          <label className="mt-4 block text-sm text-muted">
            Amount for decision check
            <input
              value={decisionAmount}
              onChange={(event) => setDecisionAmount(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink"
            />
          </label>
          <button
            type="button"
            onClick={() => decisionMutation.mutate()}
            className="mt-3 rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
          >
            Check Recommendation
          </button>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Service Registry</h2>
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
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Update Service</p>
            <input
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="mempool type"
            />
            <input
              value={serviceAddress}
              onChange={(event) => setServiceAddress(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="service address"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-muted">
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
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
            >
              Save Service
            </button>
          </div>
        </article>
      </section>
    </PageFrame>
  );
}
