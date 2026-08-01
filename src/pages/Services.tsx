import { Link } from "react-router-dom";
import ContactCta from "../components/ContactCta";
import Icon from "../components/Icon";
import Seo from "../components/Seo";
import projects from "../data/projects";
import { faqs, services, site } from "../data/site";

const Services = () => (
  <>
    <Seo
      title="Custom Software, Integrations & Support"
      description="Custom web applications, Zoho and API integrations, technical planning, and software support from Mark Judaya."
      canonical="/services"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Custom software development and integration services",
          itemListElement: services.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              name: service.title,
              description: service.summary,
              url: `${site.url}/services#${service.id}`,
              provider: {
                "@type": "Person",
                "@id": `${site.url}/#mark-judaya`,
                name: site.personName,
                url: site.url,
              },
              areaServed: "Worldwide",
            },
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${site.url}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: `${site.url}/services`,
            },
          ],
        },
      ]}
    />

    <header className="page-hero services-hero section-shell">
      <div className="page-hero__grid">
        <h1>Custom software, integrations, and support.</h1>
        <p>
          I help teams replace spreadsheet handoffs, repeated data entry, and
          fragile software with tools built around the way they actually work.
        </p>
        <div className="hero-actions">
          <Link to="/contact" className="button button--primary">
            Tell me about your project <Icon name="arrow-right" />
          </Link>
          <Link to="/projects" className="button button--quiet">
            View my work
          </Link>
        </div>
      </div>
    </header>

    <nav
      className="service-index section-shell"
      aria-label="Services on this page"
    >
      <span className="service-index__label" aria-hidden="true">
        Services
      </span>
      <div className="service-index__links">
        {services.map((service) => (
          <a key={service.id} href={`#${service.id}`}>
            {service.shortTitle}
          </a>
        ))}
      </div>
    </nav>

    <div className="service-records section-shell">
      {services.map((service) => {
        const relatedProjects = projects
          .filter((project) => service.relatedProjectIds.includes(project.id))
          .slice(0, 2);

        return (
          <section
            id={service.id}
            className="service-record"
            key={service.id}
            aria-labelledby={`${service.id}-title`}
          >
            <header>
              <h2 id={`${service.id}-title`}>{service.title}</h2>
              <p className="service-record__summary">{service.summary}</p>
              <Link
                to={`/contact?service=${encodeURIComponent(service.title)}`}
                className="button button--quiet"
              >
                Ask about this service <Icon name="arrow-right" />
              </Link>
            </header>

            <div className="service-record__body">
              <div className="service-fact">
                <h3>When this helps</h3>
                <p>{service.problem}</p>
              </div>
              <div className="service-fact">
                <h3>Who I work with</h3>
                <p>{service.fit}</p>
              </div>
              <div className="service-fact service-fact--wide">
                <h3>What I can help with</h3>
                <ul>
                  {service.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="service-fact service-fact--wide">
                <h3>How I work</h3>
                <p>{service.approach}</p>
              </div>

              {relatedProjects.length > 0 && (
                <div className="related-work">
                  <h3>Related case studies</h3>
                  {relatedProjects.map((project) => (
                    <Link key={project.id} to={`/projects/${project.id}`}>
                      <span>{project.title}</span>
                      <Icon name="arrow-up-right" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>

    <section className="faq-field section-shell" aria-labelledby="faq-title">
      <header>
        <h2 id="faq-title">Before we start</h2>
      </header>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>

    <div className="section-shell page-section page-section--cta">
      <ContactCta />
    </div>
  </>
);

export default Services;
