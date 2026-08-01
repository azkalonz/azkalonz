import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { site } from "../data/site";
import BrandWordmark from "./BrandWordmark";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/projects", label: "Work" },
  { href: "/services", label: "Services" },
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
          aria-label={`${site.name}, home`}
        >
          <BrandWordmark />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
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
            className="button button--primary button--small desktop-contact"
          >
            Tell me about your project
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "x" : "menu"} />
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
        <nav
          className="mobile-menu__nav section-shell"
          aria-label="Mobile navigation"
        >
          <NavLink to="/" onClick={() => setOpen(false)}>
            <strong>Home</strong>
            <Icon name="arrow-right" />
          </NavLink>
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
            >
              <strong>{link.label}</strong>
              <Icon name="arrow-right" />
            </NavLink>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mobile-menu__action"
          >
            <strong>Tell me about your project</strong>
            <Icon name="arrow-up-right" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
