import { STUDIO_PATH, studioPath } from "../lib/routes";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site } from "../data/site";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: studioPath("/projects"), label: "Work" },
  { href: studioPath("/services"), label: "Services" },
  { href: studioPath("/about"), label: "About" },
] as const;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pointerInteractionRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (
        pointerInteractionRef.current &&
        headerRef.current?.contains(document.activeElement)
      ) {
        (document.activeElement as HTMLElement).blur();
      }
      pointerInteractionRef.current = false;
      setOpen(false);
      setIsHidden(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.key]);

  useEffect(() => {
    let frame = 0;
    let lastY = Math.max(window.scrollY, 0);
    let downwardTravel = 0;
    let upwardTravel = 0;

    const updateScrollState = () => {
      const y = Math.max(window.scrollY, 0);
      const delta = y - lastY;

      if (y <= 8) {
        downwardTravel = 0;
        upwardTravel = 0;
        setIsScrolled(false);
        setIsHidden(false);
      } else {
        setIsScrolled(true);

        if (delta > 0) {
          downwardTravel += delta;
          upwardTravel = 0;

          const activeElement = document.activeElement;
          const headerHasKeyboardFocus =
            activeElement instanceof HTMLElement &&
            activeElement.matches(":focus-visible") &&
            headerRef.current?.contains(activeElement);
          if (
            !open &&
            !headerHasKeyboardFocus &&
            y > 96 &&
            downwardTravel >= 12
          ) {
            setIsHidden(true);
            downwardTravel = 0;
          }
        } else if (delta < 0) {
          upwardTravel -= delta;
          downwardTravel = 0;

          if (upwardTravel >= 8) {
            setIsHidden(false);
            upwardTravel = 0;
          }
        }
      }

      lastY = y;
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollState);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    frame = window.requestAnimationFrame(updateScrollState);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [location.key, open]);

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
    <header
      ref={headerRef}
      className={`site-header${isScrolled ? " site-header--scrolled" : ""}${
        isHidden ? " site-header--hidden" : ""
      }`}
      onFocusCapture={() => setIsHidden(false)}
      onPointerDownCapture={() => {
        pointerInteractionRef.current = true;
      }}
      onKeyDownCapture={() => {
        pointerInteractionRef.current = false;
      }}
    >
      <div className="site-header__inner">
        <Link
          to={STUDIO_PATH}
          onClick={() => setOpen(false)}
          className="brand"
          aria-label={`${site.name}, home`}
        >
          <span className="brand__wordmark">{site.name}</span>
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
            to={studioPath("/contact")}
            className="button button--primary button--small desktop-contact"
          >
            Contact
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() =>
              setOpen((value) => {
                const next = !value;
                if (next) setIsHidden(false);
                return next;
              })
            }
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
          <NavLink to={STUDIO_PATH} end onClick={() => setOpen(false)}>
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
            to={studioPath("/contact")}
            onClick={() => setOpen(false)}
            className="mobile-menu__action"
          >
            <strong>Contact</strong>
            <Icon name="arrow-up-right" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
