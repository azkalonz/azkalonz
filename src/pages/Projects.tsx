import { Link } from "react-router-dom";
import ContactCta from "../components/ContactCta";
import Icon from "../components/Icon";
import ProjectCard from "../components/ProjectCard";
import Seo from "../components/Seo";
import projects from "../data/projects";
import { site } from "../data/site";

const Projects = () => {
  const [leadProject, ...otherProjects] = projects;

  return (
    <>
      <Seo
        title="Custom Software & Integration Case Studies"
        description="Custom software case studies covering product information management, Salesforce-to-Zoho migration, API integration, and business automation."
        canonical="/projects"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Custom Software and Integration Case Studies",
            description:
              "Case studies in custom software, data migration, Zoho, API integration, and business automation.",
            url: `${site.url}/projects`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: projects.map((project, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: project.title,
                url: `${site.url}/projects/${project.id}`,
              })),
            },
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
            ],
          },
        ]}
      />

      <header className="page-hero section-shell">
        <p className="eyebrow">Selected work</p>
        <h1>Custom software and integrations built around real workflows.</h1>
        <p>
          These projects span application development, data operations,
          integrations, and automation. Where client details are private, the
          case study stays focused on the workflow, responsibility, and
          technical approach.
        </p>
      </header>

      <section
        className="work-index section-shell"
        aria-labelledby="featured-case-study"
      >
        <article className="lead-case-study">
          <Link
            to={`/projects/${leadProject.id}`}
            className="lead-case-study__media"
          >
            {leadProject.featuredPhoto && (
              <img
                src={leadProject.featuredPhoto}
                alt={
                  leadProject.featuredPhotoAlt ??
                  `Featured interface from ${leadProject.title}`
                }
                width="1280"
                height="720"
                fetchPriority="high"
              />
            )}
          </Link>
          <div className="lead-case-study__content">
            <div className="project-card__meta">
              <span>Featured case study</span>
              <span aria-hidden="true">•</span>
              <span>{leadProject.projectType}</span>
            </div>
            <h2 id="featured-case-study">
              <Link to={`/projects/${leadProject.id}`}>
                {leadProject.title}
              </Link>
            </h2>
            <p>{leadProject.problem}</p>
            <div className="case-outcome">
              <span>Outcome</span>
              <p>{leadProject.outcome}</p>
            </div>
            <Link
              to={`/projects/${leadProject.id}`}
              className="button button--primary"
            >
              Read the case study{" "}
              <Icon name="arrow-right" className="button__icon" />
            </Link>
          </div>
        </article>

        <div className="work-grid">
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <div className="section-shell page-section page-section--cta">
        <ContactCta
          eyebrow="Your project"
          title="Need a similar system—or something the existing tools cannot quite handle?"
          copy="Describe the current workflow and the change you need. I’ll help you turn it into a clear technical next step."
        />
      </div>
    </>
  );
};

export default Projects;
