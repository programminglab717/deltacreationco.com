import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: `The terms that apply when you use the ${site.name} website.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" path="/terms" updated="September 26, 2026">
      <p>
        These terms govern your use of the {site.name} website. By using the site, you agree to them. If you don&apos;t
        agree, please don&apos;t use the site. Client projects are governed by the separate agreement or proposal we
        sign with each client.
      </p>

      <h2>Using this website</h2>
      <p>
        You may browse, read and share our content for personal and business research. You agree not to misuse the site,
        including by attempting to disrupt it, gain unauthorized access, submit spam or automated requests, or use it
        for any unlawful purpose.
      </p>

      <h2>Content and intellectual property</h2>
      <p>
        The website&apos;s design, code, text, graphics and logos belong to {site.name} or its licensors and are
        protected by intellectual property laws. You may quote short excerpts with attribution and a link back to the
        original page.
      </p>

      <h2>Information, not advice</h2>
      <p>
        Articles, calculators and examples on this site are provided for general information. Estimates such as those
        from our ROI calculator are illustrative and are not a guarantee of results. Workflow demonstrations on this
        site are simulations for illustration.
      </p>

      <h2>Bookings and enquiries</h2>
      <p>
        Booking a call or sending an enquiry doesn&apos;t create a client relationship or obligation for either party.
        We may occasionally need to reschedule a call, in which case we&apos;ll contact you by email.
      </p>

      <h2>Third-party links</h2>
      <p>
        Our site may link to third-party websites and tools. We aren&apos;t responsible for their content, policies or
        practices.
      </p>

      <h2>Disclaimer and limitation of liability</h2>
      <p>
        The website is provided &quot;as is&quot; without warranties of any kind. To the fullest extent permitted by
        law, {site.name} is not liable for any indirect, incidental or consequential damages arising from your use of
        the site.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after changes means you accept the
        updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
