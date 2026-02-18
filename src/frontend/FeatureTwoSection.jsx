import React from "react";
import { motion } from "framer-motion";
import { PremiumButton, SectionShell } from "../components";

const FeatureTwoSection = () => {
  return (
    <SectionShell className="feature-two-section" tone="muted">
      <div className="w-layout-blockcontainer container w-container">
        <div className="featurte-two-section-inner">
          <motion.div
            className="feature-two-section-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="feature-two-section-heading">
              <div className="badge" data-w-id="8fd66346-f683-470d-8b22-c6b385ff3c7f">
                <div className="badge-text">SAFE &amp; SECURE</div>
              </div>
              <h2 className="heading-two reviews-title-content-heading" style={{ opacity: 1 }}>
                Get started in 3 easy steps
              </h2>

              <div className="feature-two-section-heading-paragraph">
                <p className="text-default text-color" style={{ opacity: 1 }}>
                  Your gateway to crypto trading and funding. Whether you are an experienced pro trader or just
                  starting out, EOSI Finance gives you a secure way to scale.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="feature-two-card-row" style={{ opacity: 1 }}>
            <motion.div
              className="feature-card-two"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="feature-card-two">
                <div className="feature-card-two-inner">
                  <div className="row-gap-24">
                    <div className="feature-card-two-title-block">
                      <h3 className="heading-three">1. Identify your goal</h3>
                    </div>
                    <p className="text-color small-text">
                      EOSI Finance offers options tailored to your trading objectives, whether you are focused on
                      growth, steady yield, or balanced risk.
                    </p>
                  </div>
                </div>
                <div>
                  <PremiumButton as="button" type="button" variant="secondary" size="sm">
                    Get Started
                  </PremiumButton>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="feature-card-two is-large">
                <div className="feature-card-two-inner">
                  <img
                    src="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca067a_Map.png"
                    loading="lazy"
                    sizes="(max-width: 479px) 100vw, (max-width: 767px) 90vw, (max-width: 991px) 46vw, (max-width: 1439px) 62vw, 755.3359375px"
                    srcSet="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca067a_Map-p-500.png 500w, /assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca067a_Map-p-800.png 800w, /assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca067a_Map.png 2367w"
                    alt="map"
                    className="feature-card-two-map-image"
                  />

                  <div className="row-gap-24">
                    <div className="feature-card-two-title-block">
                      <h3 className="heading-three">2. Define your execution profile</h3>
                    </div>
                    <p className="text-color small-text">
                      Set your preferred risk parameters, strategy posture, and operating constraints before enabling
                      any trading workflow.
                    </p>
                  </div>

                  <div className="row-gap-24">
                    <div className="feature-card-two-title-block">
                      <h3 className="heading-three">3. Start trading today</h3>
                    </div>
                    <p className="text-color small-text">
                      Choose from vetted pro traders or let EOSI Finance AI align execution with your selected risk profile.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

export default FeatureTwoSection;
