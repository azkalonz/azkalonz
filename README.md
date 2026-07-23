# Mark Judaya portfolio

A React and TypeScript portfolio for Mark Judaya's application development, systems integration, technical consulting, and ongoing support services.

## Local development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

The production build creates the Vite bundle and prerenders the primary routes and project case studies into `dist/`.

## Contact form

The inquiry form uses EmailJS. Copy `.env.example` to `.env` and provide:

```text
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

The template receives the visitor's name and reply address plus a composed message containing the selected service, company, timeline, budget, preferred contact method, current situation, and project summary. Do not commit `.env`.

## Content

- Service positioning and shared site details: `src/data/site.ts`
- Project summaries and evidence: `src/data/projects.ts`
- Long-form case studies: `public/project-details/*.md`
- Global visual system and responsive behavior: `src/index.css`

Public routes:

- `/`
- `/services`
- `/projects`
- `/projects/:id`
- `/about`
- `/contact`
