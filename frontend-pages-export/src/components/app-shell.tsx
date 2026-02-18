"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AppKitButton } from "@reown/appkit/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { HealthStrip } from "./health-strip";

type NavSection = {
  label: string;
  items: Array<{ label: string; href: string }>;
};

type ShellLinkProps = {
  href: string;
  className: string;
  children: React.ReactNode;
  onWarmRoute: (href: string) => void;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const NAV: NavSection[] = [
  {
    label: "Analyze",
    items: [
      { label: "Crypto", href: "/analyze/crypto" },
      { label: "Prediction", href: "/analyze/prediction" },
    ],
  },
  {
    label: "Trade",
    items: [
      { label: "Spot", href: "/trade/spot" },
      { label: "Perps", href: "/trade/perps" },
      { label: "Options", href: "/trade/options" },
    ],
  },
  {
    label: "LP/Vaults",
    items: [
      { label: "Liquidity", href: "/liquidity/pools" },
      { label: "Vaults", href: "/vaults" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Leaderboard", href: "/community/leaderboard" },
      { label: "Gamification", href: "/community/gamification" },
      { label: "MEV Bounty", href: "/community/mev-bounty" },
      { label: "Governance", href: "/governance" },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { label: "Positions", href: "/portfolio/positions" },
      { label: "Orders", href: "/portfolio/orders" },
      { label: "History", href: "/portfolio/history" },
      { label: "Risk", href: "/portfolio/risk" },
      { label: "Cross-Chain", href: "/portfolio/cross-chain" },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Monitoring", href: "/admin/monitoring" },
      { label: "Params", href: "/admin/params" },
      { label: "Emergency", href: "/admin/emergency" },
      { label: "Oracle Health", href: "/analytics/oracle-health" },
      { label: "Protocol Stats", href: "/analytics/protocol-stats" },
      { label: "Contract Coverage", href: "/admin/coverage" },
      { label: "Dev Concierge", href: "/dev/concierge" },
    ],
  },
  {
    label: "Protocol",
    items: [
      { label: "Hub", href: "/protocol" },
      { label: "User Account", href: "/protocol/accounts" },
      { label: "Arbitrage", href: "/protocol/arbitrage" },
      { label: "Bonding", href: "/protocol/bonding" },
      { label: "POL Vault", href: "/protocol/pol-vault" },
      { label: "LP Profiles", href: "/protocol/lp-profiles" },
      { label: "Rental", href: "/protocol/rental" },
      { label: "Cross-Chain", href: "/cross-chain" },
    ],
  },
  {
    label: "Settings",
    items: [{ label: "Private Mempool", href: "/settings/private-mempool" }],
  },
];

const BACKGROUND_PREFETCH_ROUTES = [
  "/trade/spot",
  "/trade/perps",
  "/trade/options",
  "/analyze/crypto",
  "/analyze/prediction",
  "/liquidity/pools",
  "/vaults",
  "/portfolio",
  "/portfolio/positions",
  "/portfolio/cross-chain",
  "/protocol",
  "/governance",
  "/community/leaderboard",
  "/community/mev-bounty",
  "/cross-chain",
  "/settings/private-mempool",
  "/dev/concierge",
];

function ShellLink({ href, className, children, onWarmRoute, onClick }: ShellLinkProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={() => onWarmRoute(href)}
      onFocus={() => onWarmRoute(href)}
      onTouchStart={() => onWarmRoute(href)}
      onPointerDown={() => onWarmRoute(href)}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  );
}

function MobileNav({
  onNavigate,
  onWarmRoute,
  pathname,
}: {
  onNavigate: () => void;
  onWarmRoute: (href: string) => void;
  pathname: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Landing", href: "/" },
          { label: "App", href: "/app" },
        ].map((item) => (
          <ShellLink
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            onWarmRoute={onWarmRoute}
            className={cn(
              "rounded-xl border px-3 py-2 text-center text-sm font-semibold",
              pathname === item.href
                ? "border-accent/40 bg-accent-soft/60 text-blue-300"
                : "border-line bg-panel text-muted",
            )}
          >
            {item.label}
          </ShellLink>
        ))}
      </div>

      {NAV.map((section) => (
        <section key={section.label} className="rounded-xl border border-line bg-panel p-3">
          <h3 className="text-xs uppercase tracking-[0.16em] text-muted">{section.label}</h3>
          <div className="mt-2 space-y-1">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <ShellLink
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  onWarmRoute={onWarmRoute}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-accent-soft/60 text-blue-300"
                      : "text-muted hover:bg-panel-strong hover:text-ink",
                  )}
                >
                  {item.label}
                </ShellLink>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDesktopSection, setOpenDesktopSection] = useState<string | null>(null);
  const warmedRoutes = useRef<Set<string>>(new Set());

  const warmRoute = useCallback(
    (href: string) => {
      if (warmedRoutes.current.has(href)) {
        return;
      }
      warmedRoutes.current.add(href);
      try {
        router.prefetch(href);
      } catch {
        warmedRoutes.current.delete(href);
      }
    },
    [router],
  );

  useEffect(() => {
    const timers: number[] = [];
    BACKGROUND_PREFETCH_ROUTES.forEach((href, index) => {
      if (warmedRoutes.current.has(href)) {
        return;
      }
      const timer = window.setTimeout(() => warmRoute(href), 320 + index * 140);
      timers.push(timer);
    });
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [warmRoute]);

  const mobilePanelClass = useMemo(
    () => (menuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"),
    [menuOpen],
  );

  return (
    <div className={cn("min-h-screen", isLanding ? "bg-[#040205]" : "subtle-grid")}>
      {isLanding ? null : (
        <>
          <header className="fixed inset-x-0 top-0 z-40 border-b border-line/80 bg-[#050505]/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-3 py-3 md:px-6">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="rounded-xl border border-line bg-panel p-2 text-ink md:hidden"
                aria-label="Toggle navigation"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <ShellLink href="/" onWarmRoute={warmRoute} className="flex items-center gap-2">
                <Image
                  src="/standr-icon.svg"
                  alt="STANDR"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg object-contain"
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-ink md:text-base">STANDR DEX</p>
                  <p className="text-[11px] text-muted md:text-xs">AI Trading Workspace</p>
                </div>
              </ShellLink>

              <div className="hidden md:block">
                <HealthStrip />
              </div>

              <div className="ml-auto">
                <AppKitButton balance="hide" />
              </div>
            </div>

            <div className="hidden border-t border-line/70 md:block">
              <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-6 py-2">
                <ShellLink
                  href="/"
                  onWarmRoute={warmRoute}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                    pathname === "/" ? "bg-accent-soft/60 text-blue-300" : "text-muted hover:text-ink",
                  )}
                >
                  Landing
                </ShellLink>
                <ShellLink
                  href="/app"
                  onWarmRoute={warmRoute}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                    pathname === "/app" ? "bg-accent-soft/60 text-blue-300" : "text-muted hover:text-ink",
                  )}
                >
                  App
                </ShellLink>

                {NAV.map((section) => (
                  <div key={section.label} className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDesktopSection((prev) => (prev === section.label ? null : section.label))
                      }
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition hover:text-ink"
                    >
                      <span>{section.label}</span>
                      <ChevronDown size={14} />
                    </button>
                    {openDesktopSection === section.label ? (
                      <div className="absolute left-0 top-full z-50 mt-2 min-w-[220px] rounded-xl border border-line bg-panel p-2 shadow-2xl">
                        {section.items.map((item) => {
                          const active = pathname === item.href;
                          return (
                            <ShellLink
                              key={item.href}
                              href={item.href}
                              onWarmRoute={warmRoute}
                              onClick={() => setOpenDesktopSection(null)}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-sm transition",
                                active
                                  ? "bg-accent-soft/60 text-blue-300"
                                  : "text-muted hover:bg-panel-strong hover:text-ink",
                              )}
                            >
                              {item.label}
                            </ShellLink>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </header>

          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[360px] border-r border-line bg-canvas p-4 transition md:hidden",
              mobilePanelClass,
            )}
          >
            <div className="mt-16 h-[calc(100vh-90px)] overflow-y-auto">
              <MobileNav onNavigate={() => setMenuOpen(false)} onWarmRoute={warmRoute} pathname={pathname} />
            </div>
          </div>

          {menuOpen ? (
            <button
              type="button"
              className="fixed inset-0 z-30 bg-black/60 md:hidden"
              aria-label="Close navigation backdrop"
              onClick={() => setMenuOpen(false)}
            />
          ) : null}
        </>
      )}

      <main
        className={cn(
          "mx-auto max-w-[1500px] pb-8",
          isLanding ? "px-2 pt-4 md:px-4 md:pt-6" : "px-3 pt-24 md:px-6 md:pt-32",
        )}
      >
        {children}
      </main>
    </div>
  );
}
