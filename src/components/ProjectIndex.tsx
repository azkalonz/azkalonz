import type { ElementType } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import Icon from "./Icon";

type ProjectIndexProps = {
  projects: Project[];
  headingLevel?: 2 | 3;
};

const ProjectIndex = ({ projects, headingLevel = 3 }: ProjectIndexProps) => {
  const Heading = `h${headingLevel}` as ElementType;

  return (
    <div className="project-index">
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${project.id}`}
          className="project-index__item"
          aria-label={`Read the ${project.title} case study`}
        >
          <div className="project-index__summary">
            <Heading>{project.title}</Heading>
            <p>{project.description}</p>
          </div>
          <span className="project-index__action">
            Read case study <Icon name="arrow-right" />
          </span>
        </Link>
      ))}
    </div>
  );
};

export default ProjectIndex;
