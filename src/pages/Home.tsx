import { Link } from "react-router-dom";
import ContactCta from "../components/ContactCta";
import HalftonePortrait from "../components/HalftonePortrait";
import Icon from "../components/Icon";
import ProjectCard from "../components/ProjectCard";
import SectionHeading from "../components/SectionHeading";
import Seo from "../components/Seo";
import projects from "../data/projects";
import { capabilities, faqs, services, site } from "../data/site";

const featuredProjects = projects
  .filter((project) => project.featured)
  .slice(0, 3);

const serviceIcons = ["code", "layers", "compass", "support"] as const;

const Home = () => (
  <>
    <Seo
      title="IT solutions for growing businesses"
      description="Custom web and mobile applications, business systems, automation, integrations, technical consultation, and ongoing application support from Mark Judaya."
      canonical="/"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.name,
          url: site.url,
          image: `${site.url}/avatar.webp`,
          jobTitle: "IT Solutions Developer",
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
          name: "Mark Judaya IT Solutions",
          url: site.url,
          email: site.email,
          areaServed: "Worldwide",
          serviceType: services.map((service) => service.title),
        },
      ]}
    />

    <section className="hero section-shell" aria-labelledby="home-title">
      <div className="hero__copy">
        <p className="eyebrow">Full-service IT solutions</p>
        <h1 id="home-title">
          I build, connect, and support the technology your business relies on.
        </h1>
        <p className="hero__lead">
          Custom applications, business systems, automation, integrations,
          technical consultation, and ongoing support—delivered with a practical
          full-stack approach.
        </p>
        <div className="hero__actions">
          <Link to="/contact" className="button button--primary">
            Start a project <Icon name="arrow-right" className="button__icon" />
          </Link>
          <Link to="/projects" className="button button--secondary">
            View selected work
          </Link>
        </div>
        <p className="hero__note">
          Direct collaboration from discovery through delivery and continued
          improvement.
        </p>
      </div>

      <div className="hero__visual">
        <figure className="hero-halftone">
          <div className="hero-halftone__canvas">
            <HalftonePortrait />
            <div className="hero-halftone__coordinates" aria-hidden="true">
              <span>14.5995° N</span>
              <span>120.9842° E</span>
            </div>
          </div>
          <figcaption className="hero-halftone__caption">
            <span>
              <strong>Mark Judaya</strong>
              Full-stack development & systems integration
            </span>
            <span className="hero-halftone__hint">
              <i aria-hidden="true" />
              Move through the dots
            </span>
          </figcaption>
        </figure>
        <div className="hero-system" aria-hidden="true">
          <span>Build</span>
          <i />
          <span>Connect</span>
          <i />
          <span>Improve</span>
          <i />
          <span>Support</span>
        </div>
      </div>
    </section>

    <section className="proof-strip" aria-label="Core areas of expertise">
      <div className="proof-strip__intro">
        <span className="status-dot" />
        Available for focused projects and ongoing work
      </div>
      <div className="proof-strip__items">
        <span>Full-stack delivery</span>
        <span>Business systems</span>
        <span>Zoho & API integrations</span>
        <span>Application support</span>
      </div>
    </section>

    <section
      className="page-section section-shell"
      aria-labelledby="services-title"
    >
      <SectionHeading
        eyebrow="Services"
        title="Technical help shaped around the business problem."
        description="I can take responsibility for a complete application, a difficult connection between systems, or a focused improvement to technology you already use."
        action={
          <Link to="/services" className="text-link">
            Explore all services <Icon name="arrow-right" />
          </Link>
        }
      />
      <div className="service-grid">
        {services.map((service, index) => (
          <article className="service-card" key={service.id}>
            <div className="service-card__top">
              <span className="service-card__number">{service.number}</span>
              <Icon name={serviceIcons[index]} className="service-card__icon" />
            </div>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
            <ul>
              {service.deliverables.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link to={`/services#${service.id}`} className="text-link">
              View this service <Icon name="arrow-right" />
            </Link>
          </article>
        ))}
      </div>
    </section>

    <section
      className="page-section page-section--tinted"
      aria-labelledby="work-title"
    >
      <div className="section-shell">
        <SectionHeading
          eyebrow="Selected work"
          title="Evidence of systems made clearer, more connected, and easier to operate."
          description="Each case study focuses on the operating problem, my role, the technical approach, and what changed."
          action={
            <Link to="/projects" className="text-link">
              View all work <Icon name="arrow-right" />
            </Link>
          }
        />
        <div className="featured-work-grid">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              layout={index === 0 ? "feature" : "card"}
            />
          ))}
        </div>
      </div>
    </section>

    <section
      className="page-section section-shell"
      aria-labelledby="process-title"
    >
      <SectionHeading
        eyebrow="How I work"
        title="A clear path from an unclear problem to a useful system."
        description="The process stays lightweight and adapts to the work, but the important decisions are made deliberately."
      />
      <ol className="process-list">
        <li>
          <span>01</span>
          <div>
            <h3>Discover</h3>
            <p>
              Understand the current workflow, users, constraints, and the
              outcome that matters.
            </p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <h3>Define</h3>
            <p>
              Clarify scope, system boundaries, data, risks, and the smallest
              useful delivery plan.
            </p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <h3>Build & connect</h3>
            <p>
              Implement the interface, application logic, and integrations with
              review points along the way.
            </p>
          </div>
        </li>
        <li>
          <span>04</span>
          <div>
            <h3>Validate & support</h3>
            <p>
              Test the real workflow, document the solution, launch carefully,
              and improve it after use.
            </p>
          </div>
        </li>
      </ol>
    </section>

    <section
      className="page-section page-section--dark"
      aria-labelledby="why-title"
    >
      <div className="section-shell split-section">
        <div>
          <p className="eyebrow eyebrow--light">Why work with me</p>
          <h2 id="why-title" className="section-title section-title--light">
            One technical partner who can see the whole workflow.
          </h2>
          <p className="section-copy section-copy--light">
            I work across product interfaces, application logic, data, and
            integrations. That means fewer handoffs between the business problem
            and the implementation details.
          </p>
          <Link to="/about" className="button button--outline-light">
            How I approach the work
          </Link>
        </div>
        <div className="principles-list">
          {[
            [
              "Business-aware",
              "The implementation starts with how the work actually happens, not with a preferred tool.",
            ],
            [
              "Maintainable",
              "Clear structure, validation, documentation, and sensible technical choices matter after launch.",
            ],
            [
              "Direct",
              "You work with the person planning and implementing the solution.",
            ],
            [
              "Practical",
              "Existing systems are improved or connected when that is more useful than rebuilding.",
            ],
          ].map(([title, copy]) => (
            <div key={title}>
              <Icon name="check" />
              <p>
                <strong>{title}</strong>
                <span>{copy}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section
      className="page-section section-shell"
      aria-labelledby="capabilities-title"
    >
      <SectionHeading
        eyebrow="Technical capabilities"
        title="Technology is supporting evidence, not the sales pitch."
        description="The stack changes with the problem. These are the tools and platforms represented in the work shown here."
      />
      <div className="capability-grid">
        {capabilities.map((group) => (
          <div className="capability-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    <section
      className="page-section page-section--bordered section-shell"
      aria-labelledby="faq-title"
    >
      <SectionHeading
        eyebrow="Frequently asked questions"
        title="Useful answers before we talk."
      />
      <div className="faq-list">
        {faqs.map((item) => (
          <details key={item.question}>
            <summary>
              {item.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>

    <div className="section-shell page-section page-section--cta">
      <ContactCta />
    </div>
  </>
);

export default Home;
