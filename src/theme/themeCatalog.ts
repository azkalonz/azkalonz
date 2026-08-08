export const themeTokenNames = [
  "canvas",
  "paper",
  "field",
  "ink",
  "muted",
  "line",
  "lineStrong",
  "relay",
  "relayHover",
  "relayInk",
  "system",
  "systemSoft",
  "proof",
  "proofSoft",
  "proofOn",
  "systemOn",
  "relayOn",
  "focus",
  "error",
  "success",
  "heroSceneGridSurface",
  "overlay",
  "shadowMedia",
  "shadowMenu",
  "customer",
  "customerSoft",
  "product",
  "productSoft",
] as const;

export const themeTypographyTokenNames = [
  "fontBody",
  "fontDisplay",
  "fontData",
  "bodyWeight",
  "bodyLineHeight",
  "bodyTracking",
  "displayWeight",
  "displayTracking",
  "displayTransform",
  "displayStyle",
  "dataWeight",
  "dataTracking",
  "dataTransform",
  "controlWeight",
  "controlTracking",
  "metricWeight",
  "metricTracking",
  "h1LineHeight",
  "h2LineHeight",
  "h3LineHeight",
] as const;

export type ThemeTokenName = (typeof themeTokenNames)[number];
export type ThemeTypographyTokenName =
  (typeof themeTypographyTokenNames)[number];
export type ThemeMode = Record<ThemeTokenName, string>;
export type ThemeTypography = Record<ThemeTypographyTokenName, string> & {
  label: string;
};

export type AppliedTheme = {
  id: string;
  label: string;
  description: string;
  typography: ThemeTypography;
  light: ThemeMode;
  dark: ThemeMode;
};

type ThemeModeSeed = {
  surface: readonly [canvas: string, paper: string, field: string];
  text: readonly [ink: string, muted: string];
  action: readonly [relay: string, relayHover: string, onRelay: string];
  system: readonly [system: string, systemSoft: string, onSystem: string];
  proof: readonly [proof: string, proofSoft: string, onProof: string];
  line: readonly [line: string, lineStrong: string];
  customer: readonly [customer: string, customerSoft: string];
  product: readonly [product: string, productSoft: string];
  focus: string;
  error: string;
  grid: string;
};

type ThemeFamilySeed = {
  id: string;
  label: string;
  description: string;
  typography: ThemeTypography;
  light: ThemeModeSeed;
  dark: ThemeModeSeed;
};

const fontStacks = {
  sourceSans:
    '"Source Sans 3 Variable", "Segoe UI", ui-sans-serif, system-ui, sans-serif',
  arial: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  arialBlack: '"Arial Black", Impact, "Arial Narrow", sans-serif',
  arialNarrow:
    '"Arial Narrow", "Avenir Next Condensed", "Helvetica Neue", Arial, sans-serif',
  courier: '"Courier New", Courier, ui-monospace, monospace',
  systemMono:
    'ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  trebuchet: '"Trebuchet MS", "Segoe UI", Arial, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
  didot: 'Didot, "Bodoni 72", "Bodoni MT", Georgia, serif',
  rockwell: 'Rockwell, "Roboto Slab", "Courier New", serif',
} as const;

type TypographyIdentity = Pick<
  ThemeTypography,
  "label" | "fontBody" | "fontDisplay" | "fontData"
>;

const makeTypography = (
  seed: TypographyIdentity &
    Partial<Omit<ThemeTypography, keyof TypographyIdentity>>,
): ThemeTypography => ({
  bodyWeight: "400",
  bodyLineHeight: "1.62",
  bodyTracking: "0",
  displayWeight: "650",
  displayTracking: "-0.025em",
  displayTransform: "none",
  displayStyle: "normal",
  dataWeight: "650",
  dataTracking: "0",
  dataTransform: "none",
  controlWeight: "720",
  controlTracking: "0",
  metricWeight: "680",
  metricTracking: "-0.04em",
  h1LineHeight: "0.98",
  h2LineHeight: "1.04",
  h3LineHeight: "1.15",
  ...seed,
});

