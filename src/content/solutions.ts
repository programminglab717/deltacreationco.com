import type { IconName } from "@/components/ui/icon";

export type WorkflowStep = {
  title: string;
  detail: string;
  icon: IconName;
  /** Tool or system the step runs in, shown as a tag. */
  tool: string;
  /** Simulated run time for the live demo, in milliseconds. */
  ms: number;
};

export type Solution = {
  slug: string;
  name: string;
  icon: IconName;
  short: string;
  seo: { title: string; description: string };
  headline: string;
  problem: string;
  trigger: string;
  steps: WorkflowStep[];
  /** Rough manual effort for the same work, used in the live demo comparison. */
  manualMinutes: number;
  outcomes: string[];
  included: string[];
  tools: string[];
  faqs: { q: string; a: string }[];
  services: string[];
};

export const solutions: Solution[] = [
  {
    slug: "lead-follow-up-automation",
    name: "Instant Lead Follow-Up",
    icon: "zap",
    short: "Respond to every new lead in seconds: enriched, scored and routed to the right person.",
    seo: {
      title: "Lead Follow-Up Automation: Respond to Every Lead in Seconds",
      description:
        "Automate lead capture, enrichment, AI scoring, CRM updates and personalized follow-up so no lead goes cold. See how the workflow runs.",
    },
    headline: "Never let a hot lead *go cold* again.",
    problem:
      "Leads cool off while they wait. When follow-up depends on someone checking an inbox, response times stretch from minutes to days, and buyers move on to whoever answered first.",
    trigger: "New lead",
    steps: [
      {
        title: "Lead captured",
        detail: "A visitor submits your website form or books a call.",
        icon: "inbox",
        tool: "Website",
        ms: 420,
      },
      {
        title: "Lead enriched",
        detail: "Company size, industry and website pulled in automatically.",
        icon: "search",
        tool: "Enrichment API",
        ms: 780,
      },
      {
        title: "AI qualification",
        detail: "Scored against your ideal customer profile, with a short summary.",
        icon: "sparkles",
        tool: "AI model",
        ms: 1100,
      },
      {
        title: "CRM updated",
        detail: "Contact and deal created with full context and source tracking.",
        icon: "database",
        tool: "CRM",
        ms: 520,
      },
      {
        title: "Right person alerted",
        detail: "Owner notified in Slack with a one-click reply.",
        icon: "bell",
        tool: "Slack",
        ms: 380,
      },
      {
        title: "Personal follow-up sent",
        detail: "A tailored email goes out immediately, with a booking link.",
        icon: "send",
        tool: "Email",
        ms: 640,
      },
    ],
    manualMinutes: 25,
    outcomes: [
      "Every lead gets a response in under a minute, day or night",
      "No more leads lost in a shared inbox",
      "Sales conversations start with full context",
      "Clean, complete CRM data without manual entry",
    ],
    included: [
      "Form, booking and ad lead capture",
      "Data enrichment and deduplication",
      "AI lead scoring and summaries",
      "CRM contact, deal and task creation",
      "Slack or email alerts with routing rules",
      "Personalized follow-up emails and sequences",
    ],
    tools: ["HubSpot", "Pipedrive", "Salesforce", "Slack", "Gmail", "Outlook", "OpenAI", "Claude"],
    faqs: [
      {
        q: "Will follow-ups feel automated?",
        a: "No. Messages are written in your voice, personalized with what the lead told you, and can be sent from a real team member's inbox. You can also require approval before anything is sent.",
      },
      {
        q: "Which CRMs does this work with?",
        a: "Any CRM with an API, including HubSpot, Pipedrive, Salesforce, Zoho, Close and Airtable-based pipelines.",
      },
    ],
    services: ["workflow-automation", "ai-automation"],
  },
  {
    slug: "client-onboarding-automation",
    name: "Client Onboarding on Autopilot",
    icon: "rocket",
    short: "From signed contract to kickoff call, without a single manual step.",
    seo: {
      title: "Client Onboarding Automation for Agencies & Service Businesses",
      description:
        "Automate contracts, invoices, workspace setup, welcome emails and kickoff scheduling. Deliver a consistent, professional onboarding for every client.",
    },
    headline: "A flawless first week for *every* client.",
    problem:
      "Every new client triggers the same checklist: send the contract, raise the invoice, create folders, add them to tools and schedule the kickoff. Done by hand, it's slow, inconsistent and easy to get wrong.",
    trigger: "Contract signed",
    steps: [
      {
        title: "Contract signed",
        detail: "E-signature completed by the client.",
        icon: "pen",
        tool: "E-sign",
        ms: 400,
      },
      {
        title: "Invoice sent",
        detail: "First invoice created with a secure payment link.",
        icon: "receipt",
        tool: "Stripe",
        ms: 700,
      },
      {
        title: "Workspace created",
        detail: "Folders, project board and shared channel set up from templates.",
        icon: "folder",
        tool: "Drive + PM tool",
        ms: 1200,
      },
      {
        title: "Welcome email",
        detail: "Personal welcome with next steps and portal access.",
        icon: "send",
        tool: "Email",
        ms: 500,
      },
      {
        title: "Kickoff scheduled",
        detail: "Client picks a kickoff time from your live calendar.",
        icon: "calendar",
        tool: "Calendar",
        ms: 600,
      },
      {
        title: "Team briefed",
        detail: "Account team notified with the full client brief.",
        icon: "bell",
        tool: "Slack",
        ms: 350,
      },
    ],
    manualMinutes: 90,
    outcomes: [
      "Hours of admin per client reduced to minutes",
      "A consistent, professional first impression",
      "No forgotten steps, even in your busiest weeks",
      "Faster time from signature to kickoff",
    ],
    included: [
      "E-signature and payment triggers",
      "Invoice and payment link generation",
      "Templated folder and project setup",
      "Welcome sequences and portal invites",
      "Kickoff scheduling",
      "Internal handoff notifications",
    ],
    tools: ["DocuSign", "PandaDoc", "Stripe", "Google Drive", "Notion", "ClickUp", "Asana", "Slack"],
    faqs: [
      {
        q: "Can onboarding differ by service or package?",
        a: "Yes. Workflows branch by package, service line or client type, so each client gets the right documents, tasks and team.",
      },
      {
        q: "What if a client doesn't pay the first invoice?",
        a: "The workflow can pause setup until payment clears and send polite, automatic reminders in the meantime.",
      },
    ],
    services: ["workflow-automation", "api-integrations"],
  },
  {
    slug: "invoice-payment-automation",
    name: "Invoicing & Payment Reminders",
    icon: "receipt",
    short: "Invoices out on time, reminders sent automatically and payments reconciled.",
    seo: {
      title: "Invoice Automation: Automatic Invoices, Reminders & Reconciliation",
      description:
        "Automate invoice creation, payment reminders and reconciliation with your accounting software. Get paid faster with less admin.",
    },
    headline: "Get paid faster, *without chasing*.",
    problem:
      "Invoicing late, forgetting reminders and matching payments by hand slows your cash flow and eats hours of admin time every month.",
    trigger: "Milestone reached",
    steps: [
      {
        title: "Milestone reached",
        detail: "Project milestone completed or billing date arrives.",
        icon: "flag",
        tool: "PM tool",
        ms: 400,
      },
      {
        title: "Invoice generated",
        detail: "Line items, taxes and terms filled in automatically.",
        icon: "receipt",
        tool: "Accounting",
        ms: 900,
      },
      {
        title: "Sent with pay link",
        detail: "Invoice emailed with a one-click payment link.",
        icon: "send",
        tool: "Stripe",
        ms: 500,
      },
      {
        title: "Smart reminders",
        detail: "Polite reminders before and after the due date.",
        icon: "bell",
        tool: "Email",
        ms: 450,
      },
      {
        title: "Payment reconciled",
        detail: "Payment matched to the invoice and marked paid.",
        icon: "check",
        tool: "Accounting",
        ms: 800,
      },
      {
        title: "Team updated",
        detail: "Finance dashboard and project status refreshed.",
        icon: "chart",
        tool: "Dashboard",
        ms: 350,
      },
    ],
    manualMinutes: 40,
    outcomes: [
      "Invoices go out the moment work is done",
      "Consistent reminders without awkward chasing",
      "Payments reconciled automatically",
      "Real-time view of what's owed and paid",
    ],
    included: [
      "Invoice generation from projects or schedules",
      "Payment links and card or bank payments",
      "Reminder sequences before and after due dates",
      "Automatic reconciliation",
      "Accounting software sync",
      "Cash flow dashboards",
    ],
    tools: ["Stripe", "QuickBooks", "Xero", "FreshBooks", "Gmail", "Slack"],
    faqs: [
      {
        q: "Will reminders annoy our clients?",
        a: "Reminders are friendly, well-timed and fully customizable. You can pause them for any client with a single click.",
      },
      {
        q: "Does it work with our accounting software?",
        a: "We integrate with QuickBooks, Xero, FreshBooks and most platforms that offer an API.",
      },
    ],
    services: ["workflow-automation", "api-integrations"],
  },
  {
    slug: "ai-customer-support",
    name: "AI Support Assistant",
    icon: "chat",
    short: "Answer common questions instantly, 24/7, with seamless handoff to your team.",
    seo: {
      title: "AI Customer Support Assistant Trained on Your Business",
      description:
        "An AI support assistant that answers customer questions from your knowledge base, cites sources and hands complex issues to your team with full context.",
    },
    headline: "Instant answers, *around the clock*.",
    problem:
      "Your team answers the same questions every day, while customers wait hours for replies that could take seconds. Hiring more support staff doesn't scale.",
    trigger: "Customer question",
    steps: [
      {
        title: "Question received",
        detail: "A customer asks via chat, email or your help center.",
        icon: "chat",
        tool: "Chat widget",
        ms: 380,
      },
      {
        title: "Knowledge searched",
        detail: "The assistant finds relevant answers in your docs and policies.",
        icon: "search",
        tool: "Knowledge base",
        ms: 900,
      },
      {
        title: "Answer drafted",
        detail: "A clear, on-brand reply with the source cited.",
        icon: "sparkles",
        tool: "AI model",
        ms: 1300,
      },
      {
        title: "Confidence check",
        detail: "Uncertain or sensitive? It goes to a human instead.",
        icon: "shield",
        tool: "Guardrails",
        ms: 300,
      },
      {
        title: "Reply or handoff",
        detail: "Answered instantly, or escalated with full context.",
        icon: "send",
        tool: "Helpdesk",
        ms: 450,
      },
      {
        title: "Gaps logged",
        detail: "Unanswered questions logged to improve your docs.",
        icon: "book",
        tool: "Analytics",
        ms: 320,
      },
    ],
    manualMinutes: 12,
    outcomes: [
      "Customers get accurate answers in seconds",
      "Your team focuses on complex, high-value conversations",
      "Consistent answers aligned with your policies",
      "Clear insight into what customers ask most",
    ],
    included: [
      "Knowledge base ingestion and indexing",
      "Chat widget, email or helpdesk integration",
      "Source citations and confidence thresholds",
      "Human handoff with conversation context",
      "Tone and policy guardrails",
      "Analytics and continuous improvement",
    ],
    tools: ["OpenAI", "Claude", "Intercom", "Zendesk", "Help Scout", "Crisp", "Notion", "Google Drive"],
    faqs: [
      {
        q: "What happens when the AI doesn't know the answer?",
        a: "It says so and hands the conversation to your team with the full context, instead of guessing.",
      },
      {
        q: "How long does it take to train?",
        a: "There's no lengthy training. We connect your existing documentation, test against real customer questions, and refine before launch.",
      },
    ],
    services: ["ai-automation", "web-app-development"],
  },
  {
    slug: "automated-reporting",
    name: "Automated Reporting & Dashboards",
    icon: "chart",
    short: "Numbers from every tool in one live dashboard, plus a weekly summary in your inbox.",
    seo: {
      title: "Automated Reporting & KPI Dashboards for Growing Businesses",
      description:
        "Stop building reports by hand. Pull data from your CRM, ads, finance and ops tools into live dashboards with automated weekly summaries.",
    },
    headline: "Your numbers, *always up to date*.",
    problem:
      "Someone spends every Monday exporting spreadsheets, copying numbers and formatting slides, and by the time the report is ready, the data is already stale.",
    trigger: "Every Monday 8:00",
    steps: [
      {
        title: "Schedule fires",
        detail: "Runs every morning, or the moment new data lands.",
        icon: "clock",
        tool: "Scheduler",
        ms: 300,
      },
      {
        title: "Data collected",
        detail: "Pulled from CRM, ads, analytics and finance tools.",
        icon: "database",
        tool: "APIs",
        ms: 1400,
      },
      {
        title: "Cleaned & combined",
        detail: "Deduplicated, normalized and joined into one model.",
        icon: "workflow",
        tool: "Pipeline",
        ms: 900,
      },
      {
        title: "Dashboard refreshed",
        detail: "Live KPIs updated for the whole team.",
        icon: "chart",
        tool: "Dashboard",
        ms: 500,
      },
      {
        title: "AI summary written",
        detail: "What changed, what's trending and what needs attention.",
        icon: "sparkles",
        tool: "AI model",
        ms: 1100,
      },
      {
        title: "Delivered",
        detail: "Summary posted to Slack and emailed to stakeholders.",
        icon: "send",
        tool: "Slack + Email",
        ms: 400,
      },
    ],
    manualMinutes: 180,
    outcomes: [
      "No more manual report building",
      "Everyone works from the same, current numbers",
      "Spot problems and opportunities early",
      "Leadership updates delivered automatically",
    ],
    included: [
      "Data source connections and API integrations",
      "Data cleaning and transformation",
      "Live KPI dashboards",
      "Scheduled summaries by Slack or email",
      "AI-written insights and anomaly alerts",
      "Access controls by team or role",
    ],
    tools: ["Google Analytics", "HubSpot", "Stripe", "QuickBooks", "Meta Ads", "Google Ads", "Looker Studio", "Slack"],
    faqs: [
      {
        q: "Which tools can you pull data from?",
        a: "Most modern tools with an API or export, including CRMs, ad platforms, analytics, e-commerce, billing and accounting software.",
      },
      {
        q: "Where does the dashboard live?",
        a: "Wherever suits you: a BI tool like Looker Studio, a custom dashboard inside your own app, or a shared workspace your team already uses.",
      },
    ],
    services: ["api-integrations", "workflow-automation"],
  },
  {
    slug: "document-processing-automation",
    name: "AI Document Processing",
    icon: "file",
    short: "Extract data from invoices, forms and PDFs straight into your systems.",
    seo: {
      title: "AI Document Processing: Extract Data from PDFs & Invoices",
      description:
        "Use AI to read invoices, forms, contracts and PDFs, extract the key fields, validate them and push clean data into your accounting, CRM or database.",
    },
    headline: "Stop retyping *what's already written*.",
    problem:
      "Invoices, applications, orders and contracts arrive as PDFs and emails, and someone has to read each one and type the details into another system.",
    trigger: "Document received",
    steps: [
      {
        title: "Document received",
        detail: "Arrives by email, upload or shared folder.",
        icon: "inbox",
        tool: "Inbox",
        ms: 350,
      },
      {
        title: "Fields extracted",
        detail: "AI reads the document and pulls out the key data.",
        icon: "sparkles",
        tool: "AI model",
        ms: 1500,
      },
      {
        title: "Data validated",
        detail: "Checked against business rules and existing records.",
        icon: "shield",
        tool: "Rules",
        ms: 600,
      },
      {
        title: "Human review if needed",
        detail: "Low-confidence fields flagged for a quick check.",
        icon: "user",
        tool: "Review queue",
        ms: 400,
      },
      {
        title: "Systems updated",
        detail: "Clean data pushed into accounting, CRM or your database.",
        icon: "database",
        tool: "Your systems",
        ms: 700,
      },
      {
        title: "File organized",
        detail: "Renamed, tagged and archived in the right folder.",
        icon: "folder",
        tool: "Storage",
        ms: 300,
      },
    ],
    manualMinutes: 10,
    outcomes: [
      "Documents processed in seconds, not minutes",
      "Fewer data-entry errors",
      "A searchable, organized archive",
      "Your team reviews exceptions instead of typing",
    ],
    included: [
      "Email, upload and folder intake",
      "AI extraction tuned to your documents",
      "Validation rules and duplicate detection",
      "Human review queue for edge cases",
      "Push to accounting, CRM or database",
      "Automatic filing and naming",
    ],
    tools: ["OpenAI", "Claude", "Google Drive", "Dropbox", "QuickBooks", "Xero", "Airtable", "PostgreSQL"],
    faqs: [
      {
        q: "What types of documents can it handle?",
        a: "Invoices, receipts, purchase orders, applications, contracts, forms and most other structured or semi-structured documents, including scans.",
      },
      {
        q: "How accurate is it?",
        a: "Accuracy depends on document quality and consistency. We measure it on your real documents before launch and route low-confidence results to human review, so errors don't slip into your systems.",
      },
    ],
    services: ["ai-automation", "api-integrations"],
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
