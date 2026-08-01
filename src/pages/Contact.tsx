import { useLocation } from "react-router-dom";
import Icon from "../components/Icon";
import Seo from "../components/Seo";
import { site } from "../data/site";

const Contact = () => {
  const { search } = useLocation();
  const selectedService = new URLSearchParams(search).get("service");
  const emailSubject = selectedService
    ? `Project inquiry: ${selectedService}`
    : "Project inquiry for Mark Judaya";
  const emailHref = `mailto:${site.email}?subject=${encodeURIComponent(emailSubject)}`;

  return (
    <>
      <Seo
        title="Contact a Custom Software Developer"
        description="Contact Mark Judaya about a custom web application, Zoho or API integration, automation project, or existing software that needs support."
        canonical="/contact"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Mark Judaya",
            url: `${site.url}/contact`,
            mainEntity: {
              "@type": "Person",
              "@id": `${site.url}/#mark-judaya`,
              name: site.personName,
              url: site.url,
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
                name: "Contact",
                item: `${site.url}/contact`,
              },
            ],
          },
        ]}
      />

      <header className="contact-hero section-shell">
        <h1>Tell me what the work needs to do.</h1>
        <p>
          A short note about the current process, the tools involved, and
          what needs to change is enough to begin. You do not need a finished
          specification.
        </p>
      </header>

      <section
        className="contact-routes section-shell"
        aria-labelledby="contact-routes-title"
      >
        <h2 id="contact-routes-title" className="sr-only">
          Ways to contact Mark
        </h2>

        <a href={emailHref} className="contact-route contact-route--primary">
          <div>
            <h3>Email me about your project</h3>
            <p>{site.email}</p>
          </div>
          <Icon name="arrow-up-right" />
        </a>

        <a
          href={site.bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="contact-route"
        >
          <div>
            <h3>Book a discovery call</h3>
            <p>
              Choose an available time and add a little context before we meet.
            </p>
          </div>
          <Icon name="arrow-up-right" />
        </a>

        <a
          href={site.socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="contact-route"
        >
          <div>
            <h3>Message me on LinkedIn</h3>
            <p>Best for a short introduction or question.</p>
          </div>
          <Icon name="arrow-up-right" />
        </a>

        <a
          href={site.socials.fiverr}
          target="_blank"
          rel="noreferrer"
          className="contact-route"
        >
          <div>
            <h3>View my Fiverr services</h3>
            <p>
              For work that fits an existing integration or migration solution.
            </p>
          </div>
          <Icon name="arrow-up-right" />
        </a>
      </section>

      <aside className="contact-context" aria-labelledby="useful-context-title">
        <div className="section-shell contact-context__grid">
          <div>
            <h2 id="useful-context-title">
              What to include in your first message
            </h2>
          </div>
          <ul>
            <li>What is happening now</li>
            <li>What needs to change</li>
            <li>Who uses it and who owns it</li>
            <li>Deadlines, dependencies, or important constraints</li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Contact;
