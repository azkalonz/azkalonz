import { createThemePreviewCss, getThemeById } from "../../theme/themeCatalog";

export const themePreviewStorageKey = "builtbymark:dev-theme-preview";
const previewStyleId = "dev-theme-preview-style";
const previewFontLinkId = "dev-theme-preview-font";
const previewFontPendingSelector = "link[data-dev-theme-font-pending]";
const fontLoadTimeout = 2200;
let previewRequestId = 0;

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

const ensureGoogleFontConnections = () => {
  const connections = [
    { href: "https://fonts.googleapis.com", crossOrigin: false },
    { href: "https://fonts.gstatic.com", crossOrigin: true },
  ];

  connections.forEach(({ href, crossOrigin }) => {
    if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`))
      return;

    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    if (crossOrigin) link.crossOrigin = "anonymous";
    link.dataset.devThemeFontConnection = "true";
    document.head.append(link);
  });
};

const primaryFontFamily = (fontStack: string) =>
  fontStack.match(/^\s*["']?([^,"']+)/)?.[1]?.trim();

const waitForFontFaces = async (
  theme: NonNullable<ReturnType<typeof getThemeById>>,
) => {
  if (!("fonts" in document)) return;

  const faces = [
    [theme.typography.fontBody, theme.typography.bodyWeight],
    [theme.typography.fontDisplay, theme.typography.displayWeight],
    [theme.typography.fontData, theme.typography.dataWeight],
  ] as const;
  const uniqueFaces = new Map<string, string>();

  faces.forEach(([stack, weight]) => {
    const family = primaryFontFamily(stack);
    if (family)
      uniqueFaces.set(`${weight}:${family}`, `${weight} 1em "${family}"`);
  });

  await Promise.all(
    [...uniqueFaces.values()].map((font) => document.fonts.load(font)),
  );
};

const waitForFontFacesWithinBudget = async (
  theme: NonNullable<ReturnType<typeof getThemeById>>,
) => {
  let timeout = 0;
  try {
    await Promise.race([
      waitForFontFaces(theme),
      new Promise<void>((resolve) => {
        timeout = window.setTimeout(resolve, fontLoadTimeout);
      }),
    ]);
  } finally {
    if (timeout) window.clearTimeout(timeout);
  }
};

const loadThemeFont = async (
  theme: NonNullable<ReturnType<typeof getThemeById>>,
  requestId: number,
) => {
  const activeLink = document.getElementById(
    previewFontLinkId,
  ) as HTMLLinkElement | null;

  if (!theme.fontStylesheet) {
    activeLink?.remove();
    document
      .querySelectorAll(previewFontPendingSelector)
      .forEach((link) => link.remove());
    return;
  }

  ensureGoogleFontConnections();
  if (activeLink?.href === theme.fontStylesheet) {
    await waitForFontFacesWithinBudget(theme);
    return;
  }

  document
    .querySelectorAll(previewFontPendingSelector)
    .forEach((link) => link.remove());

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = theme.fontStylesheet;
  link.dataset.devThemeFontPending = "true";

  const loaded = new Promise<boolean>((resolve) => {
    const timeout = window.setTimeout(() => resolve(false), fontLoadTimeout);
    link.addEventListener(
      "load",
      () => {
        window.clearTimeout(timeout);
        resolve(true);
      },
      { once: true },
    );
    link.addEventListener(
      "error",
      () => {
        window.clearTimeout(timeout);
        resolve(false);
      },
      { once: true },
    );
  });

  document.head.append(link);
  const fontCssLoaded = await loaded;
  if (requestId !== previewRequestId) {
    link.remove();
    return;
  }

  if (fontCssLoaded) {
    activeLink?.remove();
    link.id = previewFontLinkId;
    delete link.dataset.devThemeFontPending;
    await waitForFontFacesWithinBudget(theme);
  } else {
    activeLink?.remove();
    link.remove();
  }
};

export const getStoredThemePreview = () => {
  const themeId = readStoredThemeId();
  return themeId && getThemeById(themeId) ? themeId : null;
};

export const applyThemePreview = async (themeId: string | null) => {
  const requestId = ++previewRequestId;
  const root = document.documentElement;
  const existingStyle = document.getElementById(previewStyleId);

  if (!themeId) {
    existingStyle?.remove();
    document.getElementById(previewFontLinkId)?.remove();
    document
      .querySelectorAll(previewFontPendingSelector)
      .forEach((link) => link.remove());
    delete root.dataset.devTheme;
    delete root.dataset.devThemeFont;
    writeStoredThemeId(null);
    syncBrowserCanvas();
    refreshThemeLayout();
    return null;
  }

  const theme = getThemeById(themeId);
  if (!theme) return getStoredThemePreview();

  root.dataset.devThemeFont = theme.fontStylesheet ? "loading" : "local";
  await loadThemeFont(theme, requestId).catch(() => undefined);
  if (requestId !== previewRequestId) return getStoredThemePreview();

  const style = existingStyle ?? document.createElement("style");
  style.id = previewStyleId;
  style.dataset.devThemePreview = "true";
  style.textContent = createThemePreviewCss(theme);
  if (!style.isConnected) document.head.append(style);

  root.dataset.devTheme = theme.id;
  root.dataset.devThemeFont = theme.fontStylesheet ? "ready" : "local";
  writeStoredThemeId(theme.id);
  syncBrowserCanvas();
  refreshThemeLayout();
  return theme.id;
};

export const applyStoredThemePreview = () =>
  applyThemePreview(getStoredThemePreview());
