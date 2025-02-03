export function TermsContent() {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-lg text-muted-foreground">
        Last updated: February 1, 2025
      </p>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">1. Agreement to Terms</h2>
        <p className="text-lg text-muted-foreground">
          By accessing or using Bubba AI, Inc.'s services, you agree to be bound
          by these Terms of Service and all applicable laws and regulations. If
          you do not agree with any of these terms, you are prohibited from
          using or accessing our services.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">2. Use License</h2>
        <p className="text-lg text-muted-foreground">
          Subject to these Terms of Service, we grant you a limited,
          non-exclusive, non-transferable license to use our services for your
          organization's internal business purposes.
        </p>
        <h3 className="text-2xl font-medium mb-4">2.1 Restrictions</h3>
        <p className="text-lg text-muted-foreground">You may not:</p>
        <ul className="space-y-2 list-disc pl-6 text-lg text-muted-foreground">
          <li>Modify or copy our materials without explicit permission</li>
          <li>Use the materials for commercial purposes</li>
          <li>Remove any copyright or proprietary notations</li>
          <li>Transfer the materials to another person or organization</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">
          3. Service Availability and Support
        </h2>
        <p className="text-lg text-muted-foreground">
          We strive to provide uninterrupted service but do not guarantee that
          our services will be available at all times. We may occasionally need
          to suspend services for maintenance or updates.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">4. User Obligations</h2>
        <p className="text-lg text-muted-foreground">You must:</p>
        <ul className="space-y-2 list-disc pl-6 text-lg text-muted-foreground">
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Use the services in good faith and as intended</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">
          5. Intellectual Property
        </h2>
        <p className="text-lg text-muted-foreground">
          The services and all related materials are protected by intellectual
          property laws. Our open-source components are licensed under their
          respective licenses.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">
          6. Limitation of Liability
        </h2>
        <p className="text-lg text-muted-foreground">
          To the fullest extent permitted by law, Comp AI shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages resulting from your use of our services.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">7. Changes to Terms</h2>
        <p className="text-lg text-muted-foreground">
          We reserve the right to modify these terms at any time. We will notify
          users of any material changes via email or through our services.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">8. Contact Information</h2>
        <p className="text-lg text-muted-foreground">
          Questions about the Terms of Service should be sent to{" "}
          <a
            href="mailto:legal@trycomp.ai"
            className="text-primary hover:underline"
          >
            legal@trycomp.ai
          </a>
        </p>
      </section>
    </div>
  );
}
