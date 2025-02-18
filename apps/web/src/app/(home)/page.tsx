import { WaitlistForm } from "@/app/components/waitlist-form";
import { Button } from "@bubba/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import Logo from "../components/logo";

export const metadata: Metadata = {
  title: "Comp AI - Get SOC 2, ISO 27001 and GDPR compliant",
  description:
    "The open-source compliance automation platform for SOC 2, ISO 27001, GDPR and more.",
  alternates: {
    canonical: "https://trycomp.ai",
  },
};

export default function Home() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-6">
          <Logo />

          <h1 className="max-w-[800px] text-4xl md:text-5xl font-semibold leading-tight tracking-tighter lg:leading-[1.1] mx-auto">
            <Balancer>
              Open Source Automation For SOC 2, ISO 27001 and GDPR
            </Balancer>
          </h1>

          <p className="text-lg md:text-xl font-light text-muted-foreground mt-6 mx-auto max-w-[800px]">
            <Balancer>
              We're launching the first open-source compliance automation
              platform that does everything you need to achieve and maintain
              compliance with frameworks like SOC 2, ISO 27001, GDPR and more.
            </Balancer>
          </p>

          <div className="mt-10 w-full max-w-md">
            <WaitlistForm />
          </div>

          <div className="mt-12 w-full max-w-[800px]">
            <div className="mt-8 flex justify-center">
              <Button variant="action">
                <Link
                  href="https://discord.gg/compai"
                  className="flex items-center gap-2"
                >
                  Join us on Discord
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
