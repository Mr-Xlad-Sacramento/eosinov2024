import Link from "next/link";

import { PageFrame } from "@/components/page-frame";

export default function AdminIndexPage() {
  return (
    <PageFrame
      title="Admin"
      description="Operator control plane for internal modules, cross-chain routing telemetry, policy management, and incident controls."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { href: "/admin/monitoring", title: "Monitoring" },
          { href: "/admin/params", title: "Params" },
          { href: "/admin/emergency", title: "Emergency" },
          { href: "/analytics/oracle-health", title: "Oracle Health" },
          { href: "/analytics/protocol-stats", title: "Protocol Stats" },
          { href: "/admin/coverage", title: "Contract Coverage" },
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
