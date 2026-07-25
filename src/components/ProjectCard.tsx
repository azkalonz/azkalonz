import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import Icon from "./Icon";

type ProjectCardProps = {
  project: Project;
  layout?: "card" | "feature";
};

const ProjectCard = ({ project, layout = "card" }: ProjectCardProps) => (
  <Link
    to={`/projects/${project.id}`}
    className={`project-card ${layout === "feature" ? "project-card--feature" : ""}`}
    aria-labelledby={`project-card-${project.id}`}
  >
    {project.featuredPhoto ? (
      <div className="project-card__media">
        <img
          src={project.featuredPhoto}
          alt=""
          loading="lazy"
          width="1800"
          height="1352"
        />
      </div>
    ) : (
      <div className="project-card__identity" aria-hidden="true">
        <span>{project.tags[0]}</span>
        <strong>
          {project.title
            .split(" ")
            .slice(0, 2)
            .map((word) => word[0])
            .join("")}
        </strong>
      </div>
    )}

    <div className="project-card__body">
      <div className="project-card__meta">
        <span>{project.projectType}</span>
        <span aria-hidden="true">•</span>
        <span>{project.services[0]}</span>
      </div>
      <h3 id={`project-card-${project.id}`}>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tag-list" aria-label="Technologies used">
        {project.stack.slice(0, layout === "feature" ? 5 : 3).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <span className="text-link" aria-hidden="true">
        Read case study <Icon name="arrow-right" />
      </span>
    </div>
  </Link>
);

export default ProjectCard;
