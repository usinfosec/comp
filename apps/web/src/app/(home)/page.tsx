import { WaitlistForm } from "@/app/components/waitlist-form";
import Balancer from "react-wrap-balancer";
import Logo from "../components/logo";

export default function Home() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-6">
          <Logo />

          <h1 className="max-w-[900px] text-4xl md:text-5xl font-semibold leading-tight tracking-tighter lg:leading-[1.1] mx-auto">
            <Balancer>Get SOC 2, ISO 27001 and GDPR compliant</Balancer>
          </h1>

          <p className="text-lg md:text-xl font-light text-muted-foreground mt-6 mx-auto max-w-[800px]">
            <Balancer>
              The open source compliance automation platform that does
              everything you need to get compliant, fast. Open source
              alternative to Drata & Vanta.
            </Balancer>
          </p>

          <div className="mt-10 w-full max-w-md">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
