import { AnalyzerReportPayload } from "@/lib/types/domain";

export function ModelConsensusPanel({ report }: { report: AnalyzerReportPayload }) {
  return (
    <section className="space-y-4 rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.34)]">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold">Model Consensus</h2>
        <p className="text-sm text-muted">
          Recommendation: <span className="font-semibold text-ink">{report.recommendation}</span>
          {" | "}Confidence: {report.confidence.toFixed(1)}%
          {" | "}Risk: {report.risk_level}
        </p>
      </header>

      <div className="space-y-3">
        {report.models.map((model) => (
          <article key={model.provider} className="rounded-2xl border border-line bg-[#0b1018] px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink">
                {model.provider}
              </h3>
              <span
                className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.1em] ${
                  model.success
                    ? "border-cyan-400/35 bg-cyan-500/12 text-cyan-200"
                    : "border-warning/35 bg-warning/10 text-warning"
                }`}
              >
                {model.success ? "success" : "unavailable"}
              </span>
            </div>

            {model.output ? (
              <div className="mt-2 space-y-1 text-sm text-muted">
                <p>
                  {model.output.recommendation} ({model.output.confidence.toFixed(1)}%)
                </p>
                <p>{model.output.summary}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-warning">{model.error ?? "Provider unavailable"}</p>
            )}
          </article>
        ))}
      </div>

      {report.warnings.length > 0 ? (
        <div className="rounded-xl border border-warning/35 bg-warning/10 px-4 py-3 text-sm text-warning">
          <p className="font-semibold">Warnings</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {report.warnings.map((warning, index) => (
              <li key={`${warning}-${index}`}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
