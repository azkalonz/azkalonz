import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const NotFound = () => (
  <>
    <Seo
      title="Page not found"
      description="The requested page could not be found."
      noIndex
    />
    <section className="not-found section-shell">
      <p className="eyebrow">404</p>
      <h1>This page has moved—or never existed.</h1>
      <p>
        Use the main navigation, or return home to explore services and selected
        work.
      </p>
      <Link to="/" className="button button--primary">
        Return home
      </Link>
    </section>
  </>
);

export default NotFound;
