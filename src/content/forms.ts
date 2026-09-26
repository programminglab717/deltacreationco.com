/** Options shared by the contact form UI and server-side validation. */

export const interestOptions = [
  "Website",
  "Web app / SaaS",
  "Workflow automation",
  "AI agents",
  "Integrations & APIs",
  "Something else",
] as const;

export const budgetOptions = ["Under $5k", "$5k – $15k", "$15k – $40k", "$40k+", "Not sure yet"] as const;

export const timelineOptions = ["As soon as possible", "Within 1–3 months", "3+ months", "Just exploring"] as const;

export const topicOptions = [
  "Website",
  "Web app / SaaS",
  "Automation",
  "AI agents",
  "Integrations",
  "Not sure yet",
] as const;

/** Maps `?interest=` query values to contact form interests. */
export const interestAliases: Record<string, (typeof interestOptions)[number]> = {
  website: "Website",
  "web-app": "Web app / SaaS",
  saas: "Web app / SaaS",
  automation: "Workflow automation",
  ai: "AI agents",
  integrations: "Integrations & APIs",
};
