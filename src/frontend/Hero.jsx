import React from 'react';
import { motion } from 'framer-motion';
import '../assets/hero.css'; // Import the CSS file for styles
import { BadgePill, PremiumButton, SectionShell } from '../components';

const Hero = () => {
  return (
    <SectionShell className="hero-section" id="home" tone="elevated">
      <div className="hero-background-pattern"></div>
      <div className="container">
        <div className="hero-content-stack">
          {/* Hero Text Block */}
          <div className="hero-text-block">
            <div className="hero-title-block">
              {/* Animating the Badge Text */}
              <motion.div
                data-w-id="8fd66346-f683-470d-8b22-c6b385ff3c7f"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <BadgePill>AUTOMATE YOUR CRYPTO TRADING</BadgePill>
              </motion.div>

              {/* Animating the Heading */}
              <motion.h1
                data-w-id="6bbcde17-e16b-1c01-00fb-c36c0bf42f4a"
                className="display-heading"
                initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
                animate={{ opacity: 1, y: 0 }} // Final state: fully visible, at its original position
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} // Smooth transition with slight delay
              >
                Trade with premium AI-powered technology
              </motion.h1>
            </div>

            {/* Description Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
              animate={{ opacity: 1, y: 0 }} // Final state: fully visible, at its original position
              transition={{ duration: 1, ease: 'easeOut', delay: 0.7 }} // Smooth transition with delay
            >
              EOSI Finance is building an AI-powered Web3 prop-firm stack for disciplined execution, trader evaluation, and
              DeFAI-native growth as modules go live.
            </motion.div>

            {/* Hero Button Group */}
            <motion.div
              className="hero-button-group"
              initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
              whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible, original position when in view
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} // Smooth transition
              viewport={{ once: true }} // Trigger animation only once when it comes into view
            >
              <div
                data-w-id="3e99b484-ba4e-25e6-7352-0762e30857a2"
                style={{ opacity: 1 }}
                className="hero-button-wrap"
              >
                <PremiumButton
                  as="a"
                  href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="brand"
                  size="md"
                  className="shadow-[0_14px_32px_rgba(185,119,69,0.4)]"
                >
                  Explore EOSI Finance
                </PremiumButton>

              </div>
              <div
                data-w-id="45dd964c-d2f4-db04-ebe3-e996995539f3"
                style={{ opacity: 1 }}
                className="hero-button-group-text"
              >
                <div className="text-medium">
                  Architecture, token design, and rollout plan.
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Image Block with Framer Motion */}
          <div className="hero-image-block">
            <motion.img
              className="width-full"
              src="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca0674_hero-element.svg"
              alt="Hero"
              style={{
                opacity: 1,
                willChange: 'transform', // This will tell the browser to optimize the image for GPU
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 90, // Complete rotation in 90 seconds (as previously defined)
                ease: 'linear', // Linear transition for consistent speed
                repeat: 0, // No repeating
              }}
              sizes="(max-width: 479px) 100vw, (max-width: 767px) 250px, (max-width: 991px) 350px, (max-width: 1439px) 49vw, 626px"
            />
            <div className="hero-image-gradient-blush">
              <div className="gradient-blush">
                <div className="gradient-blush-orange"></div>
                <div className="gradient-blush-blue"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

export default Hero;
