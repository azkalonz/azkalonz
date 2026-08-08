import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getThemeById,
  themeCatalog,
  type AppliedTheme,
  type ThemeMode,
  type ThemeTypography,
} from "../src/theme/themeCatalog";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const hexToRgb = (hex: string) => {
  const value = hex.replace("#", "");
  if (!/^[\da-f]{6}$/i.test(value)) return null;

  return [0, 2, 4].map((offset) =>
    Number.parseInt(value.slice(offset, offset + 2), 16),
  ) as [number, number, number];
};

const luminance = (hex: string) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const channels = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

const contrast = (foreground: string, background: string) => {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  if (foregroundLuminance === null || backgroundLuminance === null) return null;

  const lightest = Math.max(foregroundLuminance, backgroundLuminance);
  const darkest = Math.min(foregroundLuminance, backgroundLuminance);
  return (lightest + 0.05) / (darkest + 0.05);
};

const validateMode = (theme: AppliedTheme, modeName: "light" | "dark") => {
  const mode = theme[modeName];
  const pairs: Array<
    [
      label: string,
      foreground: keyof ThemeMode,
      background: keyof ThemeMode,
      minimum: number,
    ]
  > = [
    ["body on canvas", "ink", "canvas", 4.5],
    ["body on paper", "ink", "paper", 4.5],
    ["body on field", "ink", "field", 4.5],
    ["muted on canvas", "muted", "canvas", 4.5],
    ["muted on paper", "muted", "paper", 4.5],
    ["muted on field", "muted", "field", 4.5],
    ["action text on canvas", "relay", "canvas", 4.5],
    ["action text on paper", "relay", "paper", 4.5],
    ["action text on field", "relay", "field", 4.5],
    ["system text on canvas", "system", "canvas", 4.5],
    ["system text on paper", "system", "paper", 4.5],
    ["system text on field", "system", "field", 4.5],
    ["proof text on canvas", "proof", "canvas", 4.5],
    ["proof text on paper", "proof", "paper", 4.5],
    ["proof text on field", "proof", "field", 4.5],
    ["action label", "relayInk", "relay", 4.5],
    ["action hover label", "relayInk", "relayHover", 4.5],
    ["system label", "systemOn", "system", 4.5],
    ["proof label", "proofOn", "proof", 4.5],
    ["system on soft surface", "system", "systemSoft", 4.5],
    ["proof on soft surface", "proof", "proofSoft", 4.5],
    ["customer on soft surface", "customer", "customerSoft", 4.5],
    ["product on soft surface", "product", "productSoft", 4.5],
    ["focus on canvas", "focus", "canvas", 3],
    ["focus on paper", "focus", "paper", 3],
    ["focus on field", "focus", "field", 3],
    ["error on canvas", "error", "canvas", 4.5],
    ["error on paper", "error", "paper", 4.5],
    ["error on field", "error", "field", 4.5],
    ["success on canvas", "success", "canvas", 4.5],
    ["strong line on canvas", "lineStrong", "canvas", 3],
    ["strong line on paper", "lineStrong", "paper", 3],
    ["strong line on field", "lineStrong", "field", 3],
  ];

  return pairs.flatMap(([label, foreground, background, minimum]) => {
    const ratio = contrast(mode[foreground], mode[background]);
    return ratio !== null && ratio >= minimum
      ? []
      : [
          `${theme.id} ${modeName}: ${label} is ${ratio?.toFixed(2) ?? "invalid"}:1 (needs ${minimum}:1)`,
        ];
  });
};

