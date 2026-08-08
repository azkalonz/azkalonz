import { useEffect, useRef, useState, type CSSProperties } from "react";
import appliedTheme from "../../../themes/current-theme.json";
import appliedTransition from "../../../transitions/current-transition.json";
import { themeCatalog } from "../../theme/themeCatalog";
import {
  createHeroTileCssTransform,
  createHeroTileTransformOrigin,
  getHeroTileFrame,
  getHeroTileVisibility,
  type HeroTileCell,
  type HeroTileTransition,
} from "../../transition/heroTileTransition";
import { heroTileTransitionCatalog } from "../../transition/heroTileTransitionCatalog";
import {
  applyTileTransitionPreview,
  getStoredTileTransitionPreview,
} from "./tileTransitionPreview";
import { applyThemePreview, getStoredThemePreview } from "./themePreview";

type LabPanel = "themes" | "motion";

const transitionPreviewCells = Array.from({ length: 24 }, (_, index) => index);

const TileTransitionPreview = ({
  transition,
}: {
  transition: HeroTileTransition;
}) => (
  <span className="dev-transition-preview" aria-hidden="true">
    {transitionPreviewCells.map((index) => {
      const cell: HeroTileCell = {
        index,
        row: Math.floor(index / 6),
        column: index % 6,
        columns: 6,
        visibleRows: 4,
        cellSize: 12,
        compact: false,
      };
      const visibility = getHeroTileVisibility(
        0.36,
        transition.reveal,
        cell,
        "hide",
      );
      const frame = getHeroTileFrame(
        visibility,
        transition.reveal.effect,
        cell,
      );

      return (
        <i
          key={index}
          style={
            {
              opacity: frame.opacity,
              transform: createHeroTileCssTransform(frame, transition.overscan),
              transformOrigin: createHeroTileTransformOrigin(frame),
            } as CSSProperties
          }
        />
      );
    })}
  </span>
);

const DevThemeToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<LabPanel>("themes");
  const [selectedThemeId, setSelectedThemeId] = useState(getStoredThemePreview);
  const [selectedTransitionId, setSelectedTransitionId] = useState(
    getStoredTileTransitionPreview,
  );
  const [copied, setCopied] = useState(false);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const selectedTheme = themeCatalog.find(
    (theme) => theme.id === selectedThemeId,
  );
  const selectedTransition = heroTileTransitionCatalog.find(
    (transition) => transition.id === selectedTransitionId,
  );
  const applyCommand =
    activePanel === "themes"
      ? selectedTheme
        ? `npm run theme:apply:${selectedTheme.id}`
        : null
      : selectedTransition
        ? `npm run transition:apply:${selectedTransition.id}`
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

  const selectTheme = (themeId: string | null) => {
    const appliedId = applyThemePreview(themeId);
    setSelectedThemeId(appliedId);
    setCopied(false);
  };

  const selectTransition = (transitionId: string | null) => {
    const appliedId = applyTileTransitionPreview(transitionId);
    setSelectedTransitionId(appliedId);
    setCopied(false);
  };

  const selectPanel = (panel: LabPanel) => {
    setActivePanel(panel);
    setCopied(false);
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
        <div id="dev-theme-panel" className="dev-theme-toolbar__panel">
          <header className="dev-theme-toolbar__header">
            <div>
              <strong>Design lab</strong>
              <span>
                Development only · {themeCatalog.length} themes ·{" "}
                {heroTileTransitionCatalog.length} transitions
              </span>
            </div>
            <button
              type="button"
              className="dev-theme-toolbar__close"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </header>

          <div
            className="dev-theme-toolbar__tabs"
            role="tablist"
            aria-label="Preview category"
          >
            <button
              id="dev-theme-tab"
              type="button"
              role="tab"
              aria-selected={activePanel === "themes"}
              aria-controls="dev-theme-options"
              onClick={() => selectPanel("themes")}
            >
              Color & type
              <small>{themeCatalog.length}</small>
            </button>
            <button
              id="dev-motion-tab"
              type="button"
              role="tab"
              aria-selected={activePanel === "motion"}
              aria-controls="dev-motion-options"
              onClick={() => selectPanel("motion")}
            >
              Tile motion
              <small>{heroTileTransitionCatalog.length}</small>
            </button>
          </div>

          <p className="dev-theme-toolbar__intro">
            {activePanel === "themes"
              ? "Change the complete color and typography system, then use the header control to inspect light and dark mode."
              : "Change how the hero tiles release the animation and hand off to the proof records. Scroll the hero to inspect the full sequence."}
          </p>

          {activePanel === "themes" ? (
            <div
              id="dev-theme-options"
              className="dev-theme-toolbar__themes"
              role="tabpanel"
              aria-labelledby="dev-theme-tab"
            >
              <button
                type="button"
                className="dev-theme-option dev-theme-option--production"
                aria-pressed={selectedThemeId === null}
                onClick={() => selectTheme(null)}
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

              {themeCatalog.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className="dev-theme-option"
                  aria-pressed={selectedThemeId === theme.id}
                  onClick={() => selectTheme(theme.id)}
                  style={
                    {
                      "--dev-swatch-canvas": theme.light.canvas,
                      "--dev-swatch-action": theme.light.relay,
                      "--dev-swatch-system": theme.light.system,
                      "--dev-swatch-proof": theme.light.proof,
                      "--dev-theme-body-font": theme.typography.fontBody,
                      "--dev-theme-display-font": theme.typography.fontDisplay,
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
          ) : (
            <div
              id="dev-motion-options"
              className="dev-theme-toolbar__transitions"
              role="tabpanel"
              aria-labelledby="dev-motion-tab"
            >
              <button
                type="button"
                className="dev-transition-option dev-transition-option--production"
                aria-pressed={selectedTransitionId === null}
                onClick={() => selectTransition(null)}
              >
                <TileTransitionPreview
                  transition={appliedTransition as HeroTileTransition}
                />
                <span>
                  <strong>Production</strong>
                  <small>Currently applied: {appliedTransition.label}</small>
                </span>
              </button>

              {heroTileTransitionCatalog.map((transition) => (
                <button
                  key={transition.id}
                  type="button"
                  className="dev-transition-option"
                  aria-pressed={selectedTransitionId === transition.id}
                  onClick={() => selectTransition(transition.id)}
                >
                  <TileTransitionPreview transition={transition} />
                  <span>
                    <strong>{transition.label}</strong>
                    <small>{transition.description}</small>
                  </span>
                </button>
              ))}
            </div>
          )}

          <footer className="dev-theme-toolbar__footer">
            {applyCommand ? (
              <>
                <div>
                  <span>
                    Apply this {activePanel === "themes" ? "theme" : "motion"}{" "}
                    permanently
                  </span>
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
        <small>
          {selectedTheme?.label ?? "Production"} ·{" "}
          {selectedTransition?.label ?? appliedTransition.label}
        </small>
      </button>
    </aside>
  );
};

export default DevThemeToolbar;
