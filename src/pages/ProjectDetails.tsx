import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ContactCta from "../components/ContactCta";
import Icon from "../components/Icon";
import Seo from "../components/Seo";
import projects from "../data/projects";
import { services, site } from "../data/site";

type PreloadedProjectDetails = typeof globalThis & {
  __PROJECT_DETAILS__?: Record<string, string>;
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = useMemo(() => projects.find((item) => item.id === id), [id]);
  const [details, setDetails] = useState(() => {
    if (!id) return "";
    return (
      (globalThis as PreloadedProjectDetails).__PROJECT_DETAILS__?.[id] ?? ""
    );
  });

  useEffect(() => {
    if (!id || details) return;
    const controller = new AbortController();

    fetch(`/project-details/${id}.md`, { signal: controller.signal })
      .then((response) => (response.ok ? response.text() : ""))
      .then((content) => setDetails(content))
      .catch(() => undefined);

    return () => controller.abort();
  }, [id, details]);

  if (!project) {
    return (
      <>
        <Seo
          title="Project not found"
          description="The requested project could not be found."
          noIndex
        />
        <section className="not-found section-shell">
          <p className="eyebrow">404</p>
          <h1>That case study is not here.</h1>
          <p>The link may be outdated, or the project may have moved.</p>
          <Link to="/projects" className="button button--primary">
            View selected work
          </Link>
        </section>
      </>
    );
  }

  const relatedService = services.find((service) =>
    service.relatedProjectIds.includes(project.id),
  );

  return (
    <>
      <Seo
        title={project.title}
        description={project.description}
        ogType="article"
        canonical={`/projects/${project.id}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          creator: { "@type": "Person", name: site.name, url: site.url },
          url: `${site.url}/projects/${project.id}`,
        }}
      />

      <article className="case-study">
        <header className="case-hero section-shell">
          <Link to="/projects" className="back-link">
            <Icon name="arrow-right" /> Back to selected work
          </Link>
          <div className="case-hero__grid">
            <div>
              <div className="project-card__meta">
                <span>{project.projectType}</span>
                <span aria-hidden="true">•</span>
                <span>{project.services[0]}</span>
              </div>
              <h1>{project.title}</h1>
              <p className="case-hero__lead">{project.description}</p>
              <div className="hero__actions">
                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="button button--primary"
                  >
                    Open project overview{" "}
                    <Icon name="arrow-up-right" className="button__icon" />
                  </a>
                )}
                {project.links?.repo && (
                  <a
                    href={project.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="button button--secondary"
                  >
                    View repository{" "}
                    <Icon name="arrow-up-right" className="button__icon" />
                  </a>
                )}
              </div>
            </div>
            <dl className="case-facts">
              <div>
                <dt>My role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>
                  {project.dateStarted} — {project.dateFinished}
                </dd>
              </div>
              <div>
                <dt>Services</dt>
                <dd>{project.services.join(", ")}</dd>
              </div>
            </dl>
          </div>
        </header>

        {project.featuredPhoto && (
          <div className="case-media section-shell">
            <img
              src={project.featuredPhoto}
              alt="Product information architecture for the Urban Road PIM platform"
              width="1800"
              height="1352"
            />
          </div>
        )}

        <section
          className="case-summary section-shell"
          aria-label="Case study summary"
        >
          <div>
            <span>Context</span>
            <p>{project.context}</p>
          </div>
          <div>
            <span>Problem</span>
            <p>{project.problem}</p>
          </div>
          <div>
            <span>Outcome</span>
            <p>{project.outcome}</p>
          </div>
        </section>

        <div className="case-body section-shell">
          <aside className="case-sidebar">
            <div>
              <span>Technology</span>
              <ul>
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {relatedService && (
              <div>
                <span>Related service</span>
                <Link to={`/services#${relatedService.id}`}>
                  {relatedService.title}
                  <Icon name="arrow-right" />
                </Link>
              </div>
            )}
          </aside>

          <div className="case-content">
            {details ? (
              <ReactMarkdown>{details}</ReactMarkdown>
            ) : (
              <div className="case-loading" role="status">
                Loading case study details…
              </div>
            )}

            {project.fiverrUrl && (
              <div className="case-contact-card">
                <div>
                  <span>Need a similar integration?</span>
                  <p>{project.fiverrMessage}</p>
                </div>
                <a
                  href={project.fiverrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  View this service on Fiverr <Icon name="arrow-up-right" />
                </a>
              </div>
            )}
          </div>
        </div>
      </article>

      <div className="section-shell page-section page-section--cta">
        <ContactCta
          eyebrow="Discuss a related project"
          title="Need to solve a similar workflow or system problem?"
          copy="Share the current process, the tools involved, and what needs to improve. I’ll help you identify a practical next step."
        />
      </div>
    </>
  );
};

export default ProjectDetails;
