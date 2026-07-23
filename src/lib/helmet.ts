import * as helmetModule from "react-helmet-async";

type HelmetExports = {
  Helmet: typeof helmetModule.Helmet;
  HelmetProvider: typeof helmetModule.HelmetProvider;
};

const fallback = Reflect.get(helmetModule, "default") as
  HelmetExports | undefined;
const helmetExports =
  "Helmet" in helmetModule ? (helmetModule as HelmetExports) : fallback;

if (!helmetExports) {
  throw new Error("react-helmet-async exports are unavailable");
}

export const { Helmet, HelmetProvider } = helmetExports;
