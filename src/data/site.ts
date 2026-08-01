export const site = {
  name: "BuiltByMark.dev",
  personName: "Mark Judaya",
  title: "Custom Software Developer",
  url: "https://builtbymark.dev",
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
    title: "Web & Mobile Application Development",
    shortTitle: "Applications",
    summary:
      "I build internal tools, customer portals, dashboards, and web applications around the way your team works.",
    problem:
      "Off-the-shelf software no longer fits your process, or a new product needs a clear path from scope to launch.",
    fit: "Growing businesses, product teams, and operations teams that need a focused build without hiring a full development team.",
    deliverables: [
      "Business web applications and portals",
      "Internal tools and administrative dashboards",
      "Responsive and mobile application experiences",
      "API and back-end development",
      "Existing application improvements",
    ],
    approach:
      "I map the process, choose the smallest useful first release, and build the interface, data, and supporting services together.",
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
    title: "Automation & Systems Integration",
    shortTitle: "Integrations",
    summary:
      "I connect CRMs, ERPs, marketplaces, and spreadsheets so data moves without repeated entry.",
    problem:
      "People are re-entering the same information, copying it between spreadsheets, or working around disconnected business tools.",
    fit: "Teams dealing with repeated admin, inconsistent data, or several platforms that need to exchange information.",
    deliverables: [
      "Workflow and process automation",
      "API and third-party integrations",
      "CRM, ERP, and marketplace connections",
      "Zoho customisation and Deluge functions",
      "Data migration and synchronisation",
    ],
    approach:
      "I map the data and failure cases first, then add validation, duplicate checks, logging, and recovery.",
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
    title: "IT Consulting & Technical Advisory",
    shortTitle: "Consulting",
    summary:
      "I turn a business problem into clear requirements, platform choices, and a staged delivery plan.",
    problem:
      "You know what needs to improve, but not what to build, which platform to use, or where the main delivery risks are.",
    fit: "Founders, operations leaders, and product owners who need help turning a business need into a plan they can review and fund.",
    deliverables: [
      "Technical discovery and requirements clarification",
      "Workflow and application audits",
      "Solution and integration planning",
      "Technology and platform evaluation",
      "Modernization roadmaps",
    ],
    approach:
      "I document the current process, make constraints visible, and recommend a sequence your team can review before committing to a build.",
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
    title: "IT Support, Maintenance & Improvements",
    shortTitle: "Support",
    summary:
      "I diagnose and improve existing applications and integrations, then document what changed.",
    problem:
      "A tool is breaking, outdated, difficult to change, or causing the same issue repeatedly.",
    fit: "Teams that need ongoing development or focused help with software they already depend on.",
    deliverables: [
      "Application troubleshooting and bug fixing",
      "Feature enhancements and usability improvements",
      "Integration maintenance",
      "Dependency and framework updates",
      "Documentation and handover support",
    ],
    approach:
      "I reproduce the issue, assess its effect on the work, make the smallest safe fix, and document it.",
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
      "I focus on custom applications, internal business tools, integrations, automation, technical planning, and improvements to existing software. Send a short summary or book a call to check whether your project is a good fit.",
  },
  {
    question: "Can you improve an application that already exists?",
    answer:
      "Yes. I can investigate bugs, improve a process or interface, add features, update dependencies, and make an existing application easier to maintain without assuming it needs to be rebuilt.",
  },
  {
    question: "Can you connect with the tools we already use?",
    answer:
      "Yes. I have built API integrations across CRM, inventory, ERP, marketplace, and support platforms, including Zoho, Salesforce, and Mirakl.",
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
      "Send a short summary of the current situation, the result you need, and any constraints. I’ll recommend whether to start with discovery, an audit, or a scoped build.",
  },
];
