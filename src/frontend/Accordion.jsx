import React from 'react';
import AccordionItem from './AccordionItem';

const faqData = [
  {
    question: 'What is EOSI Finance?',
    answer:
      'EOSI Finance is an AI-powered Web3 prop-firm platform in buildout stage. We are designing infrastructure for disciplined crypto execution, trader evaluation, and DeFAI tooling under transparent rollout milestones.',
  },
  {
    question: "How does EOSI Finance's AI-powered trading work?",
    answer:
      'Our AI stack is being developed to support signal interpretation, risk calibration, and execution guidance. During rollout, each module will be released in phases with clear scope and operating limits.',
  },
  {
    question: 'Can I get funded to trade on EOSI Finance?',
    answer:
      'The funded-account path is part of our roadmap. It is currently marked as coming soon while we finalize evaluation logic, risk controls, and onboarding standards.',
  },
  {
    question: 'How do I get started with EOSI Finance?',
    answer:
      'Start by understanding our roadmap and product modules. Then choose your intended path, monitor release updates, and onboard into each phase as features go live.',
  },
  {
    question: 'How secure is EOSI Finance?',
    answer:
      'EOSI Finance is being designed with non-custodial architecture and security-first engineering principles. As with all digital-asset activity, users should apply personal risk controls and review each release before use.',
  },
  {
    question: 'What are the benefits of using decentralized exchanges (DEX) with EOSI Finance?',
    answer:
      'DEX integrations allow transparent, on-chain execution without centralized custody. Our DeFAI roadmap focuses on controlled routing, observable execution quality, and robust operational safeguards.',
  },
];

const Accordion = () => {
  return (
    <div className="accordion-wrapper">
      {faqData.map((faq, index) => (
        <AccordionItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default Accordion;
