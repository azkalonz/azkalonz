export type HeroBlazeRow = {
  lead: number;
  release: number;
  duration: number;
  catchUp?: number;
};

export type HeroWallShape = {
  startEdge: number;
  endEdge: number;
  breakRange: number;
  rows: readonly HeroBlazeRow[];
};

export type HeroSceneViewport = {
  width: number;
  height: number;
};

export type HeroEmberTone = "wall" | "ash-light" | "ash-mid";

export type HeroAttachedEmber = {
  id: string;
  row: number;
  depthCells: number;
  tipInsetCells?: number;
  sizeCells?: number;
  yOffsetCells?: number;
  from: number;
  to: number;
  tone: Exclude<HeroEmberTone, "wall">;
  desktopOnly?: boolean;
  compactOnly?: boolean;
};

export type HeroWallCutout = {
  id: string;
  row: number;
  depthCells: number;
  from: number;
  to: number;
  desktopOnly?: boolean;
};

export type HeroFlightEmber = {
  id: string;
  row: number;
  launch: number;
  lifetime: number;
  gapCells: number;
  travelCells: number;
  riseCells: -2 | -1 | 0 | 1 | 2;
  tone: HeroEmberTone;
  desktopOnly?: boolean;
};

export type HeroEmberRectFrame = {
  id: string;
  x: number;
  y: number;
  size: number;
  visible: boolean;
};

export type HeroSceneFrame = {
  wallClipPath: string;
  wallClipPathData: string;
  attachedEmbers: readonly HeroEmberRectFrame[];
  flightEmbers: readonly HeroEmberRectFrame[];
  gridX: number;
  worldX: number;
  navigationBlend: number;
  useDarkPalette: boolean;
  foregroundInert: boolean;
};

export const HERO_SCENE_SCRUB = 0.68;

export type HeroSceneMotionPreset = {
  gridX: readonly [number, number];
  worldX: readonly [number, number];
  darkPaletteAt: number;
};

const heroBlazeRows = [
  { lead: 0, release: 0.02, duration: 0.82 },
  { lead: -2, release: 0, duration: 0.86 },
  { lead: 1, release: 0.06, duration: 0.78 },
  { lead: -3, release: 0.03, duration: 0.84 },
  { lead: -1, release: 0.09, duration: 0.82 },
  { lead: 4, release: 0.08, duration: 0.88, catchUp: 0.42 },
  { lead: 5, release: 0.07, duration: 0.89, catchUp: 0.46 },
  { lead: 4, release: 0.09, duration: 0.87, catchUp: 0.42 },
  { lead: 6, release: 0.06, duration: 0.9, catchUp: 0.48 },
  { lead: 5, release: 0.07, duration: 0.89, catchUp: 0.46 },
  { lead: 6, release: 0.06, duration: 0.9, catchUp: 0.48 },
  { lead: 4, release: 0.09, duration: 0.87, catchUp: 0.42 },
  { lead: 5, release: 0.07, duration: 0.89, catchUp: 0.46 },
  { lead: -1, release: 0.08, duration: 0.82 },
  { lead: 1, release: 0.04, duration: 0.82 },
  { lead: -3, release: 0.02, duration: 0.84 },
  { lead: 0, release: 0.06, duration: 0.8 },
  { lead: -2, release: 0, duration: 0.86 },
] as const satisfies readonly HeroBlazeRow[];

export const desktopHeroWallShape: HeroWallShape = {
  startEdge: 81,
  endEdge: -12,
  breakRange: 0.62,
  rows: heroBlazeRows,
};

export const compactHeroWallShape: HeroWallShape = {
  startEdge: 94,
  endEdge: -18,
  breakRange: 0.7,
  rows: heroBlazeRows,
};

