import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

const themeKey = "theme";
const rippleDuration = 1500;
const rippleStagger = 90;
const maximumConcurrentSnapshots = 2;

const getRenderedTheme = (): Theme => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const getThemeCanvas = (theme: Theme) => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--theme-${theme}-canvas`)
    .trim();
  const metaValue = document
    .getElementById(`theme-color-${theme}`)
    ?.getAttribute("content")
    ?.trim();

  return value || metaValue || "transparent";
};

const paintTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  root.style.backgroundColor = getThemeCanvas(theme);
};

const handoffTheme = (theme: Theme, sequence: number) => {
  const root = document.documentElement;
  const handoffToken = String(sequence);

  root.dataset.themeHandoff = handoffToken;
  root.classList.add("theme-ripple-handoff");
  paintTheme(theme);

  // Resolve the live page to its final colors while the completed iframe still
  // covers it, so removing the snapshot cannot expose a text-color transition.
  void root.offsetWidth;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (root.dataset.themeHandoff !== handoffToken) return;
      root.classList.remove("theme-ripple-handoff");
      delete root.dataset.themeHandoff;
    });
  });
};

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(getRenderedTheme);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);
  const requestedTheme = useRef(theme);
  const activeSnapshots = useRef(new Set<HTMLIFrameElement>());
  const snapshotSequence = useRef(0);
  const latestSettledSequence = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem(themeKey);
    if (stored === "light" || stored === "dark") return;

    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const applyPreference = (event: MediaQueryListEvent | MediaQueryList) => {
      const nextTheme = event.matches ? "dark" : "light";
      paintTheme(nextTheme);
      requestedTheme.current = nextTheme;
      setTheme(nextTheme);
    };

    preference.addEventListener("change", applyPreference);
    return () => preference.removeEventListener("change", applyPreference);
  }, []);

  useEffect(
    () => () => {
      activeSnapshots.current.forEach((snapshot) => snapshot.remove());
      activeSnapshots.current.clear();
    },
    [],
  );

  const toggle = useCallback((origin?: HTMLElement) => {
    if (activeSnapshots.current.size >= maximumConcurrentSnapshots) return;

    const nextTheme = requestedTheme.current === "dark" ? "light" : "dark";
    requestedTheme.current = nextTheme;
    localStorage.setItem(themeKey, nextTheme);
    flushSync(() => setTheme(nextTheme));

    if (!origin) {
      paintTheme(nextTheme);
      return;
    }

    const bounds = origin.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const visualViewport = window.visualViewport;
    const viewportWidth = visualViewport?.width ?? window.innerWidth;
    const viewportHeight = visualViewport?.height ?? window.innerHeight;
    const viewportLeft = visualViewport?.offsetLeft ?? 0;
    const viewportTop = visualViewport?.offsetTop ?? 0;
    const xPercent = Math.min(
      100,
      Math.max(0, ((x - viewportLeft) / viewportWidth) * 100),
    );
    const yPercent = Math.min(
      100,
      Math.max(0, ((y - viewportTop) / viewportHeight) * 100),
    );

    const sequence = ++snapshotSequence.current;
    const snapshot = document.createElement("iframe");
    const staggerIndex = Math.min(activeSnapshots.current.size, 3);
    const scrollLeft = window.scrollX;
    const scrollTop = window.scrollY;

    snapshot.className = "theme-snapshot-ripple";
    snapshot.dataset.theme = nextTheme;
    snapshot.setAttribute("aria-hidden", "true");
    snapshot.setAttribute("tabindex", "-1");
    snapshot.setAttribute("scrolling", "no");
    snapshot.style.zIndex = String(1000 + sequence);
    snapshot.style.setProperty("--theme-ripple-x", `${xPercent.toFixed(4)}%`);
    snapshot.style.setProperty("--theme-ripple-y", `${yPercent.toFixed(4)}%`);
    snapshot.style.setProperty(
      "--theme-ripple-button-radius",
      `${Math.max(bounds.width, bounds.height) * 0.75}px`,
    );
    snapshot.style.setProperty(
      "--theme-ripple-delay",
      `${staggerIndex * rippleStagger}ms`,
    );

    const bodyClone = document.body.cloneNode(true) as HTMLBodyElement;
    const cloneExclusions = [".theme-snapshot-ripple", "script"];

    if (import.meta.env.DEV) {
      cloneExclusions.push("[data-dev-theme-toolbar-root]");
    }

    bodyClone
      .querySelectorAll(cloneExclusions.join(", "))
      .forEach((element) => element.remove());

    const styleAssets = Array.from(
      document.head.querySelectorAll('link[rel="stylesheet"], style'),
    )
      .map((element) => element.outerHTML)
      .join("");
    const themeClass = nextTheme === "dark" ? ' class="dark"' : "";
    const themeColor = getThemeCanvas(nextTheme);

    snapshot.srcdoc = `<!doctype html>
      <html${themeClass} style="color-scheme:${nextTheme};background:${themeColor}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <base href="${document.baseURI}">
          ${styleAssets}
          <style>
            html { scroll-behavior: auto !important; }
            html, body { background: ${themeColor} !important; }
            * { caret-color: transparent !important; }
          </style>
        </head>
        <body>${bodyClone.innerHTML}</body>
      </html>`;

    document.body.append(snapshot);
    activeSnapshots.current.add(snapshot);
    setIsToggleDisabled(
      activeSnapshots.current.size >= maximumConcurrentSnapshots,
    );

    let fallbackTimer = 0;
    let started = false;
    const settleSnapshot = () => {
      window.clearTimeout(fallbackTimer);
      if (!activeSnapshots.current.has(snapshot)) return;

      if (sequence >= latestSettledSequence.current) {
        latestSettledSequence.current = sequence;
        handoffTheme(nextTheme, sequence);
      }
      activeSnapshots.current.delete(snapshot);
      snapshot.remove();
      setIsToggleDisabled(
        activeSnapshots.current.size >= maximumConcurrentSnapshots,
      );
    };
    const startSnapshot = () => {
      if (started || !activeSnapshots.current.has(snapshot)) return;
      started = true;

      try {
        snapshot.contentWindow?.scrollTo(scrollLeft, scrollTop);
      } catch {
        // The static snapshot still aligns at the top if scrolling is unavailable.
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!activeSnapshots.current.has(snapshot)) return;
          snapshot.classList.add("theme-snapshot-ripple--running");
        });
      });
      fallbackTimer = window.setTimeout(
        settleSnapshot,
        rippleDuration + staggerIndex * rippleStagger + 300,
      );
    };

    snapshot.addEventListener("load", startSnapshot, { once: true });
    snapshot.addEventListener("animationend", settleSnapshot, { once: true });
    window.setTimeout(startSnapshot, 300);
  }, []);

  return { toggle, isDark: theme === "dark", isToggleDisabled };
}
