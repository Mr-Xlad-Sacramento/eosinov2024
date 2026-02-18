"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChartColumnBig, Database, Landmark, Layers3, Wallet } from "lucide-react";

import { DEMO_ADDRESS } from "@/lib/constants";
import { standrApi } from "@/lib/api/standr";
import { asCurrency, formatPercentFromBps } from "@/lib/utils";

import { LiveBlockNumber } from "@/components/live-block-number";
import { PageFrame } from "@/components/page-frame";
import { VaultEligibilityPanel } from "@/components/vault-eligibility-panel";

function StatCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="panel-hover rounded-2xl border border-line bg-panel p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{helper}</p>
    </article>
  );
}

export default function AppHomePage() {
  const { data: tvl } = useQuery({ queryKey: ["app-tvl"], queryFn: standrApi.getTvl });
  const { data: volume } = useQuery({
    queryKey: ["app-volume-24h"],
    queryFn: standrApi.getVolume24h,
  });
  const { data: apy } = useQuery({ queryKey: ["app-yield-apy"], queryFn: standrApi.getApy });
  const { data: intentsCount } = useQuery({
    queryKey: ["app-intents-count", DEMO_ADDRESS],
    queryFn: () => standrApi.getIntentCount(DEMO_ADDRESS),
  });

  const cards = useMemo(
    () => [
      {
        label: "Protocol TVL",
        value: tvl ? asCurrency(tvl.tvl) : "Loading",
        helper: "From analytics indexer",
      },
      {
        label: "24h Volume",
        value: volume ? asCurrency(volume.volume) : "Loading",
        helper: "Canonical /api/v1 analytics feed",
      },
      {
        label: "Base Vault APY",
        value: apy ? formatPercentFromBps(apy.apy_bps) : "Loading",
        helper: "Yield adapter snapshot",
      },
      {
        label: "Tracked Intents",
        value: intentsCount ? intentsCount.count.toString() : "Loading",
        helper: "Intent engine sample account",
      },
    ],
    [apy, intentsCount, tvl, volume],
  );

  return (
    <PageFrame
      title="Application Workspace"
      description="Operational dashboard for current live routes, risk policy context, and execution entry points."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} helper={card.helper} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <article className="rounded-2xl border border-line bg-panel p-5">
          <h2 className="text-lg font-semibold">Execution Context</h2>
          <p className="mt-2 text-sm text-muted">
            This frontend targets canonical <code>/api/v1/*</code> routes and keeps legacy aliases for
            compatibility.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["prices", "orders", "fills", "liquidations", "funding", "blocks"].map((channel) => (
              <span
                key={channel}
                className="rounded-full border border-line bg-panel-strong px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] text-muted"
              >
                {channel}
              </span>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-line bg-canvas px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Live Chain Read</p>
            <LiveBlockNumber />
          </div>
        </article>

        <VaultEligibilityPanel compact />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/dex-trading" className="panel-hover rounded-2xl border border-line bg-panel p-5">
          <ChartColumnBig className="text-blue-300" size={20} />
          <h3 className="mt-3 font-semibold">DEX Trading Workspace</h3>
          <p className="mt-1 text-sm text-muted">Analyzer-style mode tabs with live swap + backend-managed advanced orders.</p>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-300">
            Open <ArrowRight size={14} />
          </div>
        </Link>
        <Link href="/analyze/crypto" className="panel-hover rounded-2xl border border-line bg-panel p-5">
          <Layers3 className="text-blue-300" size={20} />
          <h3 className="mt-3 font-semibold">Analyzer Flows</h3>
          <p className="mt-1 text-sm text-muted">Crypto + prediction report generation and approval-driven execution.</p>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-300">
            Open <ArrowRight size={14} />
          </div>
        </Link>
        <Link href="/portfolio/positions" className="panel-hover rounded-2xl border border-line bg-panel p-5">
          <Wallet className="text-blue-300" size={20} />
          <h3 className="mt-3 font-semibold">Portfolio Views</h3>
          <p className="mt-1 text-sm text-muted">Positions, orders, and risk pages under a shared shell.</p>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-300">
            Open <ArrowRight size={14} />
          </div>
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/liquidity/pools" className="panel-hover rounded-2xl border border-line bg-panel p-5">
          <Database className="text-blue-300" size={20} />
          <h3 className="mt-3 font-semibold">Liquidity Pools</h3>
          <p className="mt-1 text-sm text-muted">Browse active pools, create pools, add/remove, and transfer LP shares.</p>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-300">
            Open <ArrowRight size={14} />
          </div>
        </Link>
        <Link href="/governance" className="panel-hover rounded-2xl border border-line bg-panel p-5">
          <Landmark className="text-blue-300" size={20} />
          <h3 className="mt-3 font-semibold">Governance</h3>
          <p className="mt-1 text-sm text-muted">Create proposals, submit votes, and monitor treasury transfer queue.</p>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-300">
            Open <ArrowRight size={14} />
          </div>
        </Link>
        <Link href="/protocol" className="panel-hover rounded-2xl border border-line bg-panel p-5">
          <Layers3 className="text-blue-300" size={20} />
          <h3 className="mt-3 font-semibold">Protocol Hub</h3>
          <p className="mt-1 text-sm text-muted">User Intent Account, arbitrage, bonding, POL vault, LP profiles, and rental.</p>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-300">
            Open <ArrowRight size={14} />
          </div>
        </Link>
      </section>
    </PageFrame>
  );
}
