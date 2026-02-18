import { SectionTabs } from "@/components/section-tabs";

const TRADE_ROUTES = [
  { href: "/trade", label: "Surfaces" },
  { href: "/trade/spot", label: "Swap/Spot" },
  { href: "/trade/perps", label: "Perps" },
  { href: "/trade/options", label: "Options" },
];

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <SectionTabs
        title="Trade Desk"
        subtitle="Execution surfaces with internal gasless, batch, and route orchestration."
        items={TRADE_ROUTES}
      />
      {children}
    </div>
  );
}