const validateTypography = (theme: AppliedTheme) => {
  const typography = theme.typography;
  const issues: string[] = [];
  const weights = [
    "bodyWeight",
    "displayWeight",
    "dataWeight",
    "controlWeight",
    "metricWeight",
  ] as const;
  const trackings = [
    "bodyTracking",
    "displayTracking",
    "dataTracking",
    "controlTracking",
    "metricTracking",
  ] as const;

  weights.forEach((token) => {
    const value = Number(typography[token]);
    if (!Number.isFinite(value) || value < 300 || value > 900) {
      issues.push(`${theme.id}: ${token} must be between 300 and 900`);
    }
  });

  trackings.forEach((token) => {
    const raw = typography[token];
    const value = raw === "0" ? 0 : Number(raw.replace(/em$/, ""));
    if (!/^[-+]?\d*\.?\d+em$/.test(raw) && raw !== "0") {
      issues.push(`${theme.id}: ${token} must be expressed in em or zero`);
    } else if (!Number.isFinite(value) || value < -0.04 || value > 0.2) {
      issues.push(`${theme.id}: ${token} must stay between -0.04em and 0.2em`);
    }
  });

  const bodyLineHeight = Number(typography.bodyLineHeight);
  if (bodyLineHeight < 1.45 || bodyLineHeight > 1.8) {
    issues.push(`${theme.id}: bodyLineHeight must stay between 1.45 and 1.8`);
  }

  if (!["none", "uppercase"].includes(typography.displayTransform)) {
    issues.push(`${theme.id}: displayTransform must be none or uppercase`);
  }
  if (!["none", "uppercase"].includes(typography.dataTransform)) {
    issues.push(`${theme.id}: dataTransform must be none or uppercase`);
  }
  if (!["normal", "italic"].includes(typography.displayStyle)) {
    issues.push(`${theme.id}: displayStyle must be normal or italic`);
  }

  [typography.fontBody, typography.fontDisplay, typography.fontData].forEach(
    (fontFamily) => {
      if (!fontFamily.trim())
        issues.push(`${theme.id}: font families are required`);
    },
  );

  return issues;
};

const validateCatalog = () => {
  const issues = themeCatalog.flatMap((theme) => [
    ...validateMode(theme, "light"),
    ...validateMode(theme, "dark"),
    ...validateTypography(theme),
  ]);

  if (issues.length) {
    throw new Error(`Theme contrast validation failed:\n${issues.join("\n")}`);
  }
};

const updateDesignFrontmatter = (source: string, theme: AppliedTheme) => {
  const replacements: Record<string, string> = {
    "canvas-light": theme.light.canvas,
    "paper-light": theme.light.paper,
    "ink-light": theme.light.ink,
    "muted-light": theme.light.muted,
    "line-light": theme.light.line,
    "canvas-dark": theme.dark.canvas,
    "paper-dark": theme.dark.paper,
    "ink-dark": theme.dark.ink,
    "muted-dark": theme.dark.muted,
    "line-dark": theme.dark.line,
    "action-light": theme.light.relay,
    "action-dark": theme.dark.relay,
    "proof-light": theme.light.proof,
    "proof-dark": theme.dark.proof,
  };

  const withColors = Object.entries(replacements).reduce(
    (document, [key, value]) =>
      document.replace(
        new RegExp(`^(\\s*${key}:\\s*)"[^"]+"`, "m"),
        `$1"${value}"`,
      ),
    source,
  );

  const family = (value: string) => value.replaceAll('"', "");
  const typography = theme.typography;
  const typographyBlock = `typography:
  display:
    fontFamily: ${JSON.stringify(family(typography.fontDisplay))}
    fontSize: "clamp(2.6rem, 4vw, 4rem)"
    fontWeight: ${typography.displayWeight}
    lineHeight: ${typography.h1LineHeight}
    letterSpacing: ${JSON.stringify(typography.displayTracking)}
    textTransform: ${typography.displayTransform}
  headline:
    fontFamily: ${JSON.stringify(family(typography.fontDisplay))}
    fontSize: "clamp(1.85rem, 2.6vw, 2.75rem)"
    fontWeight: ${typography.displayWeight}
    lineHeight: ${typography.h2LineHeight}
    letterSpacing: ${JSON.stringify(typography.displayTracking)}
    textTransform: ${typography.displayTransform}
  title:
    fontFamily: ${JSON.stringify(family(typography.fontDisplay))}
    fontSize: "clamp(1.2rem, 1.5vw, 1.8rem)"
    fontWeight: ${typography.displayWeight}
    lineHeight: ${typography.h3LineHeight}
    letterSpacing: ${JSON.stringify(typography.displayTracking)}
    textTransform: ${typography.displayTransform}
  body:
    fontFamily: ${JSON.stringify(family(typography.fontBody))}
    fontSize: "clamp(0.98rem, 0.96rem + 0.1vw, 1.04rem)"
    fontWeight: ${typography.bodyWeight}
    lineHeight: ${typography.bodyLineHeight}
    letterSpacing: ${JSON.stringify(typography.bodyTracking)}
  small:
    fontFamily: ${JSON.stringify(family(typography.fontData))}
    fontSize: "clamp(0.76rem, 0.74rem + 0.08vw, 0.85rem)"
    fontWeight: ${typography.dataWeight}
    lineHeight: 1.4
    letterSpacing: ${JSON.stringify(typography.dataTracking)}
    textTransform: ${typography.dataTransform}
rounded:`;

  return withColors.replace(/typography:\n[\s\S]*?rounded:/, typographyBlock);
};

