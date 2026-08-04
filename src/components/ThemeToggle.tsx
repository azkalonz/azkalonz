import useTheme from "../hooks/useTheme";
import Icon from "./Icon";

const ThemeToggle = () => {
  const { isDark, isToggleDisabled, toggle } = useTheme();
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  const title = isToggleDisabled
    ? "Theme transitions are finishing"
    : label;

  return (
    <button
      type="button"
      onClick={(event) => toggle(event.currentTarget)}
      aria-label={label}
      aria-pressed={isDark}
      className="theme-toggle"
      disabled={isToggleDisabled}
      title={title}
    >
      <Icon name={isDark ? "sun" : "moon"} />
    </button>
  );
};

export default ThemeToggle;
