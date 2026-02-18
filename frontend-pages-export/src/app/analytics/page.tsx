import Link from "next/link";

import { PageFrame } from "@/components/page-frame";

export default function AnalyticsIndexPage() {
  return (
    <PageFrame
      title="Analytics"
      description="Market, oracle and protocol observability endpoints for operational decisions."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { href: "/analytics/markets", title: "Markets" },
          { href: "/analytics/oracle-health", title: "Oracle Health" },
          { href: "/analytics/protocol-stats", title: "Protocol Stats" },
          { href: "/analytics/wiring", title: "Wiring Report" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-line bg-panel p-4 text-sm font-medium transition hover:border-accent/35"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </PageFrame>
  );
}
