import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "arrow-right"
  | "arrow-up-right"
  | "check"
  | "code"
  | "compass"
  | "github"
  | "layers"
  | "linkedin"
  | "menu"
  | "message"
  | "support"
  | "x";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

const Icon = ({ name, ...props }: IconProps) => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, ReactNode> = {
    "arrow-right": (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    "arrow-up-right": (
      <>
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    code: (
      <>
        <path d="m8 9-3 3 3 3" />
        <path d="m16 9 3 3-3 3" />
        <path d="m14 5-4 14" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </>
    ),
    github: (
      <path d="M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.46.08.63-.2.63-.44v-1.6c-2.56.55-3.1-1.08-3.1-1.08-.42-1.07-1.03-1.35-1.03-1.35-.84-.57.07-.56.07-.56.93.07 1.4.94 1.4.94.82 1.4 2.15 1 2.67.77.08-.6.32-1.02.57-1.26-2.04-.23-4.2-1.03-4.2-4.6 0-1.02.36-1.85.95-2.5-.1-.24-.41-1.18.09-2.46 0 0 .78-.25 2.53.95a8.8 8.8 0 0 1 4.62 0c1.76-1.2 2.54-.95 2.54-.95.5 1.28.18 2.22.09 2.46.6.65.95 1.48.95 2.5 0 3.58-2.16 4.36-4.22 4.59.33.28.62.84.62 1.7v2.45c0 .24.17.53.64.44A9.2 9.2 0 0 0 12 2.8Z" />
    ),
    layers: (
      <>
        <path d="m12 3-9 5 9 5 9-5-9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),
    linkedin: (
      <>
        <path d="M6 9v9" />
        <path d="M6 6.5v.01" />
        <path d="M10 18v-5a4 4 0 0 1 8 0v5" />
        <path d="M10 9v9" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </>
    ),
    support: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" />
        <path d="M12 17h.01" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>
      {paths[name]}
    </svg>
  );
};

export default Icon;
