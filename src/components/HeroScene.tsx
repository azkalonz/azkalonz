import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import HeroPipeline from "./HeroPipeline";
import {
  createHeroSceneFrame,
  getHeroSceneTriggerEnd,
  getHeroSceneTriggerStart,
  heroAttachedEmbers,
  heroFlightEmbers,
  HERO_SCENE_SCRUB,
  type HeroEmberRectFrame,
} from "./heroSceneMotion";

type HeroSceneProps = {
  children: ReactNode;
};

const HeroScene = ({ children }: HeroSceneProps) => {
  const sceneId = useId().replaceAll(":", "");
  const clipPathId = `hero-wall-${sceneId}`;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const gridScrollRef = useRef<HTMLDivElement | null>(null);
  const clipPathRef = useRef<SVGPathElement | null>(null);
  const attachedEmbersRef = useRef<HTMLDivElement | null>(null);
  const flightEmbersRef = useRef<HTMLDivElement | null>(null);
  const foregroundRef = useRef<HTMLDivElement | null>(null);
  const worldScrollRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const scene = sceneRef.current;
    const gridScroll = gridScrollRef.current;
    const clipPath = clipPathRef.current;
    const attachedEmbers = attachedEmbersRef.current;
    const flightEmbers = flightEmbersRef.current;
    const foreground = foregroundRef.current;
    const worldScroll = worldScrollRef.current;
    const siteHeader = document.querySelector<HTMLElement>(".site-header");

    if (
      !track ||
      !scene ||
      !gridScroll ||
      !clipPath ||
      !attachedEmbers ||
      !flightEmbers ||
      !foreground ||
      !worldScroll
    ) {
      return;
    }

    const collectEmbers = (root: HTMLElement) =>
      new Map(
        Array.from(
          root.querySelectorAll<HTMLElement>("[data-hero-ember]"),
        ).flatMap((element) => {
          const id = element.dataset.heroEmber;
          return id ? [[id, element] as const] : [];
        }),
      );
    const attachedEmberElements = collectEmbers(attachedEmbers);
    const flightEmberElements = collectEmbers(flightEmbers);
    const emberSignatures = new Map<string, string>();
    let lastClipPathData = "";

    const setNavigationBlend = (progress: number) => {
      if (!siteHeader) return;

      siteHeader.dataset.heroSceneActive = "true";
      siteHeader.style.setProperty("--hero-nav-blend", progress.toFixed(4));
    };

    const renderEmbers = (
      frames: readonly HeroEmberRectFrame[],
      elements: ReadonlyMap<string, HTMLElement>,
    ) => {
      frames.forEach((frame) => {
        const element = elements.get(frame.id);
        if (!element) return;

        const signature = frame.visible
          ? `${frame.x.toFixed(2)}:${frame.y.toFixed(2)}:${frame.size.toFixed(2)}`
          : "hidden";
        if (emberSignatures.get(frame.id) === signature) return;

        emberSignatures.set(frame.id, signature);
        element.style.visibility = frame.visible ? "visible" : "hidden";
        if (!frame.visible) return;

        element.style.width = `${frame.size}px`;
        element.style.height = `${frame.size}px`;
        element.style.transform = `translate3d(${frame.x}px, ${frame.y}px, 0)`;
      });
    };

    const render = (progress: number) => {
      const frame = createHeroSceneFrame(progress, window.innerWidth <= 900, {
        width: scene.clientWidth,
        height: scene.clientHeight,
      });

      scene.style.setProperty("--hero-wall-clip", frame.wallClipPath);
      if (frame.wallClipPathData !== lastClipPathData) {
        clipPath.setAttribute("d", frame.wallClipPathData);
        lastClipPathData = frame.wallClipPathData;
      }
      foreground.style.clipPath = `url("#${clipPathId}")`;
      foreground.style.setProperty(
        "-webkit-clip-path",
        `url("#${clipPathId}")`,
      );
      gridScroll.style.transform = `translate3d(${frame.gridX}vw, 0, 0)`;
      worldScroll.style.transform = `translate3d(${frame.worldX}vw, 0, 0)`;
      worldScroll.style.setProperty(
        "--pipeline-dark-progress",
        frame.useDarkPalette ? "1" : "0",
      );
      foreground.inert = frame.foregroundInert;
      renderEmbers(frame.attachedEmbers, attachedEmberElements);
      renderEmbers(frame.flightEmbers, flightEmberElements);
      setNavigationBlend(frame.navigationBlend);

      if (frame.useDarkPalette) {
        worldScroll.dataset.pipelineTheme = "dark";
      } else {
        worldScroll.removeAttribute("data-pipeline-theme");
      }
    };

    const clearScene = () => {
      worldScroll.removeAttribute("data-pipeline-theme");
      worldScroll.style.removeProperty("--pipeline-dark-progress");
      foreground.inert = false;
      scene.removeAttribute("data-hero-scene-motion");
      scene.style.removeProperty("--hero-wall-clip");
      clipPath.removeAttribute("d");
      foreground.style.removeProperty("clip-path");
      foreground.style.removeProperty("-webkit-clip-path");
      siteHeader?.removeAttribute("data-hero-scene-active");
      siteHeader?.style.removeProperty("--hero-nav-blend");
      gridScroll.style.removeProperty("transform");
      worldScroll.style.removeProperty("transform");
      [
        ...attachedEmberElements.values(),
        ...flightEmberElements.values(),
      ].forEach((ember) => {
        ember.style.removeProperty("visibility");
        ember.style.removeProperty("width");
        ember.style.removeProperty("height");
        ember.style.removeProperty("transform");
      });
      emberSignatures.clear();
      lastClipPathData = "";
    };

    render(0);

    scene.dataset.heroSceneMotion = "pending";
    let cancelled = false;
    let revert = clearScene;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;

        const { gsap } = gsapModule;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        const progressState = { value: 0 };
        const context = gsap.context(() => {
          gsap.to(progressState, {
            value: 1,
            ease: "none",
            onUpdate: () => render(progressState.value),
            scrollTrigger: {
              trigger: track,
              start: getHeroSceneTriggerStart,
              end: () => getHeroSceneTriggerEnd(scene),
              scrub: HERO_SCENE_SCRUB,
              invalidateOnRefresh: true,
              onRefresh: (self) => render(self.progress),
            },
          });

          if (siteHeader) {
            ScrollTrigger.create({
              trigger: track,
              start: "bottom bottom",
              end: "bottom top",
              invalidateOnRefresh: true,
              onEnter: () => setNavigationBlend(1),
              onEnterBack: () => setNavigationBlend(0),
              onUpdate: (self) => {
                if (self.isActive || self.progress > 0) {
                  setNavigationBlend(1 - self.progress);
                }
              },
              onLeave: () => setNavigationBlend(0),
              onLeaveBack: () => render(progressState.value),
            });
          }

          scene.dataset.heroSceneMotion = "active";
        }, scene);

        revert = () => {
          context.revert();
          clearScene();
        };
      })
      .catch(() => {
        scene.removeAttribute("data-hero-scene-motion");
      });

    return () => {
      cancelled = true;
      revert();
    };
  }, [clipPathId]);

  return (
    <div ref={trackRef} className="relay-hero__motion-track">
      <div ref={sceneRef} className="relay-hero__stage-inner">
        <svg
          className="hero-scene__clip-definitions"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
              <path ref={clipPathRef} fillRule="evenodd" clipRule="evenodd" />
            </clipPath>
          </defs>
        </svg>

        <div
          ref={gridScrollRef}
          className="hero-scene__grid-scroll"
          aria-hidden="true"
        >
          <div className="hero-scene__grid-pointer">
            <div className="hero-scene__grid-root">
              <div className="hero-scene__grid-plane" data-hero-grid>
                <div className="hero-scene__grid-surface" />
              </div>
            </div>
          </div>
        </div>

        <div
          ref={flightEmbersRef}
          className="hero-scene__ember-flight"
          aria-hidden="true"
        >
          {heroFlightEmbers.map((ember) => (
            <span
              key={ember.id}
              className={`hero-scene__ember hero-scene__ember--${ember.tone}`}
              data-hero-ember={ember.id}
            />
          ))}
        </div>

        <div ref={foregroundRef} className="hero-scene__foreground">
          <div className="hero-scene__wall" data-hero-wall aria-hidden="true" />
          <div
            ref={attachedEmbersRef}
            className="hero-scene__ember-texture"
            aria-hidden="true"
          >
            {heroAttachedEmbers.map((ember) => (
              <span
                key={ember.id}
                className={`hero-scene__ember hero-scene__ember--${ember.tone}`}
                data-hero-ember={ember.id}
              />
            ))}
          </div>

          <div className="relay-hero__copy">{children}</div>
        </div>

        <div ref={worldScrollRef} className="hero-scene__world-scroll">
          <div className="hero-scene__world-pointer">
            <HeroPipeline />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroScene;
