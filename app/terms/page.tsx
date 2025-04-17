import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="text-sm text-gray-500 mb-4">Last updated: April 17, 2025</p>

      <section className="space-y-6 text-gray-700">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Image to text now (&quot;the Service&quot;),
            you agree to be bound by these Terms and Conditions
            (&quot;Terms&quot;). If you do not agree to these Terms, please do
            not use the Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
          <p>
            To access certain features of the Service, you must create an
            account via Clerk. You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            that occur under your account.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. Credit System and Payments
          </h2>
          <p>
            Image to text now operates on a credit-based system. Credits can be
            earned through coupons or purchased via Lemon Squeezy. All payments
            are final and non-refundable, except as required by law. You agree
            to provide accurate payment information and authorize us to charge
            your selected payment method.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Coupon Redemption</h2>
          <p>
            Coupons may be redeemed by logged-in users for additional credits.
            Each coupon can be redeemed only once per user. We reserve the right
            to modify or discontinue coupons at any time without notice.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. User Content</h2>
          <p>
            You retain ownership of any content you upload (e.g., images, PDFs).
            By uploading content, you grant Image to text now a non-exclusive,
            royalty-free license to process and store your content for the
            purpose of providing the Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Prohibited Conduct</h2>
          <p>
            You agree not to use the Service for any unlawful purpose, to upload
            malicious content, or to attempt to bypass the credit system.
            Violation of these Terms may result in account suspension or
            termination.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            7. Limitation of Liability
          </h2>
          <p>
            Image to text now is not liable for any indirect, incidental, or
            consequential damages arising from your use of the Service,
            including loss of data or inaccurate conversions. The Service is
            provided &quot;as is&quot; without warranties of any kind.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. Termination</h2>
          <p>
            We may terminate or suspend your account at our discretion, with or
            without notice, for any violation of these Terms or for any other
            reason.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of
            significant changes by posting a notice on the Service. Your
            continued use of the Service after such changes constitutes
            acceptance of the updated Terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:asrafulislam0312@gmail.com"
              className="text-blue-600 hover:underline"
            >
              asrafulislam0312@gmail.com
            </a>
            .
          </p>
        </div>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
