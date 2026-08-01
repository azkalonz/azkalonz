import ContactCta from "../components/ContactCta";
import ProjectIndex from "../components/ProjectIndex";
import Seo from "../components/Seo";
import projects from "../data/projects";
import { site } from "../data/site";

const Projects = () => {
  return (
    <>
      <Seo
        title="Custom Software & Integration Case Studies"
        description="See how Mark Judaya built a product information platform, migrated a CRM, and connected marketplace and ERP order flows."
        canonical="/projects"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Custom Software and Integration Case Studies",
            description:
              "Four case studies covering product data, CRM migration, marketplace orders, and ERP integration.",
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

      <header className="page-hero page-hero--work section-shell">
        <div className="page-hero__grid">
          <h1>Four systems built around real business processes.</h1>
          <p>
            Product data, CRM migration, marketplace orders, and ERP
            integration—with the key decisions and safeguards behind each
            build.
          </p>
        </div>
      </header>

      <hr className="page-hero-rule section-shell" aria-hidden="true" />

      <section
        className="work-index section-shell"
        aria-label="Case study index"
      >
        <ProjectIndex projects={projects} headingLevel={2} />
      </section>

      <div className="section-shell page-section page-section--cta">
        <ContactCta
          title="Working on something similar?"
          copy="Tell me how the work happens today, which tools are involved, and what needs to change."
        />
      </div>
    </>
  );
};

export default Projects;
