import { useEffect, useRef, useState, type CSSProperties } from "react";
import appliedTheme from "../../../themes/current-theme.json";
import { themeCatalog } from "../../theme/themeCatalog";
import { applyThemePreview, getStoredThemePreview } from "./themePreview";

const themeGroups = [
  { label: "Established directions", themes: themeCatalog.slice(0, 11) },
  { label: "Quiet systems", themes: themeCatalog.slice(11, 16) },
  { label: "Editorial", themes: themeCatalog.slice(16, 21) },
  { label: "Industrial", themes: themeCatalog.slice(21, 26) },
  { label: "Expressive, restrained", themes: themeCatalog.slice(26, 31) },
] as const;

const DevThemeToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState(getStoredThemePreview);
  const [copied, setCopied] = useState(false);
  const [isApplyingTheme, setIsApplyingTheme] = useState(false);
  const [themeStatus, setThemeStatus] = useState("");
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const selectionRequestRef = useRef(0);
  const selectedTheme = themeCatalog.find(
    (theme) => theme.id === selectedThemeId,
  );
  const applyCommand = selectedTheme
    ? `npm run theme:apply -- ${selectedTheme.id}`
    : null;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      launcherRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const selectTheme = async (themeId: string | null) => {
    const requestId = ++selectionRequestRef.current;
    const theme = themeId
      ? themeCatalog.find((candidate) => candidate.id === themeId)
      : null;

    setIsApplyingTheme(true);
    setThemeStatus(
      theme?.fontStylesheet ? `Loading ${theme.typography.label}` : "",
    );

    const appliedId = await applyThemePreview(themeId);
    if (requestId !== selectionRequestRef.current) return;

    setSelectedThemeId(appliedId);
    setCopied(false);
    setIsApplyingTheme(false);
    setThemeStatus(
      appliedId
        ? `${theme?.label ?? "Theme"} preview ready`
        : "Production theme restored",
    );
  };

  const copyCommand = async () => {
    if (!applyCommand) return;

    try {
      await navigator.clipboard.writeText(applyCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside className="dev-theme-toolbar" aria-label="Development design tools">
      {isOpen && (
        <div
          id="dev-theme-panel"
          className="dev-theme-toolbar__panel"
          aria-busy={isApplyingTheme}
        >
          <header className="dev-theme-toolbar__header">
            <div>
              <strong>Design lab</strong>
              <span>Development only · {themeCatalog.length} themes</span>
            </div>
            <button
              type="button"
              className="dev-theme-toolbar__close"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </header>

          <p className="dev-theme-toolbar__intro">
            Change the complete color and typography system, then use the header
            control to inspect light and dark mode.
          </p>

          <div className="dev-theme-toolbar__themes">
            <button
              type="button"
              className="dev-theme-option dev-theme-option--production"
              aria-pressed={selectedThemeId === null}
              onClick={() => void selectTheme(null)}
            >
              <span className="dev-theme-option__production-mark" aria-hidden>
                <i />
                <i />
                <i />
                <i />
              </span>
              <span>
                <strong>Production</strong>
                <small>Currently applied: {appliedTheme.label}</small>
                <span className="dev-theme-option__type-note">
                  {appliedTheme.typography.label}
                </span>
              </span>
            </button>

            {themeGroups.map((group) => (
              <section className="dev-theme-group" key={group.label}>
                <h2>{group.label}</h2>
                <div className="dev-theme-group__options">
                  {group.themes.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      className="dev-theme-option"
                      aria-pressed={selectedThemeId === theme.id}
                      onClick={() => void selectTheme(theme.id)}
                      style={
                        {
                          "--dev-swatch-canvas": theme.light.canvas,
                          "--dev-swatch-action": theme.light.relay,
                          "--dev-swatch-system": theme.light.system,
                          "--dev-swatch-proof": theme.light.proof,
                          "--dev-theme-body-font": theme.typography.fontBody,
                          "--dev-theme-display-font":
                            theme.typography.fontDisplay,
                          "--dev-theme-display-weight":
                            theme.typography.displayWeight,
                          "--dev-theme-display-tracking":
                            theme.typography.displayTracking,
                          "--dev-theme-display-transform":
                            theme.typography.displayTransform,
                          "--dev-theme-display-style":
                            theme.typography.displayStyle,
                        } as CSSProperties
                      }
                    >
                      <span className="dev-theme-option__swatches" aria-hidden>
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                      <span>
                        <strong>{theme.label}</strong>
                        <small>{theme.description}</small>
                        <span className="dev-theme-option__type-note">
                          {theme.typography.label}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {themeStatus}
          </span>

          <footer className="dev-theme-toolbar__footer">
            {applyCommand ? (
              <>
                <div>
                  <span>Apply this theme permanently</span>
                  <code>{applyCommand}</code>
                </div>
                <button type="button" onClick={copyCommand}>
                  {copied ? "Copied" : "Copy command"}
                </button>
              </>
            ) : (
              <p>
                Select a preview to reveal its permanent apply command. Your
                production choice stays unchanged until then.
              </p>
            )}
          </footer>
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        className="dev-theme-toolbar__launcher"
        aria-expanded={isOpen}
        aria-controls="dev-theme-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden />
        Design lab
        <small>{selectedTheme?.label ?? "Production"}</small>
      </button>
    </aside>
  );
};

export default DevThemeToolbar;
