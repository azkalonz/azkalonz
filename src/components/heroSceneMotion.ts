export const HERO_SCENE_SCRUB = 0.68;

export type HeroSceneMotionPreset = {
  gridX: readonly [number, number];
  worldX: readonly [number, number];
  darkPaletteAt: number;
};

export type HeroCameraFrame = {
  gridX: number;
  worldX: number;
  navigationBlend: number;
  useDarkPalette: boolean;
};

export const heroSceneMotionPresets = {
  desktop: {
    gridX: [50, -12],
    worldX: [50, -12],
    darkPaletteAt: 0.42,
  },
  compact: {
    gridX: [150, -24],
    worldX: [150, -24],
    darkPaletteAt: 0.34,
  },
} as const satisfies Record<string, HeroSceneMotionPreset>;

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const mix = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

const smoothstep = (progress: number) =>
  progress * progress * (3 - 2 * progress);

export const createHeroCameraFrame = (
  progress: number,
  compact: boolean,
): HeroCameraFrame => {
  const sceneProgress = clamp(progress);
  const motion = compact
    ? heroSceneMotionPresets.compact
    : heroSceneMotionPresets.desktop;
  const revealRange = compact ? 0.7 : 0.62;

  return {
    gridX: mix(motion.gridX[0], motion.gridX[1], sceneProgress),
    worldX: mix(motion.worldX[0], motion.worldX[1], sceneProgress),
    navigationBlend: smoothstep(
      clamp((sceneProgress - 0.03) / (revealRange + 0.08)),
    ),
    useDarkPalette: sceneProgress >= motion.darkPaletteAt,
  };
};

export const getHeroSceneTriggerStart = () =>
  window.innerWidth <= 900 ? "top+=88 top+=68" : "top+=96 top+=76";

export const getHeroSceneTriggerEnd = (stickyStage: HTMLElement | null) => {
  const holdRatio = window.innerWidth <= 900 ? 0.3 : 0.4;
  const stickyHeight = stickyStage?.offsetHeight ?? window.innerHeight;
  const endOffset = Math.max(
    0,
    stickyHeight - window.innerHeight + window.innerHeight * holdRatio,
  );

  return `bottom bottom+=${Math.round(endOffset)}`;
};
