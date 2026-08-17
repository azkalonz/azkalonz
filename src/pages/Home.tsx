/*
THESIS: The page presents BuiltByMark.dev as a calm, direct practice for dependable operational software.
OWN-WORLD: A themeable editorial system that can shift palette and typographic voice while one bounded service reel connects responsive application work, dependable integrations, and source-grounded AI assistance.
STORY: Visitors understand the offer through the responsive app, workflow, and AI review reel, scan project outcomes, compare selected systems, learn how the work is approached, and start a conversation.
FIRST VIEWPORT: Wide screens pair the proposition with the service reel; narrow screens lead with the copy and actions, then show the same artifact through closer framing immediately below.
FORM: A calm operational index with one authored three-act service sequence.
*/
import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import ContactCta from "../components/ContactCta";
import { HeroSceneBar, HeroSceneGrid } from "../components/HeroSceneChrome";
import HomeMotion from "../components/HomeMotion";
import Icon from "../components/Icon";
import ProjectIndex from "../components/ProjectIndex";
import ResponsiveAppScene from "../components/ResponsiveAppScene";
import Seo from "../components/Seo";
import {
  getHeroScreenLayout,
  getResponsiveAppCameraPlan,
  type ResponsiveAppViewport,
} from "../components/responsiveAppGeometry";
import projects from "../data/projects";
import { services, site } from "../data/site";

const LazyHeroSystemScreen = lazy(
  () => import("../components/HeroSystemScreen"),
);

const HeroSystemScreenFallback = () => {
  const flowRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState<ResponsiveAppViewport>();
  const [layout, setLayout] = useState<"compact" | "medium" | "desktop">(
    "desktop",
  );

  useLayoutEffect(() => {
    const flow = flowRef.current;
    if (!flow) return;

    const updateViewport = () => {
      const width = flow.clientWidth;
      const height = flow.clientHeight;
      if (width <= 0 || height <= 0) return;

      const nextLayout = getHeroScreenLayout(window.innerWidth);
      setLayout(nextLayout);
      setViewport(
        getResponsiveAppCameraPlan(width, height, nextLayout).desktop,
      );
    };

    updateViewport();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateViewport);
      return () => window.removeEventListener("resize", updateViewport);
    }

    const resizeObserver = new ResizeObserver(updateViewport);
    resizeObserver.observe(flow);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <figure
      className="hero-system-screen hero-system-screen--placeholder"
      data-workflow-layout={layout}
      data-workflow-motion="pending"
      data-active-scene="app"
      data-playback-paused="false"
      data-deck-transitioning="false"
      aria-hidden="true"
    >
      <div className="hero-system-screen__frame">
        <section
          className="hero-system-screen__card"
          data-hero-card="app"
          data-deck-depth="top"
        >
          <HeroSceneBar scene="app" />
          <div ref={flowRef} className="hero-system-screen__flow">
            <ResponsiveAppScene initialViewport={viewport} />
          </div>
        </section>
        <section
          className="hero-system-screen__card"
          data-hero-card="workflow"
          data-deck-depth="middle"
        >
          <HeroSceneBar scene="workflow" />
          <div className="hero-system-screen__flow">
            <HeroSceneGrid />
          </div>
        </section>
        <section
          className="hero-system-screen__card"
          data-hero-card="ai"
          data-deck-depth="back"
        >
          <HeroSceneBar scene="ai" />
          <div className="hero-system-screen__flow">
            <HeroSceneGrid />
          </div>
        </section>
      </div>
    </figure>
  );
};

const ResponsiveHeroSystemScreen = () => {
  const [loadAnimation, setLoadAnimation] = useState(false);

  useEffect(() => {
    let idleHandle = 0;
    let timerHandle = 0;

    const queueAnimationImport = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(() => setLoadAnimation(true), {
          timeout: 1800,
        });
      } else {
        setLoadAnimation(true);
      }
    };

    const requestLoad = () => {
      timerHandle = globalThis.setTimeout(queueAnimationImport, 650);
    };

    if (document.readyState === "complete") requestLoad();
    else window.addEventListener("load", requestLoad, { once: true });

    return () => {
      window.removeEventListener("load", requestLoad);
      if (idleHandle && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      }
      if (timerHandle) window.clearTimeout(timerHandle);
    };
  }, []);

  if (!loadAnimation) return <HeroSystemScreenFallback />;

  return (
    <Suspense fallback={<HeroSystemScreenFallback />}>
      <LazyHeroSystemScreen />
    </Suspense>
  );
};

const featuredProjects = projects.filter((project) => project.featured);

const method = [
  {
    title: "Map the process",
    copy: "Identify who uses it, where the data comes from, which decisions matter, and where handoffs break down.",
  },
  {
    title: "Plan for failures",
    copy: "Decide how validation, duplicate checks, logging, recovery, and ownership should work before implementation.",
  },
  {
    title: "Build it as one system",
    copy: "Treat the interface, data, background jobs, APIs, and documentation as one piece of work.",
  },
  {
    title: "Stay involved after launch",
    copy: "Support production use, investigate issues, and extend the software as the business changes.",
  },
];

