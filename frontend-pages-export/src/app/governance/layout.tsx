import { SectionTabs } from "@/components/section-tabs";

const GOVERNANCE_ROUTES = [
  { href: "/governance", label: "Overview" },
  { href: "/governance/proposals", label: "Proposals" },
  { href: "/governance/treasury", label: "Treasury" },
];

export default function GovernanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <SectionTabs
        title="Governance"
        subtitle="Proposal lifecycle, voting execution, and treasury transparency."
        items={GOVERNANCE_ROUTES}
      />
      {children}
    </div>
  );
}
