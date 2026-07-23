import { Link } from "react-router-dom";
import HalftonePortrait from "../components/HalftonePortrait";
import Icon from "../components/Icon";
import Seo from "../components/Seo";
import projects from "../data/projects";
import { services, site } from "../data/site";

const recentProjects = projects
  .filter((project) => project.featured)
  .slice(0, 3);

const Home = () => (
  <>
    <Seo
      title="IT solutions for growing businesses"
      description="Custom applications, automation, integrations, and ongoing technical support from full-stack systems developer Mark Judaya."
      canonical="/"
      structuredData={[
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.name,
          url: site.url,
          image: `${site.url}/avatar.webp`,
          jobTitle: "IT Solutions Developer",
          sameAs: [
            site.socials.linkedin,
            site.socials.github,
            site.socials.fiverr,
          ],
          knowsAbout: [
            "Web application development",
            "Systems integration",
            "Business automation",
            "Zoho",
            "Technical consulting",
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Mark Judaya IT Solutions",
          url: site.url,
          email: site.email,
          areaServed: "Worldwide",
          serviceType: services.map((service) => service.title),
        },
      ]}
    />

    <div className="matrix-home">
      <section className="matrix-hero" aria-labelledby="home-title">
        <div className="matrix-hero__grid" aria-hidden="true" />
        <div className="matrix-hero__status" aria-hidden="true">
          <span>SYS.01</span>
          <span className="matrix-status-signal">ONLINE</span>
          <span>PHILIPPINES / REMOTE</span>
        </div>

        <div className="matrix-hero__copy">
          <p className="matrix-kicker">
            <span aria-hidden="true">&gt;_</span> Mark Judaya // Systems
            Developer
          </p>
          <h1 id="home-title" className="matrix-title">
            I build systems that{" "}
            <span className="matrix-title__glitch" data-text="automate">
              automate
            </span>{" "}
            the work.
          </h1>
          <p className="matrix-lead">
            Custom applications, business automation, and integrations
            engineered to turn repetitive operations into reliable connected
            workflows.
          </p>

          <div className="matrix-actions">
            <Link
              to="/contact"
              className="matrix-button matrix-button--primary"
            >
              <span>Start a project</span>
              <Icon name="arrow-up-right" />
            </Link>
            <a href="#recent-work" className="matrix-button">
              <span>Recent work</span>
              <Icon name="arrow-right" className="matrix-icon--down" />
            </a>
          </div>

          <div className="matrix-pipeline" aria-label="Delivery workflow">
            <span>
              <i aria-hidden="true" />
              Input
            </span>
            <b aria-hidden="true">············</b>
            <span>
              <i aria-hidden="true" />
              Automate
            </span>
            <b aria-hidden="true">············</b>
            <span>
              <i aria-hidden="true" />
              Output
            </span>
          </div>
        </div>

        <div className="matrix-hero__visual">
          <div className="matrix-portrait">
            <div className="matrix-portrait__header">
              <span>PORTRAIT_STREAM.dat</span>
              <span>LIVE</span>
            </div>
            <div className="matrix-portrait__screen">
              <HalftonePortrait />
              <div className="matrix-portrait__reticle" aria-hidden="true" />
              <span className="matrix-portrait__axis matrix-portrait__axis--x">
                X.1209842
              </span>
              <span className="matrix-portrait__axis matrix-portrait__axis--y">
                Y.145995
              </span>
            </div>
            <div className="matrix-portrait__footer" aria-hidden="true">
              <span>PARTICLE FIELD: ACTIVE</span>
              <span>HOVER OR CLICK TO INTERACT</span>
            </div>
          </div>

          <div className="matrix-automation" aria-hidden="true">
            <span>BUILD</span>
            <i />
            <span>CONNECT</span>
            <i />
            <span>SUPPORT</span>
          </div>
        </div>

        <div className="matrix-command" aria-hidden="true">
          <span>mark@systems:~$</span> orchestrate --reliable --maintainable
          <i />
        </div>
      </section>

      <section
        id="recent-work"
        className="matrix-work"
        aria-labelledby="recent-work-title"
      >
        <div className="matrix-section-heading">
          <div>
            <p>[ OUTPUT / RECENT ]</p>
            <h2 id="recent-work-title">Recent work</h2>
          </div>
          <Link to="/projects" className="matrix-archive-link">
            View archive <Icon name="arrow-right" />
          </Link>
        </div>

        <div className="matrix-project-grid">
          {recentProjects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className={`matrix-project ${index === 0 ? "matrix-project--feature" : ""}`}
              aria-label={`Read the ${project.title} case study`}
            >
              <div className="matrix-project__topline">
                <span>CASE_{String(index + 1).padStart(2, "0")}</span>
                <span>{project.projectType}</span>
              </div>

              {project.featuredPhoto ? (
                <div className="matrix-project__media">
                  <img
                    src={project.featuredPhoto}
                    alt=""
                    loading="lazy"
                    width="1800"
                    height="1352"
                  />
                  <span aria-hidden="true">VISUAL_FEED // 01</span>
                </div>
              ) : (
                <div className="matrix-project__signal" aria-hidden="true">
                  <span>{project.tags[0]}</span>
                  <i />
                  <b>
                    {project.title
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")}
                  </b>
                </div>
              )}

              <div className="matrix-project__body">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="matrix-project__stack" aria-label="Technology">
                  {project.stack.slice(0, 3).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>

              <div className="matrix-project__footer">
                <span>Open case study</span>
                <Icon name="arrow-up-right" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  </>
);

export default Home;
