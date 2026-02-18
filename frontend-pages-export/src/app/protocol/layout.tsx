import { ProtocolSectionNav } from "@/components/protocol/section-nav";

export default function ProtocolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <ProtocolSectionNav />
      {children}
    </div>
  );
}
