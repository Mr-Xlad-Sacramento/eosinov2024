import React from 'react';
import { motion } from 'framer-motion';
import '../assets/content2.css';

const ContentTwoTextBlock = () => {
  return (
    <motion.div
      className="content-two-text-block"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <div className="content-two-text-block">
        <div className="row-gap-24">
          <div className="badge-wrapper">
            <div className="badge">
              <div className="badge-text">Launch-stage focus</div>
            </div>
          </div>
          <h2 className="heading-two">Built for the next generation of decentralized prop trading</h2>
          <div className="content-paragraph-wrap">
            <p className="text-color">
              EOSI Finance is in active build mode. We are developing AI-guided execution, structured trader evaluation, and
              DeFAI-native infrastructure for sustainable rollout.
            </p>
          </div>
        </div>

        <motion.div
          className="hero-button-group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="content-text-widgets">
            <div className="content-text-widget">
              <div className="text-medium font-weight-700">AI-assisted decision support</div>
              <div className="text-color small-text">
                Strategy tooling is being engineered to improve signal interpretation and risk posture, not to promise outcomes.
              </div>
            </div>
            <div className="content-text-widget">
              <div className="text-medium font-weight-700">Funded pathway in roadmap</div>
              <div className="text-block">
                Trader evaluation and funded accounts are planned modules and will launch after core controls are finalized.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ContentTwoImageBlock = () => {
  return (
    <motion.div
      className="content-two-image-block"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <div className="content-image-gradient-blush">
        <div className="gradient-blush">
          <div className="gradient-blush-orange"></div>
          <div className="gradient-blush-blue"></div>
        </div>
      </div>

      <img
        src="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05ca_content-1-background.webp"
        loading="lazy"
        sizes="(max-width: 479px) 100vw, (max-width: 991px) 320px, (max-width: 1439px) 45vw, 555px"
        srcSet="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05ca_content-1-background-p-500.webp 500w, /assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05ca_content-1-background-p-800.webp 800w, /assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05ca_content-1-background.webp 1110w"
        alt=""
        className="width-full"
      />

      <img
        className="floating-object content-two-object-image"
        src="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05c3_Content%202%20Object.webp"
        alt=""
        style={{ opacity: 1 }}
        sizes="(max-width: 479px) 100vw, (max-width: 991px) 156.796875px, (max-width: 1439px) 23vw, 271.9453125px"
        loading="lazy"
        srcSet="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05c3_Content%25202%2520Object-p-500.webp 500w, /assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05c3_Content%25202%2520Object-p-800.webp 800w, /assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05c3_Content%202%20Object.webp 1056w"
      />

    </motion.div>
  );
};

const ContentTwoSection = () => {
  return (
    <section className="content-two-section" style={{ marginTop: '100px' }}>
      <div className="container">
        <div className="content-two-stack-wrapper">
          <div className="content-two-stack">
            <ContentTwoImageBlock />
            <ContentTwoTextBlock />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentTwoSection;
