import React from "react";
import { PremiumButton, PremiumCard, SectionShell } from "../components";

const DefaiSection = () => {
  return (
    <SectionShell tone="elevated" className="py-10">
      <PremiumCard tone="surface-2" className="mx-auto w-full max-w-[1120px] p-6 md:p-10">
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div>
            <p className="badge-pill mb-4">PRODUCT SPOTLIGHT</p>
            <h2 className="mb-3 text-3xl font-semibold md:text-4xl">STANDR DEX: DeFAI Infrastructure</h2>
            <p className="text-secondary">
              STANDR DEX is designed as our DeFAI execution layer, combining decentralized liquidity rails with AI-assisted
              strategy tooling. It is being prepared for staged rollout under rigorous risk controls.
            </p>
            <p className="mt-3 text-sm text-muted">
              Status: <span className="text-primary">Coming soon</span>. Early previews are focused on architecture,
              automation safety, and transparent execution standards.
            </p>
            <div className="mt-5">
              <PremiumButton
                as="a"
                href={`${window.location.origin}/standr`}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="sm"
              >
                Explore STANDR DEX
              </PremiumButton>
            </div>
          </div>

          <div className="surface-1 rounded-premium p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Initial modules</p>
            <ul className="mt-3 space-y-2 text-sm text-secondary">
              <li>AI signal interpretation layer</li>
              <li>Risk-aware DeFi route orchestration</li>
              <li>Transparent execution telemetry</li>
              <li>Governed strategy rollout workflow</li>
            </ul>
          </div>
        </div>
      </PremiumCard>
    </SectionShell>
  );
};

export default DefaiSection;
