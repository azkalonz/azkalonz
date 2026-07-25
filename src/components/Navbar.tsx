import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { site } from "../data/site";
import BrandMark from "./BrandMark";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home", end: true },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
] as const;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      if (!open) return;
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="brand"
          aria-label="Mark Judaya, home"
        >
          <BrandMark />
          <span className="brand__text">
            <strong>Mark Judaya</strong>
            <small>IT Solutions Developer</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={"end" in link ? link.end : false}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link--active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />
          <Link
            to="/contact"
            className="button button--primary button--sm desktop-contact"
          >
            Start a project
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="icon-button mobile-menu-button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "x" : "menu"} className="icon-button__icon" />
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}
      >
        <nav className="mobile-menu__nav" aria-label="Mobile navigation">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={"end" in link ? link.end : false}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "mobile-nav-link--active" : ""}`
              }
            >
              <span>{link.label}</span>
              <Icon name="arrow-right" className="mobile-nav-link__icon" />
            </NavLink>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="button button--primary button--full"
          >
            Start a project
          </Link>
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="button button--secondary button--full"
          >
            Book a discovery call
            <Icon name="arrow-up-right" className="button__icon" />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
