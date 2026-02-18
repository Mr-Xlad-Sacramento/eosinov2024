import { SectionTabs } from "@/components/section-tabs";

const PORTFOLIO_ROUTES = [
  { href: "/portfolio", label: "Overview" },
  { href: "/portfolio/positions", label: "Positions" },
  { href: "/portfolio/orders", label: "Orders" },
  { href: "/portfolio/history", label: "History" },
  { href: "/portfolio/risk", label: "Risk" },
  { href: "/portfolio/cross-chain", label: "Cross-Chain" },
];

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <SectionTabs
        title="Portfolio"
        subtitle="Execution state, risk posture, and historical accountability."
        items={PORTFOLIO_ROUTES}
      />
      {children}
    </div>
  );
}
