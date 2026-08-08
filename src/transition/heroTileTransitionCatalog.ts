import {
  defaultHeroTileTransition,
  type HeroTileEffect,
  type HeroTileOrder,
  type HeroTileTransition,
} from "./heroTileTransition";

type PairedTransitionOptions = {
  id: string;
  label: string;
  description: string;
  order: HeroTileOrder;
  effect: HeroTileEffect;
  revealSpan?: number;
  exitSpan?: number;
  duration?: number;
  texture?: number;
  overscan?: number;
};

const createPairedTransition = ({
  id,
  label,
  description,
  order,
  effect,
  revealSpan = 0.54,
  exitSpan = 0.62,
  duration = 0.17,
  texture = 0.003,
  overscan = 1.04,
}: PairedTransitionOptions): HeroTileTransition => ({
  id,
  label,
  description,
  overscan,
  reveal: {
    order,
    effect,
    start: 0.02,
    staggerSpan: revealSpan,
    tileDuration: duration,
    texture,
    easing: "in-out",
  },
  exit: {
    order,
    effect,
    start: 0.05,
    staggerSpan: exitSpan,
    tileDuration: Math.min(duration + 0.01, 0.2),
    texture,
    easing: "out",
  },
});

export const heroTileTransitionCatalog: readonly HeroTileTransition[] = [
  defaultHeroTileTransition,
  createPairedTransition({
    id: "ledger-diagonal",
    label: "Ledger Diagonal",
    description:
      "A measured diagonal transfer that carries each square down and left.",
    order: "ledger-diagonal",
    effect: "diagonal-drift",
    revealSpan: 0.55,
    exitSpan: 0.64,
    overscan: 1.05,
  }),
  createPairedTransition({
    id: "hub-pulse",
    label: "Hub Pulse",
    description:
      "Concentric squares propagate outward from the operational center.",
    order: "hub-pulse",
    effect: "hub-pulse",
    revealSpan: 0.58,
    exitSpan: 0.66,
    duration: 0.18,
    texture: 0.002,
  }),
  createPairedTransition({
    id: "split-handoff",
    label: "Split Handoff",
    description:
      "The center seam opens into two opposing streams before resolving.",
    order: "split-handoff",
    effect: "split-handoff",
    revealSpan: 0.5,
    exitSpan: 0.58,
    duration: 0.19,
    texture: 0.002,
    overscan: 1.035,
  }),
  createPairedTransition({
    id: "line-scan",
    label: "Line Scan",
    description:
      "Rows alternate direction like a system reading a structured ledger.",
    order: "line-scan",
    effect: "line-scan",
    revealSpan: 0.62,
    exitSpan: 0.68,
    duration: 0.15,
    texture: 0.001,
    overscan: 1.035,
  }),
  createPairedTransition({
    id: "validation-check",
    label: "Validation Check",
    description:
      "Alternating checks release in two precise passes with a small turn.",
    order: "validation-check",
    effect: "validation-check",
    revealSpan: 0.52,
    exitSpan: 0.61,
    duration: 0.16,
    texture: 0.002,
    overscan: 1.065,
  }),
  createPairedTransition({
    id: "alternating-routes",
    label: "Alternating Routes",
    description:
      "Horizontal routes depart in opposite directions from the middle rows.",
    order: "alternating-routes",
    effect: "alternating-routes",
    revealSpan: 0.56,
    exitSpan: 0.64,
    duration: 0.18,
    texture: 0.002,
  }),
  createPairedTransition({
    id: "signal-wave",
    label: "Signal Wave",
    description:
      "A restrained waveform travels across the field as tiles flatten.",
    order: "signal-wave",
    effect: "signal-wave",
    revealSpan: 0.55,
    exitSpan: 0.63,
    duration: 0.17,
    texture: 0.001,
    overscan: 1.05,
  }),
  createPairedTransition({
    id: "cross-aperture",
    label: "Cross Aperture",
    description:
      "A cross-shaped aperture opens on two axes from the shared center.",
    order: "cross-aperture",
    effect: "cross-aperture",
    revealSpan: 0.6,
    exitSpan: 0.67,
    duration: 0.18,
    texture: 0.001,
    overscan: 1.045,
  }),
  createPairedTransition({
    id: "packet-dissolve",
    label: "Packet Dissolve",
    description:
      "Deterministic packets disperse with controlled drift and rotation.",
    order: "packet-dissolve",
    effect: "packet-dissolve",
    revealSpan: 0.58,
    exitSpan: 0.66,
    duration: 0.16,
    texture: 0.004,
    overscan: 1.075,
  }),
];

export const getHeroTileTransitionById = (id: string) =>
  heroTileTransitionCatalog.find((transition) => transition.id === id);
