import Icon from "../components/Icon";
import Seo from "../components/Seo";
import { site } from "../data/site";

const Contact = () => (
  <>
    <Seo
      title="Contact a Custom Software Developer"
      description="Contact Mark Judaya to discuss a custom web application, Zoho or API integration, business automation, technical plan, or software support need."
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
            name: site.name,
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

    <header className="page-hero page-hero--compact section-shell">
      <p className="eyebrow">Contact</p>
      <h1>Let’s make the system work better.</h1>
      <p>
        Choose the channel that suits you. A short note about what is happening
        now and what needs to change is enough to start.
      </p>
    </header>

    <section
      className="contact-direct section-shell"
      aria-labelledby="contact-options-title"
    >
      <div className="contact-direct__heading">
        <p className="eyebrow">Open a channel</p>
        <h2 id="contact-options-title">
          Start with a call or a direct message.
        </h2>
      </div>

      <div className="contact-direct__grid">
        <article className="contact-option contact-option--primary">
          <span className="contact-option__icon">
            <Icon name="message" />
          </span>
          <p className="eyebrow eyebrow--light">Discovery call</p>
          <h2>Talk through the workflow.</h2>
          <p>
            Choose an available time and share a little context before we meet.
          </p>
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="button button--light button--full"
          >
            Open booking calendar
            <Icon name="arrow-up-right" className="button__icon" />
          </a>
        </article>

        <article className="contact-option">
          <h2>Direct contact</h2>
          <a href={`mailto:${site.email}`}>
            <span>Email</span>
            <strong>{site.email}</strong>
          </a>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
            <span>Professional profile</span>
            <strong>
              LinkedIn <Icon name="arrow-up-right" />
            </strong>
          </a>
          <a href={site.socials.fiverr} target="_blank" rel="noreferrer">
            <span>Freelance services</span>
            <strong>
              Fiverr <Icon name="arrow-up-right" />
            </strong>
          </a>
        </article>

        <aside className="contact-note">
          <strong>Useful context to include</strong>
          <ul>
            <li>What is happening now</li>
            <li>What needs to change</li>
            <li>Who uses the system</li>
            <li>Any important deadline or constraint</li>
          </ul>
        </aside>
      </div>
    </section>
  </>
);

export default Contact;
