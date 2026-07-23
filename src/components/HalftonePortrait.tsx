import { useEffect, useRef, useState } from "react";

type DotField = {
  accentIndices: Uint16Array;
  amplitude: Float32Array;
  offsetX: Float32Array;
  offsetY: Float32Array;
  particleAge: Float32Array;
  particleAngle: Float32Array;
  particleCurve: Float32Array;
  particleDistance: Float32Array;
  particleDuration: Float32Array;
  particleOffsetX: Float32Array;
  particleOffsetY: Float32Array;
  particleVelocityX: Float32Array;
  particleVelocityY: Float32Array;
  phaseX: Float32Array;
  phaseY: Float32Array;
  radius: Float32Array;
  speed: Float32Array;
  velocityX: Float32Array;
  velocityY: Float32Array;
  x: Float32Array;
  y: Float32Array;
};

const VIEWBOX_SIZE = 900;
const FRAME_INTERVAL = 1000 / 30;
const INTERACTION_FRAME_INTERVAL = 1000 / 60;
const INFLUENCE_RADIUS = 138;
const REPEL_ACCELERATION = 2600;
const SPRING_STRENGTH = 18;
const VELOCITY_DAMPING = 5.2;
const MAX_PHYSICS_DISPLACEMENT = 118;
const DOT_COLOR = "#dcece7";

