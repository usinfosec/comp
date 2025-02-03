export function PrivacyContent() {
  return (
    <div className="prose prose-gray dark:prose-invert overflow-y-auto scrollbar-hide">
      <p className="text-lg text-muted-foreground">
        Last updated: February 1, 2025
      </p>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">1. Introduction</h2>
        <p className="text-lg text-muted-foreground">
          At Bubba AI, Inc. ("we," "our," or "us"), we take your privacy
          seriously. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our compliance automation
          platform and related services.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">
          2. Information We Collect
        </h2>
        <h3 className="text-2xl font-medium mb-4">
          2.1 Information You Provide
        </h3>
        <ul className="space-y-2 list-disc pl-6 text-lg text-muted-foreground">
          <li>Account information (name, email, company details)</li>
          <li>Compliance-related documentation and data</li>
          <li>Communication preferences</li>
          <li>Customer support interactions</li>
        </ul>

        <h3 className="text-2xl font-medium mb-4">
          2.2 Automatically Collected Information
        </h3>
        <ul className="space-y-2 list-disc pl-6 text-lg text-muted-foreground">
          <li>Usage data and analytics</li>
          <li>Device and browser information</li>
          <li>IP address and location data</li>
          <li>Cookies and similar technologies</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">
          3. How We Use Your Information
        </h2>
        <ul className="space-y-2 list-disc pl-6 text-lg text-muted-foreground">
          <li>To provide and improve our services</li>
          <li>To maintain security and prevent fraud</li>
          <li>To communicate with you about our services</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">4. Data Security</h2>
        <p className="text-lg text-muted-foreground">
          We implement appropriate technical and organizational measures to
          protect your information. However, no method of transmission over the
          Internet or electronic storage is 100% secure.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">5. Your Rights</h2>
        <p className="text-lg text-muted-foreground">You have the right to:</p>
        <ul className="space-y-2 list-disc pl-6 text-lg text-muted-foreground">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Data portability</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">6. Contact Us</h2>
        <p className="text-lg text-muted-foreground">
          If you have questions about this Privacy Policy, please contact us at{" "}
          <a
            href="mailto:hello@trycomp.ai"
            className="text-primary hover:underline"
          >
            hello@trycomp.ai
          </a>
        </p>
      </section>
    </div>
  );
}
