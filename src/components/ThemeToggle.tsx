import useTheme from "../hooks/useTheme";
import Icon from "./Icon";

const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={isDark}
      className="theme-toggle"
      title={label}
    >
      <Icon name={isDark ? "sun" : "moon"} />
    </button>
  );
};

export default ThemeToggle;
