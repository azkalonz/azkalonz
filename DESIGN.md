---
name: BuiltByMark.dev — Operational Index
description: A calm, evidence-led portfolio for dependable applications, integrations, and automation.
colors:
  canvas-light: "#eeeee8"
  paper-light: "#f8f7f1"
  ink-light: "#17211f"
  muted-light: "#596460"
  line-light: "#c7cbc4"
  canvas-dark: "#131917"
  paper-dark: "#1a211e"
  ink-dark: "#eeece4"
  muted-dark: "#a7b0ab"
  line-dark: "#39423d"
  action-light: "#b84421"
  action-dark: "#ff7a45"
  proof-light: "#4b6a94"
  proof-dark: "#8eadd5"
typography:
  display:
    fontFamily: "Source Sans 3 Variable, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 4vw, 4rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Source Sans 3 Variable, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.85rem, 2.6vw, 2.75rem)"
    fontWeight: 650
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Source Sans 3 Variable, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.5vw, 1.8rem)"
    fontWeight: 650
    lineHeight: 1.15
  body:
    fontFamily: "Source Sans 3 Variable, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.98rem, 0.96rem + 0.1vw, 1.04rem)"
    fontWeight: 400
    lineHeight: 1.62
  small:
    fontFamily: "Source Sans 3 Variable, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.76rem, 0.74rem + 0.08vw, 0.85rem)"
    fontWeight: 650
    lineHeight: 1.4
rounded:
  control: "0.2rem"
  media: "0.45rem"
spacing:
  unit: "0.5rem"
  group: "clamp(1.25rem, 2vw, 2rem)"
  section: "clamp(4.5rem, 7vw, 7.5rem)"
---

# Design System: Operational Index

## Creative North Star

BuiltByMark.dev is a clear index of operational work, not a developer stage. It moves from proposition to evidence with as little interface noise as possible. Real projects, plain explanations, and dependable outcomes carry the identity.

## Brand Attributes

Precise, calm, direct, experienced, operational, accountable, and human. The design is confident through editing and composition, never through theatrical technical decoration.

## Color

Light mode is a daylight working surface with mineral canvas, soft paper, blue-green ink, restrained oxide action, and documentary blue proof. Dark mode uses green-charcoal planes, bone text, and separately tuned accents. Neither mode uses pure black, pure white, automatic inversion, gradients, or glows.

Project screenshots retain natural color in both themes. Accent color is functional: oxide marks direct action, blue identifies evidence and links, and teal is reserved for dependable system states.

## Typography

Source Sans 3 is the only interface family. Weight, spacing, and measure create hierarchy without a display face or technical-looking monospace. Body copy stays between 60 and 75 characters.

Type is left-aligned, moderate in scale, and content-led. The homepage thesis is the largest text on the site but remains at or below 4rem. Page headings are concise; supporting labels use sentence case and never imitate terminal or ledger notation.

## Grid and Composition

The primary container is 92rem with a flexible 12-column grid. Sections use alignment, whitespace, and restrained surface changes instead of repeated dividers. The Home and Work surfaces use one consistent project index with generous row spacing, comparable evidence, and one clear action per project.

Section rhythm varies without relying on oversized headings. Content is not wrapped in a card unless it is an actual media object, control, or bounded artifact. Mobile follows a deliberate reading order rather than merely stacking desktop columns.

## Shape, Border, and Depth

Controls use a 0.2rem radius; media may use 0.45rem. Ordinary content has no radius. One-pixel rules are reserved for functional boundaries such as the sticky header, accordion rows, and image-viewer chrome—not ordinary content separation. Circular status marks, dot badges, ornamental nodes, numbered section markers, and rounded logo devices are not part of the identity. A surface uses either a boundary or a shadow at rest, never both.

## Navigation

The sticky header uses the BuiltByMark.dev text wordmark, short route labels, a plain theme control, and one project action. There is no monogram, subtitle, status mark, or decorative badge. Active state is a precise baseline. The mobile menu is a full-width sheet with large targets and an explicit close state.

## Workflow Explanation

A case-study workflow may show a source, decisions or transformations, and an outcome. Reading order, titles, and proximity explain the sequence without numbered badges. The homepage is the deliberate exception: its operational pipeline uses squared nodes and routed connections because the relationship itself explains Mark's work.

## Motion

Page content is visible by default. The homepage hero is a sticky, native-scroll chapter: compact placeholder bars resolve into operational language one label at a time while four precisely aligned routes trace from their inputs into one shared junction before integration and safeguards. Three empty colored rails then expand into proof records before their numbers and copy appear. CSS sticky positioning keeps the explanation present without ScrollTrigger pinning or scroll hijacking. Selected work begins as a short stack of solid paper records, hiding every buried record until it clears the one above; each record reaches its final position before its paper surface and shadow dissolve with scroll. The sole character animation is the header wordmark: its dot begins beneath its final period position and stays locked to that horizontal axis while it launches vertically and returns through diminishing floor rebounds plus one small settling hop. Once the dot is still in its punctuation position, `.dev` slides left-to-right through a fixed clipping boundary so it appears to emerge from behind `BuiltByMark`. A pre-render motion class prevents the complete wordmark from flashing before initialization, and the animated layer remains the visible final mark over a transparent selectable text layer so there is no closing handoff. GSAP is lazy-loaded and motion is limited to inexpensive transforms, opacity, color, clipping, shadows, and SVG strokes. No cursor effects, parallax, marquees, status animation, or perpetual motion. Reduced motion keeps every section complete and visible and skips the animation dependency.

## Component Principles

- Buttons are rectangular actions with explicit text, not pills.
- Project lists are consistent, clearly separated rows with title, description, evidence, and one action.
- The three homepage proof records may use solid color because they are the pipeline's resolved output, not a reusable card grid.
- Screenshots are evidence and receive captions, useful alt text, fixed aspect ratios, and responsive sources.
- Diagrams remain semantic in HTML and use composition rather than decorative notation.
- Forms and controls expose labels, states, recovery language, and keyboard focus.
- Technology is secondary metadata; never lead with a logo wall.

## Patterns That Must Not Be Introduced

Do not add monograms, decorative status labels, colored dots, circle badges, section numbers, ornamental list indices, repeated full-width separators, terminal chrome, code prompts, monospace styling, oversized headings, cyberpunk styling, glass panels, blobs, gradients, generic bento grids, floating cards, logo walls, random pills, glow effects, fake metrics, vague capability copy, or an animation on every element.
