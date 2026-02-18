import React from 'react';
import StatCard from './StatCard';
import StatTextBlock from './StatTextBlock';

const statCards = [
  {
    iconSrc: '/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca067d_Group%2034452.svg',
    title: 'AI + Web3',
    statValue: 'Execution stack',
    description:
      "A staged DeFAI architecture focused on signal quality, controlled deployment, and transparent infrastructure growth.",
  },
  {
    iconSrc: '/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca067e_Group%2034452%20%281%29.svg',
    title: 'Prop-firm model',
    statValue: 'Risk-led workflow',
    description:
      "Evaluation and funded-account pathways are being prepared with governance, controls, and launch-stage transparency.",
  },
];

const StatSection = () => {
  return (
    <section className="stat-section">
      <div className="container">
        <div className="stat-content-inner">
          <StatTextBlock />
          <div className="stat-card-block">
            {statCards.map((stat, index) => (
              <StatCard
                key={index}
                iconSrc={stat.iconSrc}
                title={stat.title}
                statValue={stat.statValue}
                description={stat.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatSection;
