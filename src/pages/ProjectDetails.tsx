import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ContactCta from "../components/ContactCta";
import Icon from "../components/Icon";
import ProjectShowcaseCarousel from "../components/ProjectShowcaseCarousel";
import Seo from "../components/Seo";
import WorkflowDiagram from "../components/WorkflowDiagram";
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
          <h1>That case study is not here.</h1>
          <p>The link may be outdated, or the project may have moved.</p>
          <Link to="/projects" className="button button--primary">
            View my work
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
        socialImage={project.featuredPhoto}
        socialImageAlt={project.featuredPhotoAlt}
        socialImageWidth={project.featuredPhoto ? 1280 : undefined}
        socialImageHeight={project.featuredPhoto ? 720 : undefined}
        canonical={`/projects/${project.id}`}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            creator: {
              "@type": "Person",
              "@id": `${site.url}/#mark-judaya`,
              name: site.personName,
              url: site.url,
            },
            url: `${site.url}/projects/${project.id}`,
            ...(project.featuredPhoto
              ? { image: new URL(project.featuredPhoto, site.url).toString() }
              : {}),
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
                name: "Case studies",
                item: `${site.url}/projects`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: project.title,
                item: `${site.url}/projects/${project.id}`,
              },
            ],
          },
        ]}
      />

      <article className="case-study">
        <header className="case-hero section-shell">
          <Link to="/projects" className="back-link">
            <Icon name="arrow-right" /> Work
          </Link>

          <div className="case-hero__grid">
            <div className="case-hero__main">
              <h1>{project.title}</h1>
              <p className="case-hero__lead">{project.description}</p>
              <div className="hero-actions">
                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="button button--primary"
                  >
                    Open project overview <Icon name="arrow-up-right" />
                  </a>
                )}
                {project.links?.repo && (
                  <a
                    href={project.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="button button--quiet"
                  >
                    View repository <Icon name="arrow-up-right" />
                  </a>
                )}
              </div>
            </div>

            <aside
              className="case-hero__meta"
              aria-label="Project responsibility"
            >
              <div>
                <span>Role</span>
                <p>{project.role}</p>
              </div>
              <div>
                <span>Services</span>
                <ul>
                  {project.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span>Timeline</span>
                <p>
                  {project.dateStarted} — {project.dateFinished}
                </p>
              </div>
            </aside>
          </div>
        </header>

        <section
          className="case-operating-model"
          aria-labelledby="workflow-title"
        >
          <div className="section-shell case-operating-model__grid">
            <div>
              <h2 id="workflow-title">How the data moves—and what can fail.</h2>
              <p className="case-operating-model__intro">{project.context}</p>
            </div>
            <WorkflowDiagram
              steps={project.workflow}
              title="Project flow"
            />
            <div className="reliability-record">
              <h3>How failures are handled</h3>
              <ul>
                {project.reliability.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {project.featuredPhoto && !project.showcase && (
          <figure className="case-media section-shell">
            <img
              src={project.featuredPhoto}
              alt={
                project.featuredPhotoAlt ?? `Interface from ${project.title}`
              }
              width="1280"
              height="720"
            />
            {project.featuredPhotoCaption && (
              <figcaption>{project.featuredPhotoCaption}</figcaption>
            )}
          </figure>
        )}

        {project.showcase && (
          <section
            className="case-showcase section-shell"
            aria-label="Product screenshots"
          >
            <ProjectShowcaseCarousel screens={project.showcase} />
          </section>
        )}

        <div className="case-body section-shell">
          <aside className="case-sidebar">
            <div>
              <span>Technology</span>
              <ul className="technology-list">
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
              <div className="case-contact-record">
                <div>
                  <span>Similar service</span>
                  <p>{project.fiverrMessage}</p>
                </div>
                <a
                  href={project.fiverrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="index-link"
                >
                  View Fiverr service <Icon name="arrow-up-right" />
                </a>
              </div>
            )}
          </div>
        </div>
      </article>

      <div className="section-shell page-section page-section--cta">
        <ContactCta
          title="Working on something similar?"
          copy="Tell me how the work happens today, which tools are involved, and what needs to change."
        />
      </div>
    </>
  );
};

export default ProjectDetails;
