import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const themeKey = "theme";

const getRenderedTheme = (): Theme => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(getRenderedTheme);

  useEffect(() => {
    const stored = localStorage.getItem(themeKey);
    if (stored === "light" || stored === "dark") return;

    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const applyPreference = (event: MediaQueryListEvent | MediaQueryList) => {
      const nextTheme = event.matches ? "dark" : "light";
      document.documentElement.classList.toggle("dark", event.matches);
      setTheme(nextTheme);
    };

    preference.addEventListener("change", applyPreference);
    return () => preference.removeEventListener("change", applyPreference);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const nextTheme = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      document.documentElement.style.colorScheme = nextTheme;
      localStorage.setItem(themeKey, nextTheme);
      return nextTheme;
    });
  }, []);

  return { toggle, isDark: theme === "dark" };
}
