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
  dateStarted: string;
  dateFinished: string;
  projectType: "Private case study" | "Live product" | "Public repository";
  fiverrUrl?: string;
  fiverrMessage?: string;
  links?: {
    repo?: string;
    live?: string;
  };
};

export const projects: Project[] = [
  {
    id: "urban-road-pim",
    title: "Urban Road Product Information Management Platform",
    description:
      "A governed product information platform that turns supplier spreadsheets into a validated catalogue and channel-ready files.",
    context:
      "An internal product operations platform for an Australian wall-art business with catalogue data distributed across Shopify, Zoho, and marketplace partners.",
    problem:
      "New collections required repeated spreadsheet reshaping and data entry, making product launches difficult to audit and vulnerable to inconsistent information.",
    outcome:
      "Centralized catalogue governance, validation, review, and channel exports in one operational workflow that continues to evolve with the business.",
    role: "Full-stack application development, workflow design, data modelling, and technical delivery",
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
    featuredPhoto: "/urban-road-pim-hero.webp",
    dateStarted: "July 2026",
    dateFinished: "Ongoing",
    projectType: "Live product",
    links: {
      live: "https://ur-pim.tail042666.ts.net/",
    },
  },
  {
    id: "salesforce-to-zoho-crm-migration",
    title: "Salesforce to Zoho CRM Migration",
    description:
      "A staged CRM migration covering export, cleaning, transformation, field mapping, validation, and continuity planning.",
    context:
      "Salesforce needed to remain active during the initial move to Zoho CRM so day-to-day operations could continue while the migrated data was validated.",
    problem:
      "More than 220,000 records across core CRM modules needed to move without losing relationships, traceability, or a path for later attachment migration.",
    outcome:
      "Transferred the required CRM data while preserving Salesforce record IDs, module relationships, and a structured foundation for the final transition.",
    role: "Migration planning, data preparation, field mapping, import execution, and validation",
    services: ["Automation & integration", "Technical consulting"],
    stack: ["Zoho CRM", "Salesforce", "Data migration", "CSV", "Deluge"],
    tags: ["CRM migration", "Data engineering", "Zoho"],
    featured: true,
    dateStarted: "October 2025",
    dateFinished: "November 2025",
    projectType: "Private case study",
    fiverrUrl: "https://www.fiverr.com/s/38QqKDr",
    fiverrMessage: "Discuss a structured CRM migration and validation plan.",
  },
  {
    id: "mirakl-zoho-inventory-integration",
    title: "Mirakl Marketplace Integration",
    description:
      "An automated order workflow connecting Mirakl, Zoho Inventory, and Zoho Desk across the marketplace order lifecycle.",
    context:
      "Marketplace orders, shipment updates, documents, and integration incidents needed to move between systems with less manual coordination.",
    problem:
      "Disconnected order handling created repeated work and limited visibility when a sync or operational edge case needed attention.",
    outcome:
      "Established a scheduled integration for order ingestion, acceptance, shipment updates, document handling, and centralized incident tracking.",
    role: "Integration design, API implementation, workflow automation, and error-handling design",
    services: ["Automation & integration", "Ongoing support"],
    stack: ["Zoho Inventory", "Zoho Desk", "Deluge", "REST API", "n8n"],
    tags: ["Marketplace", "Order sync", "Automation"],
    featured: true,
    dateStarted: "January 2026",
    dateFinished: "February 2026",
    projectType: "Private case study",
    fiverrUrl: "https://www.fiverr.com/s/DBvEbxa",
    fiverrMessage: "Discuss a Mirakl and Zoho Inventory integration.",
  },
  {
    id: "zoho-inventory-erp-integration",
    title: "Zoho Inventory ERP Integration",
    description:
      "A custom order integration from Zoho Inventory to a third-party ERP, including routing rules, production data, and invoice attachments.",
    context:
      "Sales, fulfilment, and production information had to reach a third-party ERP consistently despite limited API documentation.",
    problem:
      "Manual order handling introduced repeated entry and created a risk that shipping, production, add-on, or document details would be missed.",
    outcome:
      "Automated eligible order flow, packing, shipping details, production flags, add-ons, and invoice attachments between the two systems.",
    role: "Workflow design, Deluge development, API testing, and integration delivery",
    services: ["Automation & integration"],
    stack: ["Zoho Deluge", "n8n", "Postman"],
    tags: ["ERP", "Order automation", "Zoho"],
    featured: false,
    dateStarted: "May 2023",
    dateFinished: "June 2023",
    projectType: "Private case study",
    fiverrUrl: "https://www.fiverr.com/s/wk6N268",
    fiverrMessage: "Discuss a Zoho Inventory and ERP workflow.",
  },
];

export default projects;
