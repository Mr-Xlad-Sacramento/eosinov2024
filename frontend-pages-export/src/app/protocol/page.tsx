import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageFrame } from "@/components/page-frame";

export default function ProtocolHubPage() {
  const items = [
    {
      href: "/protocol/accounts",
      title: "User Intent Account",
      description: "Tier, intent history, and account policy controls.",
    },
    {
      href: "/protocol/arbitrage",
      title: "Cross-Chain Arbitrage",
      description: "Join and exit arbitrage pools.",
    },
    {
      href: "/protocol/bonding",
      title: "Bonding Marketplace",
      description: "Bond discovery and position creation.",
    },
    {
      href: "/protocol/pol-vault",
      title: "POL Vault",
      description: "Deposit/withdraw POL vault positions.",
    },
    {
      href: "/protocol/lp-profiles",
      title: "LP Profiles",
      description: "Liquidity provider profile and rebates.",
    },
    {
      href: "/protocol/rental",
      title: "Liquidity Rental",
      description: "Browse rental offers and manage agreements.",
    },
  ];

  return (
    <PageFrame
      title="Protocol Access Hub"
      description="User-facing protocol surfaces. Internal automation, hooks, cross-chain routing, and module coverage are managed in Admin."
    >
      <section className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4 text-sm text-slate-300">
        Internal control-plane modules are restricted to operators:{" "}
        <Link href="/admin/monitoring" className="text-cyan-300 underline underline-offset-2">
          Admin Monitoring
        </Link>
        .
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.34)] transition hover:border-cyan-300/35"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
              <ArrowUpRight size={16} className="text-cyan-200 opacity-75 transition group-hover:opacity-100" />
            </div>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </Link>
        ))}
      </section>
    </PageFrame>
  );
}
