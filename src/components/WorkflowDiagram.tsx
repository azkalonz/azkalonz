import type { Project } from "../data/projects";

type WorkflowDiagramProps = {
  steps: Project["workflow"];
  title?: string;
  compact?: boolean;
};

const WorkflowDiagram = ({
  steps,
  title = "Project flow",
  compact = false,
}: WorkflowDiagramProps) => (
  <figure
    className={`relay-diagram ${compact ? "relay-diagram--compact" : ""}`}
    aria-labelledby={`workflow-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
  >
    <figcaption
      id={`workflow-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      className="relay-diagram__caption"
    >
      {title}
    </figcaption>
    <ol className="relay-diagram__track">
      {steps.map((step) => (
        <li
          key={step.label}
          className={`relay-diagram__step relay-diagram__step--${step.kind}`}
        >
          <div>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  </figure>
);

export default WorkflowDiagram;
