import { Link } from "react-router-dom";
import ContactCta from "../components/ContactCta";
import Icon from "../components/Icon";
import Seo from "../components/Seo";
import { site } from "../data/site";

const principles = [
  {
    title: "Define the problem first",
    copy: "Write down the goal, users, constraints, handoffs, and edge cases before choosing a technical approach.",
  },
  {
    title: "Plan for errors and handover",
    copy: "Decide how validation, recovery, audit history, documentation, and ownership should work after launch.",
  },
  {
    title: "Leave room to change",
    copy: "Use a structure that can absorb the next improvement without forcing a rebuild.",
  },
];

const About = () => (
  <>
    <Seo
      title="Full-Stack Developer & Systems Specialist"
      description="Mark Judaya is a Cebu-based full-stack developer who builds custom software, integrations, automation, and internal business tools."
      canonical="/about"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Mark Judaya",
          url: `${site.url}/about`,
          mainEntity: {
            "@type": "Person",
            "@id": `${site.url}/#mark-judaya`,
            name: site.personName,
            jobTitle: "Full-Stack Developer and IT Solutions Specialist",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Cebu",
              addressCountry: "PH",
            },
            sameAs: [
              site.socials.linkedin,
              site.socials.github,
              site.socials.fiverr,
            ],
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
              name: "About",
              item: `${site.url}/about`,
            },
          ],
        },
      ]}
    />

    <header className="about-hero section-shell">
      <div className="about-hero__copy">
        <h1>
          I turn complicated business processes into software teams can run and
          maintain.
        </h1>
        <p>
          I’m a full-stack developer and IT solutions specialist based in Cebu,
          Philippines. I build internal applications, integrations, and
          automation for teams whose work has outgrown spreadsheets or
          disconnected tools.
        </p>
      </div>
      <figure className="about-portrait">
        <img
          src="/avatar.webp"
          alt="Mark Judaya"
          width="800"
          height="800"
          fetchPriority="high"
        />
        <figcaption>
          <span>Cebu, Philippines</span>
          Working with clients and teams remotely
        </figcaption>
      </figure>
    </header>

    <section className="about-scope" aria-labelledby="about-scope-title">
      <div className="section-shell about-scope__grid">
        <div>
          <h2 id="about-scope-title">
            I work across the whole system.
          </h2>
        </div>
        <div className="about-scope__copy">
          <p>
            I work on front-end interfaces, back-end services, data models,
            background jobs, APIs, automation, CRM and inventory platforms,
            migrations, and ongoing support. The aim is simple: make a difficult
            process easier to run and maintain.
          </p>
          <p>
            Recent work includes a product information platform, a large CRM
            migration, marketplace order automation, and an ERP integration.
            Some projects are public. For private projects, the case studies
            focus on the process and engineering decisions without exposing
            client data.
          </p>
          <Link to="/projects" className="index-link">
            See selected work <Icon name="arrow-right" />
          </Link>
        </div>
      </div>
    </section>

    <section
      className="thinking-field section-shell"
      aria-labelledby="thinking-title"
    >
      <header>
        <h2 id="thinking-title">
          Start with how the work happens today.
        </h2>
        <p>
          I look at the decisions, exceptions, data, and handoffs that keep the
          process moving. Then I choose technology that makes those parts easier
          to understand and manage.
        </p>
      </header>
      <ol className="principle-list">
        {principles.map((principle) => (
          <li key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.copy}</p>
          </li>
        ))}
      </ol>
    </section>

    <section
      className="collaboration-field"
      aria-labelledby="collaboration-title"
    >
      <div className="section-shell collaboration-field__grid">
        <div>
          <h2 id="collaboration-title">
            I work directly with you.
          </h2>
          <p>
            I can explain technical choices plainly to a business owner or work
            through implementation details with product, operations, and
            development teams. We agree on documentation, communication, and
            handover before the work begins.
          </p>
          <Link to="/contact" className="button button--primary">
            Tell me about your project <Icon name="arrow-right" />
          </Link>
        </div>
        <aside className="profile-index" aria-label="Professional profiles">
          <h3>Professional profiles</h3>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
            <span>LinkedIn</span>
            <Icon name="arrow-up-right" />
          </a>
          <a href={site.socials.github} target="_blank" rel="noreferrer">
            <span>GitHub</span>
            <Icon name="arrow-up-right" />
          </a>
          <a href={site.socials.fiverr} target="_blank" rel="noreferrer">
            <span>Fiverr</span>
            <Icon name="arrow-up-right" />
          </a>
        </aside>
      </div>
    </section>

    <div className="section-shell page-section page-section--cta">
      <ContactCta />
    </div>
  </>
);

export default About;
