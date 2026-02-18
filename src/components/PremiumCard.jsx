import React from "react";

const PremiumCard = ({ tone = "surface-1", className = "", children, ...props }) => {
  const toneClass = `card-premium--${tone}`;

  return (
    <div className={`card-premium ${toneClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export default PremiumCard;
