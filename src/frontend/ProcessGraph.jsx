import React from 'react';
import ProcessWidget from './ProcessWidget';

const ProcessGraph = () => {
  return (
    <div data-w-id="fe6edc6e-4c13-e13f-49e1-d0a6fd1f36a8" className="process-graph-block">
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
        <ProcessWidget title="Secure keys generated" step={1} />
        <ProcessWidget title="Data encrypted" step={2} />
        <ProcessWidget title="All Blocks linked" step={3} />
        <ProcessWidget title="Network validated" step={4} />
        <ProcessWidget title="Transactions recorded" step={5} />
      </div>
      <div className="process-overlay"></div>
    </div>
  );
};

export default ProcessGraph;