const makeMode = (seed: ThemeModeSeed, dark: boolean): ThemeMode => ({
  canvas: seed.surface[0],
  paper: seed.surface[1],
  field: seed.surface[2],
  ink: seed.text[0],
  muted: seed.text[1],
  line: seed.line[0],
  lineStrong: seed.line[1],
  relay: seed.action[0],
  relayHover: seed.action[1],
  relayInk: seed.action[2],
  system: seed.system[0],
  systemSoft: seed.system[1],
  proof: seed.proof[0],
  proofSoft: seed.proof[1],
  proofOn: seed.proof[2],
  systemOn: seed.system[2],
  relayOn: seed.action[2],
  focus: seed.focus,
  error: seed.error,
  success: seed.system[0],
  heroSceneGridSurface: seed.grid,
  overlay: dark
    ? `color-mix(in srgb, ${seed.surface[0]} 94%, transparent)`
    : `color-mix(in srgb, ${seed.text[0]} 90%, transparent)`,
  shadowMedia: dark
    ? "0 1.75rem 5rem rgba(0, 0, 0, 0.38)"
    : `0 1.5rem 4.5rem color-mix(in srgb, ${seed.text[0]} 16%, transparent)`,
  shadowMenu: dark
    ? "0 1.75rem 4rem rgba(0, 0, 0, 0.34)"
    : `0 1.5rem 3.5rem color-mix(in srgb, ${seed.text[0]} 18%, transparent)`,
  customer: seed.customer[0],
  customerSoft: seed.customer[1],
  product: seed.product[0],
  productSoft: seed.product[1],
});

