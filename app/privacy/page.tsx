import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-4">Last updated: April 17, 2025</p>

      <section className="space-y-6 text-gray-700">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Image to text now (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
            is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            2. Information We Collect
          </h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Personal Information:</strong> When you sign up via Clerk,
              we collect your email address and Clerk user ID. If you make a
              purchase via Lemon Squeezy, we collect payment-related information
              (e.g., transaction IDs).
            </li>
            <li>
              <strong>User Content:</strong> We collect images or PDFs you
              upload for conversion, along with the resulting text or code
              outputs.
            </li>
            <li>
              <strong>Usage Data:</strong> We may collect data about how you
              interact with the Service, such as IP addresses, browser type, and
              pages visited.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. How We Use Your Information
          </h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Provide and improve the Service (e.g., process image conversions,
              manage credits).
            </li>
            <li>Process payments and redeem coupons.</li>
            <li>Communicate with you (e.g., respond to support inquiries).</li>
            <li>Monitor and analyze usage to improve the Service.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            4. How We Share Your Information
          </h2>
          <p>
            We do not sell your personal information. We may share your
            information with:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Third-Party Service Providers:</strong> Clerk
              (authentication), Lemon Squeezy (payments), Google Gemini (AI
              processing), OCR.Space (OCR processing), and NeonDB (database
              hosting).
            </li>
            <li>
              <strong>Legal Requirements:</strong> If required by law or to
              protect our rights, we may disclose your information to
              authorities.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. Data Storage and Security
          </h2>
          <p>
            Your data is stored securely using NeonDB. Uploaded images are
            stored temporarily in Vercel Blob and deleted after processing. We
            implement reasonable security measures to protect your data, but no
            system is completely secure.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have the right to access,
            correct, or delete your personal data. To exercise these rights,
            contact us at{" "}
            <a
              href="mailto:support@imagewizard.com"
              className="text-blue-600 hover:underline"
            >
              support@imagewizard.com
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            7. Cookies and Tracking
          </h2>
          <p>
            We use cookies to manage user sessions (via Clerk) and analyze
            usage. You can disable cookies in your browser settings, but this
            may affect the functionality of the Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            8. Third-Party Services
          </h2>
          <p>
            The Service integrates with third-party services (e.g., Clerk, Lemon
            Squeezy, Google Gemini, OCR.Space). These services have their own
            privacy policies, and we are not responsible for their practices.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            9. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of significant changes by posting a notice on the Service. Your
            continued use of the Service after such changes constitutes
            acceptance of the updated policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href="mailto:support@imagewizard.com"
              className="text-blue-600 hover:underline"
            >
              support@imagewizard.com
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
