import React from "react";

const BadgePill = ({ className = "", children }) => {
  return <span className={`badge-pill ${className}`.trim()}>{children}</span>;
};

export default BadgePill;
