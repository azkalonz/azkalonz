export const heroTileOrderNames = [
  "right-to-left",
  "radial-left",
  "ledger-diagonal",
  "hub-pulse",
  "split-handoff",
  "line-scan",
  "validation-check",
  "alternating-routes",
  "signal-wave",
  "cross-aperture",
  "packet-dissolve",
] as const;

export const heroTileEffectNames = [
  "shrink",
  "diagonal-drift",
  "hub-pulse",
  "split-handoff",
  "line-scan",
  "validation-check",
  "alternating-routes",
  "signal-wave",
  "cross-aperture",
  "packet-dissolve",
] as const;

export const heroTileEasingNames = ["in-out", "out"] as const;

export type HeroTileOrder = (typeof heroTileOrderNames)[number];
export type HeroTileEffect = (typeof heroTileEffectNames)[number];
export type HeroTileEasing = (typeof heroTileEasingNames)[number];

export type HeroTilePhase = {
  order: HeroTileOrder;
  effect: HeroTileEffect;
  start: number;
  staggerSpan: number;
  tileDuration: number;
  texture: number;
  easing: HeroTileEasing;
};

export type HeroTileTransition = {
  id: string;
  label: string;
  description: string;
  overscan: number;
  reveal: HeroTilePhase;
  exit: HeroTilePhase;
};

export type HeroTileCell = {
  index: number;
  row: number;
  column: number;
  columns: number;
  visibleRows: number;
  cellSize: number;
  compact: boolean;
};

export type HeroTileFrame = {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
  rotation: number;
  originX: number;
  originY: number;
  opacity: number;
};

export const HERO_TILE_TRANSITION_CHANGE_EVENT =
  "builtbymark:tile-transition-change";

export const defaultHeroTileTransition: HeroTileTransition = {
  id: "relay-sweep",
  label: "Relay Sweep",
  description:
    "The original right-to-left square relay with a radial proof handoff.",
  overscan: 1.025,
  reveal: {
    order: "right-to-left",
    effect: "shrink",
    start: 0.02,
    staggerSpan: 0.46,
    tileDuration: 0.15,
    texture: 0.006,
    easing: "in-out",
  },
  exit: {
    order: "radial-left",
    effect: "shrink",
    start: 0.05,
    staggerSpan: 0.62,
    tileDuration: 0.16,
    texture: 0.004,
    easing: "out",
  },
};

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const mix = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

const hash = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453123;
  return value - Math.floor(value);
};

const getCellCoordinates = (cell: HeroTileCell) => {
  const horizontal = cell.columns <= 1 ? 0 : cell.column / (cell.columns - 1);
  const vertical =
    cell.visibleRows <= 1 ? 0 : clamp(cell.row / (cell.visibleRows - 1));

  return {
    horizontal,
    vertical,
    x: horizontal - 0.5,
    y: vertical - 0.5,
  };
};

const getRadialLeftOrder = (cell: HeroTileCell) => {
  const sourceColumn = cell.columns * 0.2;
  const sourceRow = Math.max(0, (cell.visibleRows - 1) / 2);
  const distance = Math.hypot(
    (cell.column - sourceColumn) * 0.78,
    (cell.row - sourceRow) * 0.62,
  );
  const cornerDistances = [
    [0, 0],
    [cell.columns - 1, 0],
    [0, cell.visibleRows - 1],
    [cell.columns - 1, cell.visibleRows - 1],
  ].map(([column, row]) =>
    Math.hypot((column - sourceColumn) * 0.78, (row - sourceRow) * 0.62),
  );

  return distance / Math.max(...cornerDistances, 1);
};

