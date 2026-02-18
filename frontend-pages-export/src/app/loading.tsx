export default function GlobalLoading() {
  return (
    <div className="mx-auto max-w-[1500px] px-3 pb-8 pt-24 md:px-6 md:pt-32">
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl border border-line bg-panel" />
        <div className="h-64 animate-pulse rounded-2xl border border-line bg-panel" />
      </div>
    </div>
  );
}
