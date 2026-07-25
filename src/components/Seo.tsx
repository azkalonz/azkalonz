import { site } from "../data/site";
import { Helmet } from "../lib/helmet";

type StructuredData = Record<string, unknown>;

interface SeoProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  socialImage?: string;
  socialImageAlt?: string;
  socialImageWidth?: number;
  socialImageHeight?: number;
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
  socialImage = "/social-card.svg",
  socialImageAlt = "Mark Judaya — custom software, automation, and integrations",
  socialImageWidth = 1200,
  socialImageHeight = 630,
  canonical = "/",
  noIndex = false,
  structuredData,
}: SeoProps) => {
  const fullTitle = title === site.name ? title : `${title} | ${site.name}`;
  const canonicalUrl = canonical.startsWith("http")
    ? canonical
    : new URL(canonical, site.url).toString();
  const socialImageUrl = socialImage.startsWith("http")
    ? socialImage
    : new URL(socialImage, site.url).toString();

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, follow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_PH" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={socialImageUrl} />
      <meta property="og:image:width" content={String(socialImageWidth)} />
      <meta property="og:image:height" content={String(socialImageHeight)} />
      <meta property="og:image:alt" content={socialImageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={socialImageUrl} />
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
