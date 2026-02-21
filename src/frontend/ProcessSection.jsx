import React from 'react';
import { motion } from 'framer-motion';

const ProcessSection = () => {
  return (
    <section className="proecess-section">
      <div className="w-layout-blockcontainer container w-container">
        <div className="process-inner-box">
          <div className="process-section-heading">
            <div className="badge" data-w-id="8fd66346-f683-470d-8b22-c6b385ff3c7f">
              <div className="badge-text">STEPS WE FOLLOW</div>
            </div>
            {/* <motion.h2
              className="heading-two reviews-title-content-heading"
              style={{ opacity: 0 }}
              data-w-id="c726dec5-9118-226e-e163-cff1b955c64d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            > */}

            <motion.h2
              className="heading-two reviews-title-content-heading"
              initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
              whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible when in view
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} // Smooth transition with delay
              viewport={{ once: true }} // Trigger animation only once when it comes into view
            >


              EOSI Finance initial proposed in numbers
            </motion.h2>

          </div>
          

<motion.div
              className="process-graph-block"
              initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
              whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible when in view
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} // Smooth transition with delay
              viewport={{ once: true }} // Trigger animation only once when it comes into view
            >
            <div className="graph-wrapper">
              <div className="process-image-wrapper">
                <img
                  src="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca0671_Group%201000003062%20%282%29.webp"
                  loading="lazy"
                  sizes="100vw"
                  alt=""
                  className="image-5"
                />
              </div>

              {/* Process Steps with Sequential Animation */}
              <motion.div
                className="process-widget process-one"
                data-w-id="693d7a2a-4c4c-8c97-23da-dca50bee706d"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <div>Active Users</div>
                <div className="process-widget-digit">
                  <div>723</div>
                </div>
              </motion.div>

              <motion.div
                className="process-widget process-two"
                data-w-id="2f06c7d7-663a-36d0-5674-ca355e7ac2be"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <div>Active Pro-Traders</div>
                <div className="process-widget-digit">
                  <div>5</div>
                </div>
              </motion.div>

              <motion.div
                className="process-widget process-three"
                data-w-id="07cdb5a0-352d-90f3-5b91-c1e504359781"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
              >
                <div>Total Value Traded</div>
                <div className="process-widget-digit">
                  <div>$2,047,698</div>
                </div>
              </motion.div>

              <motion.div
                className="process-widget process-four"
                data-w-id="315f1979-ae4c-3adf-35ca-75f4fdcf0760"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 3 }}
              >
                <div>Network validated</div>
                <div className="process-widget-digit">
                  <div>4</div>
                </div>
              </motion.div>

              <motion.div
                className="process-widget process-five"
                data-w-id="16a6a1fc-760f-b37b-796a-92e77361c880"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 3.5 }}
              >
                <div>DEX Platforms</div>
                <div className="process-widget-digit">
                  <div>13</div>
                </div>
              </motion.div>
            </div>
            <div className="process-overlay"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
