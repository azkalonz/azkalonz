import { createThemePreviewCss, getThemeById } from "../../theme/themeCatalog";

export const themePreviewStorageKey = "builtbymark:dev-theme-preview";
const previewStyleId = "dev-theme-preview-style";

const readStoredThemeId = () => {
  try {
    return localStorage.getItem(themePreviewStorageKey);
  } catch {
    return null;
  }
};

const writeStoredThemeId = (themeId: string | null) => {
  try {
    if (themeId) {
      localStorage.setItem(themePreviewStorageKey, themeId);
    } else {
      localStorage.removeItem(themePreviewStorageKey);
    }
  } catch {
    // Preview persistence is optional when storage is unavailable.
  }
};

const syncBrowserCanvas = () => {
  const root = document.documentElement;
  const canvas = getComputedStyle(root)
    .getPropertyValue("--theme-canvas")
    .trim();
  if (canvas) root.style.backgroundColor = canvas;
};

const refreshThemeLayout = () => {
  const refresh = () => {
    window.dispatchEvent(new CustomEvent("builtbymark:theme-preview"));
    window.dispatchEvent(new Event("resize"));
  };

  void document.fonts.ready.then(() => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(refresh));
  });
};

export const getStoredThemePreview = () => {
  const themeId = readStoredThemeId();
  return themeId && getThemeById(themeId) ? themeId : null;
};

export const applyThemePreview = (themeId: string | null) => {
  const root = document.documentElement;
  const existingStyle = document.getElementById(previewStyleId);

  if (!themeId) {
    existingStyle?.remove();
    delete root.dataset.devTheme;
    writeStoredThemeId(null);
    syncBrowserCanvas();
    refreshThemeLayout();
    return null;
  }

  const theme = getThemeById(themeId);
  if (!theme) return getStoredThemePreview();

  const style = existingStyle ?? document.createElement("style");
  style.id = previewStyleId;
  style.dataset.devThemePreview = "true";
  style.textContent = createThemePreviewCss(theme);
  if (!style.isConnected) document.head.append(style);

  root.dataset.devTheme = theme.id;
  writeStoredThemeId(theme.id);
  syncBrowserCanvas();
  refreshThemeLayout();
  return theme.id;
};

export const applyStoredThemePreview = () =>
  applyThemePreview(getStoredThemePreview());
