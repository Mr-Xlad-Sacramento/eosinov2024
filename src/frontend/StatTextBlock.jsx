import React from 'react';
import { motion } from 'framer-motion';

const StatTextBlock = () => {
  return (
    <div className="stat-text-block">
      <div className="row-gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-two">Built with prop-firm discipline and Web3 transparency</h2>
        </motion.div>

        <motion.div
          className="content-paragraph-wrap"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.25 }}
          viewport={{ once: true }}
        >
          <p className="text-color text-large">
            We are building EOSI Finance for serious traders who value structure, risk controls, and clear execution standards.
            Every module is released in stages with a long-term infrastructure mindset.
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default StatTextBlock;
