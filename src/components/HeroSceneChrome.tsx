import { useId, type CSSProperties } from "react";

export type HeroSceneId = "app" | "workflow" | "ai";

export const HeroSceneBar = ({ scene }: { scene: HeroSceneId }) => (
  <div className="hero-system-screen__bar">
    <span className="hero-system-screen__bar-copy hero-system-screen__bar-copy--title">
      {scene === "workflow" ? (
        <span className="hero-system-screen__bar-title" data-hero-bar-workflow>
          <strong>Shopify fulfilment automation</strong>
          <span>Live workflow</span>
        </span>
      ) : null}
      {scene === "app" ? (
        <span
          className="hero-system-screen__bar-title hero-system-screen__bar-title--responsive"
          data-hero-bar-responsive
        >
          <strong>Order operations app</strong>
          <span>Web + mobile development</span>
        </span>
      ) : null}
      {scene === "ai" ? (
        <span
          className="hero-system-screen__bar-title hero-system-screen__bar-title--ai"
          data-hero-bar-ai
        >
          <strong>AI-assisted workflow review</strong>
          <span>Illustrative workflow data</span>
        </span>
      ) : null}
    </span>
  </div>
);

type HeroSceneGridProps = Pick<CSSProperties, "width" | "height">;

export const HeroSceneGrid = ({
  width = "100%",
  height = "100%",
}: HeroSceneGridProps = {}) => {
  const patternId = `hero-scene-grid-${useId().replaceAll(":", "")}`;

  return (
    <svg
      className="hero-system-screen__base-grid"
      width="100%"
      height="100%"
      style={{ width, height }}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path d="M16 0V32M0 16H32" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};
