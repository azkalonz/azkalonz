import { Link } from "react-router-dom";
import ContactCta from "../components/ContactCta";
import Icon from "../components/Icon";
import Seo from "../components/Seo";
import projects from "../data/projects";
import { services } from "../data/site";

const Services = () => (
  <>
    <Seo
      title="IT services"
      description="Application development, automation and integrations, technical consulting, and ongoing IT support for growing businesses."
      canonical="/services"
    />

    <header className="page-hero section-shell">
      <p className="eyebrow">Services</p>
      <h1>
        Build what is missing. Connect what is fragmented. Improve what already
        works.
      </h1>
      <p>
        I help growing businesses turn operational needs into dependable
        applications, integrations, and improvement plans—without making the
        technology harder to understand than it needs to be.
      </p>
      <div className="hero__actions">
        <Link to="/contact" className="button button--primary">
          Discuss your project{" "}
          <Icon name="arrow-right" className="button__icon" />
        </Link>
        <Link to="/projects" className="button button--secondary">
          See relevant work
        </Link>
      </div>
    </header>

    <nav
      className="service-jump section-shell"
      aria-label="Services on this page"
    >
      {services.map((service) => (
        <a key={service.id} href={`#${service.id}`}>
          <span>{service.number}</span>
          {service.shortTitle}
        </a>
      ))}
    </nav>

    <div className="service-details section-shell">
      {services.map((service) => {
        const relatedProjects = projects
          .filter((project) => service.relatedProjectIds.includes(project.id))
          .slice(0, 2);

        return (
          <section
            id={service.id}
            className="service-detail"
            key={service.id}
            aria-labelledby={`${service.id}-title`}
          >
            <div className="service-detail__intro">
              <span className="service-detail__number">{service.number}</span>
              <p className="eyebrow">{service.shortTitle}</p>
              <h2 id={`${service.id}-title`}>{service.title}</h2>
              <p className="service-detail__summary">{service.summary}</p>
              <Link
                to={`/contact?service=${encodeURIComponent(service.title)}`}
                className="button button--secondary"
              >
                Discuss this service{" "}
                <Icon name="arrow-right" className="button__icon" />
              </Link>
            </div>

            <div className="service-detail__content">
              <div className="service-answer">
                <h3>The problem it solves</h3>
                <p>{service.problem}</p>
              </div>
              <div className="service-answer">
                <h3>Who it suits</h3>
                <p>{service.fit}</p>
              </div>
              <div className="service-answer service-answer--wide">
                <h3>Common deliverables</h3>
                <ul className="check-list">
                  {service.deliverables.map((item) => (
                    <li key={item}>
                      <Icon name="check" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="service-answer service-answer--wide">
                <h3>How I approach it</h3>
                <p>{service.approach}</p>
              </div>
              <div className="service-answer">
                <h3>Relevant technology</h3>
                <div className="tag-list">
                  {service.technologies.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="service-answer">
                <h3>Related work</h3>
                <div className="related-links">
                  {relatedProjects.map((project) => (
                    <Link key={project.id} to={`/projects/${project.id}`}>
                      <span>{project.title}</span>
                      <Icon name="arrow-right" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>

    <div className="section-shell page-section page-section--cta">
      <ContactCta
        eyebrow="Not sure where it fits?"
        title="Start with the operating problem, not the service label."
        copy="Tell me what your team is trying to change. I can help identify whether the next step is discovery, an application build, an integration, or a focused improvement."
      />
    </div>
  </>
);

export default Services;
