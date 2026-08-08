import {
  createAppliedHeroTileTransitionCss,
  HERO_TILE_TRANSITION_CHANGE_EVENT,
} from "../../transition/heroTileTransition";
import { getHeroTileTransitionById } from "../../transition/heroTileTransitionCatalog";

export const tileTransitionPreviewStorageKey =
  "builtbymark:dev-tile-transition-preview";
const previewStyleId = "dev-tile-transition-preview-style";

const readStoredTransitionId = () => {
  try {
    return localStorage.getItem(tileTransitionPreviewStorageKey);
  } catch {
    return null;
  }
};

const writeStoredTransitionId = (transitionId: string | null) => {
  try {
    if (transitionId) {
      localStorage.setItem(tileTransitionPreviewStorageKey, transitionId);
    } else {
      localStorage.removeItem(tileTransitionPreviewStorageKey);
    }
  } catch {
    // Preview persistence is optional when storage is unavailable.
  }
};

const refreshTileTransition = () => {
  window.dispatchEvent(new CustomEvent(HERO_TILE_TRANSITION_CHANGE_EVENT));
  window.requestAnimationFrame(() =>
    window.requestAnimationFrame(() =>
      window.dispatchEvent(new Event("resize")),
    ),
  );
};

export const getStoredTileTransitionPreview = () => {
  const transitionId = readStoredTransitionId();
  return transitionId && getHeroTileTransitionById(transitionId)
    ? transitionId
    : null;
};

export const applyTileTransitionPreview = (transitionId: string | null) => {
  const root = document.documentElement;
  const existingStyle = document.getElementById(previewStyleId);

  if (!transitionId) {
    existingStyle?.remove();
    delete root.dataset.devTileTransition;
    writeStoredTransitionId(null);
    refreshTileTransition();
    return null;
  }

  const transition = getHeroTileTransitionById(transitionId);
  if (!transition) return getStoredTileTransitionPreview();

  const style = existingStyle ?? document.createElement("style");
  style.id = previewStyleId;
  style.dataset.devTileTransitionPreview = "true";
  style.textContent = createAppliedHeroTileTransitionCss(transition);
  if (!style.isConnected) document.head.append(style);

  root.dataset.devTileTransition = transition.id;
  writeStoredTransitionId(transition.id);
  refreshTileTransition();
  return transition.id;
};

export const applyStoredTileTransitionPreview = () =>
  applyTileTransitionPreview(getStoredTileTransitionPreview());
