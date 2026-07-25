import { lazy, Suspense, useEffect, useRef, useState } from "react";

const HalftonePortrait = lazy(() => import("./HalftonePortrait"));

const PortraitFallback = () => (
  <div className="halftone-portrait" aria-hidden="true" />
);

const DeferredHalftonePortrait = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    const portrait =
      containerRef.current?.closest<HTMLElement>(".matrix-portrait");

    if (isEnhanced) return;

    const enhance = () => setIsEnhanced(true);
    const interactionEvents = ["pointerdown", "keydown", "touchstart"] as const;

    interactionEvents.forEach((eventName) => {
      document.addEventListener(eventName, enhance, {
        once: true,
        passive: true,
      });
    });
    portrait?.addEventListener("pointerenter", enhance, { once: true });
    portrait?.addEventListener("focusin", enhance, { once: true });

    if (document.readyState === "complete") {
      enhance();
    } else {
      window.addEventListener("load", enhance, { once: true });
    }

    return () => {
      interactionEvents.forEach((eventName) => {
        document.removeEventListener(eventName, enhance);
      });
      portrait?.removeEventListener("pointerenter", enhance);
      portrait?.removeEventListener("focusin", enhance);
      window.removeEventListener("load", enhance);
    };
  }, [isEnhanced]);

  return (
    <div ref={containerRef} className="deferred-halftone">
      {isEnhanced ? (
        <Suspense fallback={<PortraitFallback />}>
          <HalftonePortrait />
        </Suspense>
      ) : (
        <PortraitFallback />
      )}
    </div>
  );
};

export default DeferredHalftonePortrait;
