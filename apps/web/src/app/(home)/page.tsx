import { WaitlistForm } from "@/app/components/waitlist-form";
import { Button } from "@bubba/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { Logo } from "../components/logo";

export const metadata: Metadata = {
  title: "Comp AI - SOC 2, ISO 27001 and GDPR compliance",
  description:
    "The first open-source compliance automation platform that cuts your security certification time by 50%",
  alternates: {
    canonical: "https://trycomp.ai",
  },
};

export default function Home() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-6">
          <Logo width={64} height={64} className="h-16 w-16" />

          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter lg:leading-[1.1] max-w-[800px] mx-auto bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            <Balancer>Get SOC 2, ISO 27001 and GDPR certified</Balancer>
          </h1>

          <p className="text-lg md:text-xl font-light text-muted-foreground mt-6 max-w-[600px] mx-auto">
            <Balancer>
              The only open-source compliance automation platform that does
              everything you need to get certified, fast.
            </Balancer>
          </p>

          <div className="mt-10 w-full max-w-md">
            <WaitlistForm />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Join our waitlist to help make 100,000 companies compliant by
              2032.
            </p>
          </div>

          <div className="mt-12 w-full max-w-[800px]">
            <div className="mt-8 flex justify-center">
              <Button variant="action">
                <Link
                  href="https://discord.gg/compai"
                  className="flex items-center gap-2"
                >
                  Discord
                  <span>→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
