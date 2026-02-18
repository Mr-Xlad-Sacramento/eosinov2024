export function AnalyzerHero({
  title,
  subtitle,
  disclaimer,
}: {
  title: string;
  subtitle: string;
  disclaimer: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#111729] via-[#11151f] to-[#0d1118] p-6 shadow-[0_20px_50px_rgba(2,6,23,0.4)]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative z-10 space-y-4">
        <h1 className="text-2xl font-semibold text-ink md:text-3xl">{title}</h1>
        <p className="text-sm text-slate-300 md:text-base">{subtitle}</p>
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-xs text-warning">
          {disclaimer}
        </div>
      </div>
    </section>
  );
}
