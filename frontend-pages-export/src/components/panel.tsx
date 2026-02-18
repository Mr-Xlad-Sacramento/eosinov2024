"use client";

export function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="panel-hover relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141c] to-[#0d1017] p-5 shadow-[0_16px_40px_rgba(2,6,23,0.34)]">
      <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-cyan-500/8 blur-3xl" />
      <div className="relative z-10">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
        <div className="mt-4">{children}</div>
      </div>
    </article>
  );
}
