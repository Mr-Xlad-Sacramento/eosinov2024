import React from "react";

const SectionShell = ({
  id,
  className = "",
  innerClassName = "",
  tone = "default",
  children,
}) => {
  const toneClass = `section-shell--${tone}`;

  return (
    <section id={id} className={`section-shell ${toneClass} ${className}`.trim()}>
      <div className={`section-shell__inner ${innerClassName}`.trim()}>{children}</div>
    </section>
  );
};

export default SectionShell;