export const getHeroTileOrder = (order: HeroTileOrder, cell: HeroTileCell) => {
  const { horizontal, vertical, x, y } = getCellCoordinates(cell);

  switch (order) {
    case "right-to-left":
      return 1 - horizontal;
    case "radial-left":
      return getRadialLeftOrder(cell);
    case "ledger-diagonal":
      return clamp(0.68 * (1 - horizontal) + 0.32 * vertical);
    case "hub-pulse":
      return clamp(Math.hypot(x, y) / Math.SQRT1_2);
    case "split-handoff":
      return clamp(2 * Math.abs(horizontal - 0.5));
    case "line-scan":
      return clamp(
        (cell.row + (cell.row % 2 ? 1 - horizontal : horizontal)) /
          Math.max(cell.visibleRows, 1),
      );
    case "validation-check":
      return clamp(
        ((cell.column + cell.row) % 2) * 0.52 +
          (1 - horizontal) * 0.36 +
          vertical * 0.12,
      );
    case "alternating-routes":
      return clamp(Math.abs(vertical - 0.5) * 2);
    case "signal-wave":
      return clamp(
        0.78 * (1 - horizontal) +
          0.22 * (0.5 + 0.5 * Math.sin(vertical * Math.PI * 2)),
      );
    case "cross-aperture":
      return clamp(Math.min(2 * Math.abs(x), 2 * Math.abs(y)));
    case "packet-dissolve":
      return clamp(0.58 * (1 - horizontal) + 0.42 * hash(cell.index + 1));
  }
};

export const getHeroTileDelay = (phase: HeroTilePhase, cell: HeroTileCell) => {
  const textureStep = (cell.row * 7 + cell.column * 3) % 5;
  return (
    phase.start +
    getHeroTileOrder(phase.order, cell) * phase.staggerSpan +
    textureStep * phase.texture
  );
};

const easeHeroTileProgress = (progress: number, easing: HeroTileEasing) => {
  const value = clamp(progress);

  if (easing === "out") return 1 - (1 - value) ** 2;
  return value < 0.5 ? 2 * value * value : 1 - (-2 * value + 2) ** 2 / 2;
};

export const getHeroTileVisibility = (
  progress: number,
  phase: HeroTilePhase,
  cell: HeroTileCell,
  direction: "hide" | "show",
) => {
  const localProgress = clamp(
    (progress - getHeroTileDelay(phase, cell)) / phase.tileDuration,
  );
  const easedProgress = easeHeroTileProgress(localProgress, phase.easing);
  return direction === "hide" ? 1 - easedProgress : easedProgress;
};

export const getHeroTilePhaseCompletion = (phase: HeroTilePhase) =>
  clamp(
    phase.start + phase.staggerSpan + phase.texture * 4 + phase.tileDuration,
  );

