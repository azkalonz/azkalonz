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
  mac-close: "#ff5f57"
  mac-minimize: "#febc2e"
  mac-zoom: "#28c840"
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

The deployed palette is sourced from `themes/current-theme.json`. Alternative palettes live in the development-only Design lab and may be previewed across routes and reloads without changing that production source. `npm run theme:list` lists the catalog; `npm run theme:apply -- <theme-id>` deliberately promotes one system to the deployed theme and synchronizes static fallback surfaces.

## Typography

Mineral uses Source Sans 3 as its production baseline. The Design Lab contains 31 complete systems organized into established, quiet operational, editorial, industrial, and restrained expressive directions. Its Google-font alternatives use at most two coordinated families and load only for the selected preview or applied production theme. Promoting a theme updates the typography recorded in this frontmatter. Body copy stays between 60 and 75 characters in every direction.

Type is left-aligned and content-led. The homepage thesis is the largest text on the site but remains at or below 4rem. Heading weight, tracking, case, and supporting-label treatment come from the applied theme rather than one universal typographic voice.

## Grid and Composition

The primary container is 92rem with a flexible 12-column grid. Sections use alignment, whitespace, and restrained surface changes instead of repeated dividers. The Home and Work surfaces use one consistent project index with generous row spacing, comparable evidence, and one clear action per project.

Section rhythm varies without relying on oversized headings. Content is not wrapped in a card unless it is an actual media object, control, or bounded artifact. Wide homepage layouts pair the proposition with the workflow. Narrow layouts lead with the proposition and actions, then place the same workflow directly below; a closer camera follows the transaction instead of shrinking the whole topology into an unreadable thumbnail.

## Shape, Border, and Depth

Controls use a 0.2rem radius; media may use 0.45rem. Ordinary content has no radius. The responsive-app reel is the one hardware-specific exception: its browser frame uses restrained screen corners and the three familiar macOS window-control colors, and its phone state uses a literal device silhouette, while the application regions inside keep the ordinary control tokens. One-pixel rules are reserved for functional boundaries such as the sticky header, accordion rows, and image-viewer chrome—not ordinary content separation. Circular status marks, dot badges, ornamental nodes, numbered section markers, and rounded logo devices are not part of the identity. A surface uses either a boundary or a shadow at rest, never both.

## Navigation

The sticky header uses the BuiltByMark.dev text wordmark, short route labels, a plain theme control, and one project action. There is no monogram, subtitle, status mark, or decorative badge. At the top of the page it has no lower rule. Once the page moves, its generously inset rounded rail gains a one-pixel edge, a translucent canvas surface, and a bounded backdrop blur as it floats slightly below the viewport edge; downward travel hides the rail and upward travel reveals it without changing document layout. Active state is a precise baseline. The mobile menu is a full-width sheet with large targets and an explicit close state, and opening it always restores the header.

## Workflow Explanation

A case-study workflow may show a source, decisions or transformations, and an outcome. Reading order, titles, and proximity explain the sequence without numbered badges. The homepage is the deliberate exception: one bounded artifact first reflows a single order-operations interface from desktop to tablet to phone, then uses routed nodes to explain the Shopify transaction behind it, and finally shows an illustrative AI-assisted review grounded only in that workflow's visible events. The application keeps one persistent set of navigation, order, and detail components while its containing surface changes from restrained desktop/tablet browser chrome to a compact phone frame; the workflow keeps one canonical topology at every viewport size; the AI review distinguishes its example data from portfolio proof and leaves the incident log as a human review action. All three sheets carry one quiet square grid in the same camera space as their foreground content so the grid pans and zooms with the operating canvas rather than reading as a fixed decorative backdrop.

## Motion

Page content is visible by default. On wide screens, the homepage opens as a normal-height proposition beside one bounded three-act service reel. Tablet and phone layouts put the proposition and actions first, followed immediately by the same artifact with closer camera framing. The complete desktop application frame is prerendered from the same HTML and responsive camera model used by the enhanced reel; the heavier workflow renderer is requested only after page load and an idle interval, then takes over without a placeholder flash, layout shift, or arrival animation. The first act uses one application shell whose navigation, order list, and selected-order detail remain visible while they reorganize from desktop to tablet to phone. The second act traces a Shopify order through validation, inventory, fulfilment, carrier handoff, and tracking recovery. The third act types one operational question, pans across the same bounded world, and reveals an illustrative source-grounded answer with a categorical donut, event rails, and an evidence table. Each act is a complete bordered sheet in one shallow three-level deck: the active sheet is fully visible and both chronological successors leave aligned right-and-bottom keylines behind it. Automatic and Next handoffs push the top sheet toward the viewer until it disappears; only then is that hidden sheet recycled to the rear while the two visible successors advance. Previous moves the current top back one level, stages the prior sheet ahead while hidden, and settles it toward the stack as the new top. Recycling is never shown as a card visibly traveling from the front to the back, and every settled state restores the same three-sheet cyclic deck. The deck never dissolves into an empty frame, fans its cards, adds decorative shadow, or moves the surrounding page layout. All three acts share one labeled deterministic GSAP timeline, and the reel pauses offscreen, while the document is hidden, or when the visitor uses its play/pause control. Previous and next controls move between the same scene anchors, explicitly start the selected scene, remain keyboard operable, reveal with focus as well as hover, and stay discoverable on touch devices. Reduced motion hides the reel controls and resolves immediately to the readable workflow cluster with the two quieter sheet edges preserved. The three proof records follow as static evidence, without a sticky chapter, scroll-bound tiles, or transition presets. Selected work begins as a short stack of solid paper records, hiding every buried record until they clear; each record reaches its final position before its paper surface and shadow dissolve with scroll. The sole character animation is the header wordmark: its dot begins beneath its final period position and stays locked to that horizontal axis while it launches vertically and returns through diminishing floor rebounds plus one small settling hop. Once the dot is still in its punctuation position, `.dev` slides left-to-right through a fixed clipping boundary so it appears to emerge from behind `BuiltByMark`. A pre-render motion class prevents the complete wordmark from flashing before initialization, and the animated layer remains the visible final mark over a transparent selectable text layer so there is no closing handoff. GSAP is lazy-loaded and motion is limited to inexpensive transforms, opacity, color, clipping, isolated layout geometry, shadows, and SVG strokes. No cursor effects, parallax, marquees, duplicated application scenes, autonomous-action theater, or independent animation loops. Reduced motion keeps every section complete and visible.

## Component Principles

- Buttons are rectangular actions with explicit text, not pills.
- Project lists are consistent, clearly separated rows with title, description, evidence, and one action.
- The three homepage proof records are the reel's resolved output: pale semantic surfaces, hard offset rear planes, and a stepped wide-screen rhythm become generous offset sheets on narrow screens. They remain static evidence rather than a reusable card grid or another animation chapter.
- Screenshots are evidence and receive captions, useful alt text, fixed aspect ratios, and responsive sources.
- Diagrams remain semantic in HTML and use composition rather than decorative notation.
- Forms and controls expose labels, states, recovery language, and keyboard focus.
- Technology is secondary metadata; never lead with a logo wall.

## Patterns That Must Not Be Introduced

Do not add monograms, decorative status labels, colored dots, circle badges, section numbers, ornamental list indices, repeated full-width separators, terminal chrome, code prompts, decorative monospace outside a selected theme, oversized headings, cyberpunk styling, glass panels, blobs, gradients, generic bento grids, floating cards, logo walls, random pills, glow effects, fake metrics, vague capability copy, or an animation on every element.
