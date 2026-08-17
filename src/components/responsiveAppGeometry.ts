export type HeroScreenLayout = "compact" | "medium" | "desktop";
export type ResponsiveAppLayout = "desktop" | "tablet" | "phone";

export type ResponsiveAppRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ResponsiveAppGeometry = {
  shell: ResponsiveAppRect & { radius: number };
  header: ResponsiveAppRect;
  nav: ResponsiveAppRect;
  toolbar: ResponsiveAppRect;
  orders: ResponsiveAppRect;
  detail: ResponsiveAppRect;
};

export type ResponsiveAppViewport = {
  x: number;
  y: number;
  zoom: number;
};

export type ResponsiveAppCameraPlan = Record<
  ResponsiveAppLayout,
  ResponsiveAppViewport
>;

export const getHeroScreenLayout = (viewportWidth: number): HeroScreenLayout =>
  viewportWidth <= 719
    ? "compact"
    : viewportWidth <= 1279
      ? "medium"
      : "desktop";

export const RESPONSIVE_APP_LAYOUTS: Record<
  ResponsiveAppLayout,
  ResponsiveAppGeometry
> = {
  desktop: {
    shell: { x: 40, y: 35, width: 920, height: 470, radius: 12 },
    header: { x: 0, y: 30, width: 920, height: 44 },
    nav: { x: 0, y: 74, width: 148, height: 396 },
    toolbar: { x: 148, y: 74, width: 548, height: 62 },
    orders: { x: 148, y: 136, width: 548, height: 334 },
    detail: { x: 696, y: 74, width: 224, height: 396 },
  },
  tablet: {
    shell: { x: 175, y: 35, width: 650, height: 470, radius: 13 },
    header: { x: 0, y: 30, width: 650, height: 44 },
    nav: { x: 0, y: 74, width: 52, height: 396 },
    toolbar: { x: 52, y: 74, width: 598, height: 64 },
    orders: { x: 52, y: 138, width: 598, height: 202 },
    detail: { x: 52, y: 340, width: 598, height: 130 },
  },
  phone: {
    shell: { x: 320, y: 20, width: 360, height: 500, radius: 30 },
    header: { x: 8, y: 28, width: 344, height: 50 },
    nav: { x: 8, y: 434, width: 344, height: 48 },
    toolbar: { x: 8, y: 78, width: 344, height: 78 },
    orders: { x: 8, y: 156, width: 344, height: 152 },
    detail: { x: 8, y: 308, width: 344, height: 126 },
  },
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const getViewportForRect = (
  bounds: ResponsiveAppRect,
  width: number,
  height: number,
  minimumZoom: number,
  maximumZoom: number,
  padding: number,
): ResponsiveAppViewport => {
  const paddingX = Math.floor((width - width / (1 + padding)) * 0.5);
  const paddingY = Math.floor((height - height / (1 + padding)) * 0.5);
  const zoom = clamp(
    Math.min(
      (width - paddingX * 2) / bounds.width,
      (height - paddingY * 2) / bounds.height,
    ),
    minimumZoom,
    maximumZoom,
  );
  const x = width / 2 - (bounds.x + bounds.width / 2) * zoom;
  const y = height / 2 - (bounds.y + bounds.height / 2) * zoom;
  const appliedLeft = Math.floor(bounds.x * zoom + x);
  const appliedTop = Math.floor(bounds.y * zoom + y);
  const appliedRight = Math.floor(width - (bounds.x + bounds.width) * zoom - x);
  const appliedBottom = Math.floor(
    height - (bounds.y + bounds.height) * zoom - y,
  );
  const offsetLeft = Math.min(appliedLeft - paddingX, 0);
  const offsetTop = Math.min(appliedTop - paddingY, 0);
  const offsetRight = Math.min(appliedRight - paddingX, 0);
  const offsetBottom = Math.min(appliedBottom - paddingY, 0);

  return {
    x: x - offsetLeft + offsetRight,
    y: y - offsetTop + offsetBottom,
    zoom,
  };
};

export const getResponsiveAppCameraPlan = (
  width: number,
  height: number,
  layout: HeroScreenLayout,
): ResponsiveAppCameraPlan => {
  const maxZoom = layout === "desktop" ? 1 : layout === "medium" ? 1.02 : 1.06;
  const padding = layout === "compact" ? 0.055 : 0.07;
  const frame = ({ shell }: ResponsiveAppGeometry) =>
    getViewportForRect(shell, width, height, 0.18, maxZoom, padding);

  return {
    desktop: frame(RESPONSIVE_APP_LAYOUTS.desktop),
    tablet: frame(RESPONSIVE_APP_LAYOUTS.tablet),
    phone: frame(RESPONSIVE_APP_LAYOUTS.phone),
  };
};
