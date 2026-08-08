import { useLayoutEffect, useRef, type CSSProperties } from "react";
import {
  getHeroSceneTriggerEnd,
  getHeroSceneTriggerStart,
  HERO_SCENE_SCRUB,
} from "./heroSceneMotion";

const operationalInputs = [
  "Orders",
  "Inventory",
  "Customer data",
  "Product data",
];

const engineeringWork = [
  "Map the process",
  "Connect the tools",
  "Plan for failures",
];

const HERO_PIPELINE_ENTRY_DELAY = 2;
const HERO_PIPELINE_OUTPUT_VIEWPORT_X = 0.2;
const HERO_PIPELINE_CORE_HIT_AT = 0.82;
const HERO_PIPELINE_OUTPUT_HIT_AT = 0.96;
const HERO_PIPELINE_VIEWBOX_WIDTH = 760;
const HERO_PIPELINE_MERGE_X = 360;
const HERO_PIPELINE_STAGE_GAP = 260;
const HERO_PIPELINE_CORE_SPAN = 166.25;
const HERO_PIPELINE_CORE_X = HERO_PIPELINE_MERGE_X + HERO_PIPELINE_STAGE_GAP;
const HERO_PIPELINE_CORE_EXIT_X =
  HERO_PIPELINE_CORE_X + HERO_PIPELINE_CORE_SPAN;
const HERO_PIPELINE_OUTPUT_X =
  HERO_PIPELINE_CORE_EXIT_X + HERO_PIPELINE_STAGE_GAP;
const HERO_PIPELINE_CORE_LEFT = `${
  (HERO_PIPELINE_CORE_X / HERO_PIPELINE_VIEWBOX_WIDTH) * 100
}%`;
const HERO_PIPELINE_OUTPUT_LEFT = `${
  (HERO_PIPELINE_OUTPUT_X / HERO_PIPELINE_VIEWBOX_WIDTH) * 100
}%`;

