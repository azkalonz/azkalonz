import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "../src/lib/helmet.ts";
import MainLayout from "../src/layouts/MainLayout.tsx";
import About from "../src/pages/About.tsx";
import Contact from "../src/pages/Contact.tsx";
import Home from "../src/pages/Home.tsx";
import ProjectDetails from "../src/pages/ProjectDetails.tsx";
import Projects from "../src/pages/Projects.tsx";
import ProfileHome from "../src/pages/ProfileHome.tsx";
import Services from "../src/pages/Services.tsx";
import { projects } from "../src/data/projects.ts";
import { STUDIO_PATH, studioPath } from "../src/lib/routes.ts";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, "..");
const distDirectory = path.resolve(projectRoot, "dist");
const siteUrl = "https://builtbymark.dev";

type PageEntry = {
  routePath: string;
  routePattern: string;
  filename: string;
  component: ComponentType;
  title: string;
  description: string;
  projectId?: string;
  studioLayout?: boolean;
};

type HelmetServerState = {
  helmet?: {
    title: { toString: () => string };
    meta: { toString: () => string };
    link: { toString: () => string };
    script: { toString: () => string };
  };
};

const staticPages: PageEntry[] = [
  {
    routePath: "/",
    routePattern: "/",
    filename: "index.html",
    component: ProfileHome,
    title: "Mark Judaya | Full-Stack Developer",
    description:
      "I'm Mark Judaya, a full-stack developer in Cebu, Philippines. I build web apps, connect systems, and automate repetitive work.",
  },
  {
    routePath: STUDIO_PATH,
    routePattern: STUDIO_PATH,
    filename: "studio/index.html",
    component: Home,
    studioLayout: true,
    title: "Custom Software, Automation & Integrations | Mark Judaya",
    description:
      "Philippines-based full-stack developer building custom web applications, business automation, Zoho integrations, and reliable internal systems.",
  },
  {
    routePath: studioPath("/services"),
    routePattern: studioPath("/services"),
    filename: "studio/services/index.html",
    component: Services,
    studioLayout: true,
    title: "Custom Software Development & Automation Services | Mark Judaya",
    description:
      "Custom web applications, business automation, Zoho and API integrations, technical consulting, and ongoing software support for growing teams.",
  },
  {
    routePath: studioPath("/projects"),
    routePattern: studioPath("/projects"),
    filename: "studio/projects/index.html",
    component: Projects,
    studioLayout: true,
    title: "Custom Software & Integration Case Studies | Mark Judaya",
    description:
      "Custom software case studies covering product information management, Salesforce-to-Zoho migration, API integration, and business automation.",
  },
  {
    routePath: studioPath("/about"),
    routePattern: studioPath("/about"),
    filename: "studio/about/index.html",
    component: About,
    studioLayout: true,
    title: "Full-Stack Developer & Systems Specialist | Mark Judaya",
    description:
      "Meet Mark Judaya, a Philippines-based full-stack developer specializing in custom software, business automation, systems integration, and Zoho.",
  },
  {
    routePath: studioPath("/contact"),
    routePattern: studioPath("/contact"),
    filename: "studio/contact/index.html",
    component: Contact,
    studioLayout: true,
    title: "Contact a Custom Software Developer | Mark Judaya",
    description:
      "Contact Mark Judaya to discuss a custom web application, Zoho or API integration, business automation, technical plan, or software support need.",
  },
];

const projectPages: PageEntry[] = projects.map((project) => ({
  routePath: studioPath(`/projects/${project.id}`),
  routePattern: studioPath("/projects/:id"),
  filename: `studio/projects/${project.id}/index.html`,
  component: ProjectDetails,
  studioLayout: true,
  title: `${project.title} | Mark Judaya`,
  description: project.description,
  projectId: project.id,
}));

const loadProjectDetails = () => {
  const detailsDirectory = path.resolve(
    projectRoot,
    "public",
    "project-details",
  );
  if (!fs.existsSync(detailsDirectory)) return {};

  return fs
    .readdirSync(detailsDirectory)
    .filter((file) => file.endsWith(".md"))
    .reduce<Record<string, string>>((details, file) => {
      const id = file.replace(/\.md$/, "");
      details[id] = fs.readFileSync(
        path.resolve(detailsDirectory, file),
        "utf8",
      );
      return details;
    }, {});
};

const escapeAttribute = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const setMeta = (
  html: string,
  attribute: "name" | "property",
  key: string,
  value: string,
) => {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, "i");
  const tag = `<meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`;
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `  ${tag}\n</head>`);
};

