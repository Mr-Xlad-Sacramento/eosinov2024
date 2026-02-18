import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

export default function PortfolioIndexPage() {
  return (
    <PageFrame
      title="Portfolio"
      description="Track positions, orders, history, and risk posture in one execution-facing workspace."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { href: "/portfolio/positions", title: "Positions", desc: "Open exposure and PnL telemetry." },
          { href: "/portfolio/orders", title: "Orders", desc: "Intent and order lifecycle records." },
          { href: "/portfolio/history", title: "History", desc: "Governance and risk event timeline." },
          { href: "/portfolio/risk", title: "Risk", desc: "Tier controls and eligibility constraints." },
          { href: "/portfolio/cross-chain", title: "Cross-Chain", desc: "Aggregated balances across configured chains." },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.34)] transition hover:border-cyan-300/35"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">{item.title}</h2>
              <ArrowUpRight
                size={15}
                className="text-cyan-200 opacity-70 transition group-hover:opacity-100"
              />
            </div>
            <p className="mt-2 text-xs text-slate-300">{item.desc}</p>
          </Link>
        ))}
      </section>
    </PageFrame>
  );
}
