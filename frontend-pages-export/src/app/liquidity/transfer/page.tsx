import Link from "next/link";
import { MoveRight, ShieldCheck, Zap } from "lucide-react";

import { LiquidityRail } from "@/components/liquidity/LiquidityRail";
import { LiquidityTransferWizard } from "@/components/liquidity/LiquidityTransferWizard";
import { PageFrame } from "@/components/page-frame";

export default function LiquidityTransferPage() {
  return (
    <PageFrame
      title="LP/Vaults - Transfer Liquidity"
      description="Move LP shares across wallets through a guided transfer flow with position checks and replay-safe execution."
    >
      <div className="grid gap-4 lg:grid-cols-[245px_minmax(0,1fr)]">
        <LiquidityRail />

        <section className="space-y-4">
          <article className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#111729] via-[#11151f] to-[#0d1118] p-5">
            <div className="pointer-events-none absolute -left-10 -top-16 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">LP Mobility</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Transfer LP shares safely</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-300">
                Select a position, route ownership to another wallet, and execute a verifiable liquidity handoff.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-line bg-panel/80 px-3 py-1 text-cyan-100">
                  <MoveRight size={12} />
                  Wallet-to-Wallet
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-line bg-panel/80 px-3 py-1 text-cyan-100">
                  <ShieldCheck size={12} />
                  Position Validation
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-line bg-panel/80 px-3 py-1 text-cyan-100">
                  <Zap size={12} />
                  Fast Settlement
                </span>
              </div>
            </div>
          </article>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <LiquidityTransferWizard />

            <aside className="space-y-3 rounded-3xl border border-line bg-[#0f131d]/90 p-4">
              <div className="rounded-2xl border border-line bg-panel/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">Transfer Notes</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li>- Destination wallet must be valid and chain-compatible.</li>
                  <li>- Shares moved out are no longer claimable by the origin wallet.</li>
                  <li>- Use partial transfers to rebalance treasury and operator accounts.</li>
                </ul>
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
