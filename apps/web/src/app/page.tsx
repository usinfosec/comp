import Image from "next/image";
import { WaitlistForm } from "@/app/components/waitlist-form";
import Link from "next/link";
import { Card } from "@bubba/ui/card";
import { Logo } from "./components/logo";
import type { Metadata } from "next";
import { Button } from "@bubba/ui/button";
import { Shield, Clock, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Comp AI: SOC 2, ISO 27001 and GDPR compliance",
  description: "The first open-source compliance automation platform that cuts your security certification time by 50%",
};

export default function Home() {
  return (
    <>
      <section className="border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center py-16 md:py-24 text-center">
            <Logo
              width={64}
              height={64}
              className="h-16 w-16 mb-10"
            />
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter lg:leading-[1.1] max-w-[800px] mx-auto bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Get SOC 2, ISO 27001 and GDPR certified 5x faster, at 1/4 the cost
            </h1>
            
            <p className="text-lg md:text-xl font-light text-muted-foreground mt-6 max-w-[600px] mx-auto">
              The first open-source compliance automation platform that cuts your security certification time by 50%
            </p>

            <div className="mt-10 w-full max-w-md">
              <WaitlistForm />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Join our waitlist to help make 100,000 companies compliant by 2032.
              </p>
            </div>

            <div className="mt-16 w-full max-w-[800px]">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Why Comp AI?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 hover:border-primary/50 transition-colors">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      55%
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        face record-high security risks
                      </p>
                      <div className="mt-4 p-2 bg-primary/5 rounded-md">
                        <p className="text-sm font-medium text-primary">
                          Automated checks with live monitoring
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:border-primary/50 transition-colors">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      11 weeks
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        lost yearly on compliance
                      </p>
                      <div className="mt-4 p-2 bg-primary/5 rounded-md">
                        <p className="text-sm font-medium text-primary">
                          AI automation reduces time to just 2 weeks
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:border-primary/50 transition-colors">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      $46,000
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        spent on compliance tools
                      </p>
                      <div className="mt-4 p-2 bg-primary/5 rounded-md">
                        <p className="text-sm font-medium text-primary">
                          Save 75% with our open-source platform
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <Link 
                  href="/pitch" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
                >
                  See our pitch deck 
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