const HeroPipeline = () => {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const hero = root.closest<HTMLElement>(".relay-hero") ?? root;

    root.dataset.pipelineMotion = "pending";
    hero.dataset.pipelineMotion = "pending";

    let cancelled = false;
    let revert: () => void = () => undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;

        const { gsap } = gsapModule;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        const context = gsap.context(() => {
          const flows = Array.from(
            root.querySelectorAll<SVGPathElement>("[data-pipeline-flow]"),
          );
          const flowLayouts = Array.from(
            root.querySelectorAll<SVGGElement>("[data-pipeline-flows]"),
          ).map((group) => {
            const layoutFlows = Array.from(
              group.querySelectorAll<SVGPathElement>("[data-pipeline-flow]"),
            );
            return {
              sourceFlows: layoutFlows.slice(0, 4),
              convergenceFlow: layoutFlows.at(-2),
              outputFlow: layoutFlows.at(-1),
            };
          });
          const sourceNodes = root.querySelectorAll("[data-pipeline-source]");
          const sourceSurfaces = root.querySelectorAll(
            "[data-pipeline-source] > [data-pipeline-surface]",
          );
          const textShapes = root.querySelectorAll("[data-pipeline-shape]");
          const textCopies = root.querySelectorAll("[data-pipeline-copy]");
          const sourceTextShapes = root.querySelectorAll(
            "[data-pipeline-source] [data-pipeline-shape]",
          );
          const sourceTextCopies = root.querySelectorAll(
            "[data-pipeline-source] [data-pipeline-copy]",
          );
          const coreTextShapes = root.querySelectorAll(
            "[data-pipeline-core] [data-pipeline-shape]",
          );
          const coreTextCopies = root.querySelectorAll(
            "[data-pipeline-core] [data-pipeline-copy]",
          );
          const outputTextShapes = root.querySelectorAll(
            "[data-pipeline-output] [data-pipeline-shape]",
          );
          const outputTextCopies = root.querySelectorAll(
            "[data-pipeline-output] [data-pipeline-copy]",
          );
          const sourceJunctions = root.querySelectorAll(
            '[data-pipeline-node="source"]',
          );
          const coreJunctions = root.querySelectorAll(
            '[data-pipeline-node="core"]',
          );
          const outputJunctions = root.querySelectorAll(
            '[data-pipeline-node="output"]',
          );
          const core = root.querySelector<HTMLElement>("[data-pipeline-core]");
          const coreSurface = root.querySelector(
            "[data-pipeline-core] > [data-pipeline-surface]",
          );
          const coreCover = root.querySelector(
            "[data-pipeline-core] > [data-pipeline-cover]",
          );
          const coreSteps = root.querySelectorAll("[data-pipeline-step]");
          const output = root.querySelector<HTMLElement>(
            "[data-pipeline-output]",
          );
          const outputSurface = root.querySelector(
            "[data-pipeline-output] > [data-pipeline-surface]",
          );
          const outputCover = root.querySelector(
            "[data-pipeline-output] > [data-pipeline-cover]",
          );
          const canvas = root.querySelector<HTMLElement>(
            ".hero-pipeline__canvas",
          );
          const gridPlane = hero.querySelector<HTMLElement>(
            ".hero-scene__grid-plane",
          );
          const cameraTargets = [canvas, gridPlane].filter(
            (target): target is HTMLElement => target !== null,
          );
          const motionStage = hero.querySelector<HTMLElement>(
            ".relay-hero__motion-track",
          );
          const stickyStage = hero.querySelector<HTMLElement>(
            ".relay-hero__stage-inner",
          );
          const motionTrigger = motionStage ?? hero;

          flows.forEach((path) => {
            gsap.set(path, {
              opacity: 0,
              strokeDasharray: 1,
              strokeDashoffset: 1,
            });
          });

          const setHitProgress = (
            element: Element | null,
            progress: number,
          ) => {
            if (!(
              element instanceof HTMLElement || element instanceof SVGElement
            )) {
              return;
            }
            element.style.setProperty(
              "--pipeline-hit",
              String(gsap.utils.clamp(0, 1, progress)),
            );
          };

          const getViewportBounds = () => {
            const viewport = window.visualViewport;
            const left = viewport?.offsetLeft ?? 0;
            const width =
              viewport?.width ?? document.documentElement.clientWidth;

            return { left, right: left + width, center: left + width / 2 };
          };

          const getVisibilityProgress = (element: Element | null) => {
            if (!(element instanceof HTMLElement)) return 0;

            const bounds = element.getBoundingClientRect();
            const revealDistance = Math.max(1, bounds.width * 0.36);

            return gsap.utils.clamp(
              0,
              1,
              (getViewportBounds().right - bounds.left) / revealDistance,
            );
          };

          const renderPipelineStage = (
            element: Element | null,
            junction: Element | null,
            surface: Element | null,
            cover: Element | null,
            shapes: NodeListOf<Element>,
            copies: NodeListOf<Element>,
            traceProgress: number,
          ) => {
            const lightingProgress = Number(traceProgress >= 1);
            const visibilityProgress = getVisibilityProgress(element);

            setHitProgress(element, lightingProgress);
            setHitProgress(junction, lightingProgress);
            gsap.set(surface, { opacity: visibilityProgress });
            gsap.set(cover, { opacity: 1 - visibilityProgress });
            gsap.set(shapes, {
              opacity: 1 - visibilityProgress,
              scaleX: 1 - visibilityProgress,
            });
            gsap.set(copies, {
              opacity: visibilityProgress,
              y: 6 * (1 - visibilityProgress),
            });
          };

          const getCameraXForTarget = (
            element: HTMLElement | null,
            viewportX: number,
            align: "center" | "left",
          ) => {
            if (!canvas || !element) return 0;

            const currentCameraX =
              Number.parseFloat(String(gsap.getProperty(canvas, "x"))) || 0;
            const bounds = element.getBoundingClientRect();
            const targetX =
              align === "center" ? bounds.left + bounds.width / 2 : bounds.left;

            return currentCameraX + viewportX - targetX;
          };

          const mapJourney = (start: number, end: number, progress: number) =>
            gsap.utils.clamp(0, 1, (progress - start) / (end - start));

          const renderRouteProgress = (progress: number) => {
            const journeyProgress = gsap.utils.clamp(0, 1, progress);
            let coreTraceProgress = 0;
            let outputTraceProgress = 0;

            flowLayouts.forEach(
              ({ sourceFlows, convergenceFlow, outputFlow }) => {
                const drawRoute = (
                  index: number,
                  start: number,
                  end: number,
                ) => {
                  const path = sourceFlows[index];
                  if (!path) return 0;

                  const drawProgress = gsap.utils.clamp(
                    0,
                    1,
                    (journeyProgress - start) / (end - start),
                  );
                  path.style.opacity = String(
                    gsap.utils.clamp(0, 1, drawProgress / 0.03),
                  );
                  path.style.strokeDashoffset = String(1 - drawProgress);
                  setHitProgress(sourceNodes.item(index), drawProgress / 0.08);
                  setHitProgress(
                    sourceJunctions.item(index),
                    drawProgress / 0.08,
                  );
                  return drawProgress;
                };

                drawRoute(0, 0, 0.62);
                drawRoute(1, 0.1, 0.65);
                drawRoute(2, 0.14, 0.68);
                drawRoute(3, 0.18, 0.7);

                const convergenceProgress = gsap.utils.clamp(
                  0,
                  1,
                  (journeyProgress - 0.7) / (HERO_PIPELINE_CORE_HIT_AT - 0.7),
                );
                coreTraceProgress = Math.max(
                  coreTraceProgress,
                  convergenceProgress,
                );
                if (convergenceFlow) {
                  convergenceFlow.style.opacity = String(
                    gsap.utils.clamp(0, 1, convergenceProgress / 0.03),
                  );
                  convergenceFlow.style.strokeDashoffset = String(
                    1 - convergenceProgress,
                  );
                }
                if (outputFlow) {
                  const drawProgress = gsap.utils.clamp(
                    0,
                    1,
                    (journeyProgress - 0.84) /
                      (HERO_PIPELINE_OUTPUT_HIT_AT - 0.84),
                  );
                  outputTraceProgress = Math.max(
                    outputTraceProgress,
                    drawProgress,
                  );
                  outputFlow.style.opacity = String(
                    gsap.utils.clamp(0, 1, drawProgress / 0.03),
                  );
                  outputFlow.style.strokeDashoffset = String(1 - drawProgress);
                }
              },
            );

            if (cameraTargets.length) {
              const compact = window.innerWidth <= 900;
              const cameraStart = compact ? 0.42 : 0.32;
              const viewportCenterX = getViewportBounds().center;
              const coreCenterX = getCameraXForTarget(
                core,
                viewportCenterX,
                "center",
              );
              const outputCenterX = getCameraXForTarget(
                output,
                viewportCenterX,
                "center",
              );
              const outputRestX = getCameraXForTarget(
                output,
                window.innerWidth * HERO_PIPELINE_OUTPUT_VIEWPORT_X,
                "left",
              );
              let cameraX: number;

              if (journeyProgress <= HERO_PIPELINE_CORE_HIT_AT) {
                cameraX = gsap.utils.interpolate(
                  0,
                  coreCenterX,
                  mapJourney(
                    cameraStart,
                    HERO_PIPELINE_CORE_HIT_AT,
                    journeyProgress,
                  ),
                );
              } else if (journeyProgress <= HERO_PIPELINE_OUTPUT_HIT_AT) {
                cameraX = gsap.utils.interpolate(
                  coreCenterX,
                  outputCenterX,
                  mapJourney(
                    HERO_PIPELINE_CORE_HIT_AT,
                    HERO_PIPELINE_OUTPUT_HIT_AT,
                    journeyProgress,
                  ),
                );
              } else {
                cameraX = gsap.utils.interpolate(
                  outputCenterX,
                  outputRestX,
                  mapJourney(HERO_PIPELINE_OUTPUT_HIT_AT, 1, journeyProgress),
                );
              }

              gsap.set(cameraTargets, { x: cameraX });
            }

            renderPipelineStage(
              core,
              coreJunctions.item(0),
              coreSurface,
              coreCover,
              coreTextShapes,
              coreTextCopies,
              coreTraceProgress,
            );
            renderPipelineStage(
              output,
              outputJunctions.item(0),
              outputSurface,
              outputCover,
              outputTextShapes,
              outputTextCopies,
              outputTraceProgress,
            );
          };

          gsap.set(sourceNodes, {
            opacity: 1,
            "--pipeline-hit": 0,
          });
          gsap.set(sourceSurfaces, { opacity: 0 });
          gsap.set(textShapes, { opacity: 1, scaleX: 1 });
          gsap.set(textCopies, { opacity: 0, y: 6 });
          gsap.set(
            [
              ...Array.from(sourceJunctions),
              ...Array.from(coreJunctions),
              ...Array.from(outputJunctions),
            ],
            { "--pipeline-hit": 0 },
          );
          gsap.set(core, {
            opacity: 1,
            "--pipeline-hit": 0,
          });
          gsap.set(coreSurface, { opacity: 0 });
          gsap.set(coreCover, { opacity: 1 });
          gsap.set(coreSteps, { opacity: 1 });
          gsap.set(output, {
            opacity: 1,
            "--pipeline-hit": 0,
          });
          gsap.set(outputSurface, { opacity: 0 });
          gsap.set(outputCover, { opacity: 1 });
          gsap.set(cameraTargets, { x: 0 });
          renderRouteProgress(0);

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: motionTrigger,
              start: getHeroSceneTriggerStart,
              end: () => getHeroSceneTriggerEnd(stickyStage),
              scrub: HERO_SCENE_SCRUB,
              invalidateOnRefresh: true,
            },
          });
          const pipelineTimeline = gsap.timeline({
            defaults: { ease: "none" },
          });
          timeline.add(pipelineTimeline, HERO_PIPELINE_ENTRY_DELAY);

          const routeProgress = { value: 0 };
          pipelineTimeline.to(
            routeProgress,
            {
              value: 1,
              duration: 4.75,
              ease: "none",
            },
            0,
          );

          if (cameraTargets.length) {
            pipelineTimeline
              .to(
                cameraTargets,
                {
                  width: () => `${window.innerWidth <= 900 ? 56 : 96}rem`,
                  duration: 3.3,
                  ease: "none",
                },
                1.45,
              )
              .to(
                cameraTargets,
                {
                  scale: () => (window.innerWidth <= 900 ? 1.45 : 1.18),
                  transformOrigin: "0% 50%",
                  duration: 1.8,
                  ease: "power2.inOut",
                },
                1.15,
              );
          }

          pipelineTimeline
            .fromTo(
              sourceTextShapes,
              { opacity: 1, scaleX: 1 },
              {
                opacity: 0,
                scaleX: 0,
                stagger: 0.26,
                duration: 0.2,
                ease: "power2.inOut",
              },
              0.04,
            )
            .to(
              sourceSurfaces,
              {
                opacity: 1,
                stagger: 0.26,
                duration: 0.24,
                ease: "power2.out",
              },
              0.12,
            )
            .to(
              sourceTextCopies,
              {
                opacity: 1,
                y: 0,
                stagger: 0.26,
                duration: 0.24,
                ease: "power2.out",
              },
              0.12,
            );

          pipelineTimeline.eventCallback("onUpdate", () =>
            renderRouteProgress(routeProgress.value),
          );

          root.dataset.pipelineMotion = "active";
          hero.dataset.pipelineMotion = "active";
        }, root);

        revert = () => context.revert();
      })
      .catch(() => {
        root.removeAttribute("data-pipeline-motion");
        hero.removeAttribute("data-pipeline-motion");
      });

    return () => {
      cancelled = true;
      revert();
      root.removeAttribute("data-pipeline-motion");
      hero.removeAttribute("data-pipeline-motion");
    };
  }, []);

  return (
    <figure
      ref={rootRef}
      className="hero-pipeline"
      data-pipeline-motion="pending"
      style={
        {
          "--pipeline-output-left": HERO_PIPELINE_OUTPUT_LEFT,
          "--pipeline-core-left": HERO_PIPELINE_CORE_LEFT,
        } as CSSProperties
      }
    >
      <figcaption className="sr-only">
        Orders, inventory, customer data, and product data are mapped,
        connected, and protected against failures before they become one
        dependable system.
      </figcaption>

      <div className="hero-pipeline__canvas" aria-hidden="true">
        <svg
          className="hero-pipeline__flowmap hero-pipeline__flowmap--horizontal"
          viewBox="0 0 760 420"
          preserveAspectRatio="none"
        >
          <g className="hero-pipeline__tracks">
            <path d="M170 78H260C320 78 320 210 360 210" />
            <path d="M120 166H260C320 166 320 210 360 210" />
            <path d="M120 254H260C320 254 320 210 360 210" />
            <path d="M170 342H260C320 342 320 210 360 210" />
            <path d={`M${HERO_PIPELINE_MERGE_X} 210H${HERO_PIPELINE_CORE_X}`} />
            <path
              d={`M${HERO_PIPELINE_CORE_EXIT_X} 210H${HERO_PIPELINE_OUTPUT_X}`}
            />
          </g>
          <g className="hero-pipeline__flows" data-pipeline-flows>
            <path
              data-pipeline-flow
              pathLength="1"
              d="M170 78H260C320 78 320 210 360 210"
            />
            <path
              data-pipeline-flow
              pathLength="1"
              d="M120 166H260C320 166 320 210 360 210"
            />
            <path
              data-pipeline-flow
              pathLength="1"
              d="M120 254H260C320 254 320 210 360 210"
            />
            <path
              data-pipeline-flow
              pathLength="1"
              d="M170 342H260C320 342 320 210 360 210"
            />
            <path
              data-pipeline-flow
              pathLength="1"
              d={`M${HERO_PIPELINE_MERGE_X} 210H${HERO_PIPELINE_CORE_X}`}
            />
            <path
              data-pipeline-flow
              pathLength="1"
              d={`M${HERO_PIPELINE_CORE_EXIT_X} 210H${HERO_PIPELINE_OUTPUT_X}`}
            />
          </g>
          <g className="hero-pipeline__nodes">
            <circle data-pipeline-node="source" cx="170" cy="78" r="5" />
            <circle data-pipeline-node="source" cx="120" cy="166" r="5" />
            <circle data-pipeline-node="source" cx="120" cy="254" r="5" />
            <circle data-pipeline-node="source" cx="170" cy="342" r="5" />
            <circle
              data-pipeline-node="core"
              cx={HERO_PIPELINE_CORE_X}
              cy="210"
              r="5"
            />
            <circle
              className="hero-pipeline__output-node"
              data-pipeline-node="output"
              cx={HERO_PIPELINE_OUTPUT_X}
              cy="210"
              r="5"
            />
          </g>
        </svg>

        <div className="hero-pipeline__sources">
          {operationalInputs.map((input) => (
            <span key={input} data-pipeline-source data-pipeline-text>
              <span data-pipeline-surface aria-hidden="true" />
              <span data-pipeline-shape aria-hidden="true" />
              <span data-pipeline-copy>{input}</span>
            </span>
          ))}
        </div>

        <div className="hero-pipeline__core" data-pipeline-core>
          <span data-pipeline-surface aria-hidden="true" />
          <span data-pipeline-cover aria-hidden="true" />
          <strong data-pipeline-text>
            <span data-pipeline-copy>
              Build
              <br />
              the flow
            </span>
          </strong>
          <div>
            {engineeringWork.map((item) => (
              <span key={item} data-pipeline-step data-pipeline-text>
                <span data-pipeline-copy>{item}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="hero-pipeline__output" data-pipeline-output>
          <span data-pipeline-surface aria-hidden="true" />
          <span data-pipeline-cover aria-hidden="true" />
          <strong data-pipeline-text>
            <span data-pipeline-copy>
              A dependable
              <br />
              system
            </span>
          </strong>
          <span data-pipeline-text>
            <span data-pipeline-copy>
              Validated,
              <br />
              monitored, and ready
              <br />
              for production.
            </span>
          </span>
        </div>
      </div>
    </figure>
  );
};

export default HeroPipeline;
