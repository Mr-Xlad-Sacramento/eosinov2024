import React from 'react';
import { motion } from 'framer-motion';

const reviewsData = [
  {
    name: 'Alexvy',
    role: 'COO Co-Founder',
    imgSrc: '/assets/6726ca0f328abbff95ca0511/funder1.png',
    // imgStyle: {
    //   width: '153px',
    //   height: '143px',
    // },
  },



  {
    name: ' Peter Hamann',
    role: 'CTO/Co-Founder',

    imgSrc: '/assets/6726ca0f328abbff95ca0511/funder2.png',
  },

  {
    name: 'Olick Darren',
    role: 'Quant Trader',
    imgSrc: '/assets/6726ca0f328abbff95ca0511/funder5.png',
  },

  {
    name: 'Web3easter',
    role: 'Smart Contract Developer',
    imgSrc: '/assets/6726ca0f328abbff95ca0511/funder4.png',
  },
  {
    name: 'Veronika',
    role: 'Representatives Co-ordinator',
    imgSrc: '/assets/6726ca0f328abbff95ca0511/funder3.png',
  },
  {
    name: 'tevis',
    role: 'Full-Stack Web Developer',
    imgSrc: ' /assets/6726ca0f328abbff95ca0511/funder6.png',
  },
];

const TeamSection = () => {
  return (

    <section className="reviews-section" style={{ marginTop: '50px' }} id='team'>
      <div className="w-layout-blockcontainer container w-container">
        <div className="review-section-inner">
          <div className="review-section-top-part">


            <div className="review-section-heading">

              <div className="badge">
                <div className="badge-text">EOSI Finance Team</div>
              </div>
              <motion.div
                className=""
                initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
                whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible when in view
                transition={{ duration: 1, ease: 'easeOut' }} // Smooth transition
                viewport={{ once: true }} // Trigger animation only once when it comes into view
              >
                <h2 className="heading-two reviews-title-content-heading">The Team</h2>
              </motion.div>


              <motion.div
                className="text-default reviewx-section-paragraph"
                initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
                whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible when in view
                transition={{ duration: 1, ease: 'easeOut' }} // Smooth transition
                viewport={{ once: true }} // Trigger animation only once when it comes into view
              >
                <p className="text-default reviewx-section-paragraph">
                  EOSI Finance was founded by experienced quant traders, programmers, mathematicians and DeFi lovers with years of experience in decentralised finance, forex, equity, stocks, binary options and the business fields as well.

                  <br />
                  <br />
                  At EOSI Finance, we vouch for honesty, reliability, commitment, flexibility, innovation, diversity and leadership
                </p>
              </motion.div>
            </div>



          </div>
          <div className="reviews-section-card-content" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            {reviewsData.map((review, index) => (
              <div className={`part-${Math.floor(index / 3) + 1}`} key={index} style={{ flex: '0 0 auto' }}>
                <div className="reviews-section-card-one">
                  <motion.div
                    className=""
                    initial={{ opacity: 0, y: 30 }} // Initial state: invisible, slightly below
                    whileInView={{ opacity: 1, y: 0 }} // Animate to fully visible when in view
                    transition={{ duration: 1, ease: 'easeOut' }} // Smooth transition
                    viewport={{ once: true }} // Trigger animation only once when it comes into view
                  >
                    <div className="reviews-section-card-heading">
                      <div className="reviews-card-icon">
                        <img
                          src={review.imgSrc}
                          alt={review.name}
                          loading="lazy"
                          style={{
                            width: '85px',
                            height: '90px',
                            borderRadius: '50%',
                          }}
                        />
                      </div>







                      <div className="review-section-card-heading">
                        <p className="text-small reviews-card-heading">{review.name}</p>
                        <p className="text-small review-card-agency">{review.role}</p>
                      </div>


                    </div>
                  </motion.div>
                  <div className="reviews-section-card-lower-part">
                    {/* <p className="text-small reviews-section-card-paragraph">"{review.review}"</p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
