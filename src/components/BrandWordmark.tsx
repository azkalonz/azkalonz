import { useLayoutEffect, useRef } from "react";

const letters = Array.from("BuiltByMark");

const BrandWordmark = () => {
  const rootRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let cancelled = false;
    let revert: () => void = () => undefined;

    const waitForStableLayout = async () => {
      if ("fonts" in document) {
        await document.fonts.ready;
      }

      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });
    };

    void Promise.all([import("gsap"), waitForStableLayout()])
      .then(([{ gsap }]) => {
        if (cancelled) return;

        const context = gsap.context(() => {
          const copy = root.querySelector<HTMLElement>("[data-brand-copy]");
          const animationLayer = root.querySelector<HTMLElement>(
            "[data-brand-animation]",
          );
          const dot = root.querySelector<HTMLElement>("[data-brand-dot]");
          const period = root.querySelector<HTMLElement>("[data-brand-period]");
          const dev = root.querySelector<HTMLElement>("[data-brand-dev]");

          if (!copy || !animationLayer || !dot || !period || !dev) {
            return;
          }

          gsap.set(animationLayer, {
            display: "inline-flex",
            autoAlpha: 1,
          });

          const rootBounds = root.getBoundingClientRect();
          const dotSize = dot.getBoundingClientRect().width;
          const positionAt = (
            element: HTMLElement,
            verticalPosition: number,
          ) => {
            const bounds = element.getBoundingClientRect();
            return {
              x: bounds.left - rootBounds.left + bounds.width / 2 - dotSize / 2,
              y:
                bounds.top -
                rootBounds.top +
                bounds.height * verticalPosition -
                dotSize / 2,
            };
          };

          const periodPosition = positionAt(period, 0.67);
          const floorY = periodPosition.y;
          const devBounds = dev.getBoundingClientRect();
          const devTravel = devBounds.width + 1;

          gsap.set(period, { autoAlpha: 0 });
          gsap.set(dev, {
            autoAlpha: 1,
            scaleX: 1,
            transformOrigin: "0% 50%",
            x: -devTravel,
          });
          gsap.set(dot, {
            autoAlpha: 0,
            scale: 1,
            x: periodPosition.x,
            y: periodPosition.y + 28,
          });

          const timeline = gsap.timeline({
            defaults: { overwrite: "auto" },
          });

          const addBounce = (
            height: number,
            startTime: number,
            duration: number,
            scaleAtApex: number,
          ) => {
            const ascentDuration = duration * 0.44;

            timeline
              .to(
                dot,
                {
                  y: floorY - height,
                  scale: scaleAtApex,
                  duration: ascentDuration,
                  ease: "power2.out",
                },
                startTime,
              )
              .to(
                dot,
                {
                  y: floorY,
                  scale: 0.76,
                  duration: duration - ascentDuration,
                  ease: "power2.in",
                },
                startTime + ascentDuration,
              );
          };

          timeline.to(dot, { autoAlpha: 1, duration: 0.06, ease: "none" }, 0);

          const launchDuration = 0.68;
          addBounce(24, 0, launchDuration, 0.82);

          const secondBounceStart = launchDuration;
          const secondBounceDuration = 0.46;
          addBounce(10, secondBounceStart, secondBounceDuration, 0.79);

          const finalBounceStart = secondBounceStart + secondBounceDuration;
          const finalBounceDuration = 0.38;
          addBounce(4, finalBounceStart, finalBounceDuration, 0.76);

          const settlingHopStart = finalBounceStart + finalBounceDuration;
          timeline
            .to(
              dot,
              {
                y: periodPosition.y - 2,
                scale: 0.73,
                duration: 0.1,
                ease: "power2.out",
              },
              settlingHopStart,
            )
            .to(
              dot,
              {
                y: periodPosition.y,
                scale: 0.72,
                duration: 0.16,
                ease: "power2.in",
              },
              settlingHopStart + 0.1,
            );

          const settledTime = settlingHopStart + 0.26;
          const devRevealStart = settledTime + 0.12;
          timeline.to(
            dev,
            {
              x: 0,
              duration: 0.46,
              ease: "power3.out",
            },
            devRevealStart,
          );
        }, root);

        revert = () => context.revert();
      })
      .catch(() => {
        document.documentElement.classList.remove("has-brand-motion");
      });

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <span ref={rootRef} className="brand__wordmark brand__wordmark--animated">
      <span data-brand-copy className="brand__copy">
        BuiltByMark.dev
      </span>
      <span
        data-brand-animation
        aria-hidden="true"
        className="brand__animation"
      >
        <span className="brand__letters">
          {letters.map((letter, index) => (
            <span key={`${letter}-${index}`} data-brand-letter>
              {letter}
            </span>
          ))}
        </span>
        <span data-brand-period>.</span>
        <span className="brand__dev-window">
          <span data-brand-dev>dev</span>
        </span>
        <span data-brand-dot />
      </span>
    </span>
  );
};

export default BrandWordmark;
