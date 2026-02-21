import React from 'react';
import { motion } from 'framer-motion';
import '../assets/content.css'; // Import the CSS file for styles

// Content Image Block with Motion
const ContentImageBlock = () => {
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
        src="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05c7_3d-render-of-black-symetrical-shard-render%201.webp"
        alt=""
        style={{ opacity: 1 }}
        sizes="(max-width: 479px) 100vw, (max-width: 991px) 179.1953125px, (max-width: 1439px) 25vw, 310.796875px"
        loading="lazy"
        srcSet="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05c7_3d-render-of-black-symetrical-shard-render%25201-p-500.webp 500w, /assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05c7_3d-render-of-black-symetrical-shard-render%25201-p-800.webp 800w, /assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05c7_3d-render-of-black-symetrical-shard-render%25201-p-1080.webp 1080w, /assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca05c7_3d-render-of-black-symetrical-shard-render%201.webp 1496w"
      />
    </motion.div>
  );
};



// Content Text Block with Motion
const ContentTextBlock = () => {
  return (
    <motion.div
      className="content-text-block"
      initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
      whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible when in view
      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} // Smooth transition with delay
      viewport={{ once: true }} // Trigger animation only once when it comes into view
    >
      <div className="row-gap-24">
        <div className="badge-wrapper">
          <div className="badge">
            <div className="badge-text">SAFE &amp; SECURE</div>
          </div>
        </div>
        <h2 className="heading-two">Your funds and properties are safe.</h2>
        <div className="content-paragraph-wrap">
          <p className="text-color">
            Your funds lie safely on-chain for maximum interoperability. EOSI Finance will never touch them directly or indirectly.
          </p>
        </div>
      </div>


      <div className="content-text-widgets">


        <motion.div
          className="hero-button-group"
          initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
          whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible, original position when in view
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} // Smooth transition
          viewport={{ once: true }} // Trigger animation only once when it comes into view
        >
          <div className="content-text-widget">
            <div className="text-medium font-weight-700">Cloud-Based</div>
            <div className="text-block-4">
              Our AI-powered algorithms and smart contracts run reliably 24/7 and never miss a trade once placed by our pro-traders. EOSI Finance eliminates the need to trade by yourself, whether you are an experienced trader or not.
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-button-group"
          initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
          whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible, original position when in view
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} // Smooth transition
          viewport={{ once: true }} // Trigger animation only once when it comes into view
        >

          <div className="content-text-widget">
            <div className="text-medium font-weight-700">Military-grade encryption</div>
            <div className="text-color small-text">
              All the trades on our platform are encrypted as they are on-chain and interact with a public-private smart contract. So no possibility of any bot frontrunning any of our trades.
            </div>
          </div>
        </motion.div>
      </div>


    </motion.div>
  );
};

// Content Section Component with Animations
const ContentSection = () => {
  return (
    <motion.section
      className="content-section"
      initial={{ opacity: 0 }} // Initial state: invisible
      whileInView={{ opacity: 1 }} // Animate to fully visible when in view
      transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }} // Smooth transition with delay
      viewport={{ once: true }} // Trigger animation only once when it comes into view
    >
      <div className="container">
        <div className="content-stack-wrapper">
          <div className="content-stack">
            <ContentImageBlock />
            <ContentTextBlock />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContentSection;
