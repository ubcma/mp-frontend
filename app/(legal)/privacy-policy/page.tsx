import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-6">
      <div className="flex flex-col gap-8 text-sm leading-relaxed text-foreground">
        {/* Effective Date */}
        <p className="text-lg font-medium">
          <strong>Effective Date:</strong> September 1st, 2025
        </p>

        {/* Section 1 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">1. Information We Collect</h2>
          <p>
            We may collect your name, email, student ID, and payment details
            (processed securely by Stripe). UBCMA does not store credit card
            information.
          </p>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Process memberships and event ticket purchases</li>
            <li>Send event updates and organizational news</li>
            <li>Improve our services and member experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">3. Sharing of Information</h2>
          <p>
            We do not sell or rent your information. We may share limited data
            with trusted providers (e.g., Stripe, email platforms).
          </p>
        </section>

        {/* Section 4 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">4. Data Security</h2>
          <p>
            Payments are processed securely through Stripe. We take reasonable
            measures to protect your data, but no system is 100% secure.
          </p>
        </section>

        {/* Section 5 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">5. Data Retention</h2>
          <p>
            Membership and event records are retained for administrative
            purposes. You may request deletion of your data, subject to legal
            requirements.
          </p>
        </section>

        {/* Section 6 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">6. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal
            information where legally permissible.
          </p>
        </section>

        {/* Section 7 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">7. Third-Party Services</h2>
          <p>
            Our website may link to third-party services. UBCMA is not
            responsible for their privacy practices.
          </p>
        </section>

        {/* Section 8 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">8. Updates</h2>
          <p>
            We may update this Privacy Policy from time to time. Updates will be
            posted on our website with a revised effective date.
          </p>
        </section>

        {/* Section 9 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">9. Contact Us</h2>
          <p>
            For questions, contact us at: <br />
            <strong>UBC Marketing Association (UBCMA)</strong> <br />
            hello@ubcma.ca <br />
            <Link
              href="https://ubcma.ca"
              className="text-blue-600 hover:underline"
            >
              ubcma.ca
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}