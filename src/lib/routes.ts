export const STUDIO_PATH = "/studio";

export const studioPath = (path = "") => {
  if (!path || path === "/") return STUDIO_PATH;
  return `${STUDIO_PATH}${path.startsWith("/") ? path : `/${path}`}`;
};
