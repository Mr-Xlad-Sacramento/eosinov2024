"use client";

import { useState } from "react";

export function RiskDisclosureModal({
  open,
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [accepted, setAccepted] = useState(false);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3">
      <div className="w-full max-w-xl space-y-4 rounded-3xl border border-line bg-gradient-to-br from-[#111729] via-[#11151f] to-[#0d1118] p-6 shadow-[0_20px_50px_rgba(2,6,23,0.4)]">
        <h3 className="text-lg font-semibold">Risk Disclosure</h3>
        <p className="text-sm text-muted">
          AI analysis is informational only. Executions can lose capital. You must explicitly accept
          risk terms before continuing.
        </p>

        <label className="flex items-start gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1"
          />
          <span>
            I understand this is not financial advice and I accept responsibility for any trade
            execution outcomes.
          </span>
        </label>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!accepted || loading}
            onClick={onConfirm}
            className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Accept and Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
