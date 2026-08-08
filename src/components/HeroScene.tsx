import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import HeroPipeline from "./HeroPipeline";
import {
  createHeroCameraFrame,
  getHeroSceneTriggerEnd,
  getHeroSceneTriggerStart,
  HERO_SCENE_SCRUB,
} from "./heroSceneMotion";
import {
  createHeroTileCssTransform,
  createHeroTileSvgTransform,
  createHeroTileTransformOrigin,
  getHeroTileFrame,
  getHeroTilePhaseCompletion,
  getHeroTileVisibility,
  HERO_TILE_TRANSITION_CHANGE_EVENT,
  readAppliedHeroTileTransition,
  type HeroTileCell,
  type HeroTileFrame,
} from "../transition/heroTileTransition";

type HeroSceneProps = {
  children: ReactNode;
  outro: ReactNode;
};

const HERO_CURTAIN_CELL_COUNT = 528;
const HERO_CURTAIN_DESKTOP_COLUMNS = 24;
const HERO_CURTAIN_COMPACT_COLUMNS = 10;
const HERO_CURTAIN_COMPACT_CELL_COUNT = 240;
const heroCurtainCells = Array.from(
  { length: HERO_CURTAIN_CELL_COUNT },
  (_, index) => index,
);

const HeroScene = ({ children, outro }: HeroSceneProps) => {
  const [tileTransitionRevision, setTileTransitionRevision] = useState(0);
  const sceneId = useId().replaceAll(":", "");
  const copyClipId = `hero-copy-clip-${sceneId}`;
  const proofClipId = `hero-proof-clip-${sceneId}`;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const gridScrollRef = useRef<HTMLDivElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const copyClipRef = useRef<SVGClipPathElement | null>(null);
  const proofClipRef = useRef<SVGClipPathElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const worldScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const refreshTransition = () =>
      setTileTransitionRevision((revision) => revision + 1);
    window.addEventListener(
      HERO_TILE_TRANSITION_CHANGE_EVENT,
      refreshTransition,
    );

    return () =>
      window.removeEventListener(
        HERO_TILE_TRANSITION_CHANGE_EVENT,
        refreshTransition,
      );
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const scene = sceneRef.current;
    const gridScroll = gridScrollRef.current;
    const curtain = curtainRef.current;
    const copyClip = copyClipRef.current;
    const proofClip = proofClipRef.current;
    const copy = copyRef.current;
    const worldScroll = worldScrollRef.current;
    const siteHeader = document.querySelector<HTMLElement>(".site-header");

    if (
      !track ||
      !scene ||
      !gridScroll ||
      !curtain ||
      !copyClip ||
      !proofClip ||
      !copy ||
      !worldScroll
    ) {
      return;
    }

    const tileTransition = readAppliedHeroTileTransition(scene);
    scene.dataset.heroTileTransition = tileTransition.id;

    const allCurtainCells = Array.from(
      curtain.querySelectorAll<HTMLElement>("[data-hero-curtain-cell]"),
    );
    const allCopyClipCells = Array.from(
      copyClip.querySelectorAll<SVGRectElement>("[data-hero-copy-clip-cell]"),
    );
    const allProofClipCells = Array.from(
      proofClip.querySelectorAll<SVGRectElement>("[data-hero-proof-clip-cell]"),
    );
    let exitProgress = 0;

    const setNavigationBlend = (progress: number) => {
      if (!siteHeader) return;

      siteHeader.dataset.heroSceneActive = "true";
      siteHeader.style.setProperty("--hero-nav-blend", progress.toFixed(4));
    };

    const setCopyInert = (isInert: boolean) => {
      if (copy.inert === isInert) return;

      copy.inert = isInert;
      if (isInert && copy.contains(document.activeElement)) {
        (document.activeElement as HTMLElement | null)?.blur();
      }
    };

    const renderCamera = (progress: number) => {
      const frame = createHeroCameraFrame(progress, window.innerWidth <= 900);

      gridScroll.style.transform = `translate3d(${frame.gridX}vw, 0, 0)`;
      worldScroll.style.transform = `translate3d(${frame.worldX}vw, 0, 0)`;
      worldScroll.style.setProperty(
        "--pipeline-dark-progress",
        frame.useDarkPalette ? "1" : "0",
      );
      if (exitProgress <= 0) {
        setNavigationBlend(frame.navigationBlend);
      }

      if (frame.useDarkPalette) {
        worldScroll.dataset.pipelineTheme = "dark";
      } else {
        worldScroll.removeAttribute("data-pipeline-theme");
      }
    };

    const clearScene = () => {
      scene.removeAttribute("data-hero-scene-motion");
      scene.removeAttribute("data-hero-copy-clip-active");
      scene.removeAttribute("data-hero-proof-clip-active");
      scene.removeAttribute("data-hero-tile-transition");
      worldScroll.removeAttribute("data-pipeline-theme");
      worldScroll.style.removeProperty("--pipeline-dark-progress");
      siteHeader?.removeAttribute("data-hero-scene-active");
      siteHeader?.style.removeProperty("--hero-nav-blend");
      gridScroll.style.removeProperty("transform");
      worldScroll.style.removeProperty("transform");
      setCopyInert(false);
      copy.style.removeProperty("opacity");
      copy.style.removeProperty("visibility");
      copy.style.removeProperty("transform");
      allCurtainCells.forEach((cell) => {
        cell.style.removeProperty("opacity");
        cell.style.removeProperty("transform");
        cell.style.removeProperty("transform-origin");
      });
      allCopyClipCells.forEach((cell) => {
        cell.removeAttribute("x");
        cell.removeAttribute("y");
        cell.removeAttribute("width");
        cell.removeAttribute("height");
        cell.removeAttribute("transform");
        cell.style.removeProperty("transform");
        cell.style.removeProperty("transform-origin");
      });
      allProofClipCells.forEach((cell) => {
        cell.removeAttribute("x");
        cell.removeAttribute("y");
        cell.removeAttribute("width");
        cell.removeAttribute("height");
        cell.removeAttribute("transform");
        cell.style.removeProperty("transform");
        cell.style.removeProperty("transform-origin");
      });
    };

    renderCamera(0);
    scene.dataset.heroSceneMotion = "pending";

    let cancelled = false;
    let revert = clearScene;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scene.dataset.heroSceneMotion = "active";
      return clearScene;
    }

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
            onUpdate: () => renderCamera(progressState.value),
            scrollTrigger: {
              trigger: track,
              start: getHeroSceneTriggerStart,
              end: () => getHeroSceneTriggerEnd(scene),
              scrub: HERO_SCENE_SCRUB,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                progressState.value = self.progress;
                renderCamera(self.progress);
              },
            },
          });

          scene.dataset.heroSceneMotion = "active";
        }, scene);

        const motionMedia = gsap.matchMedia();
        motionMedia.add(
          {
            desktop: "(min-width: 901px)",
            compact: "(max-width: 900px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          (mediaContext) => {
            const conditions = mediaContext.conditions as
              { compact?: boolean; reduceMotion?: boolean } | undefined;
            if (conditions?.reduceMotion) return;

            const compact = Boolean(conditions?.compact);
            const columns = compact
              ? HERO_CURTAIN_COMPACT_COLUMNS
              : HERO_CURTAIN_DESKTOP_COLUMNS;
            const cellCount = compact
              ? HERO_CURTAIN_COMPACT_CELL_COUNT
              : HERO_CURTAIN_CELL_COUNT;
            const curtainCells = allCurtainCells.slice(0, cellCount);
            const copyClipCells = allCopyClipCells.slice(0, cellCount);
            const inactiveCopyClipCells = allCopyClipCells.slice(cellCount);
            const proofClipCells = allProofClipCells.slice(0, cellCount);
            const inactiveProofClipCells = allProofClipCells.slice(cellCount);
            const rowCount = Math.ceil(cellCount / columns);
            let clipCellSize = scene.clientWidth / columns;
            let visibleRowCount = Math.min(
              rowCount,
              Math.ceil(scene.clientHeight / clipCellSize),
            );
            let tileCells: HeroTileCell[] = [];

            const syncTileModel = () => {
              clipCellSize = scene.clientWidth / columns;
              visibleRowCount = Math.min(
                rowCount,
                Math.ceil(scene.clientHeight / clipCellSize),
              );
              tileCells = curtainCells.map((_, index) => ({
                index,
                row: Math.floor(index / columns),
                column: index % columns,
                columns,
                visibleRows: visibleRowCount,
                cellSize: clipCellSize,
                compact,
              }));
            };

            const getClipCellX = (index: number) =>
              (index % columns) * clipCellSize;
            const getClipCellY = (index: number) =>
              Math.floor(index / columns) * clipCellSize;
            const syncClipGeometry = (
              activeCells: SVGRectElement[],
              inactiveCells: SVGRectElement[],
            ) => {
              const maskCellSize = clipCellSize * tileTransition.overscan;
              const maskCellInset = (maskCellSize - clipCellSize) / 2;

              activeCells.forEach((cell, index) => {
                cell.setAttribute(
                  "x",
                  String(getClipCellX(index) - maskCellInset),
                );
                cell.setAttribute(
                  "y",
                  String(getClipCellY(index) - maskCellInset),
                );
                cell.setAttribute("width", String(maskCellSize));
                cell.setAttribute("height", String(maskCellSize));
              });
              inactiveCells.forEach((cell) => {
                cell.setAttribute("x", "0");
                cell.setAttribute("y", "0");
                cell.setAttribute("width", "0");
                cell.setAttribute("height", "0");
                cell.removeAttribute("transform");
              });
            };
            const syncCopyClipGeometry = () =>
              syncClipGeometry(copyClipCells, inactiveCopyClipCells);
            const syncProofClipGeometry = () =>
              syncClipGeometry(proofClipCells, inactiveProofClipCells);
            const renderedRevealFrames = Array<string | null>(
              copyClipCells.length,
            ).fill(null);
            const renderedProofFrames = Array<string | null>(
              proofClipCells.length,
            ).fill(null);
            const getFrameSignature = (frame: HeroTileFrame) =>
              [
                frame.scaleX,
                frame.scaleY,
                frame.translateX,
                frame.translateY,
                frame.rotation,
                frame.originX,
                frame.originY,
                frame.opacity,
              ]
                .map((value) => value.toFixed(4))
                .join("|");
            const applyClipFrame = (
              cell: SVGRectElement,
              index: number,
              frame: HeroTileFrame,
            ) => {
              // SVG clip paths only respond to geometry, so fold the tile's
              // opacity into its aperture. This closes every mask completely
              // at rest instead of leaving a grid of tiny squares or slivers.
              const aperture = Math.sqrt(frame.opacity);
              const clipFrame = {
                ...frame,
                scaleX: frame.scaleX * aperture,
                scaleY: frame.scaleY * aperture,
              };

              if (
                clipFrame.scaleX >= 0.9999 &&
                clipFrame.scaleY >= 0.9999 &&
                Math.abs(clipFrame.translateX) < 0.001 &&
                Math.abs(clipFrame.translateY) < 0.001 &&
                Math.abs(clipFrame.rotation) < 0.001
              ) {
                cell.removeAttribute("transform");
                return;
              }

              cell.setAttribute(
                "transform",
                createHeroTileSvgTransform(
                  clipFrame,
                  getClipCellX(index),
                  getClipCellY(index),
                  clipCellSize,
                ),
              );
            };
            const renderRevealTiles = (progress: number, force = false) => {
              copyClipCells.forEach((clipCell, index) => {
                const tileCell = tileCells[index];
                const curtainCell = curtainCells[index];
                if (!tileCell || !curtainCell) return;

                const visibility = getHeroTileVisibility(
                  progress,
                  tileTransition.reveal,
                  tileCell,
                  "hide",
                );
                const frame = getHeroTileFrame(
                  visibility,
                  tileTransition.reveal.effect,
                  tileCell,
                );
                const signature = getFrameSignature(frame);

                if (!force && renderedRevealFrames[index] === signature) {
                  return;
                }
                renderedRevealFrames[index] = signature;

                curtainCell.style.transformOrigin =
                  createHeroTileTransformOrigin(frame);
                curtainCell.style.transform = createHeroTileCssTransform(
                  frame,
                  tileTransition.overscan,
                );
                curtainCell.style.opacity = frame.opacity.toFixed(4);
                applyClipFrame(clipCell, index, frame);
              });

              setCopyInert(
                progress >= getHeroTilePhaseCompletion(tileTransition.reveal),
              );
            };
            const renderProofClip = (progress: number, force = false) => {
              proofClipCells.forEach((cell, index) => {
                const tileCell = tileCells[index];
                if (!tileCell) return;

                const visibility = getHeroTileVisibility(
                  progress,
                  tileTransition.exit,
                  tileCell,
                  "show",
                );
                const frame = getHeroTileFrame(
                  visibility,
                  tileTransition.exit.effect,
                  tileCell,
                );
                const signature = getFrameSignature(frame);

                if (!force && renderedProofFrames[index] === signature) {
                  return;
                }
                renderedProofFrames[index] = signature;
                applyClipFrame(cell, index, frame);
              });
            };

            const copyClipProgress = { value: 0 };
            const proofClipProgress = { value: 0 };
            const syncTileGeometry = () => {
              syncTileModel();
              syncCopyClipGeometry();
              syncProofClipGeometry();
              renderedRevealFrames.fill(null);
              renderedProofFrames.fill(null);
              renderRevealTiles(copyClipProgress.value, true);
              renderProofClip(proofClipProgress.value, true);
            };

            syncTileGeometry();

            const revealTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: track,
                start: getHeroSceneTriggerStart,
                end: () => getHeroSceneTriggerEnd(scene),
                scrub: HERO_SCENE_SCRUB,
                invalidateOnRefresh: true,
                onRefresh: (self) => {
                  copyClipProgress.value = self.progress;
                  syncTileGeometry();
                },
              },
            });

            revealTimeline.to(
              copyClipProgress,
              {
                value: 1,
                duration: 1,
                ease: "none",
                onUpdate: () => renderRevealTiles(copyClipProgress.value),
              },
              0,
            );

            scene.dataset.heroCopyClipActive = "true";
            scene.dataset.heroProofClipActive = "true";

            const exitTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: track,
                start: () => getHeroSceneTriggerEnd(scene),
                end: "bottom bottom",
                scrub: HERO_SCENE_SCRUB,
                invalidateOnRefresh: true,
                onRefresh: (self) => {
                  proofClipProgress.value = self.progress;
                  syncTileGeometry();
                },
                onEnter: () => {
                  exitProgress = 0;
                  setNavigationBlend(1);
                },
                onEnterBack: () => {
                  exitProgress = 1;
                  setNavigationBlend(0);
                },
                onUpdate: (self) => {
                  if (self.isActive || self.progress > 0) {
                    exitProgress = self.progress;
                    setNavigationBlend(1 - self.progress);
                  }
                },
                onLeave: () => {
                  exitProgress = 1;
                  setNavigationBlend(0);
                },
                onLeaveBack: () => {
                  exitProgress = 0;
                  renderCamera(progressState.value);
                },
              },
            });

            exitTimeline.to(
              proofClipProgress,
              {
                value: 1,
                duration: 1,
                ease: "none",
                onUpdate: () => renderProofClip(proofClipProgress.value),
              },
              0,
            );

            const clipResizeObserver =
              typeof ResizeObserver === "undefined"
                ? null
                : new ResizeObserver(() => {
                    syncTileGeometry();
                  });
            clipResizeObserver?.observe(scene);

            return () => clipResizeObserver?.disconnect();
          },
        );

        revert = () => {
          motionMedia.revert();
          context.revert();
          clearScene();
        };
      })
      .catch(() => {
        clearScene();
      });

    return () => {
      cancelled = true;
      revert();
    };
  }, [tileTransitionRevision]);

  return (
    <div ref={trackRef} className="relay-hero__motion-track">
      <div ref={sceneRef} className="relay-hero__stage-inner">
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
          ref={copyRef}
          className="relay-hero__copy"
          style={
            {
              "--hero-copy-clip": `url(#${copyClipId})`,
            } as CSSProperties
          }
        >
          {children}
        </div>

        <svg
          className="hero-scene__clip-defs"
          width="0"
          height="0"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath
              ref={copyClipRef}
              id={copyClipId}
              clipPathUnits="userSpaceOnUse"
            >
              {heroCurtainCells.map((cell) => (
                <rect key={cell} data-hero-copy-clip-cell />
              ))}
            </clipPath>
            <clipPath
              ref={proofClipRef}
              id={proofClipId}
              clipPathUnits="userSpaceOnUse"
            >
              {heroCurtainCells.map((cell) => (
                <rect key={cell} data-hero-proof-clip-cell />
              ))}
            </clipPath>
          </defs>
        </svg>

        <div ref={worldScrollRef} className="hero-scene__world-scroll">
          <div className="hero-scene__world-pointer">
            <HeroPipeline />
          </div>
        </div>

        <div
          ref={curtainRef}
          className="hero-scene__curtain"
          aria-hidden="true"
        >
          {heroCurtainCells.map((cell) => (
            <span key={cell} data-hero-curtain-cell />
          ))}
        </div>

        <div
          className="hero-scene__outro"
          style={
            {
              "--hero-proof-clip": `url(#${proofClipId})`,
            } as CSSProperties
          }
        >
          {outro}
        </div>
      </div>
    </div>
  );
};

export default HeroScene;