const renderStandaloneTheme = (
  mode: ThemeMode,
  typography: ThemeTypography,
  indentation: string,
  includeTypography: boolean,
) =>
  [
    `--canvas: ${mode.canvas};`,
    `--paper: ${mode.paper};`,
    `--ink: ${mode.ink};`,
    `--muted: ${mode.muted};`,
    `--line: ${mode.line};`,
    `--relay: ${mode.relay};`,
    `--relay-ink: ${mode.relayInk};`,
    `--focus: ${mode.focus};`,
    ...(includeTypography
      ? [
          `--font-body: ${typography.fontBody};`,
          `--font-display: ${typography.fontDisplay};`,
          `--body-weight: ${typography.bodyWeight};`,
          `--body-leading: ${typography.bodyLineHeight};`,
          `--body-tracking: ${typography.bodyTracking};`,
          `--display-weight: ${typography.displayWeight};`,
          `--display-tracking: ${typography.displayTracking};`,
          `--display-transform: ${typography.displayTransform};`,
          `--display-style: ${typography.displayStyle};`,
          `--h1-leading: ${typography.h1LineHeight};`,
          `--control-weight: ${typography.controlWeight};`,
          `--control-tracking: ${typography.controlTracking};`,
        ]
      : []),
  ]
    .map((declaration) => `${indentation}${declaration}`)
    .join("\n");

const updateStandalone404 = (source: string, theme: AppliedTheme) =>
  source
    .replace(
      /(\/\* applied-theme-light:start \*\/)[\s\S]*?(\/\* applied-theme-light:end \*\/)/,
      `$1\n${renderStandaloneTheme(theme.light, theme.typography, "        ", true)}\n        $2`,
    )
    .replace(
      /(\/\* applied-theme-dark:start \*\/)[\s\S]*?(\/\* applied-theme-dark:end \*\/)/,
      `$1\n${renderStandaloneTheme(theme.dark, theme.typography, "          ", false)}\n          $2`,
    );

const writeIfChanged = async (filePath: string, content: string) => {
  const current = await readFile(filePath, "utf8");
  if (current === content) return false;
  await writeFile(filePath, content);
  return true;
};

const applyTheme = async (theme: AppliedTheme) => {
  const currentThemePath = path.join(projectRoot, "themes/current-theme.json");
  const manifestPath = path.join(projectRoot, "public/manifest.json");
  const notFoundPath = path.join(projectRoot, "public/404.html");
  const designPath = path.join(projectRoot, "DESIGN.md");

  const [manifestSource, notFoundSource, designSource] = await Promise.all([
    readFile(manifestPath, "utf8"),
    readFile(notFoundPath, "utf8"),
    readFile(designPath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource) as Record<string, unknown>;
  manifest.background_color = theme.light.canvas;
  manifest.theme_color = theme.light.ink;

  const nextTheme = `${JSON.stringify(theme, null, 2)}\n`;
  const temporaryThemePath = `${currentThemePath}.tmp`;
  await writeFile(temporaryThemePath, nextTheme);
  await rename(temporaryThemePath, currentThemePath);

  const results = await Promise.all([
    writeIfChanged(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`),
    writeIfChanged(notFoundPath, updateStandalone404(notFoundSource, theme)),
    writeIfChanged(designPath, updateDesignFrontmatter(designSource, theme)),
  ]);

  const touched = 1 + results.filter(Boolean).length;
  console.log(
    `Applied ${theme.label} (${theme.id}) to ${touched} tracked theme file${touched === 1 ? "" : "s"}.`,
  );
  console.log("Run npm run build to verify the production theme.");
};

const main = async () => {
  validateCatalog();

  const themeId = process.argv[2];
  if (!themeId || themeId === "--list") {
    console.log("Available themes:");
    themeCatalog.forEach((theme) =>
      console.log(`  ${theme.id.padEnd(24)} ${theme.label}`),
    );
    if (!themeId) process.exitCode = 1;
    return;
  }

  const theme = getThemeById(themeId);
  if (!theme) {
    console.error(`Unknown theme: ${themeId}`);
    console.error("Run npm run theme:list to see valid theme IDs.");
    process.exitCode = 1;
    return;
  }

  await applyTheme(theme);
};

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
