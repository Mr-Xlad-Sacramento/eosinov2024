import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

export default function TradeIndexPage() {
  return (
    <PageFrame
      title="Trade Surfaces"
      description="Choose execution surfaces for spot routing, perpetuals risk-managed positions, and options lifecycle operations."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            href: "/trade/spot",
            title: "Swap/Spot",
            desc: "Route-aware spot execution with gasless and batch logic handled internally.",
          },
          {
            href: "/trade/perps",
            title: "Perps",
            desc: "Funding-aware perpetuals with vault-backed collateral eligibility checks.",
          },
          {
            href: "/trade/options",
            title: "Options",
            desc: "Structured options flow for quote, open, close, and exercise lifecycle.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.34)] transition hover:border-cyan-300/35"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
              <ArrowUpRight
                size={16}
                className="text-cyan-200 opacity-70 transition group-hover:opacity-100"
              />
            </div>
            <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
          </Link>
        ))}
      </section>
    </PageFrame>
  );
}
