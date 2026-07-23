import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
};

const SectionHeading = ({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: SectionHeadingProps) => (
  <div
    className={`section-heading ${align === "center" ? "section-heading--center" : ""}`}
  >
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-copy">{description}</p>}
    </div>
    {action && <div className="section-heading__action">{action}</div>}
  </div>
);

export default SectionHeading;
