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
import Services from "../src/pages/Services.tsx";
import { projects } from "../src/data/projects.ts";

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
    component: Home,
    title: "Custom Software, Automation & Integrations | Mark Judaya",
    description:
      "Philippines-based full-stack developer building custom web applications, business automation, Zoho integrations, and reliable internal systems.",
  },
  {
    routePath: "/services",
    routePattern: "/services",
    filename: "services/index.html",
    component: Services,
    title: "Custom Software Development & Automation Services | Mark Judaya",
    description:
      "Custom web applications, business automation, Zoho and API integrations, technical consulting, and ongoing software support for growing teams.",
  },
  {
    routePath: "/projects",
    routePattern: "/projects",
    filename: "projects/index.html",
    component: Projects,
    title: "Custom Software & Integration Case Studies | Mark Judaya",
    description:
      "Custom software case studies covering product information management, Salesforce-to-Zoho migration, API integration, and business automation.",
  },
  {
    routePath: "/about",
    routePattern: "/about",
    filename: "about/index.html",
    component: About,
    title: "Full-Stack Developer & Systems Specialist | Mark Judaya",
    description:
      "Meet Mark Judaya, a Philippines-based full-stack developer specializing in custom software, business automation, systems integration, and Zoho.",
  },
  {
    routePath: "/contact",
    routePattern: "/contact",
    filename: "contact/index.html",
    component: Contact,
    title: "Contact a Custom Software Developer | Mark Judaya",
    description:
      "Contact Mark Judaya to discuss a custom web application, Zoho or API integration, business automation, technical plan, or software support need.",
  },
];

const projectPages: PageEntry[] = projects.map((project) => ({
  routePath: `/projects/${project.id}`,
  routePattern: "/projects/:id",
  filename: `projects/${project.id}/index.html`,
  component: ProjectDetails,
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

const prerender = () => {
  const templatePath = path.resolve(distDirectory, "index.html");
  const template = fs.readFileSync(templatePath, "utf8");
  const projectDetails = loadProjectDetails();

  for (const entry of [...staticPages, ...projectPages]) {
    try {
      const helmetContext: HelmetServerState = {};
      const content = renderToStaticMarkup(
        createElement(
          HelmetProvider,
          { context: helmetContext },
          createElement(
            StaticRouter,
            { location: entry.routePath },
            createElement(
              MainLayout,
              null,
              createElement(
                Routes,
                null,
                createElement(Route, {
                  path: entry.routePattern,
                  element: createElement(entry.component),
                }),
              ),
            ),
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
            /<meta\s+(?:name|property)="(?:description|robots|theme-color|twitter:[^"]+|og:[^"]+)"[^>]*\/?>\s*/gi,
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
};

prerender();
