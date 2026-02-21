import { motion } from "framer-motion";
import React from "react";
import { PremiumCard, SectionShell } from "../components";

const featureCards = [
  {
    icon: "/icons/ai-intel.svg",
    title: "AI-assisted trader intelligence",
    description:
      "Strategy discovery and signal evaluation are designed to support disciplined prop-firm style decision-making.",
    status: "Status: Building",
  },
  {
    icon: "/icons/defi-rails.svg",
    title: "Decentralized execution rails",
    description:
      "Execution paths are being engineered for transparency, non-custodial control, and measurable performance controls.",
    status: "Status: In architecture",
  },
  {
    icon: "/icons/risk-copy.svg",
    title: "Risk-governed copy framework",
    description:
      "Copy allocation logic will focus on guardrails first, helping users align strategy selection with defined risk appetite.",
    status: "Status: Coming soon",
  },
  {
    icon: "/icons/prop-growth.svg",
    title: "Prop-firm growth infrastructure",
    description:
      "EOSI Finance is building a platform where AI, Web3, and professional trading workflows can scale together over time.",
    status: "Status: In development",
  },
];

const FeatureSection = () => {
  return (
    <SectionShell className="feature-section">
      <div className="container">
        <div className="feature-section-heading">
          <motion.div
            className="heading-two"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          >
            <h1 className="heading-two">Built for the first AI-powered Web3 prop firm era</h1>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        >
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {featureCards.map((card) => (
              <PremiumCard key={card.title} className="p-5 md:p-6" tone="surface-1">
                <div className="mb-4 flex items-center gap-3">
                  <img loading="lazy" src={card.icon} alt="" className="h-[50px] w-[50px] rounded-xl object-cover" />
                  <p className="text-sm text-muted">{card.status}</p>
                </div>
                <div>
                  <p className="text-lg font-medium text-primary">{card.title}</p>
                  <p className="mt-2 text-sm text-secondary">{card.description}</p>
                </div>
              </PremiumCard>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
};

export default FeatureSection;
