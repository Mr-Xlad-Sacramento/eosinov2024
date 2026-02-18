import React from "react";

const PremiumButton = ({
  as = "button",
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...props
}) => {
  const Component = as;
  const variantClass = `btn-premium--${variant}`;
  const sizeClass = `btn-premium--${size}`;

  return (
    <Component
      href={href}
      className={`btn-premium ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
};

export default PremiumButton;
