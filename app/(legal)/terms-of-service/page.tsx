import ReturnToHomeButton from "@/components/ReturnToHome";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl py-12 px-6">

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-foreground">


      <ReturnToHomeButton />

        {/* Effective Date */}
        <p className="text-lg font-medium">
          <strong>Effective Date:</strong> September 1st, 2025
        </p>

        {/* Section 1 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">1. Memberships</h2>
          <p>
            UBCMA offers annual memberships valid for one (1) year from the date
            of purchase. Membership benefits, events, and offerings are
            determined by UBCMA and may change at any time. Memberships are
            non-transferable and may only be used by the individual who
            purchased them.
          </p>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">2. Event Tickets</h2>
          <p>
            Event tickets are available for purchase by members and non-members,
            subject to availability. Each ticket is valid only for the specific
            event, date, and time listed at purchase. UBCMA reserves the right
            to set event capacity limits and entry requirements.
          </p>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">3. Payments</h2>
          <p>
            All payments are processed securely through Stripe. Prices are
            listed in CAD and include applicable taxes unless otherwise stated.
            By completing a purchase, you authorize UBCMA (through Stripe) to
            charge your selected payment method.
          </p>
        </section>

        {/* Section 4 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">4. Refunds & Cancellations</h2>
          <p>
            All sales are final. Memberships and event tickets are non-refundable
            and non-exchangeable. If an event is canceled by UBCMA, we will
            provide notice and may, at our discretion, issue refunds or credits.
            UBCMA is not responsible for inability to attend due to personal
            circumstances, scheduling conflicts, or other external factors.
          </p>
        </section>

        {/* Section 5 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">5. Code of Conduct</h2>
          <p>
            Members and event attendees are expected to act respectfully and
            professionally. UBCMA reserves the right to revoke membership or
            deny event entry without refund if behavior violates our policies or
            disrupts the community.
          </p>
        </section>

        {/* Section 6 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
          <p>
            UBCMA is not liable for any indirect, incidental, or consequential
            damages arising from participation in our events or use of our
            services. To the maximum extent permitted by law, UBCMA’s total
            liability is limited to the amount you paid for the membership or
            ticket in question.
          </p>
        </section>

        {/* Section 7 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">7. Privacy</h2>
          <p>
            We collect and process personal information in accordance with our{" "}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        {/* Section 8 */}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">8. Changes to Terms</h2>
          <p>
            UBCMA may update these Terms of Service at any time. Updates will be
            posted on our website with a revised effective date. Continued use
            of membership or event participation after changes constitutes
            acceptance of the updated terms.
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