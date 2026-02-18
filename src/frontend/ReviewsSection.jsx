import React from "react";
import { PremiumCard, SectionShell } from "../components";

const principles = [
  {
    title: "Launch-stage transparency",
    text: "EOSI Finance is in presale-stage buildout. We prioritize clear milestone communication over inflated launch claims.",
  },
  {
    title: "Risk-first architecture",
    text: "Our product direction is structured around controlled deployment, measurable safeguards, and capital protection principles.",
  },
  {
    title: "Web3-native control",
    text: "The platform vision is non-custodial by design, with transparent execution pathways and auditable strategy behavior.",
  },
  {
    title: "AI with operator discipline",
    text: "AI tooling is being built to augment trading decisions, not to replace governance, accountability, and proper risk processes.",
  },
];

const ReviewsSection = () => {
  return (
    <SectionShell className="reviews-section" tone="muted">
      <div className="w-layout-blockcontainer container w-container">
        <div className="review-section-inner">
          <div className="review-section-top-part">
            <div className="review-section-heading">
              <div className="badge">
                <div className="badge-text">OUR COMMITMENT</div>
              </div>
              <h2 className="heading-two reviews-title-content-heading">Designed for credibility from day one</h2>
              <p className="text-default reviewx-section-paragraph">
                As an early-stage AI powered Web3 prop-firm platform, EOSI Finance focuses on architecture quality, risk
                controls, and long-term execution discipline.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {principles.map((item) => (
              <PremiumCard key={item.title} className="p-5 md:p-6" tone="surface-1">
                <p className="text-base font-semibold text-primary">{item.title}</p>
                <p className="mt-2 text-sm text-secondary">{item.text}</p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

export default ReviewsSection;
