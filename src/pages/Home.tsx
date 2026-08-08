/*
THESIS: The page presents BuiltByMark.dev as a calm, direct practice for dependable operational software.
OWN-WORLD: A themeable editorial system that can shift palette and typographic voice while the operational pipeline continues turning disconnected inputs into a dependable system.
STORY: Visitors understand the offer through the pipeline, scan project outcomes, compare selected systems, learn how the work is approached, and start a conversation.
FIRST VIEWPORT: A compact proposition and one primary action sit beside a scroll-responsive model of Mark's actual work.
FORM: A calm operational index with one authored, explanatory motion sequence.
*/
import { Link } from "react-router-dom";
import ContactCta from "../components/ContactCta";
import HeroScene from "../components/HeroScene";
import HomeMotion from "../components/HomeMotion";
import Icon from "../components/Icon";
import ProjectIndex from "../components/ProjectIndex";
import Seo from "../components/Seo";
import projects from "../data/projects";
import { services, site } from "../data/site";

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
            <HeroScene
              outro={
                <div
                  className="proof-rail"
                  aria-label="Selected project outcomes"
                >
                  <div className="proof-rail__item">
                    <div className="proof-rail__metric">
                      <strong>2M+</strong>
                      <span className="proof-rail__label">
                        Migrated records
                      </span>
                    </div>
                    <p className="proof-rail__description">
                      Records moved between CRM systems with relationships
                      preserved for validation.
                    </p>
                  </div>
                  <div className="proof-rail__item">
                    <div className="proof-rail__metric">
                      <strong>5M+</strong>
                      <span className="proof-rail__label">
                        Automation executions
                      </span>
                    </div>
                    <p className="proof-rail__description">
                      Recurring business processes handled through connected
                      applications and integrations.
                    </p>
                  </div>
                  <div className="proof-rail__item">
                    <div className="proof-rail__metric">
                      <strong>40K+</strong>
                      <span className="proof-rail__label">
                        Synced live orders
                      </span>
                    </div>
                    <p className="proof-rail__description">
                      Live order data carried between commerce, inventory, and
                      fulfilment operations.
                    </p>
                  </div>
                </div>
              }
            >
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
            </HeroScene>
          </div>
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
