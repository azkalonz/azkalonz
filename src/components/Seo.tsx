import { site } from "../data/site";
import { Helmet } from "../lib/helmet";

type StructuredData = Record<string, unknown>;

interface SeoProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  canonical?: string;
  noIndex?: boolean;
  structuredData?: StructuredData | StructuredData[];
}

const Seo = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogType = "website",
  canonical = "/",
  noIndex = false,
  structuredData,
}: SeoProps) => {
  const fullTitle = title === site.name ? title : `${title} | ${site.name}`;
  const canonicalUrl = canonical.startsWith("http")
    ? canonical
    : new URL(canonical, site.url).toString();
  const socialImage = `${site.url}/social-card.svg`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, follow" />}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={socialImage} />
      <meta
        property="og:image:alt"
        content="Mark Judaya — IT solutions for growing businesses"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={socialImage} />
      <meta
        name="theme-color"
        content="#f6f5f1"
        media="(prefers-color-scheme: light)"
      />
      <meta
        name="theme-color"
        content="#101514"
        media="(prefers-color-scheme: dark)"
      />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default Seo;
