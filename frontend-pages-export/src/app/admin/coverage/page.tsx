import path from "node:path";
import { readdirSync } from "node:fs";
import Link from "next/link";

import { PageFrame } from "@/components/page-frame";

type CoverageStatus = "Available" | "Partial" | "Missing" | "Internal";

type ModuleCoverage = {
  module: string;
  status: CoverageStatus;
  frontendEntry: string | null;
  notes: string;
};

const COVERAGE_MAP: Record<string, Omit<ModuleCoverage, "module">> = {
  account: {
    status: "Partial",
    frontendEntry: "/protocol/accounts",
    notes: "Tier, policy, and user intent history are user-facing; execution internals are hidden behind backend orchestration.",
  },
  adapters: {
    status: "Internal",
    frontendEntry: null,
    notes: "Protocol adapter contracts are backend/infra internals.",
  },
  arbitrage: {
    status: "Partial",
    frontendEntry: "/protocol/arbitrage",
    notes: "Arbitrage pool join/exit is exposed through backend-managed APIs in this phase.",
  },
  automation: {
    status: "Partial",
    frontendEntry: "/admin/monitoring",
    notes: "Automation job visibility is admin-only; keeper internals remain backend-managed.",
  },
  bonding: {
    status: "Partial",
    frontendEntry: "/protocol/bonding",
    notes: "Bond market browsing and bond position creation are exposed via backend APIs.",
  },
  bridges: {
    status: "Available",
    frontendEntry: "/admin/monitoring",
    notes: "Bridge route and settlement telemetry are exposed in admin monitoring; user routing remains internal.",
  },
  core: {
    status: "Partial",
    frontendEntry: "/trade/spot",
    notes: "Core trading/intents are surfaced, but many advanced core modules are not yet surfaced.",
  },
  gamification: {
    status: "Available",
    frontendEntry: "/community/gamification",
    notes: "Profile and achievements are available via community pages.",
  },
  governance: {
    status: "Available",
    frontendEntry: "/governance",
    notes: "Proposal listing, creation, voting, and treasury queue are surfaced.",
  },
  hooks: {
    status: "Partial",
    frontendEntry: "/admin/monitoring",
    notes: "Hook registry state is visible from admin monitoring; direct user controls are hidden.",
  },
  interfaces: {
    status: "Internal",
    frontendEntry: null,
    notes: "Interface definitions are internal.",
  },
  libraries: {
    status: "Internal",
    frontendEntry: null,
    notes: "Library contracts are implementation internals.",
  },
  liquidity: {
    status: "Available",
    frontendEntry: "/liquidity/pools",
    notes: "Pool listing/create/add/remove/transfer is available, and LP profile controls are exposed at /protocol/lp-profiles.",
  },
  mocks: {
    status: "Internal",
    frontendEntry: null,
    notes: "Mocks are test-only.",
  },
  options: {
    status: "Available",
    frontendEntry: "/trade/options",
    notes: "Series, quote, open/close/exercise flows are surfaced.",
  },
  oracles: {
    status: "Partial",
    frontendEntry: "/admin/monitoring",
    notes: "Oracle health visibility exists in admin monitoring; full oracle management is not exposed.",
  },
  "percolator-integration": {
    status: "Partial",
    frontendEntry: "/protocol/pol-vault",
    notes: "POL vault and LP-related flows are partially exposed; deeper module coverage remains to be wired.",
  },
  perps: {
    status: "Available",
    frontendEntry: "/trade/perps",
    notes: "Open/close position and liquidation estimate are available.",
  },
  registry: {
    status: "Missing",
    frontendEntry: null,
    notes: "Adapter registry management is not yet exposed in UI.",
  },
  rental: {
    status: "Partial",
    frontendEntry: "/protocol/rental",
    notes: "Liquidity rental offers, rent, and return flows are exposed in backend-managed mode.",
  },
  rewards: {
    status: "Missing",
    frontendEntry: null,
    notes: "Reward distributor-specific controls are not yet exposed.",
  },
  risk: {
    status: "Partial",
    frontendEntry: "/protocol/accounts",
    notes: "User policy settings and risk-facing controls are visible; advanced operator controls are admin/internal.",
  },
  security: {
    status: "Partial",
    frontendEntry: "/admin/emergency",
    notes: "Emergency visibility exists; operational security controls remain admin/internal.",
  },
  staking: {
    status: "Missing",
    frontendEntry: null,
    notes: "Staking contract flows are not exposed.",
  },
  trading: {
    status: "Partial",
    frontendEntry: "/trade/spot",
    notes: "Spot/limit/dca/multi/intent are exposed, but all trading modules are not wired.",
  },
  vaults: {
    status: "Available",
    frontendEntry: "/vaults",
    notes: "Vault overview with inline deposit/withdraw flows is available.",
  },
  verifier: {
    status: "Missing",
    frontendEntry: null,
    notes: "Verifier management is not surfaced.",
  },
  zk: {
    status: "Missing",
    frontendEntry: null,
    notes: "ZK proof gating and verifier operations are not exposed in frontend.",
  },
};

