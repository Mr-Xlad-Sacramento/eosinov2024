import { SectionTabs } from "@/components/section-tabs";

const ANALYZE_ROUTES = [
  { href: "/analyze/crypto", label: "Crypto" },
  { href: "/analyze/prediction", label: "Prediction" },
];

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <SectionTabs
        title="Analyzer"
        subtitle="AI consensus analysis with explicit execution approvals."
        items={ANALYZE_ROUTES}
      />
      {children}
    </div>
  );
}
