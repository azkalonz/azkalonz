import { Link } from "react-router-dom";
import { site } from "../data/site";
import BrandMark from "./BrandMark";
import Icon from "./Icon";

const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div className="site-footer__brand">
        <Link
          to="/"
          className="brand brand--footer"
          aria-label="Mark Judaya, home"
        >
          <BrandMark />
          <span className="brand__text">
            <strong>Mark Judaya</strong>
          </span>
        </Link>
        <p>
          I build, connect, improve, and support the technology growing
          businesses rely on.
        </p>
      </div>

      <div>
        <h2 className="footer-heading">Explore</h2>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/services">Services</Link>
          <Link to="/projects">Selected work</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>

      <div>
        <h2 className="footer-heading">Connect</h2>
        <div className="footer-links">
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
        </div>
      </div>
    </div>

    <div className="site-footer__base">
      <p>© {new Date().getFullYear()} Mark Judaya. All rights reserved.</p>
      <a
        href={site.bookingUrl}
        target="_blank"
        rel="noreferrer"
        className="footer-call-link"
      >
        Book a call <Icon name="arrow-up-right" />
      </a>
    </div>
  </footer>
);

export default Footer;
