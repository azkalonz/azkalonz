import { type ReactNode, useLayoutEffect, useRef } from "react";

type HomeMotionProps = {
  children: ReactNode;
};

const HomeMotion = ({ children }: HomeMotionProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let cancelled = false;
    let revert: () => void = () => undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;

        const { gsap } = gsapModule;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        const context = gsap.context(() => {
          const work = root.querySelector(".home-work");
          if (work) {
            const heading = work.querySelectorAll(".editorial-heading > *");
            const projectIndex = work.querySelector(".project-index");
            const projects = Array.from(
              work.querySelectorAll<HTMLElement>(".project-index__item"),
            );
            const allWorkLink = work.querySelector(":scope > .index-link");

            gsap.fromTo(
              heading,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 0.62,
                ease: "expo.out",
                stagger: 0.08,
                scrollTrigger: {
                  trigger: work,
                  start: "top 82%",
                  once: true,
                },
              },
            );

            if (projectIndex && projects.length > 0) {
              const firstTop = projects[0].offsetTop;
              const stackLeft =
                (projectIndex.clientWidth - projects[0].offsetWidth) / 2;
              const stackOffset = projectIndex.clientWidth <= 600 ? 28 : 16;

              projects.forEach((project, index) => {
                gsap.set(project, {
                  x: stackLeft - project.offsetLeft,
                  y: firstTop - project.offsetTop + index * stackOffset,
                  scale: 1 - index * 0.018,
                  zIndex: projects.length - index,
                  "--stack-shadow-opacity": 0.12,
                  transformOrigin: "50% 0%",
                });
                gsap.set(project.children, { opacity: index === 0 ? 1 : 0 });
              });

              const workTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: projectIndex,
                  start: "top 78%",
                  end: "bottom 72%",
                  scrub: 0.65,
                },
              });

              projects.forEach((project, index) => {
                const position = index * 0.16;
                workTimeline.to(
                  project,
                  {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.72,
                    ease: "power3.inOut",
                  },
                  position,
                );

                workTimeline.to(
                  project,
                  {
                    "--stack-shadow-opacity": 0,
                    duration: 0.34,
                    ease: "power1.inOut",
                  },
                  position + 0.72,
                );

                if (index > 0) {
                  workTimeline.to(
                    project.children,
                    {
                      opacity: 1,
                      duration: 0.2,
                      ease: "power2.out",
                    },
                    position + 0.72,
                  );
                }
              });

              if (allWorkLink) {
                workTimeline.fromTo(
                  allWorkLink,
                  { opacity: 0, y: 10 },
                  { opacity: 1, y: 0, duration: 0.2 },
                  1.42,
                );
              }
            }
          }

          const capabilities = root.querySelector(".capability-field");
          if (capabilities) {
            const rows = capabilities.querySelectorAll(".service-ledger__row");
            rows.forEach((row) => {
              gsap.fromTo(
                row,
                {
                  autoAlpha: 0.55,
                  scale: 0.84,
                  transformOrigin: "50% 50%",
                },
                {
                  autoAlpha: 1,
                  scale: 1,
                  duration: 0.7,
                  ease: "none",
                  scrollTrigger: {
                    trigger: row,
                    start: "top 96%",
                    end: "top 68%",
                    scrub: 0.45,
                    invalidateOnRefresh: true,
                  },
                },
              );
            });
          }

          const method = root.querySelector(".method-field");
          if (method) {
            const steps = method.querySelectorAll(".method-relay li");
            steps.forEach((step) => {
              gsap.fromTo(
                step,
                { opacity: 0, x: 34 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.58,
                  ease: "none",
                  scrollTrigger: {
                    trigger: step,
                    start: "top 96%",
                    end: "top 68%",
                    scrub: 0.45,
                    invalidateOnRefresh: true,
                  },
                },
              );
            });
          }

          const about = root.querySelector(".home-about__grid");
          if (about) {
            const columns = about.querySelectorAll(":scope > div");
            gsap.fromTo(
              columns,
              { autoAlpha: 0.45, x: (index) => (index === 0 ? -28 : 28) },
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.8,
                ease: "expo.out",
                stagger: 0.08,
                scrollTrigger: {
                  trigger: about,
                  start: "top 78%",
                  once: true,
                },
              },
            );
          }

          const contact = root.querySelector(".home-contact .cta-field");
          if (contact) {
            gsap.fromTo(
              contact,
              { clipPath: "inset(0 100% 0 0)" },
              {
                clipPath: "inset(0 0% 0 0)",
                duration: 0.95,
                ease: "expo.out",
                scrollTrigger: {
                  trigger: contact,
                  start: "top 82%",
                  once: true,
                },
              },
            );
            gsap.fromTo(
              contact.querySelectorAll(":scope > div"),
              { autoAlpha: 0, x: -18 },
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.65,
                delay: 0.16,
                ease: "expo.out",
                stagger: 0.08,
                scrollTrigger: {
                  trigger: contact,
                  start: "top 82%",
                  once: true,
                },
              },
            );
          }
        }, root);

        revert = () => context.revert();
      },
    );

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relay-home">
      {children}
    </div>
  );
};

export default HomeMotion;