const themeSeeds: readonly ThemeFamilySeed[] = [
  {
    id: "mineral",
    label: "Mineral",
    description:
      "The deployed baseline: calm mineral surfaces with oxide, teal, and documentary blue.",
    typography: makeTypography({
      label: "Source Sans 3 throughout",
      fontBody: fontStacks.sourceSans,
      fontDisplay: fontStacks.sourceSans,
      fontData: fontStacks.sourceSans,
    }),
    light: {
      surface: ["#eeeee8", "#f8f7f1", "#e4e6df"],
      text: ["#17211f", "#596460"],
      action: ["#ad3e1e", "#923116", "#fffaf3"],
      system: ["#22695f", "#d8e7e1", "#fffaf3"],
      proof: ["#425f88", "#dce3ed", "#fffaf3"],
      line: ["#c7cbc4", "#767e79"],
      customer: ["#8b4d0e", "#f1e2c9"],
      product: ["#765878", "#eadfea"],
      focus: "#1e67bf",
      error: "#a6362d",
      grid: "#131917",
    },
    dark: {
      surface: ["#131917", "#1a211e", "#212a26"],
      text: ["#eeece4", "#a7b0ab"],
      action: ["#ff7a45", "#ff986c", "#171d1a"],
      system: ["#73c1b2", "#203c35", "#131917"],
      proof: ["#8eadd5", "#26364a", "#131917"],
      line: ["#39423d", "#707a74"],
      customer: ["#e2b36f", "#45351f"],
      product: ["#c6a0ca", "#3b2f3f"],
      focus: "#f4b45f",
      error: "#ff9a8f",
      grid: "#0c100f",
    },
  },
  {
    id: "signal-brutalist",
    label: "Signal Brutalist",
    description:
      "Newsprint, danger red, royal blue, and acid yellow with poster-scale condensed type.",
    typography: makeTypography({
      label: "Impact · Arial · Courier",
      fontBody: fontStacks.arial,
      fontDisplay: fontStacks.arialBlack,
      fontData: fontStacks.courier,
      bodyLineHeight: "1.56",
      bodyTracking: "0.006em",
      displayWeight: "800",
      displayTracking: "0.005em",
      displayTransform: "uppercase",
      dataWeight: "700",
      dataTracking: "0.12em",
      dataTransform: "uppercase",
      controlWeight: "800",
      controlTracking: "0.02em",
      metricWeight: "900",
      metricTracking: "-0.025em",
      h1LineHeight: "0.9",
      h2LineHeight: "0.94",
      h3LineHeight: "1.02",
    }),
    light: {
      surface: ["#f4efe3", "#fffdf6", "#e5dccb"],
      text: ["#111111", "#5f584d"],
      action: ["#b40d22", "#8f0819", "#ffffff"],
      system: ["#084dc2", "#dbe6ff", "#ffffff"],
      proof: ["#745200", "#ffe35d", "#ffffff"],
      line: ["#beb3a1", "#7a7062"],
      customer: ["#00645d", "#c8e8e2"],
      product: ["#63319a", "#e6d7f5"],
      focus: "#005fcc",
      error: "#a20d26",
      grid: "#0f0f0f",
    },
    dark: {
      surface: ["#0f0f0f", "#1a1917", "#27241f"],
      text: ["#fff7e4", "#bdb4a4"],
      action: ["#ff5063", "#ff7a87", "#1c060a"],
      system: ["#76a7ff", "#172647", "#07142c"],
      proof: ["#ffd53d", "#4a3b0a", "#201700"],
      line: ["#44413b", "#7a746a"],
      customer: ["#58d6c8", "#183c38"],
      product: ["#c4a0ff", "#38284c"],
      focus: "#65afff",
      error: "#ff8792",
      grid: "#080808",
    },
  },
  {
    id: "terminal-phosphor",
    label: "Terminal Phosphor",
    description:
      "Phosphor green, cyan telemetry, and amber evidence in a full monospace system.",
    typography: makeTypography({
      label: "System monospace throughout",
      fontBody: fontStacks.systemMono,
      fontDisplay: fontStacks.systemMono,
      fontData: fontStacks.systemMono,
      bodyLineHeight: "1.58",
      displayWeight: "700",
      displayTracking: "-0.035em",
      displayTransform: "uppercase",
      dataWeight: "700",
      dataTracking: "0.12em",
      dataTransform: "uppercase",
      controlWeight: "700",
      controlTracking: "0.04em",
      metricWeight: "800",
      metricTracking: "-0.035em",
      h1LineHeight: "0.92",
      h2LineHeight: "0.98",
      h3LineHeight: "1.06",
    }),
    light: {
      surface: ["#e5efe4", "#f6fff4", "#d3e3d3"],
      text: ["#0e2415", "#49644f"],
      action: ["#0b642f", "#064b22", "#ffffff"],
      system: ["#00646b", "#c8e9e8", "#ffffff"],
      proof: ["#7b4300", "#f7dfad", "#ffffff"],
      line: ["#a8bba9", "#677e69"],
      customer: ["#5c2888", "#e7d5f1"],
      product: ["#9c330e", "#f1d3c6"],
      focus: "#005fc6",
      error: "#a51d28",
      grid: "#07120a",
    },
    dark: {
      surface: ["#050b07", "#09140d", "#102319"],
      text: ["#baffc9", "#78b78a"],
      action: ["#46ff76", "#79ff9a", "#031208"],
      system: ["#4ef1ff", "#133b3e", "#02171a"],
      proof: ["#ffb347", "#4d3010", "#211000"],
      line: ["#21462c", "#4e805a"],
      customer: ["#d29aff", "#35203f"],
      product: ["#ff9974", "#49261a"],
      focus: "#70a8ff",
      error: "#ff7f88",
      grid: "#020503",
    },
  },
  {
    id: "international-red",
    label: "International Red",
    description:
      "Swiss-poster white, near-black, signal red, cobalt, and mustard with hard grotesk type.",
    typography: makeTypography({
      label: "Arial Black · Helvetica · Courier",
      fontBody: fontStacks.arial,
      fontDisplay: fontStacks.arialBlack,
      fontData: fontStacks.courier,
      bodyLineHeight: "1.52",
      bodyTracking: "0.004em",
      displayWeight: "900",
      displayTracking: "-0.04em",
      displayTransform: "uppercase",
      dataWeight: "700",
      dataTracking: "0.15em",
      dataTransform: "uppercase",
      controlWeight: "800",
      controlTracking: "0.015em",
      metricWeight: "900",
      metricTracking: "-0.04em",
      h1LineHeight: "0.88",
      h2LineHeight: "0.93",
      h3LineHeight: "1",
    }),
    light: {
      surface: ["#f2f1ed", "#ffffff", "#deddd8"],
      text: ["#0a0a0a", "#5e5d59"],
      action: ["#b5110a", "#8d0c06", "#ffffff"],
      system: ["#6f5d00", "#ffe769", "#ffffff"],
      proof: ["#064dc7", "#d9e5ff", "#ffffff"],
      line: ["#b9b8b3", "#73716d"],
      customer: ["#00685b", "#c9e8e2"],
      product: ["#68339b", "#e5d7f0"],
      focus: "#0057d8",
      error: "#a9120c",
      grid: "#000000",
    },
    dark: {
      surface: ["#090909", "#151515", "#242424"],
      text: ["#faf9f4", "#aaa9a4"],
      action: ["#ff4a3e", "#ff7167", "#220400"],
      system: ["#f2cf38", "#4b3e0b", "#211a00"],
      proof: ["#6e9fff", "#1a2e50", "#06122c"],
      line: ["#383838", "#737373"],
      customer: ["#6dd7c4", "#173c36"],
      product: ["#cba1ff", "#38284d"],
      focus: "#73adff",
      error: "#ff766d",
      grid: "#000000",
    },
  },
  {
    id: "memphis-candy",
    label: "Memphis Candy",
    description:
      "Peach, lavender, magenta, cyan, and orange with a softer, upbeat humanist voice.",
    typography: makeTypography({
      label: "Trebuchet · Courier",
      fontBody: fontStacks.trebuchet,
      fontDisplay: fontStacks.trebuchet,
      fontData: fontStacks.courier,
      bodyLineHeight: "1.66",
      bodyTracking: "0.004em",
      displayWeight: "700",
      displayTracking: "-0.025em",
      dataWeight: "700",
      dataTracking: "0.08em",
      dataTransform: "uppercase",
      controlWeight: "700",
      controlTracking: "0.015em",
      metricWeight: "800",
      metricTracking: "-0.03em",
      h1LineHeight: "0.96",
      h2LineHeight: "1.01",
      h3LineHeight: "1.1",
    }),
    light: {
      surface: ["#fff0e2", "#fffaf4", "#e8ddff"],
      text: ["#29143c", "#685575"],
      action: ["#9b176e", "#781052", "#ffffff"],
      system: ["#006b74", "#c9f1ed", "#ffffff"],
      proof: ["#984400", "#ffd7a6", "#ffffff"],
      line: ["#d1b8cb", "#8b6386"],
      customer: ["#257237", "#d4eccf"],
      product: ["#5345a2", "#dcd8ff"],
      focus: "#0066c2",
      error: "#a4203e",
      grid: "#22112f",
    },
    dark: {
      surface: ["#24132f", "#301a40", "#412453"],
      text: ["#fff0db", "#ceb8d6"],
      action: ["#ff79c6", "#ff9dd5", "#2a0820"],
      system: ["#66e7eb", "#174347", "#062023"],
      proof: ["#ffab59", "#52300e", "#2a1100"],
      line: ["#543b60", "#957aa0"],
      customer: ["#9ce9a8", "#23432b"],
      product: ["#b9b1ff", "#38335a"],
      focus: "#72c6ff",
      error: "#ff8b9e",
      grid: "#160a20",
    },
  },
  {
    id: "botanical-press",
    label: "Botanical Press",
    description:
      "Cream stock, forest ink, berry action, moss systems, and antique-gold evidence.",
    typography: makeTypography({
      label: "Georgia · Source Sans · Courier",
      fontBody: fontStacks.sourceSans,
      fontDisplay: fontStacks.georgia,
      fontData: fontStacks.courier,
      bodyLineHeight: "1.7",
      bodyTracking: "0.003em",
      displayWeight: "600",
      displayTracking: "-0.035em",
      dataWeight: "700",
      dataTracking: "0.08em",
      dataTransform: "uppercase",
      controlWeight: "700",
      controlTracking: "0.01em",
      metricWeight: "700",
      metricTracking: "-0.035em",
      h1LineHeight: "0.99",
      h2LineHeight: "1.03",
      h3LineHeight: "1.12",
    }),
    light: {
      surface: ["#f1ead5", "#fffaf0", "#d9e2c9"],
      text: ["#173321", "#586453"],
      action: ["#8e183b", "#6f0e2c", "#ffffff"],
      system: ["#2f642d", "#d8e8ce", "#ffffff"],
      proof: ["#795000", "#f0d99f", "#ffffff"],
      line: ["#bdb79e", "#7b8068"],
      customer: ["#556100", "#e4e5b8"],
      product: ["#5d3f82", "#e1d5ea"],
      focus: "#005fa8",
      error: "#a32230",
      grid: "#102418",
    },
    dark: {
      surface: ["#0c2015", "#122b1d", "#1d3a28"],
      text: ["#f5edda", "#b1baa8"],
      action: ["#ff7f9d", "#ff9fb5", "#260711"],
      system: ["#9dd38c", "#304f2a", "#0b2109"],
      proof: ["#e7bd60", "#4c3714", "#281800"],
      line: ["#2f4a37", "#728b75"],
      customer: ["#c8d46b", "#3d4216"],
      product: ["#c8a7e6", "#3e2b4e"],
      focus: "#74baff",
      error: "#ff7c86",
      grid: "#07130c",
    },
  },
  {
    id: "mediterranean-poster",
    label: "Mediterranean Poster",
    description:
      "Sun-bleached sand, navy, tangerine, turquoise, and violet in bold travel-poster type.",
    typography: makeTypography({
      label: "Impact · Trebuchet · Courier",
      fontBody: fontStacks.trebuchet,
      fontDisplay: fontStacks.arialBlack,
      fontData: fontStacks.courier,
      bodyLineHeight: "1.58",
      bodyTracking: "0.006em",
      displayWeight: "900",
      displayTracking: "0.015em",
      displayTransform: "uppercase",
      dataWeight: "700",
      dataTracking: "0.1em",
      dataTransform: "uppercase",
      controlWeight: "800",
      controlTracking: "0.025em",
      metricWeight: "900",
      metricTracking: "-0.02em",
      h1LineHeight: "0.88",
      h2LineHeight: "0.93",
      h3LineHeight: "1",
    }),
    light: {
      surface: ["#ffedc8", "#fff9e8", "#ffd39b"],
      text: ["#142252", "#565f78"],
      action: ["#a92f00", "#7d2100", "#ffffff"],
      system: ["#006c60", "#c6ebe2", "#ffffff"],
      proof: ["#5534a6", "#ddd2ff", "#ffffff"],
      line: ["#c9a977", "#8c724c"],
      customer: ["#00657c", "#c5e9f2"],
      product: ["#91355d", "#f2d3df"],
      focus: "#005db8",
      error: "#a42117",
      grid: "#101b3f",
    },
    dark: {
      surface: ["#101a3e", "#17234e", "#22305f"],
      text: ["#fff1cf", "#c1bfd0"],
      action: ["#ff7934", "#ff9b65", "#251000"],
      system: ["#5ce0cc", "#174943", "#06221e"],
      proof: ["#b9a0ff", "#40356e", "#150d2d"],
      line: ["#34446e", "#7886ab"],
      customer: ["#72daf1", "#173f4a"],
      product: ["#ff96c0", "#4c2034"],
      focus: "#6bc4ff",
      error: "#ff8b7d",
      grid: "#080d24",
    },
  },
  {
    id: "atelier-editorial",
    label: "Atelier Editorial",
    description:
      "Blush paper, burgundy, antique gold, and midnight plum with high-fashion serif typography.",
    typography: makeTypography({
      label: "Didot · Georgia · Source Sans",
      fontBody: fontStacks.georgia,
      fontDisplay: fontStacks.didot,
      fontData: fontStacks.sourceSans,
      bodyLineHeight: "1.7",
      bodyTracking: "0.004em",
      displayWeight: "500",
      displayTracking: "-0.04em",
      dataWeight: "700",
      dataTracking: "0.16em",
      dataTransform: "uppercase",
      controlWeight: "700",
      controlTracking: "0.02em",
      metricWeight: "600",
      metricTracking: "-0.04em",
      h1LineHeight: "0.96",
      h2LineHeight: "1",
      h3LineHeight: "1.08",
    }),
    light: {
      surface: ["#f7ece7", "#fff9f4", "#ead8dc"],
      text: ["#271721", "#685864"],
      action: ["#7f123e", "#620c30", "#ffffff"],
      system: ["#006069", "#cee8e8", "#ffffff"],
      proof: ["#715400", "#efe0a4", "#ffffff"],
      line: ["#cdbbc0", "#806d75"],
      customer: ["#3d622b", "#dce9ce"],
      product: ["#42519a", "#d9def1"],
      focus: "#005fb8",
      error: "#9d1e30",
      grid: "#1b1018",
    },
    dark: {
      surface: ["#160d15", "#24151f", "#331e2b"],
      text: ["#f8e8dc", "#c2adb7"],
      action: ["#ee76a7", "#ff9abd", "#2b0717"],
      system: ["#6ed2d6", "#23484a", "#072225"],
      proof: ["#e3bd5d", "#4b3814", "#271a00"],
      line: ["#45313e", "#876f7c"],
      customer: ["#a7d88b", "#2b4423"],
      product: ["#adb9ff", "#31375b"],
      focus: "#77b9ff",
      error: "#ff8794",
      grid: "#0c070b",
    },
  },
  {
    id: "arctic-lab",
    label: "Arctic Lab",
    description:
      "Icy cyan, navy, electric blue, mint, and highlighter lime with condensed lab typography.",
    typography: makeTypography({
      label: "Arial Narrow · Source Sans · Courier",
      fontBody: fontStacks.sourceSans,
      fontDisplay: fontStacks.arialNarrow,
      fontData: fontStacks.courier,
      bodyLineHeight: "1.6",
      bodyTracking: "0.006em",
      displayWeight: "800",
      displayTracking: "0.045em",
      displayTransform: "uppercase",
      dataWeight: "700",
      dataTracking: "0.14em",
      dataTransform: "uppercase",
      controlWeight: "750",
      controlTracking: "0.035em",
      metricWeight: "850",
      metricTracking: "-0.025em",
      h1LineHeight: "0.92",
      h2LineHeight: "0.96",
      h3LineHeight: "1.02",
    }),
    light: {
      surface: ["#e8faff", "#f8feff", "#cceef3"],
      text: ["#061e31", "#456579"],
      action: ["#005ed2", "#0045a1", "#ffffff"],
      system: ["#006e5c", "#c1eee4", "#ffffff"],
      proof: ["#596200", "#e3f48d", "#ffffff"],
      line: ["#a7cbd3", "#5a818d"],
      customer: ["#6d2f8d", "#ead7f2"],
      product: ["#974700", "#f2d7bb"],
      focus: "#0057d1",
      error: "#a51f35",
      grid: "#061923",
    },
    dark: {
      surface: ["#041820", "#08242f", "#0d3442"],
      text: ["#d8faff", "#8fbdc8"],
      action: ["#57a5ff", "#83bdff", "#061527"],
      system: ["#53e6c1", "#174c40", "#04231a"],
      proof: ["#cbea57", "#435012", "#192000"],
      line: ["#1b4654", "#5c8995"],
      customer: ["#d5a1ed", "#40264c"],
      product: ["#ffc177", "#4e3317"],
      focus: "#ffbf4d",
      error: "#ff8192",
      grid: "#020c11",
    },
  },
  {
    id: "desert-western",
    label: "Desert Western",
    description:
      "Terracotta, leather, dark teal, denim, and dusty violet with slab-serif character.",
    typography: makeTypography({
      label: "Rockwell · Georgia · Courier",
      fontBody: fontStacks.georgia,
      fontDisplay: fontStacks.rockwell,
      fontData: fontStacks.courier,
      bodyLineHeight: "1.68",
      bodyTracking: "0.003em",
      displayWeight: "700",
      displayTracking: "-0.02em",
      dataWeight: "700",
      dataTracking: "0.1em",
      dataTransform: "uppercase",
      controlWeight: "700",
      controlTracking: "0.015em",
      metricWeight: "800",
      metricTracking: "-0.025em",
      h1LineHeight: "0.96",
      h2LineHeight: "1",
      h3LineHeight: "1.08",
    }),
    light: {
      surface: ["#f0cfad", "#ffe8cf", "#d9aa80"],
      text: ["#2c1810", "#5b3f31"],
      action: ["#7f1d0b", "#5f1207", "#ffffff"],
      system: ["#074c43", "#c9e5d8", "#ffffff"],
      proof: ["#233f6d", "#cddcf0", "#ffffff"],
      line: ["#b98d67", "#704c32"],
      customer: ["#59610c", "#dee1b5"],
      product: ["#64347a", "#e4d3e7"],
      focus: "#005fb5",
      error: "#751015",
      grid: "#24130c",
    },
    dark: {
      surface: ["#21120c", "#311b13", "#47271b"],
      text: ["#ffe9d3", "#cca789"],
      action: ["#ff875a", "#ffa17e", "#2b0d03"],
      system: ["#75d2bc", "#214d43", "#09221d"],
      proof: ["#9cbcff", "#2b3f64", "#0b1930"],
      line: ["#55352a", "#a17860"],
      customer: ["#d3d975", "#3f4219"],
      product: ["#dda4e7", "#45264a"],
      focus: "#6db9ff",
      error: "#ff8585",
      grid: "#110905",
    },
  },
  {
    id: "ultraviolet-club",
    label: "Ultraviolet Club",
    description:
      "Lavender daylight and deep-purple night with ultraviolet, cyan, orange, and acid green.",
    typography: makeTypography({
      label: "Arial Black · Trebuchet · Courier",
      fontBody: fontStacks.trebuchet,
      fontDisplay: fontStacks.arialBlack,
      fontData: fontStacks.courier,
      bodyLineHeight: "1.58",
      bodyTracking: "0.006em",
      displayWeight: "850",
      displayTracking: "0.015em",
      displayTransform: "uppercase",
      dataWeight: "700",
      dataTracking: "0.18em",
      dataTransform: "uppercase",
      controlWeight: "800",
      controlTracking: "0.03em",
      metricWeight: "900",
      metricTracking: "-0.02em",
      h1LineHeight: "0.9",
      h2LineHeight: "0.94",
      h3LineHeight: "1.01",
    }),
    light: {
      surface: ["#efe8ff", "#fbf8ff", "#d8c9ff"],
      text: ["#1e0b3c", "#5f5078"],
      action: ["#6514c7", "#4c0c99", "#ffffff"],
      system: ["#005b57", "#c5efe9", "#ffffff"],
      proof: ["#8b3300", "#ffd7b6", "#ffffff"],
      line: ["#b9a8da", "#735e9c"],
      customer: ["#4e6200", "#e0ebaa"],
      product: ["#00647b", "#c8eaf1"],
      focus: "#005fd1",
      error: "#a61945",
      grid: "#110522",
    },
    dark: {
      surface: ["#110522", "#1b0a35", "#28124b"],
      text: ["#f5eaff", "#bba9d5"],
      action: ["#bb75ff", "#d09cff", "#24063d"],
      system: ["#53e6d7", "#164a43", "#06231f"],
      proof: ["#ff9652", "#54240e", "#2a0d00"],
      line: ["#3e2860", "#8768a5"],
      customer: ["#b9dc5c", "#374414"],
      product: ["#78d9ef", "#19404b"],
      focus: "#5bc9ff",
      error: "#ff79a0",
      grid: "#080211",
    },
  },
];

