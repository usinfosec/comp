import { TermsContent } from "@/app/components/legal/terms-content";
import type { Metadata } from "next";
import Balancer from "react-wrap-balancer";

export const metadata: Metadata = {
  title: "Terms of Service - Comp AI",
  description: "Terms of service and usage agreement for Comp AI",
};

export default function TermsPage() {
  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter lg:leading-[1.1] max-w-[800px] mx-auto text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-16">
            <Balancer>Terms of Service</Balancer>
          </h1>

          <div className="w-full max-w-[800px]">
            <TermsContent />
          </div>
        </div>
      </div>
    </section>
  );
}