function getCoverageRows(): ModuleCoverage[] {
  const contractsRoot = path.resolve(process.cwd(), "..", "contracts");
  let discovered: string[];
  try {
    discovered = readdirSync(contractsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
  } catch {
    discovered = Object.keys(COVERAGE_MAP).sort((left, right) => left.localeCompare(right));
  }

  return discovered.map((moduleName) => ({
    module: moduleName,
    status: COVERAGE_MAP[moduleName]?.status ?? "Missing",
    frontendEntry: COVERAGE_MAP[moduleName]?.frontendEntry ?? null,
    notes:
      COVERAGE_MAP[moduleName]?.notes ??
      "No frontend mapping recorded yet for this contract module.",
  }));
}

function badgeClass(status: CoverageStatus): string {
  if (status === "Available") {
    return "border-success/35 bg-success/10 text-success";
  }
  if (status === "Partial") {
    return "border-warning/35 bg-warning/10 text-warning";
  }
  if (status === "Internal") {
    return "border-line bg-panel-strong text-muted";
  }
  return "border-danger/35 bg-danger/10 text-danger";
}

export default function ContractCoveragePage() {
  const rows = getCoverageRows();
  const total = rows.length;
  const available = rows.filter((row) => row.status === "Available").length;
  const partial = rows.filter((row) => row.status === "Partial").length;
  const missing = rows.filter((row) => row.status === "Missing").length;

  return (
    <PageFrame
      title="Contract Coverage"
      description="Admin view of smart-contract module coverage mapped to frontend/operator access points."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-line bg-panel p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Modules</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{total}</p>
        </article>
        <article className="rounded-2xl border border-success/35 bg-success/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-success">Available</p>
          <p className="mt-2 text-2xl font-semibold text-success">{available}</p>
        </article>
        <article className="rounded-2xl border border-warning/35 bg-warning/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-warning">Partial</p>
          <p className="mt-2 text-2xl font-semibold text-warning">{partial}</p>
        </article>
        <article className="rounded-2xl border border-danger/35 bg-danger/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-danger">Missing</p>
          <p className="mt-2 text-2xl font-semibold text-danger">{missing}</p>
        </article>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-line bg-panel">
        <table className="min-w-full text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-3 py-3">Module</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Frontend Entry</th>
              <th className="px-3 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.module} className="border-b border-line/60 align-top last:border-b-0">
                <td className="px-3 py-3 font-semibold text-ink">{row.module}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full border px-2 py-1 text-xs ${badgeClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {row.frontendEntry ? (
                    <Link
                      href={row.frontendEntry}
                      className="rounded-lg border border-line bg-panel-strong px-2 py-1 text-xs font-semibold text-ink"
                    >
                      {row.frontendEntry}
                    </Link>
                  ) : (
                    <span className="text-xs text-muted">None</span>
                  )}
                </td>
                <td className="px-3 py-3 text-muted">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </PageFrame>
  );
}