export const heroAttachedEmbers = [
  {
    id: "ash-01",
    row: 1,
    depthCells: 2,
    from: 0,
    to: 0.58,
    tone: "ash-light",
  },
  {
    id: "ash-02",
    row: 2,
    depthCells: 4,
    from: 0.16,
    to: 0.72,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-03",
    row: 3,
    depthCells: 1,
    from: 0,
    to: 0.8,
    tone: "ash-light",
  },
  {
    id: "ash-04",
    row: 4,
    depthCells: 3,
    from: 0.08,
    to: 0.7,
    tone: "ash-light",
  },
  {
    id: "ash-05",
    row: 0,
    depthCells: 5,
    from: 0.22,
    to: 0.86,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-06",
    row: 1,
    depthCells: 2,
    from: 0,
    to: 0.64,
    tone: "ash-light",
  },
  {
    id: "ash-07",
    row: 2,
    depthCells: 1,
    from: 0.1,
    to: 0.78,
    tone: "ash-mid",
  },
  {
    id: "ash-08",
    row: 4,
    depthCells: 2,
    from: 0.28,
    to: 0.62,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-09",
    row: 13,
    depthCells: 4,
    from: 0,
    to: 0.54,
    tone: "ash-light",
  },
  {
    id: "ash-10",
    row: 14,
    depthCells: 2,
    from: 0.18,
    to: 0.83,
    tone: "ash-mid",
  },
  {
    id: "ash-11",
    row: 15,
    depthCells: 5,
    from: 0.3,
    to: 0.74,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-12",
    row: 13,
    depthCells: 1,
    from: 0,
    to: 0.68,
    tone: "ash-light",
  },
  {
    id: "ash-13",
    row: 14,
    depthCells: 3,
    from: 0.14,
    to: 0.8,
    tone: "ash-mid",
  },
  {
    id: "ash-14",
    row: 15,
    depthCells: 2,
    from: 0,
    to: 0.52,
    tone: "ash-light",
  },
  {
    id: "ash-15",
    row: 16,
    depthCells: 5,
    from: 0.24,
    to: 0.76,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-16",
    row: 17,
    depthCells: 1,
    from: 0.06,
    to: 0.88,
    tone: "ash-mid",
  },
  {
    id: "ash-middle-start-01",
    row: 5,
    depthCells: 1,
    from: 0,
    to: 0.24,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-middle-start-02",
    row: 6,
    depthCells: 2,
    from: 0,
    to: 0.31,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-middle-start-03",
    row: 7,
    depthCells: 1,
    from: 0,
    to: 0.28,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-middle-start-04",
    row: 8,
    depthCells: 2,
    from: 0,
    to: 0.36,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-middle-start-05",
    row: 9,
    depthCells: 1,
    from: 0,
    to: 0.27,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-middle-start-06",
    row: 10,
    depthCells: 2,
    from: 0,
    to: 0.34,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-middle-start-07",
    row: 11,
    depthCells: 1,
    from: 0,
    to: 0.25,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-middle-start-08",
    row: 12,
    depthCells: 2,
    from: 0,
    to: 0.32,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-middle-01",
    row: 5,
    depthCells: 1,
    from: 0.01,
    to: 0.52,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-middle-02",
    row: 6,
    depthCells: 2,
    from: 0.035,
    to: 0.58,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-middle-03",
    row: 7,
    depthCells: 3,
    from: 0.02,
    to: 0.68,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-middle-04",
    row: 8,
    depthCells: 2,
    from: 0.045,
    to: 0.56,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-middle-05",
    row: 9,
    depthCells: 2,
    from: 0.055,
    to: 0.72,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-middle-06",
    row: 10,
    depthCells: 3,
    from: 0.065,
    to: 0.64,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-middle-07",
    row: 11,
    depthCells: 1,
    from: 0.025,
    to: 0.54,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-middle-08",
    row: 12,
    depthCells: 2,
    from: 0.05,
    to: 0.7,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-middle-09",
    row: 8,
    depthCells: 3,
    from: 0.28,
    to: 0.6,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "ash-middle-10",
    row: 10,
    depthCells: 3,
    from: 0.3,
    to: 0.66,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "ash-compact-middle-start-01",
    row: 5,
    depthCells: 0,
    tipInsetCells: 0,
    sizeCells: 0.75,
    yOffsetCells: 0.125,
    from: 0,
    to: 0.2,
    tone: "ash-mid",
    compactOnly: true,
  },
  {
    id: "ash-compact-middle-start-02",
    row: 7,
    depthCells: 0,
    tipInsetCells: 0.125,
    sizeCells: 0.5,
    yOffsetCells: -0.125,
    from: 0,
    to: 0.27,
    tone: "ash-light",
    compactOnly: true,
  },
  {
    id: "ash-compact-middle-start-03",
    row: 8,
    depthCells: 0,
    tipInsetCells: 0,
    sizeCells: 0.875,
    yOffsetCells: 0.125,
    from: 0,
    to: 0.22,
    tone: "ash-mid",
    compactOnly: true,
  },
  {
    id: "ash-compact-middle-start-04",
    row: 10,
    depthCells: 0,
    tipInsetCells: 0.25,
    sizeCells: 0.625,
    yOffsetCells: -0.125,
    from: 0,
    to: 0.31,
    tone: "ash-light",
    compactOnly: true,
  },
  {
    id: "ash-compact-middle-start-05",
    row: 12,
    depthCells: 0,
    tipInsetCells: 0,
    sizeCells: 0.5,
    yOffsetCells: 0.25,
    from: 0,
    to: 0.25,
    tone: "ash-mid",
    compactOnly: true,
  },
  {
    id: "ash-compact-middle-scroll-01",
    row: 6,
    depthCells: 0,
    tipInsetCells: 0.375,
    sizeCells: 0.5,
    yOffsetCells: 0.25,
    from: 0.08,
    to: 0.34,
    tone: "ash-light",
    compactOnly: true,
  },
  {
    id: "ash-compact-middle-scroll-02",
    row: 9,
    depthCells: 0,
    tipInsetCells: 0,
    sizeCells: 0.75,
    yOffsetCells: -0.125,
    from: 0.14,
    to: 0.42,
    tone: "ash-mid",
    compactOnly: true,
  },
  {
    id: "ash-compact-middle-scroll-03",
    row: 11,
    depthCells: 0,
    tipInsetCells: 0.625,
    sizeCells: 0.5,
    yOffsetCells: 0.125,
    from: 0.22,
    to: 0.48,
    tone: "ash-light",
    compactOnly: true,
  },
] as const satisfies readonly HeroAttachedEmber[];