const getHiddenFrame = (
  effect: HeroTileEffect,
  cell: HeroTileCell,
): Omit<HeroTileFrame, "opacity"> => {
  const { horizontal, vertical, x, y } = getCellCoordinates(cell);
  const compactFactor = cell.compact ? 0.75 : 1;
  const parity = (cell.column + cell.row) % 2;
  const firstHash = hash(cell.index + 1);
  const secondHash = hash((cell.index + 1) * 7.13);

  switch (effect) {
    case "shrink":
      return {
        scaleX: 0.04,
        scaleY: 0.04,
        translateX: 0,
        translateY: 0,
        rotation: 0,
        originX: 0.5,
        originY: 0.5,
      };
    case "diagonal-drift":
      return {
        scaleX: 0.03,
        scaleY: 0.03,
        translateX: cell.cellSize * -0.12 * compactFactor,
        translateY: cell.cellSize * 0.12 * compactFactor,
        rotation: 0,
        originX: 0.5,
        originY: 0.5,
      };
    case "hub-pulse":
      return {
        scaleX: 0.02,
        scaleY: 0.02,
        translateX: 0,
        translateY: 0,
        rotation: 0,
        originX: 0.5,
        originY: 0.5,
      };
    case "split-handoff": {
      const leftHalf = horizontal < 0.5;
      return {
        scaleX: 0.02,
        scaleY: 1,
        translateX: cell.cellSize * (leftHalf ? -0.85 : 0.85) * compactFactor,
        translateY: 0,
        rotation: 0,
        originX: leftHalf ? 0 : 1,
        originY: 0.5,
      };
    }
    case "line-scan": {
      const reverse = cell.row % 2 === 1;
      return {
        scaleX: 0.02,
        scaleY: 1,
        translateX: cell.cellSize * (reverse ? -0.25 : 0.25) * compactFactor,
        translateY: 0,
        rotation: 0,
        originX: reverse ? 1 : 0,
        originY: 0.5,
      };
    }
    case "validation-check":
      return {
        scaleX: 0.02,
        scaleY: 0.02,
        translateX: 0,
        translateY: 0,
        rotation: (parity ? 12 : -12) * compactFactor,
        originX: 0.5,
        originY: 0.5,
      };
    case "alternating-routes":
      return {
        scaleX: 0.04,
        scaleY: 0.72,
        translateX: cell.cellSize * (cell.row % 2 ? -1.1 : 1.1) * compactFactor,
        translateY: 0,
        rotation: 0,
        originX: 0.5,
        originY: 0.5,
      };
    case "signal-wave":
      return {
        scaleX: 0.22,
        scaleY: 0.02,
        translateX: 0,
        translateY:
          cell.cellSize *
          0.35 *
          Math.sin(vertical * Math.PI * 2) *
          compactFactor,
        rotation: 0,
        originX: 0.5,
        originY: 0.5,
      };
    case "cross-aperture": {
      const nearVerticalAxis = Math.abs(x) <= Math.abs(y);
      return {
        scaleX: nearVerticalAxis ? 0.02 : 0.65,
        scaleY: nearVerticalAxis ? 0.65 : 0.02,
        translateX: nearVerticalAxis
          ? cell.cellSize * Math.sign(x || 1) * 0.3 * compactFactor
          : 0,
        translateY: nearVerticalAxis
          ? 0
          : cell.cellSize * Math.sign(y || 1) * 0.3 * compactFactor,
        rotation: 0,
        originX: 0.5,
        originY: 0.5,
      };
    }
    case "packet-dissolve":
      return {
        scaleX: 0.02,
        scaleY: 0.02,
        translateX: cell.cellSize * (firstHash - 0.5) * 0.9 * compactFactor,
        translateY: cell.cellSize * (secondHash - 0.5) * 0.9 * compactFactor,
        rotation: (secondHash - 0.5) * 28 * compactFactor,
        originX: 0.5,
        originY: 0.5,
      };
  }
};

export const getHeroTileFrame = (
  visibility: number,
  effect: HeroTileEffect,
  cell: HeroTileCell,
): HeroTileFrame => {
  const visible = clamp(visibility);
  const hidden = getHiddenFrame(effect, cell);

  return {
    scaleX: mix(hidden.scaleX, 1, visible),
    scaleY: mix(hidden.scaleY, 1, visible),
    translateX: mix(hidden.translateX, 0, visible),
    translateY: mix(hidden.translateY, 0, visible),
    rotation: mix(hidden.rotation, 0, visible),
    originX: hidden.originX,
    originY: hidden.originY,
    opacity: clamp(visible / 0.12),
  };
};

const formatNumber = (value: number, precision = 4) =>
  Number(value.toFixed(precision)).toString();

export const createHeroTileCssTransform = (
  frame: HeroTileFrame,
  overscan = 1,
) =>
  `translate3d(${formatNumber(frame.translateX, 3)}px, ${formatNumber(frame.translateY, 3)}px, 0) rotate(${formatNumber(frame.rotation, 3)}deg) scale(${formatNumber(frame.scaleX * overscan)}, ${formatNumber(frame.scaleY * overscan)})`;

export const createHeroTileTransformOrigin = (frame: HeroTileFrame) =>
  `${formatNumber(frame.originX * 100, 2)}% ${formatNumber(frame.originY * 100, 2)}%`;

