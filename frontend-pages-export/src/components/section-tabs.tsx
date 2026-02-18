"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type SectionTabItem = {
  href: string;
  label: string;
};

export function SectionTabs({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: SectionTabItem[];
}) {
  const pathname = usePathname();

  function isActiveTab(href: string): boolean {
    if (pathname === href) {
      return true;
    }

    if (!pathname.startsWith(`${href}/`)) {
      return false;
    }

    // Prefer the most specific matching tab for nested routes.
    const hasMoreSpecificMatch = items.some(
      (item) =>
        item.href !== href &&
        item.href.length > href.length &&
        (pathname === item.href || pathname.startsWith(`${item.href}/`)),
    );

    return !hasMoreSpecificMatch;
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#0f1421] via-[#0f131b] to-[#0b0f15] p-4 shadow-[0_18px_45px_rgba(2,6,23,0.42)]">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative z-10 space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300">{title}</p>
          <p className="mt-1 text-xs text-muted">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const active = isActiveTab(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? "border-cyan-400/45 bg-cyan-500/15 text-cyan-100"
                    : "border-line bg-panel/80 text-muted hover:border-cyan-300/30 hover:text-cyan-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