export const heroWallCutouts = [
  {
    id: "cutout-01",
    row: 0,
    depthCells: 2,
    from: 0.18,
    to: 0.54,
    desktopOnly: true,
  },
  { id: "cutout-02", row: 1, depthCells: 2, from: 0, to: 0.44 },
  { id: "cutout-03", row: 3, depthCells: 1, from: 0.1, to: 0.7 },
  {
    id: "cutout-04",
    row: 4,
    depthCells: 4,
    from: 0.3,
    to: 0.64,
    desktopOnly: true,
  },
  { id: "cutout-05", row: 2, depthCells: 3, from: 0.22, to: 0.66 },
  { id: "cutout-06", row: 13, depthCells: 1, from: 0, to: 0.48 },
  { id: "cutout-07", row: 14, depthCells: 2, from: 0.16, to: 0.62 },
  {
    id: "cutout-08",
    row: 15,
    depthCells: 4,
    from: 0.34,
    to: 0.72,
    desktopOnly: true,
  },
  { id: "cutout-09", row: 16, depthCells: 1, from: 0.06, to: 0.58 },
  { id: "cutout-10", row: 17, depthCells: 3, from: 0.24, to: 0.68 },
  {
    id: "cutout-11",
    row: 15,
    depthCells: 1,
    from: 0.08,
    to: 0.52,
  },
  { id: "cutout-middle-01", row: 5, depthCells: 1, from: 0.025, to: 0.34 },
  { id: "cutout-middle-02", row: 7, depthCells: 1, from: 0.045, to: 0.4 },
  { id: "cutout-middle-03", row: 10, depthCells: 1, from: 0.035, to: 0.38 },
  { id: "cutout-middle-04", row: 12, depthCells: 1, from: 0.055, to: 0.42 },
  { id: "cutout-middle-05", row: 6, depthCells: 2, from: 0.04, to: 0.31 },
  { id: "cutout-middle-06", row: 9, depthCells: 2, from: 0.06, to: 0.36 },
] as const satisfies readonly HeroWallCutout[];