export const createHeroTileSvgTransform = (
  frame: HeroTileFrame,
  cellX: number,
  cellY: number,
  cellSize: number,
) => {
  const pivotX = cellX + cellSize * frame.originX;
  const pivotY = cellY + cellSize * frame.originY;
  const translatedPivotX = pivotX + frame.translateX;
  const translatedPivotY = pivotY + frame.translateY;

  return `translate(${formatNumber(translatedPivotX, 3)} ${formatNumber(translatedPivotY, 3)}) rotate(${formatNumber(frame.rotation, 3)}) scale(${formatNumber(frame.scaleX)} ${formatNumber(frame.scaleY)}) translate(-${formatNumber(pivotX, 3)} -${formatNumber(pivotY, 3)})`;
};

const renderPhaseCss = (prefix: string, phase: HeroTilePhase) =>
  [
    `--hero-tile-${prefix}-order:${phase.order}`,
    `--hero-tile-${prefix}-effect:${phase.effect}`,
    `--hero-tile-${prefix}-start:${phase.start}`,
    `--hero-tile-${prefix}-stagger:${phase.staggerSpan}`,
    `--hero-tile-${prefix}-duration:${phase.tileDuration}`,
    `--hero-tile-${prefix}-texture:${phase.texture}`,
    `--hero-tile-${prefix}-easing:${phase.easing}`,
  ].join(";");

export const createAppliedHeroTileTransitionCss = (
  transition: HeroTileTransition,
) =>
  `:root{--hero-tile-transition-id:${transition.id};--hero-tile-overscan:${transition.overscan};${renderPhaseCss("reveal", transition.reveal)};${renderPhaseCss("exit", transition.exit)}}`;

const readCssValue = (
  styles: CSSStyleDeclaration,
  property: string,
  fallback: string,
) => styles.getPropertyValue(property).trim() || fallback;

const readCssNumber = (
  styles: CSSStyleDeclaration,
  property: string,
  fallback: number,
) => {
  const value = Number(styles.getPropertyValue(property).trim());
  return Number.isFinite(value) ? value : fallback;
};

const readCssOption = <Option extends string>(
  styles: CSSStyleDeclaration,
  property: string,
  options: readonly Option[],
  fallback: Option,
) => {
  const value = styles.getPropertyValue(property).trim() as Option;
  return options.includes(value) ? value : fallback;
};

const readPhase = (
  styles: CSSStyleDeclaration,
  prefix: "reveal" | "exit",
  fallback: HeroTilePhase,
): HeroTilePhase => ({
  order: readCssOption(
    styles,
    `--hero-tile-${prefix}-order`,
    heroTileOrderNames,
    fallback.order,
  ),
  effect: readCssOption(
    styles,
    `--hero-tile-${prefix}-effect`,
    heroTileEffectNames,
    fallback.effect,
  ),
  start: readCssNumber(styles, `--hero-tile-${prefix}-start`, fallback.start),
  staggerSpan: readCssNumber(
    styles,
    `--hero-tile-${prefix}-stagger`,
    fallback.staggerSpan,
  ),
  tileDuration: readCssNumber(
    styles,
    `--hero-tile-${prefix}-duration`,
    fallback.tileDuration,
  ),
  texture: readCssNumber(
    styles,
    `--hero-tile-${prefix}-texture`,
    fallback.texture,
  ),
  easing: readCssOption(
    styles,
    `--hero-tile-${prefix}-easing`,
    heroTileEasingNames,
    fallback.easing,
  ),
});

export const readAppliedHeroTileTransition = (
  element: Element,
): HeroTileTransition => {
  const styles = getComputedStyle(element);
  const fallback = defaultHeroTileTransition;
  const id = readCssValue(styles, "--hero-tile-transition-id", fallback.id);

  return {
    id,
    label: id,
    description: "",
    overscan: readCssNumber(styles, "--hero-tile-overscan", fallback.overscan),
    reveal: readPhase(styles, "reveal", fallback.reveal),
    exit: readPhase(styles, "exit", fallback.exit),
  };
};
