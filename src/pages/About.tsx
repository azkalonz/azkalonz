import { Link } from "react-router-dom";
import ContactCta from "../components/ContactCta";
import Icon from "../components/Icon";
import Seo from "../components/Seo";
import { site } from "../data/site";

const About = () => (
  <>
    <Seo
      title="Full-Stack Developer & Systems Specialist"
      description="Meet Mark Judaya, a Philippines-based full-stack developer specializing in custom software, business automation, systems integration, and Zoho."
      canonical="/about"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            "@id": `${site.url}/#mark-judaya`,
            name: site.name,
            url: site.url,
            image: `${site.url}/avatar.webp`,
            jobTitle: "Full-Stack Developer and Systems Specialist",
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
              name: "About Mark Judaya",
              item: `${site.url}/about`,
            },
          ],
        },
      ]}
    />

    <header className="about-hero section-shell">
      <div className="about-hero__copy">
        <p className="eyebrow">About</p>
        <h1>
          Full-stack development for the systems behind day-to-day operations.
        </h1>
        <p className="about-hero__lead">
          I’m Mark Judaya, a full-stack developer and systems specialist based
          in the Philippines. I help businesses understand a technical problem,
          shape a practical solution, build it, and keep it useful as the work
          evolves.
        </p>
      </div>
      <div className="about-hero__portrait">
        <img src="/avatar.webp" alt="Mark Judaya" width="480" height="480" />
        <div>
          <strong>Mark Judaya</strong>
          <span>
            Full-stack development · Systems integration · Technical support
          </span>
        </div>
      </div>
    </header>

    <section
      className="about-story section-shell"
      aria-labelledby="approach-title"
    >
      <div className="about-story__label">
        <span>01</span>
        <p>What I bring</p>
      </div>
      <div className="about-story__content">
        <h2 id="approach-title">
          A broad technical view, with a practical centre.
        </h2>
        <div className="prose-columns">
          <p>
            My work covers front-end interfaces, back-end services, data models,
            background jobs, APIs, automation, and business platforms. That
            range is useful when a problem crosses system boundaries—as business
            problems usually do.
          </p>
          <p>
            Automation and Zoho remain important specialties, but they sit
            inside a wider capability: building and improving the technology
            behind day-to-day operations. Recent work includes a full product
            information platform, large CRM data migration, marketplace order
            automation, and ERP integration.
          </p>
        </div>
      </div>
    </section>

    <section
      className="about-story section-shell"
      aria-labelledby="problem-solving-title"
    >
      <div className="about-story__label">
        <span>02</span>
        <p>How I think</p>
      </div>
      <div className="about-story__content">
        <h2 id="problem-solving-title">
          Understand the workflow before choosing the solution.
        </h2>
        <p className="about-story__lead">
          I look for the decisions, handoffs, exceptions, and information that
          make a process work. The technology should make those things clearer
          and more reliable—not hide them behind unnecessary complexity.
        </p>
        <div className="value-grid">
          <article>
            <Icon name="compass" />
            <h3>Clarify first</h3>
            <p>
              Make the goal, users, constraints, and edge cases explicit before
              committing to a build.
            </p>
          </article>
          <article>
            <Icon name="layers" />
            <h3>Design for operations</h3>
            <p>
              Account for validation, recovery, auditability, and the people
              responsible for the system after launch.
            </p>
          </article>
          <article>
            <Icon name="code" />
            <h3>Build for change</h3>
            <p>
              Use maintainable structure and documentation so the next
              improvement does not require starting again.
            </p>
          </article>
        </div>
      </div>
    </section>

    <section
      className="about-story section-shell"
      aria-labelledby="collaboration-title"
    >
      <div className="about-story__label">
        <span>03</span>
        <p>Collaboration</p>
      </div>
      <div className="about-story__content about-story__content--split">
        <div>
          <h2 id="collaboration-title">
            Direct, clear, and comfortable across technical levels.
          </h2>
          <p className="about-story__lead">
            I can work with a business owner who needs the technical choices
            explained plainly or alongside a product and development team that
            wants implementation detail. Either way, I keep decisions visible
            and avoid promising outcomes the system cannot guarantee.
          </p>
          <Link to="/contact" className="button button--primary">
            Discuss working together{" "}
            <Icon name="arrow-right" className="button__icon" />
          </Link>
        </div>
        <aside className="profile-links" aria-label="Professional profiles">
          <h3>Professional profiles</h3>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
            <span>
              <Icon name="linkedin" />
              LinkedIn
            </span>
            <Icon name="arrow-up-right" />
          </a>
          <a href={site.socials.github} target="_blank" rel="noreferrer">
            <span>
              <Icon name="github" />
              GitHub
            </span>
            <Icon name="arrow-up-right" />
          </a>
          <a href={site.socials.fiverr} target="_blank" rel="noreferrer">
            <span>
              <Icon name="fiverr" />
              Fiverr
            </span>
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