export const heroFlightEmbers = [
  {
    id: "flight-01",
    row: 2,
    launch: 0.03,
    lifetime: 0.27,
    gapCells: 1,
    travelCells: 7,
    riseCells: -1,
    tone: "wall",
  },
  {
    id: "flight-02",
    row: 3,
    launch: 0.07,
    lifetime: 0.29,
    gapCells: 2,
    travelCells: 5,
    riseCells: 0,
    tone: "ash-light",
  },
  {
    id: "flight-03",
    row: 14,
    launch: 0.11,
    lifetime: 0.26,
    gapCells: 1,
    travelCells: 8,
    riseCells: 1,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "flight-04",
    row: 4,
    launch: 0.15,
    lifetime: 0.31,
    gapCells: 1,
    travelCells: 6,
    riseCells: 1,
    tone: "ash-light",
  },
  {
    id: "flight-05",
    row: 13,
    launch: 0.2,
    lifetime: 0.25,
    gapCells: 3,
    travelCells: 4,
    riseCells: 0,
    tone: "wall",
  },
  {
    id: "flight-06",
    row: 16,
    launch: 0.25,
    lifetime: 0.29,
    gapCells: 1,
    travelCells: 7,
    riseCells: -1,
    tone: "ash-light",
  },
  {
    id: "flight-07",
    row: 1,
    launch: 0.3,
    lifetime: 0.24,
    gapCells: 2,
    travelCells: 8,
    riseCells: 1,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "flight-08",
    row: 15,
    launch: 0.34,
    lifetime: 0.31,
    gapCells: 1,
    travelCells: 5,
    riseCells: -1,
    tone: "wall",
  },
  {
    id: "flight-09",
    row: 0,
    launch: 0.39,
    lifetime: 0.27,
    gapCells: 2,
    travelCells: 7,
    riseCells: 0,
    tone: "ash-light",
  },
  {
    id: "flight-10",
    row: 15,
    launch: 0.44,
    lifetime: 0.3,
    gapCells: 1,
    travelCells: 6,
    riseCells: 1,
    tone: "ash-mid",
    desktopOnly: true,
  },
  {
    id: "flight-11",
    row: 3,
    launch: 0.49,
    lifetime: 0.25,
    gapCells: 1,
    travelCells: 9,
    riseCells: -1,
    tone: "wall",
  },
  {
    id: "flight-12",
    row: 14,
    launch: 0.54,
    lifetime: 0.29,
    gapCells: 2,
    travelCells: 5,
    riseCells: 0,
    tone: "ash-light",
  },
  {
    id: "flight-13",
    row: 17,
    launch: 0.59,
    lifetime: 0.26,
    gapCells: 1,
    travelCells: 7,
    riseCells: -1,
    tone: "ash-mid",
  },
  {
    id: "flight-14",
    row: 4,
    launch: 0.64,
    lifetime: 0.3,
    gapCells: 2,
    travelCells: 6,
    riseCells: 1,
    tone: "ash-light",
    desktopOnly: true,
  },
  {
    id: "flight-15",
    row: 13,
    launch: 0.7,
    lifetime: 0.25,
    gapCells: 1,
    travelCells: 5,
    riseCells: 0,
    tone: "wall",
  },
  {
    id: "flight-16",
    row: 16,
    launch: 0.76,
    lifetime: 0.22,
    gapCells: 2,
    travelCells: 7,
    riseCells: -1,
    tone: "ash-mid",
    desktopOnly: true,
  },
] as const satisfies readonly HeroFlightEmber[];

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

type HeroWallRowFrame = {
  edge: number;
  top: number;
  bottom: number;
};

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const mix = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

