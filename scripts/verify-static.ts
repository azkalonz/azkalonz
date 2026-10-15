import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { projects } from "../src/data/projects.ts";
import { site } from "../src/data/site.ts";
import { STUDIO_PATH, studioPath } from "../src/lib/routes.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const sections = ["/services", "/projects", "/about", "/contact"];
const routes = [
  "/",
  STUDIO_PATH,
  ...sections.map(studioPath),
  ...projects.map((project) => studioPath(`/projects/${project.id}`)),
];
const readPage = (route: string) =>
  fs.readFileSync(path.join(dist, route, "index.html"), "utf8");
const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

for (const route of routes) {
  const html = readPage(route);
  const canonical = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/g) ?? [];
  assert.equal(canonical.length, 1, `${route}: expected one canonical`);
  assert.ok(
    canonical[0].includes(`href="${site.url}${route}"`),
    `${route}: wrong canonical`,
  );
  assert.match(
    html,
    /<html\b[^>]*\bclass="dark"/,
    `${route}: expected dark default`,
  );
  assert.match(
    html,
    /<main\b[^>]*\bid="main-content"/,
    `${route}: missing static content`,
  );
  assert.equal(
    (html.match(/<title\b/g) ?? []).length,
    1,
    `${route}: duplicate title`,
  );
  assert.equal(
    (html.match(/<h1\b/g) ?? []).length,
    1,
    `${route}: missing page heading`,
  );
  assert.equal(
    (html.match(/\bname="theme-color"/g) ?? []).length,
    1,
    `${route}: duplicate theme metadata`,
  );
  assert.ok(
    !html.includes("Loading case study details"),
    `${route}: case study was not rendered`,
  );
  assert.ok(
    !html.includes("__APPLIED_THEME_"),
    `${route}: unresolved theme token`,
  );

  for (const [, asset] of html.matchAll(/\b(?:src|href)="(\/[^"#?]*)/g)) {
    if (asset.startsWith("//") || !path.extname(asset)) continue;
    assert.ok(
      fs.existsSync(path.join(dist, decodeURIComponent(asset))),
      `${route}: missing asset ${asset}`,
    );
  }
  for (const [, asset] of html.matchAll(
    /<(?:script|link)\b[^>]*\b(?:src|href)="([^"#]+\.(?:js|css))"/g,
  )) {
    assert.match(
      asset,
      /^\/assets\/.+-[\w-]{8}\.(?:js|css)$/,
      `${route}: bundled asset must use an absolute, versioned path: ${asset}`,
    );
  }
}

for (const project of projects) {
  const html = readPage(studioPath(`/projects/${project.id}`));
  const markdown = fs.readFileSync(
    path.join(root, "public/project-details", `${project.id}.md`),
    "utf8",
  );
  for (const [, hashes, heading] of markdown.matchAll(/^(#{1,6}) (.+)$/gm)) {
    assert.ok(
      html.includes(
        `<h${hashes.length}>${escapeHtml(heading)}</h${hashes.length}>`,
      ),
      `${project.id}: missing static section ${heading}`,
    );
  }
  assert.ok(
    html.includes("globalThis.__PROJECT_DETAILS__"),
    `${project.id}: missing client preload`,
  );
}

const redirects = [
  ...sections.map((route) => [route, studioPath(route)]),
  ...projects.map((project) => [
    `/projects/${project.id}`,
    studioPath(`/projects/${project.id}`),
  ]),
  ["/work", studioPath("/projects")],
  [studioPath("/work"), studioPath("/projects")],
];

for (const [from, to] of redirects) {
  const html = readPage(from);
  assert.ok(
    html.includes(`content="0;url=${to}"`),
    `${from}: missing static redirect`,
  );
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, `${from}: missing redirect script`);
  let redirected = "";
  vm.runInNewContext(script, {
    window: {
      location: {
        search: "?source=old-link",
        hash: "#section",
        replace: (destination: string) => {
          redirected = destination;
        },
      },
    },
  });
  assert.equal(
    redirected,
    `${to}?source=old-link#section`,
    `${from}: lost query or fragment`,
  );
}

const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
for (const route of routes) {
  assert.ok(
    sitemap.includes(`<loc>${site.url}${route}</loc>`),
    `${route}: missing sitemap entry`,
  );
}
assert.equal(
  fs.readFileSync(path.join(dist, "CNAME"), "utf8").trim(),
  new URL(site.url).hostname,
);
assert.ok(
  fs.existsSync(path.join(dist, ".nojekyll")),
  "Missing GitHub Pages static-site marker",
);
console.log(
  `Verified ${routes.length} static pages, ${projects.length} complete case studies, and ${redirects.length} redirects.`,
);
