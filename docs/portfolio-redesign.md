# Portfolio Design Brief

## Selected concept: Link Index

The personal homepage introduces Mark through the approved compact Link Index. BuiltByMark.dev presents the full portfolio under `/studio` in the same monochrome UI. A bounded three-act service reel gives the homepage one authored focal moment: one responsive order-operations interface reorganizes across desktop, tablet, and phone; an order-fulfilment workflow resolves through integration and recovery; and a short AI-assisted review turns the visible workflow events into an explicitly illustrative answer and evidence report. The rest of the interface exposes verified evidence and gives each case study room to show the problem, system relationship, safeguards, and outcome.

The personal homepage contains the updated portrait, name, role, location, one short description, and four links. It has no projects, generic header, work images, Fiverr, or link subtitles.

## Brand positioning

**Core proposition:** Turning complex operational workflows into dependable systems.

BuiltByMark.dev is the portfolio name. Mark Joseph Judaya remains the person behind the work: a full-stack developer and IT solutions specialist in Cebu, Philippines. The site positions him as a direct technical partner for production systems—not a generic freelancer and not an AI-only developer.

## Audience and decision path

The primary visitor is a business or technical decision-maker with a custom application, disconnected systems, repeated manual work, fragile integration, data migration, or maintenance need.

The experience answers, in order:

1. What BuiltByMark.dev solves.
2. What verified work proves the capability.
3. How Mark approaches reliability and maintainability.
4. How to start a direct conversation.

## Information architecture

- **Home** — concise proposition, explanatory operational pipeline, verified proof, selected work, services, working method, short personal introduction, and contact route.
- **Work** — one consistent index of four case studies separated by rhythm and comparable evidence.
- **Case study** — context, responsibility, workflow, safeguards, outcome, screenshots where available, implementation detail, and relevant technology.
- **Services** — organized around operational problems and the kind of engagement they require.
- **About** — Mark's location, strengths, working approach, and professional links.
- **Contact** — direct email, booking, LinkedIn, and Fiverr with concise guidance on useful project context.

The mobile-first personal link index lives at `/`. This existing portfolio now lives at `/studio`, `/studio/services`, `/studio/projects`, `/studio/projects/:id`, `/studio/about`, and `/studio/contact`. Previous page URLs redirect to the matching studio route; `/work` and `/studio/work` redirect to `/studio/projects`.

## Visual system

The design uses a 12-column responsive grid, strong left alignment, moderate type, and generous but controlled whitespace. Locally hosted Manrope is the font family throughout. Content is separated through composition and spacing instead of repeated rules or boxes.

Dark mode uses charcoal canvas and raised gray surfaces, pale text, and quiet borders. Every page load starts dark regardless of system preference or older saved choices. The manual theme control provides a coordinated light monochrome palette for the current visit. Project screenshots retain their natural color.

## Rules

- Base spacing unit: 0.5rem, with a fluid section scale from 4.5rem to 7.5rem.
- Page display type remains at or below 4rem.
- Controls use a 0.625rem radius; media and bounded surfaces use 0.875rem; ordinary prose remains unboxed.
- One-pixel rules mark functional boundaries and quiet link-row separators. Raised surfaces use small offset soft shadows, without hard rear planes.
- The BuiltByMark.dev wordmark is text only.
- No monograms, decorative dots, circle badges, status labels, technical monospace, or uppercase label styling.
- Project indexes use consistent rows; detail belongs inside the case study.
- Focus uses a high-contrast outline with offset and is never replaced by color alone.

## Motion and responsive behavior

The homepage hero uses a normal-height two-column composition on wide screens: a concise proposition beside one bounded service reel. Tablet and phone layouts place the proposition and actions at the top, then show the same artifact below through closer camera framing. The first act keeps one application DOM mounted while its navigation, order list, and selected-order detail reflow from a restrained desktop/tablet browser frame into a native phone frame. The second illustrates order intake, validation, inventory, fulfilment, carrier handoff, failure, and recovery. The third types one workflow question, pans from prompt to evidence, and resolves a source-grounded answer with nonnumeric charts and an evidence table labeled as illustrative workflow data. All three scene sheets remain present as a precise aligned deck. Next pushes the top sheet toward the viewer until it disappears, then recycles it invisibly to the rear while the other sheets advance; Previous moves the current top back and settles the prior sheet inward from the foreground. One GSAP timeline controls all three acts, pauses offscreen, and restores the desktop application before repeating. Under `prefers-reduced-motion`, the workflow settles on a readable mid-flow cluster with the quieter rear sheet edges preserved. Three static proof records follow in normal document flow. Project, proof, capability, and method content stays immediately visible in normal document flow without scroll-controlled stacking or dissolving surfaces. GSAP is lazy-loaded and limited to transform, opacity, color, clip-path, isolated geometry, shadow, and SVG-stroke changes.

At wide sizes, project rows expose title, explanation, proof, and action in one scan. At tablet widths, evidence remains beside the summary. At mobile widths, each row becomes a simple sequence of project, proof, and action without decorative numbering. Navigation remains obvious and controls keep accessible target sizes.

## Future guardrails

Future additions must begin with a real business problem or project fact. Do not add decorative terminal language, monograms, status chips, colored dots, oversized headings, gradients, glass, glows, generic bento grids, floating cards, logo walls, vague marketing copy, invented metrics, or repeated equal tiles. A smaller, better-evidenced page is preferable to a larger collection of components.
