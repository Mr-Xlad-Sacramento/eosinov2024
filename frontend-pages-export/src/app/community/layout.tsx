import { SectionTabs } from "@/components/section-tabs";

const COMMUNITY_ROUTES = [
  { href: "/community/leaderboard", label: "Leaderboard" },
  { href: "/community/gamification", label: "Gamification" },
  { href: "/community/mev-bounty", label: "MEV Bounty" },
];

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <SectionTabs
        title="Community"
        subtitle="Social performance, gamification progress, and ranking telemetry."
        items={COMMUNITY_ROUTES}
      />
      {children}
    </div>
  );
}
