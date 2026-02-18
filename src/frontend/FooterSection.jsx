import React from 'react';
import FooterLinks from './FooterLinks';
import FooterNewsletter from './FooterNewsletter';
import FooterCopyright from './FooterCopyright';
import { PremiumCard, SectionShell } from '../components';

const FooterSection = () => {
  return (
    <SectionShell className="footer-section" tone="muted">
      <div className="w-layout-blockcontainer container w-container">
        <PremiumCard
          className="footer-section-main-content border border-[#24314d] bg-[linear-gradient(135deg,rgba(7,10,18,0.98),rgba(8,15,30,0.96))] p-6 shadow-[0_24px_54px_rgba(2,6,18,0.55)] md:p-8"
          tone="surface-2"
        >
          <div className="footer-top-content flex flex-col gap-10 lg:flex-row lg:justify-between">
            <FooterLinks />
            <FooterNewsletter />
          </div>
          <FooterCopyright />
        </PremiumCard>
      </div>
    </SectionShell>
  );
};

export default FooterSection;
