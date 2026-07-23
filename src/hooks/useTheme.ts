import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const themeKey = "theme";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(themeKey);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(themeKey, theme);
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((value) => (value === "dark" ? "light" : "dark")),
    [],
  );

  return { toggle, isDark: theme === "dark" };
}
