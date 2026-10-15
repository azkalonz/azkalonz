import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { site } from "../data/site";
import { STUDIO_PATH } from "../lib/routes";

const profileLinks = [
  { label: "GitHub", href: site.socials.github },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Email me", href: `mailto:${site.email}` },
];

const ProfileArrow = () => (
  <svg
    className="profile-home__arrow"
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M4 12 12 4M4 4h8v8"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ProfileHome = () => (
  <>
    <Seo
      title="Mark Judaya — Full-stack developer"
      exactTitle
      description="I build web apps, connect systems, and automate repetitive work. Full-stack developer based in Cebu, Philippines."
      canonical="/"
      themeColor="#171b20"
      socialImage="/profile/mark-judaya.jpg"
      socialImageAlt="Mark Judaya"
      socialImageWidth={320}
      socialImageHeight={320}
      structuredData={{
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${site.url}/#mark-judaya`,
        name: site.personName,
        url: `${site.url}/`,
        image: `${site.url}/profile/mark-judaya.jpg`,
        jobTitle: "Full-stack developer",
        email: site.email,
        homeLocation: {
          "@type": "Place",
          name: "Cebu, Philippines",
        },
        sameAs: [site.socials.github, site.socials.linkedin],
      }}
    />
    <main className="profile-home" id="main-content">
      <div className="profile-home__content">
        <div className="profile-home__identity">
          <img
            className="profile-home__portrait"
            src="/profile/mark-judaya.jpg"
            alt="Mark Judaya"
            width="72"
            height="78"
            fetchPriority="high"
          />
          <div>
            <h1 className="profile-home__name">Mark Judaya</h1>
            <p className="profile-home__role">Full-stack developer</p>
            <p className="profile-home__place">Cebu, Philippines</p>
          </div>
        </div>
        <p className="profile-home__bio">
          I build web apps, connect systems, and automate repetitive work.
        </p>
        <nav className="profile-home__links" aria-label="Find me online">
          <ul className="profile-home__link-list">
            {profileLinks.map(({ label, href }) => (
              <li className="profile-home__link-item" key={label}>
                <a className="profile-home__link" href={href}>
                  <span>{label}</span>
                  <ProfileArrow />
                </a>
              </li>
            ))}
            <li className="profile-home__link-item">
              <Link className="profile-home__link" to={STUDIO_PATH}>
                <span>BuiltByMark.dev</span>
                <ProfileArrow />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  </>
);

export default ProfileHome;
