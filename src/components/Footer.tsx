import { Link } from "react-router-dom";
import { site } from "../data/site";

const Footer = () => (
  <footer className="site-footer">
    <div className="section-shell site-footer__top">
      <div className="site-footer__brand">
        <Link
          to="/"
          className="brand brand--footer"
          aria-label={`${site.name}, home`}
        >
          <strong className="brand__wordmark">{site.name}</strong>
        </Link>
        <p>
          Custom software, integrations, and support for the tools your business
          depends on.
        </p>
      </div>

      <div>
        <h2>Explore</h2>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/projects">Work</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>

      <div>
        <h2>Connect</h2>
        <nav className="footer-links" aria-label="Professional links">
          <a href={`mailto:${site.email}`}>Email</a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={site.socials.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={site.socials.fiverr} target="_blank" rel="noreferrer">
            Fiverr
          </a>
        </nav>
      </div>
    </div>

    <div className="section-shell site-footer__base">
      <p>
        © {new Date().getFullYear()} {site.name} · Cebu, Philippines
      </p>
    </div>
  </footer>
);

export default Footer;
