import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import DevThemeToolbar from "./DevThemeToolbar";
import { applyStoredTileTransitionPreview } from "./tileTransitionPreview";
import { applyStoredThemePreview } from "./themePreview";
import "./themePreview.css";

declare global {
  interface Window {
    __builtByMarkThemePreviewRoot?: Root;
  }
}

export const mountThemePreview = () => {
  applyStoredThemePreview();
  applyStoredTileTransitionPreview();

  window.__builtByMarkThemePreviewRoot?.unmount();
  document.querySelector("[data-dev-theme-toolbar-root]")?.remove();

  const container = document.createElement("div");
  container.dataset.devThemeToolbarRoot = "true";
  document.body.append(container);

  const root = createRoot(container);
  window.__builtByMarkThemePreviewRoot = root;
  root.render(
    <StrictMode>
      <DevThemeToolbar />
    </StrictMode>,
  );
};
