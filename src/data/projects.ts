export type Project = {
  id: string;
  title: string;
  description: string;
  context: string;
  problem: string;
  outcome: string;
  role: string;
  services: string[];
  stack: string[];
  tags: string[];
  featured: boolean;
  featuredPhoto?: string;
  featuredPhotoAlt?: string;
  featuredPhotoCaption?: string;
  showcase?: {
    src: string;
    alt: string;
    title: string;
    description: string;
  }[];
  dateStarted: string;
  dateFinished: string;
  projectType: "Private case study" | "Live product" | "Public repository";
  fiverrUrl?: string;
  fiverrMessage?: string;
  links?: {
    repo?: string;
    live?: string;
  };
  proof: {
    value: string;
    label: string;
  }[];
  workflow: {
    label: string;
    detail: string;
    kind: "source" | "process" | "system" | "outcome";
  }[];
  reliability: string[];
};

export const projects: Project[] = [
  {
    id: "urban-road-pim",
    title: "Urban Road Product Information Management Platform",
    description:
      "An internal PIM that imports supplier spreadsheets, validates product data, and creates files for Shopify, Zoho, and marketplace partners.",
    context:
      "Built for an Australian wall-art business whose catalogue data was spread across Shopify, Zoho, supplier workbooks, and marketplace templates.",
    problem:
      "New collections required repeated spreadsheet reshaping and data entry, making product launches difficult to audit and vulnerable to inconsistent information.",
    outcome:
      "Brought catalogue imports, validation, review, and channel exports into one application that continues to change with the product team.",
    role: "Full-stack application development, process design, data modelling, and technical delivery",
    services: [
      "Application development",
      "Technical consulting",
      "Ongoing improvements",
    ],
    stack: [
      "Laravel",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Tailwind CSS",
    ],
    tags: ["PIM", "Full stack", "Data workflows"],
    featured: true,
    featuredPhoto: "/project-screens/urban-road-pim/product-overview.webp",
    featuredPhotoAlt:
      "Urban Road PIM product overview with the headline One catalogue. Every channel ready.",
    featuredPhotoCaption:
      "The product overview introduces the catalogue and collection launch workspace.",
    showcase: [
      {
        src: "/project-screens/urban-road-pim/product-overview.webp",
        alt: "Urban Road PIM product overview with the headline One catalogue. Every channel ready.",
        title: "Product overview",
        description:
          "The overview introduces the catalogue and collection launch workspace.",
      },
      {
        src: "/project-screens/urban-road-pim/widget-configuration.webp",
        alt: "Urban Road PIM widget configuration screen with governed report settings and a bar chart preview",
        title: "Reporting widgets",
        description:
          "Teams can configure reusable reporting widgets, set their parameters, and preview the result before saving.",
      },
      {
        src: "/project-screens/urban-road-pim/custom-dashboard.webp",
        alt: "Urban Road PIM custom dashboard editor arranging catalogue metrics and a variants-needing-attention table",
        title: "Custom dashboards",
        description:
          "Teams can arrange catalogue counts, publishing health, and records that need attention in one dashboard.",
      },
      {
        src: "/project-screens/urban-road-pim/product-catalogue.webp",
        alt: "Urban Road PIM product catalogue listing governed artwork records, SKUs, product types, colours, and collections",
        title: "Product catalogue",
        description:
          "Saved views and filters make product records, catalogue attributes, ownership, and review states easier to manage.",
      },
      {
        src: "/project-screens/urban-road-pim/channel-exports.webp",
        alt: "Urban Road PIM channel exports showing enabled destinations, eligible variants, output columns, and export status",
        title: "Channel-ready output",
        description:
          "Each channel run shows eligibility, mapping coverage, warnings, and export status before a file is created.",
      },
      {
        src: "/project-screens/urban-road-pim/global-search.webp",
        alt: "Urban Road PIM global search showing matching products and variants with highlighted query terms",
        title: "Catalogue-wide search",
        description:
          "Operators can move directly from a search result to the relevant product or variant without losing its catalogue context.",
      },
      {
        src: "/project-screens/urban-road-pim/operations-dashboard.webp",
        alt: "Urban Road PIM operations dashboard showing catalogue totals, operational jobs, and publishing readiness checks",
        title: "Operations at a glance",
        description:
          "The dashboard shows catalogue health, active jobs, missing data, and channel readiness in one place.",
      },
    ],
    dateStarted: "July 2026",
    dateFinished: "Ongoing",
    projectType: "Live product",
    proof: [
      { value: "673", label: "product field mappings" },
      { value: "8", label: "enabled destinations" },
      { value: "6 steps", label: "from import to promotion" },
    ],
    workflow: [
      {
        label: "Supplier data",
        detail: "Collection workbooks and CSV source files",
        kind: "source",
      },
      {
        label: "Map and validate",
        detail: "Reusable mappings, transformations, dry runs, and review",
        kind: "process",
      },
      {
        label: "Reviewed catalogue",
        detail:
          "Products, variants, content, pricing, logistics, and eligibility",
        kind: "system",
      },
      {
        label: "Channel-ready output",
        detail: "Shopify, Zoho, and marketplace-specific exports",
        kind: "outcome",
      },
    ],
    reliability: [
      "Bounded, resumable processing for large import and export jobs",
      "Checkpoints, idempotent promotion, and reversible workflow stages",
      "Blocking, warning, and informational validation before catalogue promotion",
      "Audit history, monitoring, background-job controls, and role-based access",
    ],
  },
  {
    id: "salesforce-to-zoho-crm-migration",
    title: "Salesforce to Zoho CRM Migration",
    description:
      "Migrated more than 2 million records from Salesforce to Zoho CRM while Salesforce stayed live for day-to-day work.",
    context:
      "Salesforce needed to remain active during the initial move to Zoho CRM so day-to-day operations could continue while the migrated data was validated.",
    problem:
      "More than 2 million records across core CRM modules needed to move without losing relationships, traceability, or a path for later attachment migration.",
    outcome:
      "Moved the required CRM data while preserving Salesforce record IDs and relationships for validation and later attachment work.",
    role: "Migration planning, data preparation, field mapping, import execution, and validation",
    services: ["Automation & integration", "Technical consulting"],
    stack: ["Zoho CRM", "Salesforce", "Data migration", "CSV", "Deluge"],
    tags: ["CRM migration", "Data engineering", "Zoho"],
    featured: true,
    dateStarted: "October 2025",
    dateFinished: "November 2025",
    projectType: "Private case study",
    fiverrUrl: "https://www.fiverr.com/s/38QqKDr",
    fiverrMessage: "Ask about a Salesforce-to-Zoho CRM migration.",
    proof: [
      { value: "2M+", label: "records transferred" },
      { value: "6", label: "core CRM modules" },
      { value: "Live", label: "source CRM during validation" },
    ],
    workflow: [
      {
        label: "Salesforce export",
        detail: "Structured exports across six related modules",
        kind: "source",
      },
      {
        label: "Clean and map",
        detail:
          "Deduplication, normalisation, field mapping, and custom fields",
        kind: "process",
      },
      {
        label: "Staged Zoho import",
        detail: "Initial load while Salesforce remained operational",
        kind: "system",
      },
      {
        label: "Validated records",
        detail:
          "Relationships and source record IDs preserved for reconciliation",
        kind: "outcome",
      },
    ],
    reliability: [
      "Salesforce record IDs preserved for traceability and later attachment work",
      "Module relationships checked to maintain referential integrity",
      "Required fields, dates, and picklist values normalized before import",
      "Staged migration kept day-to-day CRM operations available during validation",
    ],
  },
  {
    id: "mirakl-zoho-inventory-integration",
    title: "Mirakl Marketplace Integration",
    description:
      "Pulled Mirakl orders into Zoho Inventory, returned shipment updates, and logged failed syncs in Zoho Desk.",
    context:
      "Orders, shipment updates, documents, and failed syncs had to move between Mirakl and Zoho with less manual handling.",
    problem:
      "Disconnected order handling created repeated work and made failed or unusual syncs difficult to investigate.",
    outcome:
      "Set up scheduled order imports, acceptance, shipment updates, document handling, and incident logging in Zoho Desk.",
    role: "Integration design, API implementation, workflow automation, and error-handling design",
    services: ["Automation & integration", "Ongoing support"],
    stack: ["Zoho Inventory", "Zoho Desk", "Deluge", "REST API", "n8n"],
    tags: ["Marketplace", "Order sync", "Automation"],
    featured: true,
    dateStarted: "January 2026",
    dateFinished: "February 2026",
    projectType: "Private case study",
    fiverrUrl: "https://www.fiverr.com/s/DBvEbxa",
    fiverrMessage: "Ask about a Mirakl and Zoho Inventory integration.",
    proof: [
      { value: "Scheduled", label: "order imports" },
      { value: "Checked", label: "before order creation" },
      { value: "Logged", label: "failed syncs in Zoho Desk" },
    ],
    workflow: [
      {
        label: "Mirakl orders",
        detail: "New and pending marketplace orders",
        kind: "source",
      },
      {
        label: "Scheduled integration",
        detail: "Batching, validation, acceptance, and duplicate protection",
        kind: "process",
      },
      {
        label: "Zoho operations",
        detail: "Inventory orders, documents, fulfilment, and incident records",
        kind: "system",
      },
      {
        label: "Updates returned",
        detail:
          "Shipment updates returned to Mirakl; failures routed for review",
        kind: "outcome",
      },
    ],
    reliability: [
      "Batch handling and duplicate protection during scheduled order ingestion",
      "Validation before records move between marketplace and inventory systems",
      "Errors and exceptions logged centrally in Zoho Desk",
      "Shipment updates and document handling covered by the same integration",
    ],
  },
  {
    id: "zoho-inventory-erp-integration",
    title: "Zoho Inventory ERP Integration",
    description:
      "Sent eligible Zoho Inventory orders to a third-party ERP with shipping details, production flags, add-ons, and invoice PDFs.",
    context:
      "Sales, fulfilment, and production teams needed the same complete order record in a third-party ERP despite limited API documentation.",
    problem:
      "Manual order handling introduced repeated entry and created a risk that shipping, production, add-on, or document details would be missed.",
    outcome:
      "Eligible orders now move to the ERP with packing, shipping details, production flags, add-ons, and invoice attachments.",
    role: "Workflow design, Deluge development, API testing, and integration delivery",
    services: ["Automation & integration"],
    stack: ["Zoho Deluge", "n8n", "Postman"],
    tags: ["ERP", "Order automation", "Zoho"],
    featured: false,
    dateStarted: "May 2023",
    dateFinished: "June 2023",
    projectType: "Private case study",
    fiverrUrl: "https://www.fiverr.com/s/wk6N268",
    fiverrMessage: "Ask about a Zoho Inventory and ERP integration.",
    proof: [
      { value: "Rules", label: "filter eligible orders" },
      { value: "Full", label: "shipping and production data" },
      { value: "PDFs", label: "attached to ERP orders" },
    ],
    workflow: [
      {
        label: "Zoho Inventory",
        detail:
          "Orders, shipping details, production flags, add-ons, and invoices",
        kind: "source",
      },
      {
        label: "Eligibility and packing",
        detail:
          "Despatch-location routing, payload validation, and order packing",
        kind: "process",
      },
      {
        label: "Third-party ERP",
        detail: "Complete order, fulfilment, production, and document records",
        kind: "system",
      },
      {
        label: "One ERP record",
        detail:
          "Sales, fulfilment, and production details arrive together",
        kind: "outcome",
      },
    ],
    reliability: [
      "Only orders matching despatch-location rules enter the integration",
      "Payloads include shipping, production, add-on, and order-note context",
      "Invoice PDFs use the available order-attachment endpoint",
      "API behaviour was tested and validated despite limited documentation",
    ],
  },
];

export default projects;
