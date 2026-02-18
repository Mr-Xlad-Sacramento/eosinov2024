export function PageFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#111726] via-[#10141d] to-[#0b0f15] p-5 shadow-[0_22px_55px_rgba(2,6,23,0.4)] md:p-6">
        <div className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-16 h-56 w-56 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="relative z-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">STANDR DEX Workspace</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300 md:text-base">{description}</p>
        </div>
      </header>
      {children}
    </div>
  );
}
