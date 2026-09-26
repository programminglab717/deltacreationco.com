import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the information you share with us.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy" updated="September 26, 2026">
      <p>
        This policy explains what information {site.name} (&quot;we&quot;, &quot;us&quot;) collects when you visit{" "}
        {site.url.replace(/^https?:\/\//, "")}, how we use it and the choices you have. We keep data collection to what
        we need to respond to you and run our business.
      </p>

      <h2>Information you give us</h2>
      <p>When you fill in our contact form or book a call, we collect the details you provide, which may include:</p>
      <ul>
        <li>Your name, email address, company and website</li>
        <li>Information about your project, budget, timeline and goals</li>
        <li>Your chosen meeting time and time zone</li>
        <li>Anything else you choose to include in your message</li>
      </ul>

      <h2>Information collected automatically</h2>
      <p>
        To understand which pages and channels bring people to us, our site stores a small record in your browser&apos;s
        local storage of how you arrived: the referring website, the page you landed on and campaign parameters (such as
        UTM tags) in the link you followed. This is sent to us only if you submit a form. If we enable website
        analytics, our analytics provider may collect standard usage data such as pages viewed, device and browser type
        and approximate location.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To reply to your enquiry and schedule and hold calls you book</li>
        <li>To prepare proposals and deliver services you request</li>
        <li>To understand and improve our website and marketing</li>
        <li>To keep our website secure and prevent spam and abuse</li>
      </ul>
      <p>We don&apos;t sell your personal information, and we don&apos;t use it for automated decision-making.</p>

      <h2>Service providers</h2>
      <p>
        We use trusted providers to operate our business, including website hosting, email delivery, scheduling and task
        management tools (such as FocusPilot, where booked meetings are recorded) and, where enabled, analytics. They
        process your information only on our behalf and under appropriate safeguards.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry and booking information for as long as needed to respond to you and manage our relationship, and
        for any period required for legal, tax or accounting reasons. You can ask us to delete it at any time.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, delete or restrict the use of your
        personal information, to object to processing and to data portability. To make a request, email us at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. We&apos;ll respond within the timeframe required by
        applicable law.
      </p>

      <h2>Security</h2>
      <p>
        We use industry-standard measures, including encryption in transit, access controls and reputable infrastructure
        providers, to protect your information. No method of transmission or storage is completely secure, but we take
        protecting your data seriously.
      </p>

      <h2>Children</h2>
      <p>Our services are intended for businesses and are not directed to children under 16.</p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &quot;last updated&quot; date above shows when it was last
        changed.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or your data? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
