export const site = {
  name: "Mark Judaya",
  title: "IT Solutions Developer",
  url: "https://markjudaya.com",
  email: "markjosephjudaya@gmail.com",
  bookingUrl: "https://calendar.app.google/MtqQgN54P647GRcx7",
  socials: {
    github: "https://github.com/azkalonz",
    linkedin: "https://www.linkedin.com/in/markjudaya/",
    fiverr: "https://www.fiverr.com/markjudaya",
  },
} as const;

export type Service = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  problem: string;
  fit: string;
  deliverables: string[];
  approach: string;
  technologies: string[];
  relatedProjectIds: string[];
};

export const services: Service[] = [
  {
    id: "application-development",
    number: "01",
    title: "Web & Mobile Application Development",
    shortTitle: "Applications",
    summary:
      "Custom applications, internal tools, dashboards, and responsive product experiences built around real operating needs.",
    problem:
      "Off-the-shelf tools no longer match the way your team works, or a product idea needs a dependable technical path from scope to launch.",
    fit: "Growing businesses, product teams, and operations teams that need a focused build without assembling a large development team.",
    deliverables: [
      "Business web applications and portals",
      "Internal tools and administrative dashboards",
      "Responsive and mobile application experiences",
      "API and back-end development",
      "Existing application improvements",
    ],
    approach:
      "I clarify the workflow first, shape the smallest useful release, and build the interface, data model, and supporting services as one maintainable system.",
    technologies: [
      "React",
      "TypeScript",
      "Laravel",
      "PHP",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Tailwind CSS",
    ],
    relatedProjectIds: ["urban-road-pim"],
  },
  {
    id: "automation-integrations",
    number: "02",
    title: "Automation & Systems Integration",
    shortTitle: "Integrations",
    summary:
      "Reliable workflows that connect the platforms you already use and reduce repetitive handoffs between people and systems.",
    problem:
      "Information is re-entered, copied between spreadsheets, or trapped in disconnected CRMs, ERPs, marketplaces, and business tools.",
    fit: "Teams with recurring operational work, inconsistent data flow, or a platform ecosystem that needs dependable orchestration.",
    deliverables: [
      "Workflow and process automation",
      "API and third-party integrations",
      "CRM, ERP, and marketplace connections",
      "Zoho customization and Deluge functions",
      "Data migration and synchronization",
    ],
    approach:
      "I map the data and failure paths before implementation, then build validation, duplicate protection, logging, and recovery into the workflow.",
    technologies: [
      "REST APIs",
      "Zoho CRM",
      "Zoho Inventory",
      "Zoho Desk",
      "Deluge",
      "n8n",
      "Salesforce",
      "Mirakl",
    ],
    relatedProjectIds: [
      "mirakl-zoho-inventory-integration",
      "zoho-inventory-erp-integration",
      "salesforce-to-zoho-crm-migration",
    ],
  },
  {
    id: "consulting",
    number: "03",
    title: "IT Consulting & Technical Advisory",
    shortTitle: "Consulting",
    summary:
      "Practical technical direction for teams that know the business problem but need help choosing the right system, scope, or sequence.",
    problem:
      "The goal is clear, but the requirements, platform choice, integration plan, or delivery risks are not.",
    fit: "Founders, operations leaders, and product owners who need a technical partner to turn a business need into an actionable plan.",
    deliverables: [
      "Technical discovery and requirements clarification",
      "Workflow and application audits",
      "Solution and integration planning",
      "Technology and platform evaluation",
      "Modernization roadmaps",
    ],
    approach:
      "I translate the current process into clear requirements, surface constraints early, and recommend a staged plan that your team can evaluate and maintain.",
    technologies: [
      "Process mapping",
      "Solution architecture",
      "API planning",
      "Data modelling",
      "Technical documentation",
    ],
    relatedProjectIds: ["urban-road-pim", "salesforce-to-zoho-crm-migration"],
  },
  {
    id: "support-maintenance",
    number: "04",
    title: "IT Support, Maintenance & Improvements",
    shortTitle: "Support",
    summary:
      "Hands-on help to diagnose problems, improve existing applications, and keep important workflows useful after launch.",
    problem:
      "An application or integration is fragile, outdated, hard to change, or creating recurring operational issues.",
    fit: "Businesses that need continued development help or targeted support for systems they already depend on.",
    deliverables: [
      "Application troubleshooting and bug fixing",
      "Feature enhancements and usability improvements",
      "Integration maintenance",
      "Dependency and framework updates",
      "Documentation and handover support",
    ],
    approach:
      "I start by reproducing the issue and understanding its operational impact, then prioritize the smallest safe improvement and document what changed.",
    technologies: [
      "Issue investigation",
      "Performance review",
      "Release support",
      "Monitoring",
      "Documentation",
    ],
    relatedProjectIds: ["urban-road-pim", "mirakl-zoho-inventory-integration"],
  },
];

export const capabilities = [
  {
    title: "Front end",
    items: [
      "React",
      "TypeScript",
      "Inertia",
      "Tailwind CSS",
      "Responsive interfaces",
    ],
  },
  {
    title: "Back end & data",
    items: [
      "Laravel",
      "PHP",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Background jobs",
    ],
  },
  {
    title: "Integrations",
    items: ["REST APIs", "n8n", "Data migration", "CSV pipelines", "Webhooks"],
  },
  {
    title: "Business platforms",
    items: ["Zoho CRM", "Zoho Inventory", "Zoho Desk", "Salesforce", "Mirakl"],
  },
];

export const faqs = [
  {
    question: "What kinds of projects do you take on?",
    answer:
      "I focus on custom applications, internal business systems, integrations, automation, technical planning, and improvements to existing software. A short discovery call is usually enough to confirm whether the work is a good fit.",
  },
  {
    question: "Can you improve an application that already exists?",
    answer:
      "Yes. I can investigate bugs, improve a workflow or interface, add features, update dependencies, and make an existing application easier to maintain without assuming it needs to be rebuilt.",
  },
  {
    question: "Can you connect with the tools we already use?",
    answer:
      "That is a core part of my work. I have delivered API-based workflows across CRM, inventory, ERP, marketplace, and support platforms, including Zoho, Salesforce, and Mirakl.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes. Support can cover issue investigation, maintenance, incremental improvements, integration changes, and continued development after an initial release.",
  },
  {
    question: "Can you work with an existing team?",
    answer:
      "Yes. I can work directly with a business owner or collaborate with product, operations, design, and development teams, with the level of documentation and handover agreed at the start.",
  },
  {
    question: "How does a project begin?",
    answer:
      "Start with a short summary of the current situation, the outcome you need, and any constraints. I will use that context to recommend the next useful step, which may be discovery, an audit, or a scoped implementation.",
  },
];