const writeCompatibilityRedirects = () => {
  const redirects = [
    ...["/services", "/projects", "/about", "/contact"].map((route) => ({
      from: route,
      to: studioPath(route),
    })),
    ...projects.map((project) => ({
      from: `/projects/${project.id}`,
      to: studioPath(`/projects/${project.id}`),
    })),
    { from: "/work", to: studioPath("/projects") },
    { from: studioPath("/work"), to: studioPath("/projects") },
  ];

  for (const redirect of redirects) {
    const destination = escapeAttribute(redirect.to);
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${siteUrl}${destination}" />
    <meta http-equiv="refresh" content="0;url=${destination}" />
    <title>Page moved | Mark Judaya</title>
    <script>window.location.replace(${JSON.stringify(redirect.to)} + window.location.search + window.location.hash);</script>
  </head>
  <body>
    <p>This page has moved. <a href="${destination}">Continue to the page</a>.</p>
  </body>
</html>
`;
    const outputPath = path.resolve(
      distDirectory,
      redirect.from.slice(1),
      "index.html",
    );
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html);
    console.log(`✓ Redirected ${redirect.from} → ${redirect.to}`);
  }
};

const prerender = () => {
  const templatePath = path.resolve(distDirectory, "index.html");
  const template = fs.readFileSync(templatePath, "utf8");
  const projectDetails = loadProjectDetails();

  for (const entry of [...staticPages, ...projectPages]) {
    try {
      const helmetContext: HelmetServerState = {};
      const initialDetails = entry.projectId
        ? projectDetails[entry.projectId]
        : undefined;
      if (entry.projectId && !initialDetails) {
        throw new Error(`Missing case-study content: ${entry.projectId}`);
      }
      const pageContent = entry.projectId
        ? createElement(ProjectDetails, { initialDetails })
        : createElement(entry.component);
      const pageRoute = createElement(Route, {
        path: entry.routePattern,
        element: entry.studioLayout
          ? createElement(MainLayout, null, pageContent)
          : pageContent,
      });
      const content = renderToStaticMarkup(
        createElement(
          HelmetProvider,
          { context: helmetContext },
          createElement(
            StaticRouter,
            { location: entry.routePath },
            createElement(Routes, null, pageRoute),
          ),
        ),
      );

      const depth = entry.filename.split("/").length - 1;
      const relativeBase = depth > 0 ? "../".repeat(depth) : "./";
      const canonicalUrl = `${siteUrl}${entry.routePath === "/" ? "/" : entry.routePath}`;
      let html = template
        .replace(/href="\.\//g, `href="${relativeBase}`)
        .replace(/src="\.\//g, `src="${relativeBase}`)
        .replace(
          /<title>[^<]*<\/title>/i,
          `<title>${escapeAttribute(entry.title)}</title>`,
        )
        .replace(/<div id="root"><\/div>/, `<div id="root">${content}</div>`);

      html = setMeta(html, "name", "description", entry.description);
      html = setMeta(html, "property", "og:title", entry.title);
      html = setMeta(html, "property", "og:description", entry.description);
      html = setMeta(html, "property", "og:url", canonicalUrl);
      html = setMeta(html, "name", "twitter:card", "summary_large_image");
      html = setMeta(html, "name", "twitter:title", entry.title);
      html = setMeta(html, "name", "twitter:description", entry.description);

      const helmet = helmetContext.helmet;
      if (helmet) {
        html = html
          .replace(/<title[^>]*>.*?<\/title>/is, "")
          .replace(
            /<meta\b(?=[^>]*\b(?:name|property)\s*=\s*["'](?:description|robots|theme-color|twitter:[^"']+|og:[^"']+)["'])[^>]*>\s*/gi,
            "",
          )
          .replace(/<link\s+rel="canonical"[^>]*\/?>\s*/gi, "");

        const managedHead = [
          helmet.title.toString(),
          helmet.meta.toString(),
          helmet.link.toString(),
          helmet.script.toString(),
        ]
          .filter(Boolean)
          .join("\n    ");
        html = html.replace("</head>", `    ${managedHead}\n  </head>`);
      } else {
        html = html.replace(
          "</head>",
          `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`,
        );
      }

      if (entry.projectId && projectDetails[entry.projectId]) {
        const payload = JSON.stringify({
          [entry.projectId]: projectDetails[entry.projectId],
        }).replaceAll("<", "\\u003c");
        html = html.replace(
          "</body>",
          `  <script>globalThis.__PROJECT_DETAILS__ = ${payload};</script>\n</body>`,
        );
      }

      const outputPath = path.resolve(distDirectory, entry.filename);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, html);
      console.log(`✓ Generated ${entry.filename}`);
    } catch (error) {
      console.error(`✗ Error generating ${entry.filename}:`, error);
      process.exitCode = 1;
    }
  }

  writeCompatibilityRedirects();
};

prerender();
