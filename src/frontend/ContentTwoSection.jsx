import React from 'react';
import { motion } from 'framer-motion';
import '../assets/content2.css'; // Import the CSS file for styles

const ContentTwoTextBlock = () => {
  return (

    <motion.div
      className="content-two-text-block"
      initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
      whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible when in view
      transition={{ duration: 1, ease: 'easeOut' }} // Smooth transition
      viewport={{ once: true }} // Trigger animation only once when it comes into view
    >





      <div className="content-two-text-block">
        <div className="row-gap-24">
          <div className="badge-wrapper">
            <div className="badge">
              <div className="badge-text">Becoming an EOSI Finance User</div>
            </div>
          </div>
          <h2 className="heading-two">
            Your Gateway to Crypto Trading and Funding
          </h2>
          <div className="content-paragraph-wrap">
            <p className="text-color">
              Are you ready to explore the exciting world of crypto trading? Look no further than EOSI Finance, a platform that combines simplicity, security, decentralization and innovation. Here's what makes EOSI Finance stand out:
            </p>
          </div>
        </div>

        <motion.div
          className="hero-button-group"
          initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
          whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible, original position when in view
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} // Smooth transition
          viewport={{ once: true }} // Trigger animation only once when it comes into view
        >
          <div className="content-text-widgets">
            <div className="content-text-widget">
              <div className="text-medium font-weight-700">EOSI Finance revolutionizes proprietary trading</div>
              <div className="text-color small-text">
                Through democratizing access via AI and ML technologies, enabling prospective pro-traders to participate and get funded without traditional barriers.
              </div>
            </div>
            <div className="content-text-widget">
              <div className="text-medium font-weight-700">EOSI Finance enables easy entry </div>
              <div className="text-block">
                EOSI Finance enables easy entry into the crypto space for beginners by utilizing decentralized exchange (DEX) protocols, ensuring confident engagement.
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
      className="content-image-block"
      initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
      whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible when in view
      transition={{ duration: 1, ease: 'easeOut' }} // Smooth transition
      viewport={{ once: true }} // Trigger animation only once when it comes into view
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
        className="floating-object content-object-image"
        src="/assets/6726ca0f328abbff95ca0511/section7-right.png"
        alt=""
        style={{ opacity: 1 }}
        sizes="(max-width: 479px) 100vw, (max-width: 991px) 179.1953125px, (max-width: 1439px) 25vw, 310.796875px"
        loading="lazy"
        srcSet="/assets/6726ca0f328abbff95ca0511/section7-right.png 500w, /assets/6726ca0f328abbff95ca0511/section7-right.png 800w, /assets/6726ca0f328abbff95ca0511/section7-right.png 1080w, /assets/6726ca0f328abbff95ca0511/section7-right.png 1496w"
      />
    </motion.div>
  );
};

const ContentTwoSection = () => {
  return (
    <section className="content-two-section">
      <div className="container">
        <div className="content-two-stack-wrapper">
          <div className="content-two-stack">
            <ContentTwoTextBlock />
            <ContentTwoImageBlock />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentTwoSection;
