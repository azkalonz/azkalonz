---
name: Mark Judaya — Link Index
description: A compact personal profile and a monochrome studio sharing one visual language.
colors:
  profile-canvas: "#171b20"
  profile-surface: "#242a32"
  profile-ink: "#f0f2f5"
  profile-muted: "#bcc4ce"
  profile-body: "#d2d8e0"
  profile-line: "#3a414a"
  profile-action: "#cbd7e8"
  canvas-light: "#f2f3f5"
  paper-light: "#ffffff"
  ink-light: "#171b20"
  muted-light: "#555f6b"
  line-light: "#d4d9df"
  canvas-dark: "#171b20"
  paper-dark: "#242a32"
  ink-dark: "#f0f2f5"
  muted-dark: "#bcc4ce"
  line-dark: "#3a414a"
  action-light: "#242a32"
  action-dark: "#f0f2f5"
  proof-light: "#3a414a"
  proof-dark: "#d2d8e0"
  mac-close: "#ff5f57"
  mac-minimize: "#febc2e"
  mac-zoom: "#28c840"
typography:
  display:
    fontFamily: "Profile Manrope, Manrope, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 4vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
    textTransform: none
  headline:
    fontFamily: "Profile Manrope, Manrope, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.85rem, 2.6vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
    textTransform: none
  title:
    fontFamily: "Profile Manrope, Manrope, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.5vw, 1.8rem)"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.025em"
    textTransform: none
  body:
    fontFamily: "Profile Manrope, Manrope, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.98rem, 0.96rem + 0.1vw, 1.04rem)"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0"
  small:
    fontFamily: "Profile Manrope, Manrope, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.76rem, 0.74rem + 0.08vw, 0.85rem)"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
    textTransform: none
rounded:
  control: "0.625rem"
  media: "0.875rem"
spacing:
  unit: "0.5rem"
  group: "clamp(1.25rem, 2vw, 2rem)"
  section: "clamp(4.5rem, 7vw, 7.5rem)"
---

# Link Index

## Visual direction

The approved Figma direction 21 is the visual authority. The personal homepage and the studio share charcoal planes, locally hosted Manrope, pale text, quiet separators, rounded controls, and small offset soft shadows. Hierarchy comes from spacing and reading order. No orange, teal, or blue accent system remains in the studio. Real project screenshots retain their natural colors; error feedback may use a restrained semantic red.

`themes/current-theme.json` owns the applied palette and typography. The Link Index entry in the development theme catalog preserves this system for intentional reuse. Do not let a development preview change the production default.

## Personal homepage — `/`

One compact profile: a 72 × 78 portrait beside Mark's name, role and location; one short sentence; one raised link list. No generic site header, footer, project content, work imagery, badges, or repeated sections.

The list uses a 14px radius, quiet internal separators, and four full-width rows at least 64px high: GitHub, LinkedIn, Email me, and BuiltByMark.dev. No usernames, addresses, or subtitles beneath the labels. BuiltByMark.dev opens `/studio`.

Start at phone size with 24px side padding and a 342px content maximum. Desktop keeps the narrow centered composition at 360px. Allow natural scrolling on short screens and safe-area padding. Name: 25px, weight 600, line-height 1.2, tracking −0.6px. Body: 16px, weight 400, line-height 1.65. Role and location: 13px. The portrait uses Mark's updated supplied image.

## Studio — `/studio/*`

The existing portfolio, services, case studies, About, and contact pages live under `/studio`, including the previous homepage at `/studio`. Preserve their factual content, route relationships, contact tools, SEO, and project evidence. Old root-level links redirect to the matching studio routes with their query strings and anchors.

Extend the personal homepage's component language to the denser portfolio content: Manrope 400 for body, 500 for controls and metadata, 600 for headings. Body line-height is 1.7. Headings stay sentence case and readable rather than oversized. Bound long prose to a comfortable measure and give content groups generous separation. Small screens use a single clear reading order; navigation and forms remain comfortably operable.

Use `#171b20` canvas, `#242a32` raised surfaces, `#2b323b` fields, `#f0f2f5` primary text, `#bcc4ce` secondary text, and `#3a414a` separators. Primary buttons use pale fill with dark text. Secondary actions and links use quiet text or bounded surfaces. Cards use soft elevation instead of hard offset planes. Ordinary prose does not need a card.

Navigation is a compact route index with restrained BuiltByMark.dev text branding, a route-aware active state, a manual theme control, and a clear contact action. The footer provides useful navigation and profiles without promotional clutter. About uses the updated portrait, exported at a larger resolution than the compact homepage image.

## Default theme

The homepage is always dark. Every fresh studio page load starts dark regardless of operating-system preference or a previously saved choice. The manual theme control may switch to the coordinated light monochrome palette for the current visit. Do not subscribe to system color-scheme changes. The HTML, initial browser canvas, prerendered markup, and default browser theme color must agree before React loads.

## Project evidence and motion

Keep real project rows, case-study diagrams, captions, useful alt text, responsive images, and full details. Interface illustrations use the same neutral tokens. Existing functional service-reel scenes remain available with pause and scene controls; illustrative values remain clearly identified. Project and proof content is immediately visible and does not require scroll-controlled stacking or dissolving surfaces.

Interactions use small, purposeful changes in color or position. Keyboard focus stays visible, controls retain meaningful labels and states, and reduced-motion behavior keeps all content complete. Avoid decorative animation on ordinary content.

## Guardrails

No invented claims, metrics, testimonials, clients, or capabilities. No gradients, glows, terminal decoration, logo walls, decorative status marks, repeated ornamental indices, or generic bento scaffolds. Keep human copy specific and brief. Use visible labels, useful recovery messages, accessible contrast, and layouts without horizontal overflow.
