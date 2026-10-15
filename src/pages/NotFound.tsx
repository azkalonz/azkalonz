import { Link, useLocation } from "react-router-dom";
import Seo from "../components/Seo";
import { STUDIO_PATH } from "../lib/routes";

const NotFound = () => {
  const { pathname } = useLocation();
  const homePath = pathname.startsWith(`${STUDIO_PATH}/`) ? STUDIO_PATH : "/";
  return (
    <>
      <Seo
        title="Page not found"
        description="The requested page could not be found."
        noIndex
      />
      <section className="not-found section-shell">
        <h1>This page has moved—or never existed.</h1>
        <p>The link may be outdated. Return home to find your way back.</p>
        <Link to={homePath} className="button button--primary">
          Return home
        </Link>
      </section>
    </>
  );
};

export default NotFound;
