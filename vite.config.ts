import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import currentTheme from "./themes/current-theme.json";
import {
  createAppliedThemeCss,
  type AppliedTheme,
} from "./src/theme/themeCatalog";

const appliedTheme = currentTheme as AppliedTheme;
const virtualThemeId = "virtual:applied-theme.css";
const resolvedVirtualThemeId = `\0${virtualThemeId}`;
const appliedFontStylesheet = appliedTheme.fontStylesheet?.replaceAll(
  "&",
  "&amp;",
);

const appliedFontLinks = appliedFontStylesheet
  ? [
      '<link rel="preconnect" href="https://fonts.googleapis.com">',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      `<link rel="stylesheet" href="${appliedFontStylesheet}">`,
    ].join("\n    ")
  : "";

const appliedThemePlugin = {
  name: "applied-theme",
  resolveId(id: string) {
    if (id === virtualThemeId) return resolvedVirtualThemeId;
    return null;
  },
  load(id: string) {
    if (id === resolvedVirtualThemeId)
      return createAppliedThemeCss(appliedTheme);
    return null;
  },
  transformIndexHtml(html: string) {
    const themedHtml = html
      .replaceAll("__APPLIED_THEME_LIGHT_CANVAS__", appliedTheme.light.canvas)
      .replaceAll("__APPLIED_THEME_DARK_CANVAS__", appliedTheme.dark.canvas);

    return appliedFontLinks
      ? themedHtml.replace("</head>", `    ${appliedFontLinks}\n  </head>`)
      : themedHtml;
  },
};

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    appliedThemePlugin,
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: "terser",
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
