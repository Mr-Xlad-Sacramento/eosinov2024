import React from "react";
import PremiumButton from "./PremiumButton";

const TopAnnouncementBar = ({
  title,
  subtitle,
  ctaLabel,
  onClick,
  className = "",
}) => {
  return (
    <div className={`top-announcement top-announcement--animated ${className}`.trim()} onClick={onClick}>
      <div className="top-announcement__text">
        <p className="top-announcement__title">{title}</p>
        {subtitle ? <p className="top-announcement__subtitle">{subtitle}</p> : null}
      </div>
      <PremiumButton as="span" variant="brand" size="sm" className="btn-luxury-shimmer">
        {ctaLabel}
      </PremiumButton>
    </div>
  );
};

export default TopAnnouncementBar;
