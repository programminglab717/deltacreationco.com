import type { IconName } from "@/components/ui/icon";

export const processSteps = [
  {
    title: "Discovery call",
    body: "A free 30-minute call to understand your goals, your current setup and what success looks like. You'll leave with useful ideas, even if we never work together.",
    points: ["Goals & constraints", "Quick-win ideas", "Honest fit check"],
  },
  {
    title: "Strategy & proposal",
    body: "We map the solution, define the scope and send a clear, fixed-price proposal with timeline and milestones. No vague estimates, no surprise invoices.",
    points: ["Solution map", "Fixed-price scope", "Timeline & milestones"],
  },
  {
    title: "Design & build",
    body: "We design, build and share progress in regular demos. You see real, working software early and often, never a black box.",
    points: ["Regular demos", "Shared project board", "Feedback built in"],
  },
  {
    title: "Launch",
    body: "We test thoroughly, deploy, migrate data where needed and train your team. Launch day is calm, not chaotic.",
    points: ["QA & testing", "Deployment", "Team training"],
  },
  {
    title: "Optimize & support",
    body: "We monitor, measure and improve. Ongoing care plans keep your website and automations fast, secure and working as you grow.",
    points: ["Monitoring", "Improvements", "Priority support"],
  },
];

export const principles: { title: string; body: string; icon: IconName }[] = [
  {
    title: "Fixed scope, clear pricing",
    body: "Detailed proposals with fixed prices for a defined scope. You'll know the investment before we start.",
    icon: "receipt",
  },
  {
    title: "Progress you can see",
    body: "Regular demos and a shared project board. You always know exactly where things stand.",
    icon: "eye",
  },
  {
    title: "You own everything",
    body: "Code, accounts, data and automations belong to you. No lock-in, ever.",
    icon: "key",
  },
  {
    title: "Performance by default",
    body: "Fast, accessible, SEO-ready builds, because speed is a feature your customers can feel.",
    icon: "gauge",
  },
  {
    title: "Automation-first thinking",
    body: "We look for the manual work around every project, then eliminate it.",
    icon: "workflow",
  },
  {
    title: "Built to last",
    body: "Clean code, documentation and monitoring, so what we build keeps working long after launch.",
    icon: "shield",
  },
];

export const homeFaqs = [
  {
    q: "What does Delta Creation Co. do?",
    a: "We're a development and automation studio. We build websites, web apps and SaaS products, and we automate business processes with workflow tools and AI, so companies can grow without drowning in busywork.",
  },
  {
    q: "Who do you work with?",
    a: "Founders, small and mid-sized businesses, agencies and service companies that want a modern web presence and fewer manual processes. If you're growing and your systems aren't keeping up, we should talk.",
  },
  {
    q: "How much does a project cost?",
    a: "Every project is scoped individually. After a free discovery call, we send a fixed-price proposal for a clearly defined scope, so you know the investment before we start. We offer both project-based pricing and monthly retainers.",
  },
  {
    q: "How long does a project take?",
    a: "Focused automations can go live in days. Marketing websites typically take a few weeks, and custom apps or SaaS MVPs take longer depending on scope. Every proposal includes a clear timeline with milestones.",
  },
  {
    q: "Do you work with clients remotely?",
    a: "Yes. We work with clients across time zones using video calls, shared project boards and clear async updates, so collaboration feels effortless wherever you are.",
  },
  {
    q: "Which tools and technologies do you use?",
    a: "Next.js, React, TypeScript and Node.js for development; n8n, Make, Zapier and custom code for automation; and leading AI models from OpenAI and Anthropic. We choose tools based on what's best for your business, not what's trendy.",
  },
  {
    q: "Do you offer support after launch?",
    a: "Yes. We offer care plans for monitoring, updates and continuous improvement, and we're always here when you're ready for the next feature or automation.",
  },
  {
    q: "What happens on the discovery call?",
    a: "We talk about your goals, your current setup and where you're losing time or leads. You'll leave with concrete recommendations, whether or not we end up working together.",
  },
];

export const engagementModels = [
  {
    name: "Project",
    tagline: "Fixed scope. Fixed price.",
    body: "Ideal for new websites, web apps and clearly defined automation builds. One proposal, one price, a clear finish line.",
    bestFor: "New builds & rebuilds",
  },
  {
    name: "Automation Sprint",
    tagline: "Fast, focused wins.",
    body: "A short, focused engagement: we audit your processes, then ship your highest-impact automations first.",
    bestFor: "Teams drowning in admin",
  },
  {
    name: "Ongoing Partnership",
    tagline: "Your on-demand tech team.",
    body: "A monthly plan for continuous development, automation and optimization, with priority support.",
    bestFor: "Growing businesses",
  },
];

export const capabilities = [
  "Web Development",
  "Workflow Automation",
  "AI Agents",
  "Web Apps & SaaS",
  "Integrations & APIs",
  "Conversion Design",
  "Technical SEO",
];

export const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "n8n",
  "Make",
  "Zapier",
  "OpenAI",
  "Claude",
  "Supabase",
  "PostgreSQL",
  "Stripe",
  "Vercel",
  "HubSpot",
  "Airtable",
];

export const commitments = [
  { value: "1 day", label: "Reply to every enquiry within one business day" },
  { value: "Fixed", label: "Fixed-price proposals for clearly defined scope" },
  { value: "100%", label: "Ownership of your code, accounts and data" },
];
