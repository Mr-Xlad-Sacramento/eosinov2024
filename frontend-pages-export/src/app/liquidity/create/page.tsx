import Link from "next/link";
import { Orbit, ShieldCheck, Sparkles } from "lucide-react";

import { LiquidityCreatePoolForm } from "@/components/liquidity/LiquidityCreatePoolForm";
import { LiquidityRail } from "@/components/liquidity/LiquidityRail";
import { PageFrame } from "@/components/page-frame";

export default function LiquidityCreatePage() {
  return (
    <PageFrame
      title="LP/Vaults - Create Liquidity"
      description="Launch a new liquidity market with managed policy checks, route protection, and deterministic creation."
    >
      <div className="grid gap-4 lg:grid-cols-[245px_minmax(0,1fr)]">
        <LiquidityRail />

        <section className="space-y-4">
          <article className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#111729] via-[#11151f] to-[#0d1118] p-5">
            <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-cyan-400/12 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Market Factory</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Create a high-signal liquidity pool</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-300">
                Define your token pair, configure base APR, and publish a new pool entrypoint for LP routing.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-line bg-panel/80 px-3 py-1 text-cyan-100">
                  <Sparkles size={12} />
                  Deterministic Idempotency
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-line bg-panel/80 px-3 py-1 text-cyan-100">
                  <ShieldCheck size={12} />
                  Policy-Gated Deployment
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-line bg-panel/80 px-3 py-1 text-cyan-100">
                  <Orbit size={12} />
                  Router Compatible
                </span>
              </div>
            </div>
          </article>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <LiquidityCreatePoolForm />

            <aside className="space-y-3 rounded-3xl border border-line bg-[#0f131d]/90 p-4">
              <div className="rounded-2xl border border-line bg-panel/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">Launch Checklist</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li>- Confirm token contract addresses are canonical.</li>
                  <li>- Start with conservative APR before opening wider incentives.</li>
                  <li>- Validate pool naming to match token pair intent.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-line bg-panel/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">Post-Creation</p>
                <p className="mt-2 text-sm text-slate-300">
                  After deployment, seed initial liquidity from the pools workspace and monitor fill velocity on TVL and volume cards.
                </p>
              </div>

              <Link
                href="/liquidity/pools"
                className="inline-flex w-full items-center justify-center rounded-xl border border-line bg-panel-strong px-4 py-2 text-sm font-semibold text-ink transition hover:border-cyan-300/35"
              >
                Back to pools
              </Link>
            </aside>
          </section>
        </section>
      </div>
    </PageFrame>
  );
}
