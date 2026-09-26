import type { IconName } from "@/components/ui/icon";

export type ServiceCategory = "development" | "automation";

export type Service = {
  slug: string;
  category: ServiceCategory;
  name: string;
  icon: IconName;
  /** One-line summary used on cards and in navigation. */
  short: string;
  seo: { title: string; description: string };
  /** `*text*` renders as the italic serif accent. */
  headline: string;
  lead: string;
  problems: string[];
  deliverables: { title: string; body: string; icon: IconName }[];
  outcomes: { title: string; body: string }[];
  stack: string[];
  faqs: { q: string; a: string }[];
  relatedSolutions: string[];
  relatedPosts: string[];
};

export const serviceCategories: Record<ServiceCategory, { label: string; title: string; description: string }> = {
  development: {
    label: "Development",
    title: "Websites, apps & products",
    description:
      "Fast, conversion-focused websites and custom software built on the same modern stack used by the world's best product teams.",
  },
  automation: {
    label: "Automation",
    title: "Workflows, AI & integrations",
    description:
      "Automations, AI agents and integrations that take repetitive work off your team's plate and keep your tools in sync.",
  },
};

export const services: Service[] = [
  {
    slug: "website-development",
    category: "development",
    name: "Websites & Landing Pages",
    icon: "layout",
    short: "Fast, SEO-ready websites engineered to turn visitors into leads.",
    seo: {
      title: "Website Development Services: Fast Websites That Convert",
      description:
        "Custom website development on Next.js. Fast, SEO-optimized websites and landing pages designed to turn visitors into leads. Book a free strategy call.",
    },
    headline: "Websites that load fast, rank well and *sell for you*.",
    lead: "Your website is either your hardest-working salesperson or your most expensive brochure. We design and develop custom websites on a modern stack that load instantly, rank in search and guide every visitor toward getting in touch.",
    problems: [
      "Your site looks dated, and it's quietly costing you credibility.",
      "Traffic arrives, but very few visitors ever get in touch.",
      "Pages crawl on mobile, and visitors leave before they load.",
      "Every small change means waiting on a developer.",
    ],
    deliverables: [
      {
        title: "Conversion-focused UX & design",
        body: "Page structure, messaging and calls-to-action designed around how your buyers actually decide.",
        icon: "pen",
      },
      {
        title: "Custom Next.js development",
        body: "Hand-built, component-based code. No bloated page builders and no theme lock-in.",
        icon: "code",
      },
      {
        title: "Technical SEO foundations",
        body: "Semantic markup, structured data, sitemaps, metadata and Core Web Vitals tuned from day one.",
        icon: "search",
      },
      {
        title: "Headless CMS",
        body: "Update pages, blog posts and case studies yourself without touching a line of code.",
        icon: "file",
      },
      {
        title: "Analytics & conversion tracking",
        body: "Form fills, bookings and key events tracked, so you know exactly what's working.",
        icon: "chart",
      },
      {
        title: "Forms, bookings & CRM hookups",
        body: "Every lead lands in your CRM, inbox or Slack instantly, so nothing slips through the cracks.",
        icon: "plug",
      },
    ],
    outcomes: [
      {
        title: "Built for speed",
        body: "Lightweight pages that load fast on any device, because every second of waiting costs you visitors.",
      },
      {
        title: "Designed to convert",
        body: "Clear messaging, social proof and frictionless calls-to-action on every page.",
      },
      {
        title: "Easy to grow",
        body: "A component system and CMS that make new pages and campaigns quick to launch.",
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Headless CMS", "Vercel", "GSAP"],
    faqs: [
      {
        q: "How long does a website project take?",
        a: "Most marketing websites take a few weeks from kickoff to launch. The exact timeline depends on the number of pages, how ready your content is and which integrations you need. Your proposal includes a clear schedule with milestones.",
      },
      {
        q: "Can I update the website myself?",
        a: "Yes. We connect your site to a headless CMS so you can edit text, images, pages and blog posts through a friendly editor, with no code and no developer required.",
      },
      {
        q: "Do you write the copy?",
        a: "We can. We'll help you sharpen your positioning and write conversion-focused copy, or refine the content you already have so it's clear, persuasive and search-friendly.",
      },
      {
        q: "Will my website rank on Google?",
        a: "No one can honestly guarantee rankings. What we do guarantee is that your site ships with the technical SEO foundations search engines reward: fast load times, clean semantic markup, structured data, metadata and a sitemap. From there, great content and authority do the heavy lifting, and we can help with both.",
      },
      {
        q: "Do you handle hosting and maintenance?",
        a: "Yes. We deploy on modern, globally distributed infrastructure and offer optional care plans for updates, monitoring and ongoing improvements.",
      },
    ],
    relatedSolutions: ["lead-follow-up-automation", "automated-reporting"],
    relatedPosts: ["website-conversion-principles"],
  },
  {
    slug: "web-app-development",
    category: "development",
    name: "Web Apps & SaaS",
    icon: "app",
    short: "Custom web apps, portals and SaaS products, from MVP to scale.",
    seo: {
      title: "Custom Web App & SaaS Development Services",
      description:
        "We design and build custom web applications, client portals, internal tools and SaaS MVPs with Next.js, React and Node.js. Get a fixed-price proposal.",
    },
    headline: "From idea to *production-ready* product.",
    lead: "Whether it's a customer portal, an internal tool or your next SaaS product, we design and build secure, scalable web applications on the stack modern products run on, and ship a first version fast.",
    problems: [
      "You're running critical operations on spreadsheets that keep breaking.",
      "Off-the-shelf tools almost fit, but never quite.",
      "You have a product idea and need a technical partner to ship it.",
      "Your current app is slow, brittle or painful to change.",
    ],
    deliverables: [
      {
        title: "Product discovery & scoping",
        body: "We turn your idea into a clear, prioritized scope so you launch the right thing first.",
        icon: "compass",
      },
      {
        title: "UX/UI design for apps",
        body: "Clean, intuitive interfaces and user flows, prototyped and validated before we write code.",
        icon: "pen",
      },
      {
        title: "Full-stack development",
        body: "Next.js and React front-ends, Node.js or Python back-ends, and robust, documented APIs.",
        icon: "code",
      },
      {
        title: "Auth, roles & payments",
        body: "Secure sign-in, team permissions and Stripe subscriptions or one-off payments.",
        icon: "lock",
      },
      {
        title: "Databases & infrastructure",
        body: "PostgreSQL, Supabase and cloud infrastructure designed for reliability and growth.",
        icon: "database",
      },
      {
        title: "Dashboards & admin panels",
        body: "Give your team the controls, reports and insight they need to run the product.",
        icon: "chart",
      },
    ],
    outcomes: [
      {
        title: "Launch sooner",
        body: "A focused first version in users' hands quickly, then iterate on real feedback.",
      },
      {
        title: "Built to scale",
        body: "Clean architecture and modern infrastructure that grow with your users.",
      },
      {
        title: "Yours, completely",
        body: "Full ownership of the code, data and accounts. No lock-in, ever.",
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Supabase", "Stripe", "AWS", "Vercel"],
    faqs: [
      {
        q: "How much does a custom web app cost?",
        a: "It depends on scope. After a discovery call, we send a fixed-price proposal for a clearly defined first version (your MVP), so you know exactly what you're getting and what it costs before any work begins.",
      },
      {
        q: "Who owns the code?",
        a: "You do. You get full ownership of the source code, repositories, infrastructure and accounts from day one.",
      },
      {
        q: "Can you work on our existing app?",
        a: "Yes. We start with a short technical audit to understand the codebase, then recommend whether to improve, extend or rebuild parts of it, with honest trade-offs.",
      },
      {
        q: "Can you add AI features to our product?",
        a: "Absolutely. From AI-powered search and chat to document processing and smart automations, we integrate leading AI models directly into your product.",
      },
      {
        q: "What happens after launch?",
        a: "We offer ongoing development retainers for new features, improvements and maintenance, or a clean handover with documentation if your own team takes over.",
      },
    ],
    relatedSolutions: ["ai-customer-support", "automated-reporting"],
    relatedPosts: ["business-processes-to-automate"],
  },
  {
    slug: "workflow-automation",
    category: "automation",
    name: "Workflow Automation",
    icon: "workflow",
    short: "Automate the repetitive work that eats your team's week.",
    seo: {
      title: "Workflow & Business Process Automation Services",
      description:
        "Business process automation with n8n, Make, Zapier and custom code. Automate lead handling, onboarding, invoicing and reporting. Book a free automation audit.",
    },
    headline: "Put your busywork on *autopilot*.",
    lead: "Copying data between tools, chasing follow-ups, building the same report every Monday: it adds up to hours every week. We map your processes and build reliable automations that handle the repetitive work, so your team can focus on work that grows the business.",
    problems: [
      "Your team copies data between apps by hand, every day.",
      "Leads and follow-ups slip through the cracks.",
      "Reporting eats hours that should go to real work.",
      "Your tools don't talk to each other, so people fill the gaps.",
    ],
    deliverables: [
      {
        title: "Process audit & automation roadmap",
        body: "We map how work actually flows today and prioritize automations by time saved and impact.",
        icon: "compass",
      },
      {
        title: "Workflow design & build",
        body: "Robust automations in n8n, Make, Zapier or custom code, whichever fits your needs and budget.",
        icon: "workflow",
      },
      {
        title: "CRM & sales automation",
        body: "Lead capture, enrichment, routing, follow-ups and pipeline updates, handled automatically.",
        icon: "target",
      },
      {
        title: "Operations & finance automation",
        body: "Onboarding, invoicing, approvals, reminders and document generation on autopilot.",
        icon: "receipt",
      },
      {
        title: "Error handling & monitoring",
        body: "Alerts, retries and logs keep automations running, and tell you when something needs attention.",
        icon: "shield",
      },
      {
        title: "Documentation & training",
        body: "Clear docs and walkthroughs so your team understands and trusts every workflow.",
        icon: "book",
      },
    ],
    outcomes: [
      {
        title: "Hours back every week",
        body: "Repetitive tasks run in seconds, without anyone lifting a finger.",
      },
      {
        title: "Fewer mistakes",
        body: "Automations don't mistype, forget or skip steps on a busy Friday.",
      },
      {
        title: "Scale without hiring",
        body: "Handle more leads, clients and orders without adding admin headcount.",
      },
    ],
    stack: [
      "n8n",
      "Make",
      "Zapier",
      "HubSpot",
      "Airtable",
      "Google Workspace",
      "Slack",
      "Notion",
      "Stripe",
      "Webhooks",
    ],
    faqs: [
      {
        q: "What kinds of processes can you automate?",
        a: "Anything repetitive, rules-based and digital: lead handling, client onboarding, invoicing, data entry, reporting, scheduling, notifications, document generation and syncing data between tools. If your team does it the same way every time, it's a candidate.",
      },
      {
        q: "Should we use Zapier, Make, n8n or custom code?",
        a: "It depends on volume, complexity, budget and who will maintain it. We'll recommend the most reliable, cost-effective option for your situation. Our guide on choosing an automation stack walks through the trade-offs.",
      },
      {
        q: "What happens if an automation breaks?",
        a: "We build in error handling, retries and alerts, so failures are caught and surfaced immediately instead of silently dropping data. Our care plans include monitoring and fixes.",
      },
      {
        q: "Do we need to change the tools we already use?",
        a: "Usually not. We automate around your existing stack whenever possible, and only recommend new tools when they clearly pay for themselves.",
      },
      {
        q: "How quickly will we see results?",
        a: "We prioritize quick wins, so your first automations typically go live early in the engagement, and you start saving time while bigger workflows are still being built.",
      },
    ],
    relatedSolutions: ["lead-follow-up-automation", "client-onboarding-automation", "invoice-payment-automation"],
    relatedPosts: ["business-processes-to-automate", "zapier-vs-make-vs-n8n"],
  },
  {
    slug: "ai-automation",
    category: "automation",
    name: "AI Agents & Assistants",
    icon: "sparkles",
    short: "Practical AI agents that qualify leads, answer questions and process documents.",
    seo: {
      title: "AI Automation Agency: Custom AI Agents & Assistants",
      description:
        "Custom AI agents and assistants built on leading models, grounded in your data and connected to your tools. Automate support, lead qualification and document processing.",
    },
    headline: "AI that does real work, *not just demos*.",
    lead: "We build practical AI systems on top of leading models from OpenAI, Anthropic and others. They're grounded in your data and wired into your tools, so they can answer, qualify, summarize and act, with guardrails you control.",
    problems: [
      "Your team answers the same questions all day, every day.",
      "Documents and emails pile up waiting for someone to process them.",
      "You know AI could help, but not where it would actually pay off.",
      "You tried an AI tool, but it didn't understand your business.",
    ],
    deliverables: [
      {
        title: "AI opportunity assessment",
        body: "We identify where AI will create real value in your business, and where it won't.",
        icon: "compass",
      },
      {
        title: "Custom assistants & chatbots",
        body: "Grounded in your knowledge base to answer customers and staff accurately, with human handoff.",
        icon: "chat",
      },
      {
        title: "AI lead qualification",
        body: "Score, enrich and route inbound leads, and draft personalized replies for approval.",
        icon: "target",
      },
      {
        title: "Document & email processing",
        body: "Extract data from invoices, forms and emails, and push it straight into your systems.",
        icon: "file",
      },
      {
        title: "Knowledge bases (RAG)",
        body: "Search and chat across your documents, SOPs and data, with sources cited.",
        icon: "database",
      },
      {
        title: "Guardrails & human-in-the-loop",
        body: "Approval steps, logging and evaluation keep AI accurate, safe and accountable.",
        icon: "shield",
      },
    ],
    outcomes: [
      {
        title: "Instant answers, 24/7",
        body: "Customers and staff get accurate answers in seconds, at any hour.",
      },
      {
        title: "Less manual processing",
        body: "AI handles the reading, extracting and drafting. Your team reviews and decides.",
      },
      {
        title: "AI you can trust",
        body: "Grounded answers, cited sources and clear escalation paths.",
      },
    ],
    stack: ["OpenAI", "Anthropic Claude", "Vector search", "pgvector", "n8n", "Python", "TypeScript"],
    faqs: [
      {
        q: "Is our data safe?",
        a: "We design with privacy first: we use AI providers' business APIs, which by default don't use your data to train their models. We restrict access to only what each workflow needs and can keep sensitive data inside your own infrastructure.",
      },
      {
        q: "Will AI replace my team?",
        a: "Our goal is the opposite: take repetitive work off your team's plate so they can focus on relationships, judgment and growth. The best systems pair AI speed with human oversight.",
      },
      {
        q: "How do you prevent wrong answers?",
        a: "We ground responses in your approved content, cite sources, set confidence thresholds, and route anything uncertain to a human. Every assistant is tested against real questions before launch.",
      },
      {
        q: "Which AI models do you use?",
        a: "We're model-agnostic. We pick the best model for each task based on accuracy, speed and cost, and design systems so models can be swapped as the technology improves.",
      },
    ],
    relatedSolutions: ["ai-customer-support", "document-processing-automation", "lead-follow-up-automation"],
    relatedPosts: ["business-processes-to-automate"],
  },
  {
    slug: "api-integrations",
    category: "automation",
    name: "Integrations & APIs",
    icon: "plug",
    short: "Connect your tools so data flows automatically. No more copy-paste.",
    seo: {
      title: "API Integration Services: Connect Your Business Tools",
      description:
        "Custom API integrations, webhooks and data pipelines that keep your CRM, billing, e-commerce and project tools in sync. Stop copy-pasting between apps.",
    },
    headline: "Make your tools *talk to each other*.",
    lead: "When your CRM, website, billing and project tools don't share data, your team becomes the integration. We build reliable integrations, custom APIs and data pipelines that keep everything in sync, automatically.",
    problems: [
      "Customer data lives in five different places.",
      "The numbers never match from one tool to the next.",
      "An app you rely on has no native integration.",
      "Your reporting depends on manual exports and spreadsheets.",
    ],
    deliverables: [
      {
        title: "System integrations",
        body: "Two-way syncs between CRMs, billing, e-commerce, support and project management tools.",
        icon: "plug",
      },
      {
        title: "Custom APIs & webhooks",
        body: "Well-documented APIs and webhook handlers that connect anything with an endpoint.",
        icon: "code",
      },
      {
        title: "Data pipelines & ETL",
        body: "Move, clean and transform data between systems on a schedule or in real time.",
        icon: "workflow",
      },
      {
        title: "Reporting dashboards",
        body: "Live dashboards that combine data from all your tools in one place.",
        icon: "chart",
      },
      {
        title: "Legacy system connectors",
        body: "Bridge older software, spreadsheets and databases into your modern stack.",
        icon: "database",
      },
      {
        title: "Monitoring & reliability",
        body: "Retries, alerts and logs keep integrations working as your business grows.",
        icon: "shield",
      },
    ],
    outcomes: [
      {
        title: "One source of truth",
        body: "Every tool shows the same, up-to-date customer and financial data.",
      },
      {
        title: "Real-time operations",
        body: "Changes flow instantly between systems, with no overnight exports.",
      },
      {
        title: "Room to grow",
        body: "Add new tools without rebuilding your workflows from scratch.",
      },
    ],
    stack: [
      "REST",
      "GraphQL",
      "Webhooks",
      "Node.js",
      "Python",
      "PostgreSQL",
      "HubSpot",
      "Stripe",
      "Shopify",
      "QuickBooks",
    ],
    faqs: [
      {
        q: "What if an app we use doesn't have an API?",
        a: "There's almost always a way: webhooks, scheduled exports, email parsing, direct database access or, as a last resort, browser automation. We'll recommend the most reliable option for your situation.",
      },
      {
        q: "Can you build an API for our own product?",
        a: "Yes. We design and build secure, well-documented REST or GraphQL APIs, including authentication, rate limiting and developer documentation.",
      },
      {
        q: "How do you handle security?",
        a: "We follow least-privilege access, store credentials in encrypted secret managers, validate every payload and log activity, so your data stays protected in transit and at rest.",
      },
      {
        q: "Who maintains the integrations?",
        a: "We can, through an ongoing care plan with monitoring and updates when third-party APIs change. Or we hand over documented code your team can own.",
      },
    ],
    relatedSolutions: ["automated-reporting", "invoice-payment-automation"],
    relatedPosts: ["zapier-vs-make-vs-n8n"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function servicesByCategory(category: ServiceCategory) {
  return services.filter((s) => s.category === category);
}