const smoothstep = (progress: number) =>
  progress * progress * (3 - 2 * progress);

const formatPercent = (value: number) =>
  `${Number.isFinite(value) ? value.toFixed(2) : "0"}%`;

const formatUnit = (value: number) =>
  Number.isFinite(value) ? value.toFixed(5) : "0";

const createWallRowFrame = (
  row: HeroBlazeRow,
  index: number,
  wallProgress: number,
  rowHeight: number,
  squareWidth: number,
  shape: HeroWallShape,
): HeroWallRowFrame => {
  const localProgress = clamp((wallProgress - row.release) / row.duration);
  const baseEdge = shape.startEdge;
  const startEdge = baseEdge + row.lead * squareWidth;
  const catchUpCells = row.catchUp
    ? Math.min(
        Math.max(0, row.lead),
        wallProgress > 0
          ? Math.ceil(clamp(wallProgress / row.catchUp) * Math.max(0, row.lead))
          : 0,
      )
    : 0;
  const travelOrigin = row.catchUp ? baseEdge : startEdge;
  const travelCells = Math.ceil(
    Math.max(0, travelOrigin - shape.endEdge) / squareWidth,
  );
  const releasedCells = Math.floor(localProgress * travelCells);

  return {
    edge:
      localProgress >= 1
        ? shape.endEdge
        : Math.max(
            shape.endEdge,
            startEdge - (catchUpCells + releasedCells) * squareWidth,
          ),
    top: index * rowHeight,
    bottom: (index + 1) * rowHeight,
  };
};

const isActive = (
  item: {
    from: number;
    to: number;
    desktopOnly?: boolean;
    compactOnly?: boolean;
  },
  wallProgress: number,
  compact: boolean,
) =>
  (!compact || !item.desktopOnly) &&
  (compact || !item.compactOnly) &&
  wallProgress >= item.from &&
  wallProgress < item.to;

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

