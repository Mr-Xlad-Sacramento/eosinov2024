import { WiringBinding } from "@/lib/types/domain";

type WiringBadgesProps = {
  binding: WiringBinding | null;
  executionMode: string;
};

function statusTone(status: string): string {
  switch (status) {
    case "verified":
      return "border-emerald-400/40 bg-emerald-500/15 text-emerald-100";
    case "route_present_simulation":
      return "border-amber-400/40 bg-amber-500/15 text-amber-100";
    default:
      return "border-rose-400/40 bg-rose-500/15 text-rose-100";
  }
}

export function WiringBadges({ binding, executionMode }: WiringBadgesProps) {
  if (!binding) {
    return (
      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full border border-line bg-[#0b1018] px-2 py-1 text-muted">
          Mode: {executionMode}
        </span>
        <span className="rounded-full border border-rose-400/40 bg-rose-500/15 px-2 py-1 text-rose-100">
          Wiring: not mapped
        </span>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
      <span className="rounded-full border border-line bg-[#0b1018] px-2 py-1 text-muted">
        Mode: {executionMode}
      </span>
      <span className="rounded-full border border-line bg-[#0b1018] px-2 py-1 text-muted">
        Contract: {binding.contract_name}
      </span>
      <span className="rounded-full border border-line bg-[#0b1018] px-2 py-1 text-muted">
        Fn: {binding.function_signature}
      </span>
      <span
        className={`rounded-full border px-2 py-1 font-semibold ${statusTone(binding.validation.status)}`}
      >
        {binding.validation.status}
      </span>
    </div>
  );
}
