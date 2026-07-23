## Project overview

Urban Road PIM is an internal product information management platform for an Australian wall-art business. It replaces a fragmented, spreadsheet-heavy launch process with one governed workflow for importing, validating, reviewing, and distributing product data.

The platform maintains a canonical catalogue across products, variants, content, assets, pricing, costs, logistics, and channel eligibility. From that shared data, it prepares channel-ready files for eight enabled destinations across Shopify, Zoho, and marketplace partners.

## The challenge

Launching a new collection previously meant reshaping and re-keying the same information across multiple spreadsheets and channel templates. That made product operations slow, difficult to audit, and vulnerable to inconsistent data.

The goal is to keep marketplace-specific requirements from redefining the core catalogue while still producing each destination's exact format.

## What I built

The platform is organized around eight connected capabilities:

- **Collection imports** — A six-step CSV workflow with reusable mappings, transformations, dry-run validation, review, and controlled promotion into the catalogue.
- **Product generation** — Collection onboarding generates the five standard wall-art product groups and their sellable variants from seed data.
- **Transformation rules** — A governed engine supports visual rules, shared conditions, JSON documents, and isolated PHP, Node.js, or Python scripts.
- **Catalogue governance** — Connected product, variant, pricing, cost, logistics, content, asset, and eligibility records share one source of truth.
- **Channel delivery** — Custom batch exports and a channel export engine are driven by 673 governed field mappings.
- **Eligibility controls** — Repeatable derivation rules and sparse channel overrides keep exports predictable and auditable.
- **Operational tooling** — Background-job controls, monitoring, audit history, saved views, bulk actions, and granular role-based permissions support day-to-day work.
- **Secure access** — Verification, password confirmation, two-factor authentication, and passkeys protect privileged workflows.

## Architecture and engineering

The application uses Laravel and PostgreSQL for its domain model and server-side workflows, with React, Inertia, TypeScript, and Tailwind CSS for the interface. Redis-backed queues support long-running imports, exports, and bulk operations, while Laravel Horizon and Pulse provide operational visibility.

Large data workflows are processed in bounded, resumable chunks. Import stages preserve checkpoints, promotion is idempotent and reversible, and validation findings are classified as blocking, warning, or informational before data reaches the canonical catalogue.

## Current status

The V1 platform is operational and continues to evolve alongside Urban Road's master-data workbook and product operations requirements. The public overview and operating guide are available through the live project link.
