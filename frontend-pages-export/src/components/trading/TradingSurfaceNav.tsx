"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

type SidebarSubmenu = "analyzer" | "docs" | null;
type TradingSurfaceNavVariant = "default" | "analyze";

const WHITEPAPER_URL = "https://eosi-finance-1.gitbook.io/eosi-finance-documentations/";
const TERMS_URL =
  "https://eosi-finance-1.gitbook.io/eosi-finance-documentations/eosi-finance/14-legal-and-compliance-considerations";

export function TradingSurfaceNav({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: TradingSurfaceNavVariant;
}) {
  const pathname = usePathname();
  const compactAnalyze = variant === "analyze";
  const [openSidebarSubmenu, setOpenSidebarSubmenu] = useState<SidebarSubmenu>(
    pathname.startsWith("/analyze") ? "analyzer" : null,
  );

  function toggleSidebarSubmenu(target: SidebarSubmenu) {
    if (!target) {
      setOpenSidebarSubmenu(null);
      return;
    }
    setOpenSidebarSubmenu((prev) => (prev === target ? null : target));
  }

  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#090d14] via-[#0d1118] to-[#0d111a] p-4 shadow-[0_18px_50px_rgba(2,6,23,0.45)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-500/8 blur-3xl" />
      <div className="relative z-10">
        <h2 className="text-lg font-semibold text-ink">STANDR DEX</h2>
        <p className="mt-1 text-xs text-muted">Trading workspace</p>

        <nav className="mt-4 space-y-1">
          <Link
            href="/trade/spot"
            className={cn(
              "block rounded-xl border px-3 py-2 text-sm transition",
              pathname === "/trade/spot"
                ? "border-cyan-400/40 bg-cyan-500/12 text-cyan-100"
                : "border-line bg-panel/70 text-muted hover:border-cyan-300/25 hover:text-ink",
            )}
          >
            Swap/Spot
          </Link>

          <Link
            href="/trade/perps"
            className={cn(
              "block rounded-xl border px-3 py-2 text-sm transition",
              pathname === "/trade/perps"
                ? "border-cyan-400/40 bg-cyan-500/12 text-cyan-100"
                : "border-line bg-panel/70 text-muted hover:border-cyan-300/25 hover:text-ink",
            )}
          >
            Perps (live)
          </Link>

          {compactAnalyze ? (
            <Link
              href="/trade/spot?mode=intent"
              className={cn(
                "block rounded-xl border px-3 py-2 text-sm transition",
                pathname === "/trade/spot"
                  ? "border-cyan-400/40 bg-cyan-500/12 text-cyan-100"
                  : "border-line bg-panel/70 text-muted hover:border-cyan-300/25 hover:text-ink",
              )}
            >
              Intent
            </Link>
          ) : (
            <Link
              href="/trade/options"
              className={cn(
                "block rounded-xl border px-3 py-2 text-sm transition",
                pathname === "/trade/options"
                  ? "border-cyan-400/40 bg-cyan-500/12 text-cyan-100"
                  : "border-line bg-panel/70 text-muted hover:border-cyan-300/25 hover:text-ink",
              )}
            >
              Options
            </Link>
          )}

          {compactAnalyze ? null : (
            <div>
              <button
                type="button"
                onClick={() => toggleSidebarSubmenu("analyzer")}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition",
                  pathname.startsWith("/analyze")
                    ? "border-cyan-400/40 bg-cyan-500/12 text-cyan-100"
                    : "border-line bg-panel/70 text-muted hover:border-cyan-300/25 hover:text-ink",
                )}
              >
                <span>Analyzer</span>
                <ChevronDown
                  size={14}
                  className={cn(openSidebarSubmenu === "analyzer" ? "rotate-180" : "", "transition")}
                />
              </button>
              <div
                className={cn(
                  "mt-1 space-y-1 pl-3",
                  openSidebarSubmenu === "analyzer" ? "block" : "hidden",
                )}
              >
                <Link
                  href="/analyze/crypto"
                  className={cn(
                    "block rounded-lg px-3 py-2 text-xs",
                    pathname === "/analyze/crypto" || pathname === "/analyze/coin"
                      ? "bg-cyan-500/12 text-cyan-100"
                      : "text-muted hover:bg-panel-strong hover:text-ink",
                  )}
                >
                  Crypto Market
                </Link>
                <Link
                  href="/analyze/prediction"
                  className={cn(
                    "block rounded-lg px-3 py-2 text-xs",
                    pathname === "/analyze/prediction"
                      ? "bg-cyan-500/12 text-cyan-100"
                      : "text-muted hover:bg-panel-strong hover:text-ink",
                  )}
                >
                  Prediction Market
                </Link>
              </div>
            </div>
          )}

          {compactAnalyze ? null : (
            <>
              <Link
                href="/portfolio/positions"
                className={cn(
                  "block rounded-xl border px-3 py-2 text-sm transition",
                  pathname.startsWith("/portfolio")
                    ? "border-cyan-400/40 bg-cyan-500/12 text-cyan-100"
                    : "border-line bg-panel/70 text-muted hover:border-cyan-300/25 hover:text-ink",
                )}
              >
                Portfolio
              </Link>

              <Link
                href="/vaults"
                className={cn(
                  "block rounded-xl border px-3 py-2 text-sm transition",
                  pathname.startsWith("/vaults")
                    ? "border-cyan-400/40 bg-cyan-500/12 text-cyan-100"
                    : "border-line bg-panel/70 text-muted hover:border-cyan-300/25 hover:text-ink",
                )}
              >
                Vaults
              </Link>

              <Link
                href="/protocol/accounts"
                className={cn(
                  "block rounded-xl border px-3 py-2 text-sm transition",
                  pathname === "/protocol/accounts"
                    ? "border-cyan-400/40 bg-cyan-500/12 text-cyan-100"
                    : "border-line bg-panel/70 text-muted hover:border-cyan-300/25 hover:text-ink",
                )}
              >
                User Intent Account
              </Link>

              <div>
                <button
                  type="button"
                  onClick={() => toggleSidebarSubmenu("docs")}
                  className="flex w-full items-center justify-between rounded-xl border border-line bg-panel/70 px-3 py-2 text-sm text-muted transition hover:border-cyan-300/25 hover:text-ink"
                >
                  <span>Documentation</span>
                  <ChevronDown
                    size={14}
                    className={cn(openSidebarSubmenu === "docs" ? "rotate-180" : "", "transition")}
                  />
                </button>
                <div
                  className={cn(
                    "mt-1 space-y-1 pl-3",
                    openSidebarSubmenu === "docs" ? "block" : "hidden",
                  )}
                >
                  <a
                    href={WHITEPAPER_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg px-3 py-2 text-xs text-muted hover:bg-panel-strong hover:text-ink"
                  >
                    Whitepaper
                  </a>
                  <a
                    href={TERMS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg px-3 py-2 text-xs text-muted hover:bg-panel-strong hover:text-ink"
                  >
                    T&amp;Cs
                  </a>
                </div>
              </div>
            </>
          )}
        </nav>

        <div className="mt-5 rounded-2xl border border-line bg-gradient-to-br from-panel-strong to-[#111827] p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">Execution Model</p>
          <p className="mt-2 text-xs text-muted">
            Swap, gasless sponsorship, batching, session keys, and cross-chain route selection are automatically handled behind this interface.
          </p>
        </div>
      </div>
    </aside>
  );
}