const seededValue = (value: number) => {
  const result = Math.sin(value * 12.9898) * 43758.5453;
  return result - Math.floor(result);
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const getHeadAndNeckWeight = (x: number, y: number) => {
  const head = clamp01((510 - y) / 70);
  const neckVertical = Math.min(
    clamp01((y - 400) / 70),
    clamp01((640 - y) / 70),
  );
  const neckHorizontal = Math.min(
    clamp01((x - 280) / 80),
    clamp01((620 - x) / 80),
  );

  return Math.max(head, neckVertical * neckHorizontal);
};

const HalftonePortrait = () => {
  const portraitRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dots, setDots] = useState<DotField>();

  useEffect(() => {
    const controller = new AbortController();

    fetch("/halftone-portrait.svg", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load portrait: ${response.status}`);
        }
        return response.text();
      })
      .then((markup) => {
        const document = new DOMParser().parseFromString(
          markup,
          "image/svg+xml",
        );
        const circles = Array.from(document.querySelectorAll("circle"));
        const count = circles.length;
        const accentIndices: number[] = [];
        const columnBounds = new Map<number, [number, number]>();
        const rowBounds = new Map<number, [number, number]>();
        const dotField: DotField = {
          accentIndices: new Uint16Array(),
          amplitude: new Float32Array(count),
          offsetX: new Float32Array(count),
          offsetY: new Float32Array(count),
          particleAge: new Float32Array(),
          particleAngle: new Float32Array(),
          particleCurve: new Float32Array(),
          particleDistance: new Float32Array(),
          particleDuration: new Float32Array(),
          particleOffsetX: new Float32Array(),
          particleOffsetY: new Float32Array(),
          particleVelocityX: new Float32Array(),
          particleVelocityY: new Float32Array(),
          phaseX: new Float32Array(count),
          phaseY: new Float32Array(count),
          radius: new Float32Array(count),
          speed: new Float32Array(count),
          velocityX: new Float32Array(count),
          velocityY: new Float32Array(count),
          x: new Float32Array(count),
          y: new Float32Array(count),
        };

        circles.forEach((circle, index) => {
          const x = Number(circle.getAttribute("cx") ?? 0);
          const y = Number(circle.getAttribute("cy") ?? 0);
          const hash = (x * 12.9898 + y * 78.233) % 1;
          const radius = Number(circle.getAttribute("r") ?? 0);

          dotField.x[index] = x;
          dotField.y[index] = y;
          dotField.radius[index] = radius;
          dotField.phaseX[index] = Math.abs(hash) * Math.PI * 2;
          dotField.phaseY[index] =
            Math.abs((hash * 1.618 + 0.37) % 1) * Math.PI * 2;
          dotField.speed[index] = 0.55 + Math.abs(hash) * 0.65;
          dotField.amplitude[index] =
            1 + Math.abs(hash) * 2 + Math.max(0, 1.7 - radius) * 2.1;

          if (radius > 0.6) {
            const row = rowBounds.get(y) ?? [Infinity, -Infinity];
            row[0] = Math.min(row[0], x);
            row[1] = Math.max(row[1], x);
            rowBounds.set(y, row);

            const column = columnBounds.get(x) ?? [Infinity, -Infinity];
            column[0] = Math.min(column[0], y);
            column[1] = Math.max(column[1], y);
            columnBounds.set(x, column);
          }
        });

        circles.forEach((_, index) => {
          const x = dotField.x[index];
          const y = dotField.y[index];
          const radius = dotField.radius[index];
          const hash = Math.abs((x * 12.9898 + y * 78.233) % 1);
          const row = rowBounds.get(y);
          const column = columnBounds.get(x);
          const isExterior =
            row &&
            column &&
            (x - row[0] <= 12 ||
              row[1] - x <= 12 ||
              y - column[0] <= 12 ||
              column[1] - y <= 12);

          const headAndNeckWeight = getHeadAndNeckWeight(x, y);
          const emissionThreshold = 0.55 + headAndNeckWeight * 0.4;

          if (radius > 0.6 && isExterior && hash > emissionThreshold) {
            accentIndices.push(index);
            dotField.amplitude[index] += 4.5 - headAndNeckWeight * 3.2;
          }
        });

        dotField.accentIndices = new Uint16Array(accentIndices);
        dotField.particleAge = new Float32Array(accentIndices.length);
        dotField.particleAngle = new Float32Array(accentIndices.length);
        dotField.particleCurve = new Float32Array(accentIndices.length);
        dotField.particleDistance = new Float32Array(accentIndices.length);
        dotField.particleDuration = new Float32Array(accentIndices.length);
        dotField.particleOffsetX = new Float32Array(accentIndices.length);
        dotField.particleOffsetY = new Float32Array(accentIndices.length);
        dotField.particleVelocityX = new Float32Array(accentIndices.length);
        dotField.particleVelocityY = new Float32Array(accentIndices.length);

        accentIndices.forEach((dotIndex, particleIndex) => {
          const seed = dotIndex + particleIndex * 0.731;
          const duration = 5 + seededValue(seed + 1) * 8;
          const rest = 0.6 + seededValue(seed + 2) * 4.2;
          const cyclePosition = seededValue(seed + 3) * (duration + rest);

          dotField.particleDuration[particleIndex] = duration;
          dotField.particleAge[particleIndex] =
            cyclePosition <= duration
              ? cyclePosition
              : -(duration + rest - cyclePosition);
          dotField.particleAngle[particleIndex] =
            (seededValue(seed + 4) - 0.5) * 1.65;
          dotField.particleCurve[particleIndex] =
            seededValue(seed + 5) * Math.PI * 2;
          dotField.particleDistance[particleIndex] =
            (42 +
              seededValue(seed + 6) * 65 +
              Math.max(0, 1.5 - dotField.radius[dotIndex]) * 14) *
            (1.12 -
              getHeadAndNeckWeight(dotField.x[dotIndex], dotField.y[dotIndex]) *
                0.55);
        });

        setDots(dotField);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error(error);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const portrait = portraitRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!portrait || !canvas || !context || !dots) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let isVisible = true;
    let lastFrame = 0;
    let pointerX = VIEWBOX_SIZE / 2;
    let pointerY = VIEWBOX_SIZE / 2;
    let pointerTarget = 0;
    let pointerStrength = 0;
    let physicsEnergy = 0;
    let renderScale = 1;
    let renderOffsetX = 0;
    let renderOffsetY = 0;
    let pixelRatio = 1;

    const resizeCanvas = () => {
      const rect = portrait.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      renderScale = Math.min(rect.width, rect.height) / VIEWBOX_SIZE;
      renderOffsetX = (rect.width - VIEWBOX_SIZE * renderScale) / 2;
      renderOffsetY = (rect.height - VIEWBOX_SIZE * renderScale) / 2;
      canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
    };

    const draw = (timestamp: number, force = false) => {
      animationFrame = 0;

      if (!isVisible) {
        return;
      }

      const isInteractionActive =
        pointerTarget > 0 || pointerStrength > 0.01 || physicsEnergy > 0.1;
      const frameInterval = isInteractionActive
        ? INTERACTION_FRAME_INTERVAL
        : FRAME_INTERVAL;

      if (!force && timestamp - lastFrame < frameInterval) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      const frameDelta = lastFrame
        ? Math.min((timestamp - lastFrame) / 1000, 0.05)
        : 0;
      lastFrame = timestamp;
      const pointerResponse = frameDelta ? 1 - Math.exp(-18 * frameDelta) : 1;
      pointerStrength += (pointerTarget - pointerStrength) * pointerResponse;
      let nextPhysicsEnergy = 0;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(
        pixelRatio * renderScale,
        0,
        0,
        pixelRatio * renderScale,
        pixelRatio * renderOffsetX,
        pixelRatio * renderOffsetY,
      );
      context.fillStyle = DOT_COLOR;
      context.beginPath();

      const time = timestamp * 0.00045;
      const cursorActive = pointerStrength > 0.002;
      const influenceSquared = INFLUENCE_RADIUS * INFLUENCE_RADIUS;

      for (let index = 0; index < dots.x.length; index += 1) {
        const headAndNeckWeight = getHeadAndNeckWeight(
          dots.x[index],
          dots.y[index],
        );
        const densityThreshold =
          (dots.radius[index] >= 2.2 ? 0.16 : 0.34) * headAndNeckWeight;

        if (seededValue(index + 17.3) < densityThreshold) {
          continue;
        }

        const drift = reducedMotion.matches ? 0 : dots.amplitude[index];
        let x =
          dots.x[index] +
          Math.sin(time * dots.speed[index] + dots.phaseX[index]) * drift;
        let y =
          dots.y[index] +
          Math.cos(time * dots.speed[index] * 0.86 + dots.phaseY[index]) *
            drift;

        if (!reducedMotion.matches && frameDelta > 0) {
          let offsetX = dots.offsetX[index];
          let offsetY = dots.offsetY[index];
          let velocityX = dots.velocityX[index];
          let velocityY = dots.velocityY[index];

          if (cursorActive) {
            const deltaX = x + offsetX - pointerX;
            const deltaY = y + offsetY - pointerY;
            const distanceSquared = deltaX * deltaX + deltaY * deltaY;

            if (distanceSquared < influenceSquared) {
              const distance = Math.max(Math.sqrt(distanceSquared), 0.1);
              const falloff = 1 - distance / INFLUENCE_RADIUS;
              const impulse =
                REPEL_ACCELERATION *
                falloff *
                falloff *
                pointerStrength *
                frameDelta;
              velocityX += (deltaX / distance) * impulse;
              velocityY += (deltaY / distance) * impulse;
            }
          }

          velocityX -= offsetX * SPRING_STRENGTH * frameDelta;
          velocityY -= offsetY * SPRING_STRENGTH * frameDelta;

          const damping = Math.exp(-VELOCITY_DAMPING * frameDelta);
          velocityX *= damping;
          velocityY *= damping;
          offsetX += velocityX * frameDelta;
          offsetY += velocityY * frameDelta;

          const displacement = Math.hypot(offsetX, offsetY);

          if (displacement > MAX_PHYSICS_DISPLACEMENT) {
            const limit = MAX_PHYSICS_DISPLACEMENT / displacement;
            offsetX *= limit;
            offsetY *= limit;
            velocityX *= 0.68;
            velocityY *= 0.68;
          }

          dots.offsetX[index] = offsetX;
          dots.offsetY[index] = offsetY;
          dots.velocityX[index] = velocityX;
          dots.velocityY[index] = velocityY;
          nextPhysicsEnergy = Math.max(
            nextPhysicsEnergy,
            (Math.abs(velocityX) + Math.abs(velocityY)) * 0.014,
            (Math.abs(offsetX) + Math.abs(offsetY)) * 0.055,
          );
          x += offsetX;
          y += offsetY;
        }

        const radiusVariation = dots.radius[index] < 1.7 ? 0.11 : 0.025;
        const regionScale = 1.05 - headAndNeckWeight * 0.36;
        const radius =
          dots.radius[index] *
          regionScale *
          (1 + Math.sin(time * 1.7 + dots.phaseY[index]) * radiusVariation);
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, Math.PI * 2);
      }

      context.fill();

      if (!reducedMotion.matches) {
        context.save();
        context.globalAlpha = 0.82;
        context.fillStyle = DOT_COLOR;
        context.shadowColor = "rgba(220, 236, 231, 0.42)";
        context.shadowBlur = 3;
        context.beginPath();

        for (let accent = 0; accent < dots.accentIndices.length; accent += 1) {
          const index = dots.accentIndices[accent];
          const phase = dots.phaseX[index];
          let particleAge = dots.particleAge[accent] + frameDelta;
          let duration = dots.particleDuration[accent];

          if (particleAge > duration) {
            particleAge = -(0.6 + Math.random() * 4.8);
            duration = 5 + Math.random() * 9;
            dots.particleDuration[accent] = duration;
            dots.particleAngle[accent] = (Math.random() - 0.5) * 1.8;
            dots.particleCurve[accent] = Math.random() * Math.PI * 2;
            dots.particleDistance[accent] =
              (42 +
                Math.random() * 68 +
                Math.max(0, 1.5 - dots.radius[index]) * 14) *
              (1.12 -
                getHeadAndNeckWeight(dots.x[index], dots.y[index]) * 0.55);
            dots.particleOffsetX[accent] = 0;
            dots.particleOffsetY[accent] = 0;
            dots.particleVelocityX[accent] = 0;
            dots.particleVelocityY[accent] = 0;
          }

          dots.particleAge[accent] = particleAge;

          if (particleAge < 0) {
            continue;
          }

          const progress = Math.min(particleAge / duration, 1);
          const remainingLife = 1 - progress;
          const birth = Math.min(progress / 0.14, 1);
          const sourceDrift = dots.amplitude[index];
          const sourceX =
            dots.x[index] +
            Math.sin(time * dots.speed[index] + phase) * sourceDrift;
          const sourceY =
            dots.y[index] +
            Math.cos(time * dots.speed[index] * 0.86 + dots.phaseY[index]) *
              sourceDrift;
          const radialAngle = Math.atan2(sourceY - 450, sourceX - 450);
          const angle = radialAngle + dots.particleAngle[accent];
          const maxDistance = dots.particleDistance[accent];
          const distance = Math.pow(progress, 0.78) * maxDistance;
          const curl =
            Math.sin(progress * Math.PI) *
            (Math.sin(dots.particleCurve[accent] + progress * Math.PI * 2.4) *
              0.22 +
              Math.sin(
                dots.particleCurve[accent] * 0.63 + progress * Math.PI * 5.2,
              ) *
                0.08) *
            maxDistance;
          let x =
            sourceX +
            Math.cos(angle) * distance +
            Math.cos(angle + Math.PI / 2) * curl;
          let y =
            sourceY +
            Math.sin(angle) * distance +
            Math.sin(angle + Math.PI / 2) * curl;

          if (frameDelta > 0) {
            let offsetX = dots.particleOffsetX[accent];
            let offsetY = dots.particleOffsetY[accent];
            let velocityX = dots.particleVelocityX[accent];
            let velocityY = dots.particleVelocityY[accent];

            if (cursorActive) {
              const deltaX = x + offsetX - pointerX;
              const deltaY = y + offsetY - pointerY;
              const distanceSquared = deltaX * deltaX + deltaY * deltaY;

              if (distanceSquared < influenceSquared) {
                const cursorDistance = Math.max(
                  Math.sqrt(distanceSquared),
                  0.1,
                );
                const falloff = 1 - cursorDistance / INFLUENCE_RADIUS;
                const impulse =
                  REPEL_ACCELERATION *
                  0.82 *
                  falloff *
                  falloff *
                  pointerStrength *
                  frameDelta;
                velocityX += (deltaX / cursorDistance) * impulse;
                velocityY += (deltaY / cursorDistance) * impulse;
              }
            }

            velocityX -= offsetX * (SPRING_STRENGTH * 0.86) * frameDelta;
            velocityY -= offsetY * (SPRING_STRENGTH * 0.86) * frameDelta;

            const damping = Math.exp(-(VELOCITY_DAMPING * 0.9) * frameDelta);
            velocityX *= damping;
            velocityY *= damping;
            offsetX += velocityX * frameDelta;
            offsetY += velocityY * frameDelta;

            const displacement = Math.hypot(offsetX, offsetY);

            if (displacement > MAX_PHYSICS_DISPLACEMENT * 1.15) {
              const limit = (MAX_PHYSICS_DISPLACEMENT * 1.15) / displacement;
              offsetX *= limit;
              offsetY *= limit;
              velocityX *= 0.68;
              velocityY *= 0.68;
            }

            dots.particleOffsetX[accent] = offsetX;
            dots.particleOffsetY[accent] = offsetY;
            dots.particleVelocityX[accent] = velocityX;
            dots.particleVelocityY[accent] = velocityY;
            nextPhysicsEnergy = Math.max(
              nextPhysicsEnergy,
              (Math.abs(velocityX) + Math.abs(velocityY)) * 0.014,
              (Math.abs(offsetX) + Math.abs(offsetY)) * 0.055,
            );
            x += offsetX;
            y += offsetY;
          }

          const radius =
            (dots.radius[index] + 0.35) *
            (1.12 - getHeadAndNeckWeight(dots.x[index], dots.y[index]) * 0.55) *
            (0.1 + 1.3 * birth * Math.pow(remainingLife, 0.72));

          context.moveTo(x + radius, y);
          context.arc(x, y, radius, 0, Math.PI * 2);
        }

        context.fill();
        context.restore();
      }

      physicsEnergy = nextPhysicsEnergy;

      if (!reducedMotion.matches || pointerTarget || pointerStrength > 0.002) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const requestDraw = (force = false) => {
      if (!animationFrame && isVisible) {
        animationFrame = window.requestAnimationFrame((timestamp) =>
          draw(timestamp, force),
        );
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      const rect = portrait.getBoundingClientRect();
      pointerX = (event.clientX - rect.left - renderOffsetX) / renderScale;
      pointerY = (event.clientY - rect.top - renderOffsetY) / renderScale;
      pointerTarget = 1;
      pointerStrength = Math.max(pointerStrength, 0.35);
      requestDraw(true);
    };

    const handlePointerLeave = () => {
      pointerTarget = 0;
      requestDraw(true);
    };

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        dots.offsetX.fill(0);
        dots.offsetY.fill(0);
        dots.velocityX.fill(0);
        dots.velocityY.fill(0);
        dots.particleOffsetX.fill(0);
        dots.particleOffsetY.fill(0);
        dots.particleVelocityX.fill(0);
        dots.particleVelocityY.fill(0);
      }

      requestDraw(true);
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      requestDraw(true);
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;

      if (isVisible) {
        requestDraw(true);
      } else if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    });

    resizeObserver.observe(portrait);
    intersectionObserver.observe(portrait);
    portrait.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    portrait.addEventListener("pointerleave", handlePointerLeave);
    reducedMotion.addEventListener("change", handleMotionPreference);

    resizeCanvas();
    requestDraw(true);

    return () => {
      portrait.removeEventListener("pointermove", handlePointerMove);
      portrait.removeEventListener("pointerleave", handlePointerLeave);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [dots]);

  return (
    <div
      ref={portraitRef}
      className="halftone-portrait"
      role="img"
      aria-label="Interactive particle portrait of Mark Judaya"
    >
      <canvas
        ref={canvasRef}
        className="halftone-portrait__canvas"
        aria-hidden="true"
      />
      {!dots && (
        <img
          className="halftone-portrait__fallback"
          src="/halftone-portrait.svg"
          alt=""
          width="900"
          height="900"
        />
      )}
    </div>
  );
};

export default HalftonePortrait;
