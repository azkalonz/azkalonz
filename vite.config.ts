import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import currentTransition from "./transitions/current-transition.json";
import currentTheme from "./themes/current-theme.json";
import {
  createAppliedThemeCss,
  type AppliedTheme,
} from "./src/theme/themeCatalog";
import {
  createAppliedHeroTileTransitionCss,
  type HeroTileTransition,
} from "./src/transition/heroTileTransition";

const appliedTheme = currentTheme as AppliedTheme;
const appliedTransition = currentTransition as HeroTileTransition;
const virtualThemeId = "virtual:applied-theme.css";
const resolvedVirtualThemeId = `\0${virtualThemeId}`;
const virtualTransitionId = "virtual:applied-tile-transition.css";
const resolvedVirtualTransitionId = `\0${virtualTransitionId}`;

const appliedThemePlugin = {
  name: "applied-theme",
  resolveId(id: string) {
    if (id === virtualThemeId) return resolvedVirtualThemeId;
    if (id === virtualTransitionId) return resolvedVirtualTransitionId;
    return null;
  },
  load(id: string) {
    if (id === resolvedVirtualThemeId)
      return createAppliedThemeCss(appliedTheme);
    if (id === resolvedVirtualTransitionId) {
      return createAppliedHeroTileTransitionCss(appliedTransition);
    }
    return null;
  },
  transformIndexHtml(html: string) {
    return html
      .replaceAll("__APPLIED_THEME_LIGHT_CANVAS__", appliedTheme.light.canvas)
      .replaceAll("__APPLIED_THEME_DARK_CANVAS__", appliedTheme.dark.canvas);
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
