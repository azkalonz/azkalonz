import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { HelmetProvider } from "./lib/helmet";

import "@fontsource-variable/source-sans-3";
import "virtual:applied-theme.css";
import "virtual:applied-tile-transition.css";
import "./index.css";

const renderApp = () => {
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </HelmetProvider>,
  );
};

if (import.meta.env.DEV) {
  void import("./dev/theme-preview/mount")
    .then(({ mountThemePreview }) => {
      mountThemePreview();
      renderApp();
    })
    .catch(renderApp);
} else {
  renderApp();
}
