# Portfolio Design Brief

## Selected concept: Operational Index

BuiltByMark.dev presents complex technical work through a calm, consistent index. A scroll-responsive operational pipeline gives the homepage one authored focal moment, while the rest of the interface exposes verified evidence and gives each case study room to show the problem, system relationship, safeguards, and outcome.

This is a refinement of the earlier Relay Ledger direction. The useful operational focus remains; the monogram, status language, large display typography, circular nodes, and competing work layouts were removed because they distracted from the evidence.

## Brand positioning

**Core proposition:** Turning complex operational workflows into dependable systems.

BuiltByMark.dev is the portfolio name. Mark Judaya remains the person behind the work: a full-stack developer and IT solutions specialist in Cebu, Philippines. The site positions him as a direct technical partner for production systems—not a generic freelancer and not an AI-only developer.

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

Existing routes remain stable: `/`, `/services`, `/projects`, `/projects/:id`, `/about`, and `/contact`; `/work` continues to redirect to `/projects`.

## Visual system

The design uses a 12-column responsive grid, strong left alignment, moderate type, and generous but controlled whitespace. Source Sans 3 is the only font family. Content is separated through composition and spacing instead of repeated rules or boxes.

Light mode uses mineral daylight surfaces, blue-green ink, oxide action, restrained teal, and documentary blue. Dark mode uses green-charcoal planes, bone text, and independently tuned accents. Neither theme uses pure black/white or automatic inversion.

## Rules

- Base spacing unit: 0.5rem, with a fluid section scale from 4.5rem to 7.5rem.
- Page display type remains at or below 4rem.
- Controls use a 0.2rem radius; media may use 0.45rem; ordinary content has no radius.
- One-pixel rules are reserved for functional boundaries. Shadows are restricted to lifted screenshots and overlays.
- The BuiltByMark.dev wordmark is text only.
- No monograms, decorative dots, circle badges, status labels, technical monospace, or uppercase label styling.
- Project indexes use consistent rows; detail belongs inside the case study.
- Focus uses a high-contrast outline with offset and is never replaced by color alone.

## Motion and responsive behavior

The homepage hero is a sticky native-scroll chapter. Placeholder bars resolve into operational labels one at a time while GSAP traces four precisely aligned colored routes into one shared junction; CSS sticky positioning keeps the explanation in view without pinning or altering native scrolling. The proof sequence starts as three empty colored rails that expand before their numbers and descriptions appear. Selected work begins as a solid paper stack whose buried records remain hidden until they clear; each record settles before its white surface and shadow dissolve with scroll. Capabilities use reversible scrubbed scaling, and method steps combine their directional slide with a complete opacity reveal. GSAP is lazy-loaded and limited to transform, opacity, color, clip-path, shadow, and SVG-stroke changes. `prefers-reduced-motion` keeps the complete static explanation visible and skips GSAP loading. Below 900px the sticky chapter collapses into a compact, naturally scrolling sequence.

At wide sizes, project rows expose title, explanation, proof, and action in one scan. At tablet widths, evidence remains beside the summary. At mobile widths, each row becomes a simple sequence of project, proof, and action without decorative numbering. Navigation remains obvious and controls keep accessible target sizes.

## Future guardrails

Future additions must begin with a real business problem or project fact. Do not add decorative terminal language, monograms, status chips, colored dots, oversized headings, gradients, glass, glows, generic bento grids, floating cards, logo walls, vague marketing copy, invented metrics, or repeated equal tiles. A smaller, better-evidenced page is preferable to a larger collection of components.
