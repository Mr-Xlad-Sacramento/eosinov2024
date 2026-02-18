import { SectionTabs } from "@/components/section-tabs";

const VAULT_ROUTES = [
  { href: "/vaults", label: "Overview" },
  { href: "/vaults/deposit", label: "Deposit" },
  { href: "/vaults/withdraw", label: "Withdraw" },
  { href: "/vaults/strategy", label: "Strategy" },
  { href: "/vaults/rewards", label: "Rewards" },
];

export default function VaultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <SectionTabs
        title="LP/Vaults"
        subtitle="Vault portfolio command center with premium controls."
        items={VAULT_ROUTES}
      />
      {children}
    </div>
  );
}
