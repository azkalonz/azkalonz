import { useEffect, useRef, useState } from "react";
import type { Project } from "../data/projects";
import Icon from "./Icon";

type ShowcaseScreen = NonNullable<Project["showcase"]>[number];

type ProjectShowcaseCarouselProps = {
  screens: ShowcaseScreen[];
};

const ProjectShowcaseCarousel = ({ screens }: ProjectShowcaseCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const activeScreen = screens[activeIndex];

  const showScreen = (index: number) => {
    setActiveIndex((index + screens.length) % screens.length);
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    const opener = openerRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      } else if (event.key === "ArrowLeft") {
        setActiveIndex(
          (currentIndex) =>
            (currentIndex - 1 + screens.length) % screens.length,
        );
      } else if (event.key === "ArrowRight") {
        setActiveIndex((currentIndex) => (currentIndex + 1) % screens.length);
      } else if (event.key === "Tab") {
        const controls = Array.from(
          lightboxRef.current?.querySelectorAll<HTMLButtonElement>(
            "button:not([disabled])",
          ) ?? [],
        );
        const firstControl = controls[0];
        const lastControl = controls.at(-1);

        if (
          event.shiftKey &&
          firstControl &&
          document.activeElement === firstControl
        ) {
          event.preventDefault();
          lastControl?.focus();
        } else if (
          !event.shiftKey &&
          lastControl &&
          document.activeElement === lastControl
        ) {
          event.preventDefault();
          firstControl?.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      opener?.focus();
    };
  }, [lightboxOpen, screens.length]);

  if (!activeScreen) return null;

  const counter = `${String(activeIndex + 1).padStart(2, "0")} / ${String(
    screens.length,
  ).padStart(2, "0")}`;

  return (
    <div className="showcase-carousel">
      <div className="showcase-carousel__stage">
        <button
          ref={openerRef}
          type="button"
          className="showcase-carousel__image-button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Open ${activeScreen.title} in a lightbox`}
        >
          <img
            key={activeScreen.src}
            src={activeScreen.src}
            alt={activeScreen.alt}
            decoding="async"
            width="1280"
            height="720"
          />
          <span className="showcase-carousel__expand">
            EXPAND <Icon name="arrow-up-right" />
          </span>
        </button>

        {screens.length > 1 && (
          <>
            <button
              type="button"
              className="showcase-carousel__control showcase-carousel__control--previous"
              onClick={() => showScreen(activeIndex - 1)}
              aria-label="Show previous screen"
            >
              <Icon name="arrow-right" />
            </button>
            <button
              type="button"
              className="showcase-carousel__control showcase-carousel__control--next"
              onClick={() => showScreen(activeIndex + 1)}
              aria-label="Show next screen"
            >
              <Icon name="arrow-right" />
            </button>
          </>
        )}
      </div>

      <div className="showcase-carousel__caption" aria-live="polite">
        <span>SCREEN_{counter}</span>
        <div>
          <strong>{activeScreen.title}</strong>
          <p>{activeScreen.description}</p>
        </div>
      </div>

      <div
        className="showcase-carousel__thumbnails"
        aria-label="Product screen gallery"
      >
        {screens.map((screen, index) => (
          <button
            key={screen.src}
            type="button"
            className="showcase-carousel__thumbnail"
            aria-label={`Show screen ${index + 1}: ${screen.title}`}
            aria-pressed={index === activeIndex}
            onClick={() => showScreen(index)}
          >
            <img
              src={screen.src}
              alt=""
              loading="lazy"
              decoding="async"
              width="160"
              height="90"
            />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          ref={lightboxRef}
          className="showcase-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeScreen.title} image viewer`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLightboxOpen(false);
            }
          }}
        >
          <div className="showcase-lightbox__panel">
            <div className="showcase-lightbox__toolbar">
              <span>SCREEN_{counter}</span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close image viewer"
              >
                CLOSE <Icon name="x" />
              </button>
            </div>

            <div className="showcase-lightbox__media">
              <img
                src={activeScreen.src}
                alt={activeScreen.alt}
                width="1280"
                height="720"
              />
              {screens.length > 1 && (
                <>
                  <button
                    type="button"
                    className="showcase-lightbox__control showcase-lightbox__control--previous"
                    onClick={() => showScreen(activeIndex - 1)}
                    aria-label="Show previous screen"
                  >
                    <Icon name="arrow-right" />
                  </button>
                  <button
                    type="button"
                    className="showcase-lightbox__control showcase-lightbox__control--next"
                    onClick={() => showScreen(activeIndex + 1)}
                    aria-label="Show next screen"
                  >
                    <Icon name="arrow-right" />
                  </button>
                </>
              )}
            </div>

            <div className="showcase-lightbox__caption">
              <strong>{activeScreen.title}</strong>
              <p>{activeScreen.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcaseCarousel;