export const createHeroSceneFrame = (
  progress: number,
  compact: boolean,
  viewport: HeroSceneViewport = { width: 1000, height: 1000 },
  shape: HeroWallShape = compact ? compactHeroWallShape : desktopHeroWallShape,
  motion: HeroSceneMotionPreset = compact
    ? heroSceneMotionPresets.compact
    : heroSceneMotionPresets.desktop,
): HeroSceneFrame => {
  const sceneProgress = clamp(progress);
  const wallProgress = clamp(sceneProgress / shape.breakRange);
  const viewportWidth = Math.max(1, viewport.width);
  const viewportHeight = Math.max(1, viewport.height);
  const rowHeight = 100 / shape.rows.length;
  const squareSize = viewportHeight / shape.rows.length;
  const squareWidth = (squareSize / viewportWidth) * 100;
  const rowFrames = shape.rows.map((row, index) =>
    createWallRowFrame(row, index, wallProgress, rowHeight, squareWidth, shape),
  );
  const polygonPoints = rowFrames.flatMap(({ edge, top, bottom }) => [
    `${formatPercent(edge)} ${formatPercent(top)}`,
    `${formatPercent(edge)} ${formatPercent(bottom)}`,
  ]);
  const outlinePath = [
    "M 0 0",
    ...rowFrames.flatMap(({ edge, top, bottom }) => [
      `L ${formatUnit(edge / 100)} ${formatUnit(top / 100)}`,
      `L ${formatUnit(edge / 100)} ${formatUnit(bottom / 100)}`,
    ]),
    "L 0 1 Z",
  ];
  const cutoutPaths = heroWallCutouts.flatMap((cutout) => {
    if (!isActive(cutout, wallProgress, compact)) return [];

    const rowFrame = rowFrames[cutout.row];
    if (!rowFrame) return [];

    const rawLeft = rowFrame.edge - cutout.depthCells * squareWidth;
    const left = clamp(rawLeft, 0, 100);
    const right = clamp(rawLeft + squareWidth, 0, 100);
    if (right - left <= 0.001) return [];

    return [
      `M ${formatUnit(left / 100)} ${formatUnit(rowFrame.top / 100)}`,
      `H ${formatUnit(right / 100)}`,
      `V ${formatUnit(rowFrame.bottom / 100)}`,
      `H ${formatUnit(left / 100)} Z`,
    ];
  });
  const attachedEmbers = heroAttachedEmbers.map((ember) => {
    const rowFrame = rowFrames[ember.row];
    const compactOnly = "compactOnly" in ember && Boolean(ember.compactOnly);
    const tipInsetCells = "tipInsetCells" in ember ? ember.tipInsetCells : 0;
    const sizeCells = "sizeCells" in ember ? ember.sizeCells : 1;
    const emberSize = squareSize * sizeCells;
    const emberWidth = squareWidth * sizeCells;
    const yOffsetCells = "yOffsetCells" in ember ? ember.yOffsetCells : 0;
    const xPercent = rowFrame
      ? compactOnly
        ? Math.min(rowFrame.edge, 100) -
          (tipInsetCells + sizeCells) * squareWidth
        : rowFrame.edge - ember.depthCells * squareWidth
      : -emberWidth;

    return {
      id: ember.id,
      x: (xPercent / 100) * viewportWidth,
      y:
        ((rowFrame?.top ?? -rowHeight) / 100) * viewportHeight +
        yOffsetCells * squareSize,
      size: emberSize,
      visible:
        Boolean(rowFrame) &&
        isActive(ember, wallProgress, compact) &&
        xPercent < 100 &&
        xPercent + emberWidth > 0,
    };
  });
  const flightEmbers = heroFlightEmbers.map((ember) => {
    const desktopOnly = "desktopOnly" in ember && Boolean(ember.desktopOnly);
    const isSupported = !compact || !desktopOnly;
    const flightProgress = (wallProgress - ember.launch) / ember.lifetime;
    const isFlying = isSupported && flightProgress >= 0 && flightProgress < 1;
    const boundedFlightProgress = clamp(flightProgress);
    const travelCells = compact
      ? Math.min(ember.travelCells, 5)
      : ember.travelCells;
    const travelStep = Math.min(
      travelCells,
      Math.floor(boundedFlightProgress * (travelCells + 1)),
    );
    const row = shape.rows[ember.row];
    const birthFrame = row
      ? createWallRowFrame(
          row,
          ember.row,
          ember.launch,
          rowHeight,
          squareWidth,
          shape,
        )
      : undefined;
    const riseMagnitude = Math.abs(ember.riseCells);
    const riseStep = riseMagnitude
      ? Math.sign(ember.riseCells) *
        Math.min(
          riseMagnitude,
          Math.floor(boundedFlightProgress * (riseMagnitude + 1)),
        )
      : 0;
    const flightRow = clamp(ember.row + riseStep, 0, shape.rows.length - 1);
    const xPercent = birthFrame
      ? birthFrame.edge + (ember.gapCells + travelStep) * squareWidth
      : 101;

    return {
      id: ember.id,
      x: (xPercent / 100) * viewportWidth,
      y: flightRow * squareSize,
      size: squareSize,
      visible:
        isFlying &&
        Boolean(birthFrame) &&
        xPercent < 100 + squareWidth &&
        xPercent + squareWidth > 0,
    };
  });

  return {
    wallClipPath: `polygon(0% 0%, ${polygonPoints.join(", ")}, 0% 100%)`,
    wallClipPathData: [...outlinePath, ...cutoutPaths].join(" "),
    attachedEmbers,
    flightEmbers,
    gridX: mix(motion.gridX[0], motion.gridX[1], sceneProgress),
    worldX: mix(motion.worldX[0], motion.worldX[1], sceneProgress),
    navigationBlend: smoothstep(
      clamp((sceneProgress - 0.03) / (shape.breakRange + 0.08)),
    ),
    useDarkPalette: sceneProgress >= motion.darkPaletteAt,
    foregroundInert: wallProgress >= 0.995,
  };
};
