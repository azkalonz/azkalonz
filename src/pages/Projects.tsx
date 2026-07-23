import { Link } from "react-router-dom";
import ContactCta from "../components/ContactCta";
import Icon from "../components/Icon";
import ProjectCard from "../components/ProjectCard";
import Seo from "../components/Seo";
import projects from "../data/projects";

const Projects = () => {
  const [leadProject, ...otherProjects] = projects;

  return (
    <>
      <Seo
        title="Selected work"
        description="Case studies in custom application development, data migration, business automation, Zoho, API integration, and operational support."
        canonical="/projects"
      />

      <header className="page-hero section-shell">
        <p className="eyebrow">Selected work</p>
        <h1>Practical systems, explained through the problems they solve.</h1>
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
                alt="Product information architecture for the Urban Road PIM platform"
                width="1800"
                height="1352"
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
