import { useLayoutEffect, useRef } from "react";

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

const HeroPipeline = () => {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const hero = root.closest<HTMLElement>(".relay-hero") ?? root;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.removeAttribute("data-pipeline-motion");
      return;
    }

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
          const core = root.querySelector("[data-pipeline-core]");
          const coreSurface = root.querySelector(
            "[data-pipeline-core] > [data-pipeline-surface]",
          );
          const coreCover = root.querySelector(
            "[data-pipeline-core] > [data-pipeline-cover]",
          );
          const coreSteps = root.querySelectorAll("[data-pipeline-step]");
          const output = root.querySelector("[data-pipeline-output]");
          const outputSurface = root.querySelector(
            "[data-pipeline-output] > [data-pipeline-surface]",
          );
          const outputCover = root.querySelector(
            "[data-pipeline-output] > [data-pipeline-cover]",
          );
          const canvas = root.querySelector<HTMLElement>(
            ".hero-pipeline__canvas",
          );
          const motionStage = hero.querySelector<HTMLElement>(
            ".relay-hero__motion-track",
          );
          const stickyStage = hero.querySelector<HTMLElement>(
            ".relay-hero__stage-inner",
          );
          const motionTrigger = motionStage ?? hero;
          const proofRail = hero.querySelector<HTMLElement>(".proof-rail");
          const proofItems = hero.querySelectorAll<HTMLElement>(
            ".proof-rail__item",
          );
          const proofNumbers = hero.querySelectorAll<HTMLElement>(
            ".proof-rail__item strong",
          );
          const proofCopy = hero.querySelectorAll<HTMLElement>(
            ".proof-rail__item span",
          );

          flows.forEach((path) => {
            gsap.set(path, {
              opacity: 0,
              strokeDasharray: 1,
              strokeDashoffset: 1,
            });
          });

          const triggerStart = () =>
            window.innerWidth <= 900
              ? "top+=88 top+=68"
              : "top+=96 top+=76";
          const triggerEnd = () => {
            const holdRatio = window.innerWidth <= 900 ? 0.3 : 0.4;
            const stickyHeight = stickyStage?.offsetHeight ?? window.innerHeight;
            const endOffset = Math.max(
              0,
              stickyHeight - window.innerHeight + window.innerHeight * holdRatio,
            );
            return `bottom bottom+=${Math.round(endOffset)}`;
          };

          const setHitProgress = (element: Element | null, progress: number) => {
            if (!(element instanceof HTMLElement || element instanceof SVGElement)) {
              return;
            }
            element.style.setProperty(
              "--pipeline-hit",
              String(gsap.utils.clamp(0, 1, progress)),
            );
          };

          const renderRouteProgress = (progress: number) => {
            const journeyProgress = gsap.utils.clamp(0, 1, progress);

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
                  setHitProgress(
                    sourceNodes.item(index),
                    drawProgress / 0.08,
                  );
                  setHitProgress(
                    sourceJunctions.item(index),
                    drawProgress / 0.08,
                  );
                  return drawProgress;
                };

                drawRoute(0, 0, 0.7);
                drawRoute(1, 0.1, 0.74);
                drawRoute(2, 0.14, 0.78);
                drawRoute(3, 0.18, 0.82);

                const convergenceProgress = gsap.utils.clamp(
                  0,
                  1,
                  (journeyProgress - 0.7) / 0.12,
                );
                if (convergenceFlow) {
                  convergenceFlow.style.opacity = String(
                    gsap.utils.clamp(0, 1, convergenceProgress / 0.03),
                  );
                  convergenceFlow.style.strokeDashoffset = String(
                    1 - convergenceProgress,
                  );
                }
                const coreHitProgress =
                  (convergenceProgress - 0.82) / 0.18;
                setHitProgress(core, coreHitProgress);
                setHitProgress(coreJunctions.item(0), coreHitProgress);

                if (outputFlow) {
                  const drawProgress = gsap.utils.clamp(
                    0,
                    1,
                    (journeyProgress - 0.91) / 0.07,
                  );
                  outputFlow.style.opacity = String(
                    gsap.utils.clamp(0, 1, drawProgress / 0.03),
                  );
                  outputFlow.style.strokeDashoffset = String(1 - drawProgress);
                  const outputHitProgress = (drawProgress - 0.88) / 0.12;
                  setHitProgress(output, outputHitProgress);
                  setHitProgress(outputJunctions.item(0), outputHitProgress);
                }
              },
            );

            if (window.innerWidth <= 900 && canvas) {
              const rootFontSize = Number.parseFloat(
                getComputedStyle(document.documentElement).fontSize,
              );
              const worldWidth = 56 * rootFontSize;
              const mobileZoom = 1.45;
              const coreX =
                window.innerWidth * 0.08 - worldWidth * 0.55 * mobileZoom;
              const outputX =
                window.innerWidth * 0.3 - worldWidth * 1.05 * mobileZoom;
              const firstRouteCameraStart =
                0.06 + (0.7 - 0.06) * 0.6;
              const coreCameraProgress = gsap.utils.clamp(
                0,
                1,
                (journeyProgress - firstRouteCameraStart) /
                  (0.88 - firstRouteCameraStart),
              );
              const outputCameraProgress = gsap.utils.clamp(
                0,
                1,
                (journeyProgress - 0.91) / 0.09,
              );
              const coreCameraX = gsap.utils.interpolate(
                0,
                coreX,
                coreCameraProgress,
              );
              gsap.set(canvas, {
                x: gsap.utils.interpolate(
                  coreCameraX,
                  outputX,
                  outputCameraProgress,
                ),
              });
            }
          };

          const routeTrigger = ScrollTrigger.create({
            trigger: motionTrigger,
            start: triggerStart,
            end: triggerEnd,
            invalidateOnRefresh: true,
            onUpdate: (self) => renderRouteProgress(self.progress),
            onRefresh: (self) => renderRouteProgress(self.progress),
          });
          renderRouteProgress(routeTrigger.progress);

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
          gsap.set(canvas, { x: 0 });
          renderRouteProgress(routeTrigger.progress);

          const introCopy = hero.querySelector(".relay-hero__intro-copy");
          const themeTarget = motionStage ?? hero;
          const updateChapterTheme = (progress: number) => {
            const darkProgress = gsap.utils.clamp(0, 1, progress);
            themeTarget.style.setProperty(
              "--pipeline-dark-progress",
              String(darkProgress),
            );
            if (darkProgress >= 0.5) {
              themeTarget.dataset.pipelineTheme = "dark";
            } else {
              themeTarget.removeAttribute("data-pipeline-theme");
            }
          };

          ScrollTrigger.create({
            trigger: motionTrigger,
            start: () =>
              window.innerWidth <= 900
                ? "top+=560 top+=68"
                : "top+=680 top+=76",
            end: () =>
              window.innerWidth <= 900
                ? "top+=1320 top+=68"
                : "top+=1500 top+=76",
            invalidateOnRefresh: true,
            onUpdate: (self) => updateChapterTheme(self.progress),
            onRefresh: (self) => updateChapterTheme(self.progress),
          });

          if (window.innerWidth > 900 && canvas) {
            const focusTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: motionTrigger,
                start: "top top+=76",
                end: "top+=700 top+=76",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            });

            focusTimeline
              .to(
                root,
                {
                  width: "92%",
                  marginLeft: "54%",
                  duration: 0.72,
                  ease: "none",
                },
                0,
              )
              .to(
                canvas,
                {
                  width: "100%",
                  duration: 0.72,
                  ease: "none",
                },
                0,
              )
              .to(
                introCopy,
                { opacity: 0, y: -24, duration: 0.28, ease: "power2.inOut" },
                0.72,
              );
          } else if (introCopy) {
            const mobileHandoff = gsap.timeline({
              scrollTrigger: {
                trigger: motionTrigger,
                start: "top top+=68",
                end: "top+=600 top+=68",
                scrub: 0.85,
                invalidateOnRefresh: true,
              },
            });

            mobileHandoff
              .fromTo(
                root,
                { xPercent: 108 },
                { xPercent: 0, duration: 1, ease: "none" },
                0,
              )
              .fromTo(
                introCopy,
                { xPercent: 0, opacity: 1 },
                {
                  xPercent: -112,
                  opacity: 0,
                  duration: 1,
                  ease: "none",
                },
                0,
              );
          }

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: motionTrigger,
              start: triggerStart,
              end: triggerEnd,
              scrub: 1.15,
              invalidateOnRefresh: true,
            },
          });

          if (window.innerWidth > 900) {
            timeline.to(
              root,
              {
                marginLeft: 0,
                duration: 3.3,
                ease: "none",
              },
              1.45,
            );
          }

          if (canvas) {
            const rootFontSize = Number.parseFloat(
              getComputedStyle(document.documentElement).fontSize,
            );
            const isMobile = window.innerWidth <= 900;
            const worldWidthRem = isMobile ? 56 : 96;
            const worldWidth = worldWidthRem * rootFontSize;
            const mobileZoom = 1.45;
            const desktopZoom = 1.18;
            const outputLeftRatio = 1.05;

            if (isMobile) {
              timeline
                .to(
                  canvas,
                  {
                    width: `${worldWidthRem}rem`,
                    duration: 1.45,
                    ease: "none",
                  },
                  1.45,
                )
                .to(
                  canvas,
                  {
                    scale: mobileZoom,
                    transformOrigin: "0% 50%",
                    duration: 1.5,
                    ease: "power2.inOut",
                  },
                  1.05,
                );
            } else {
              timeline
                .to(
                  canvas,
                  {
                    width: `${worldWidthRem}rem`,
                    x: () =>
                      window.innerWidth * 0.4 -
                      worldWidth * outputLeftRatio * desktopZoom,
                    duration: 3.3,
                    ease: "none",
                  },
                  1.45,
                )
                .to(
                  canvas,
                  {
                    scale: desktopZoom,
                    transformOrigin: "0% 50%",
                    duration: 1.8,
                    ease: "power2.inOut",
                  },
                  1.25,
                );
            }

          if (proofRail && proofItems.length) {
            const proofTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: proofRail,
                start: "top 88%",
                end: "bottom 62%",
                scrub: 0.75,
              },
            });

            proofTimeline
              .fromTo(
                proofItems,
                { scaleY: 0.06, transformOrigin: "50% 100%" },
                {
                  scaleY: 1,
                  stagger: 0.12,
                  duration: 0.72,
                  ease: "power3.inOut",
                },
                0,
              )
              .fromTo(
                proofNumbers,
                { clipPath: "inset(100% 0 0 0)", opacity: 0, y: 14 },
                {
                  clipPath: "inset(0% 0 0 0)",
                  opacity: 1,
                  y: 0,
                  stagger: 0.12,
                  duration: 0.42,
                  ease: "power3.out",
                },
                0.42,
              )
              .fromTo(
                proofCopy,
                { opacity: 0, y: 8 },
                {
                  opacity: 1,
                  y: 0,
                  stagger: 0.12,
                  duration: 0.38,
                  ease: "power2.out",
                },
                0.5,
              );
          }
          }

          timeline
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
            )
            .fromTo(
              coreTextShapes,
              { opacity: 1, scaleX: 1 },
              {
                opacity: 0,
                scaleX: 0,
                stagger: 0.1,
                duration: 0.2,
                ease: "power2.inOut",
              },
              2.58,
            )
            .to(
              coreCover,
              {
                opacity: 0,
                duration: 0.24,
                ease: "power2.out",
              },
              2.68,
            )
            .to(
              coreSurface,
              {
                opacity: 1,
                duration: 0.24,
                ease: "power2.out",
              },
              2.68,
            )
            .to(
              coreTextCopies,
              {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.24,
                ease: "power2.out",
              },
              2.68,
            );

          timeline
            .fromTo(
              outputTextShapes,
              { opacity: 1, scaleX: 1 },
              {
                opacity: 0,
                scaleX: 0,
                stagger: 0.12,
                duration: 0.2,
                ease: "power2.inOut",
              },
              3.7,
            )
            .to(
              outputCover,
              {
                opacity: 0,
                duration: 0.25,
                ease: "power2.out",
              },
              3.8,
            )
            .to(
              outputSurface,
              {
                opacity: 1,
                duration: 0.25,
                ease: "power2.out",
              },
              3.8,
            )
            .to(
              outputTextCopies,
              {
                opacity: 1,
                y: 0,
                stagger: 0.12,
                duration: 0.25,
                ease: "power2.out",
              },
              3.8,
            );

          root.dataset.pipelineMotion = "active";
          hero.dataset.pipelineMotion = "active";
        }, root);

        revert = () => {
          const themeTarget =
            hero.querySelector<HTMLElement>(".relay-hero__motion-track") ?? hero;
          themeTarget.removeAttribute("data-pipeline-theme");
          themeTarget.style.removeProperty("--pipeline-dark-progress");
          context.revert();
        };
      })
      .catch(() => {
        root.removeAttribute("data-pipeline-motion");
        hero.removeAttribute("data-pipeline-motion");
      });

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <figure
      ref={rootRef}
      className="hero-pipeline"
      data-pipeline-motion="pending"
    >
      <figcaption className="sr-only">
        Orders, inventory, customer data, and product data are mapped, connected,
        and protected against failures before they become one dependable system.
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
            <path d="M360 210H418" />
            <path d="M590 210H790" />
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
            <path data-pipeline-flow pathLength="1" d="M360 210H418" />
            <path data-pipeline-flow pathLength="1" d="M590 210H790" />
          </g>
          <g className="hero-pipeline__nodes">
            <circle
              data-pipeline-node="source"
              cx="170"
              cy="78"
              r="5"
            />
            <circle
              data-pipeline-node="source"
              cx="120"
              cy="166"
              r="5"
            />
            <circle
              data-pipeline-node="source"
              cx="120"
              cy="254"
              r="5"
            />
            <circle
              data-pipeline-node="source"
              cx="170"
              cy="342"
              r="5"
            />
            <circle
              className="hero-pipeline__output-node"
              data-pipeline-node="output"
              cx="790"
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
