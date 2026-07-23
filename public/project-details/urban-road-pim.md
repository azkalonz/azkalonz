## Project overview

Urban Road PIM is an internal product information management platform for an Australian wall-art business. It replaces a fragmented, spreadsheet-heavy launch process with one governed workflow for importing, validating, reviewing, and distributing product data.

The platform maintains a canonical catalogue across products, variants, content, assets, pricing, costs, logistics, and channel eligibility. From that shared data, it prepares channel-ready files for eight enabled destinations across Shopify, Zoho, and marketplace partners.

## The challenge

Launching a new collection previously meant reshaping and re-keying the same information across multiple spreadsheets and channel templates. That made product operations slow, difficult to audit, and vulnerable to inconsistent data.

The goal is to keep marketplace-specific requirements from redefining the core catalogue while still producing each destination's exact format.

## What I built

- A six-step CSV import workflow with reusable mappings, transformations, dry-run validation, review, and controlled promotion into the catalogue.
- Collection onboarding that generates the five standard wall-art product groups and their sellable variants from seed data.
- A governed transformation engine supporting visual rules, shared conditions, JSON documents, and isolated PHP, Node.js, or Python scripts.
- Catalogue management for connected product, variant, pricing, cost, logistics, content, asset, and eligibility records.
- Custom batch exports and a channel export engine driven by 673 governed field mappings.
- Eligibility checks, repeatable derivation rules, and sparse channel overrides so exports remain predictable and auditable.
- Background job controls, operational monitoring, audit history, saved views, bulk actions, and granular role-based permissions.
- Secure account access with verification, password confirmation, two-factor authentication, and passkeys.

## Architecture and engineering

The application uses Laravel and PostgreSQL for its domain model and server-side workflows, with React, Inertia, TypeScript, and Tailwind CSS for the interface. Redis-backed queues support long-running imports, exports, and bulk operations, while Laravel Horizon and Pulse provide operational visibility.

Large data workflows are processed in bounded, resumable chunks. Import stages preserve checkpoints, promotion is idempotent and reversible, and validation findings are classified as blocking, warning, or informational before data reaches the canonical catalogue.

## Current status

The V1 platform is operational and continues to evolve alongside Urban Road's master-data workbook and product operations requirements. The public overview and operating guide are available through the live project link.