const Home = () => (
  <>
    <Seo
      title="Custom Software, Integrations & Support"
      description="Mark Judaya builds custom business software, integrations, and automation for teams managing orders, inventory, CRM, and product data."
      canonical="/"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${site.url}/#website`,
          name: site.name,
          alternateName: site.personName,
          url: site.url,
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": `${site.url}/#mark-judaya`,
          name: site.personName,
          url: site.url,
          image: `${site.url}/avatar.webp`,
          jobTitle: "Full-Stack Developer and IT Solutions Specialist",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Cebu",
            addressCountry: "PH",
          },
          sameAs: [
            site.socials.linkedin,
            site.socials.github,
            site.socials.fiverr,
          ],
          knowsAbout: [
            "Web application development",
            "Systems integration",
            "Business automation",
            "Zoho",
            "Technical consulting",
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "@id": `${site.url}/#professional-service`,
          name: site.name,
          url: site.url,
          email: site.email,
          founder: { "@id": `${site.url}/#mark-judaya` },
          areaServed: "Worldwide",
          serviceType: services.map((service) => service.title),
        },
      ]}
    />

    <HomeMotion>
      <section className="relay-hero" aria-labelledby="home-title">
        <div className="section-shell relay-hero__grid">
          <div className="relay-hero__stage">
            <div className="relay-hero__intro-copy">
              <h1 id="home-title">
                Built for
                <br />
                real work.
              </h1>
              <p className="relay-hero__lead">
                Custom applications and integrations for orders, inventory,
                customer records, product data, and the systems that keep your
                business moving.
              </p>
              <div className="hero-actions">
                <Link to="/contact" className="button button--primary">
                  Start a project <Icon name="arrow-right" />
                </Link>
                <a href="#selected-work" className="button button--quiet">
                  View my work <Icon name="arrow-right" />
                </a>
              </div>
            </div>
            <ResponsiveHeroSystemScreen />
          </div>
        </div>
      </section>

      <section
        className="section-shell proof-rail"
        aria-labelledby="proof-rail-title"
      >
        <header className="proof-rail__header">
          <h2 id="proof-rail-title">What the systems handled.</h2>
          <p>
            Selected outcomes from applications and integrations running in
            production.
          </p>
        </header>
        <div className="proof-rail__records">
          <article className="proof-rail__item">
            <header className="proof-rail__item-bar">
              <h3 className="proof-rail__label">Fulfilled order value</h3>
            </header>
            <div className="proof-rail__item-body">
              <strong className="proof-rail__metric">$5M+</strong>
              <p className="proof-rail__description">
                More than $5 million in orders fulfilled through a live commerce
                integration.
              </p>
            </div>
          </article>
          <article className="proof-rail__item">
            <header className="proof-rail__item-bar">
              <h3 className="proof-rail__label">Automation executions</h3>
            </header>
            <div className="proof-rail__item-body">
              <strong className="proof-rail__metric">5M+</strong>
              <p className="proof-rail__description">
                Recurring business processes handled through connected
                applications and integrations.
              </p>
            </div>
          </article>
          <article className="proof-rail__item">
            <header className="proof-rail__item-bar">
              <h3 className="proof-rail__label">Synced live orders</h3>
            </header>
            <div className="proof-rail__item-body">
              <strong className="proof-rail__metric">40K+</strong>
              <p className="proof-rail__description">
                Live order data carried between commerce, inventory, and
                fulfilment operations.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section
        id="selected-work"
        className="home-work section-shell"
        aria-labelledby="selected-work-title"
      >
        <header className="editorial-heading editorial-heading--plain">
          <h2 id="selected-work-title">Selected work</h2>
          <p>
            Selected projects, with the problem, build, and safeguards behind
            each one.
          </p>
        </header>

        <ProjectIndex projects={featuredProjects} />

        <Link to="/projects" className="index-link">
          View all four case studies <Icon name="arrow-right" />
        </Link>
      </section>

      <section className="capability-field" aria-labelledby="capability-title">
        <div className="section-shell">
          <header className="editorial-heading editorial-heading--compact">
            <h2 id="capability-title">What I help teams solve</h2>
            <Link to="/services" className="index-link">
              Explore services <Icon name="arrow-right" />
            </Link>
          </header>

          <div className="service-ledger">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services#${service.id}`}
                className="service-ledger__row"
              >
                <h3>{service.title}</h3>
                <p>{service.problem}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="method-field section-shell"
        aria-labelledby="method-title"
      >
        <header>
          <h2 id="method-title">How I keep software reliable.</h2>
          <p>
            Good implementation is only part of it. I also plan for exceptions,
            recovery, handover, and the people responsible after launch.
          </p>
        </header>
        <ol className="method-relay">
          {method.map((step) => (
            <li key={step.title}>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-about" aria-labelledby="home-about-title">
        <div className="section-shell home-about__grid">
          <div>
            <h2 id="home-about-title">
              You work directly with me—from scoping to production.
            </h2>
          </div>
          <div>
            <p>
              I’m Mark Judaya, a full-stack developer and IT solutions
              specialist in Cebu, Philippines. I work with business owners,
              operations teams, and developers to understand the problem, build
              the software, and support it after launch.
            </p>
            <Link to="/about" className="index-link">
              More about how I work <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <div className="section-shell home-contact">
        <ContactCta
          title="What isn’t working—or what do you need to build?"
          copy="Send a short note about the current process, the tools involved, and what needs to change. That is enough to get started."
        />
      </div>
    </HomeMotion>
  </>
);

export default Home;