export const themeCatalog: readonly AppliedTheme[] = themeSeeds.map(
  (theme) => ({
    id: theme.id,
    label: theme.label,
    description: theme.description,
    typography: theme.typography,
    light: makeMode(theme.light, false),
    dark: makeMode(theme.dark, true),
  }),
);

export const getThemeById = (themeId: string) =>
  themeCatalog.find((theme) => theme.id === themeId);

const toCssToken = (token: string) =>
  token.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const renderPhysicalTokens = (theme: AppliedTheme) =>
  (["light", "dark"] as const).flatMap((mode) =>
    themeTokenNames.map(
      (token) =>
        `  --theme-${mode}-${toCssToken(token)}: ${theme[mode][token]};`,
    ),
  );

const renderTypographyTokens = (theme: AppliedTheme) =>
  themeTypographyTokenNames.map(
    (token) => `  --theme-${toCssToken(token)}: ${theme.typography[token]};`,
  );

export const createThemePreviewCss = (theme: AppliedTheme) =>
  [
    ":root {",
    ...renderPhysicalTokens(theme),
    ...renderTypographyTokens(theme),
    "}",
  ].join("\n");

export const createAppliedThemeCss = (theme: AppliedTheme) => {
  const currentLight = themeTokenNames.map(
    (token) =>
      `  --theme-${toCssToken(token)}: var(--theme-light-${toCssToken(token)});`,
  );
  const currentDark = themeTokenNames.map(
    (token) =>
      `  --theme-${toCssToken(token)}: var(--theme-dark-${toCssToken(token)});`,
  );

  return [
    `/* Applied theme: ${theme.label} (${theme.id}). Generated by npm run theme:apply:${theme.id}. */`,
    ":root {",
    "  color-scheme: light;",
    ...renderPhysicalTokens(theme),
    ...renderTypographyTokens(theme),
    ...currentLight,
    "}",
    "",
    ".dark {",
    "  color-scheme: dark;",
    ...currentDark,
    "}",
    "",
  ].join("\n");
};
