import { HeroSection } from "@/app/components/(homepage)/home-hero";
import { Section2 } from "@/app/components/(homepage)/section-2";
import { Section3 } from "@/app/components/(homepage)/section-3";
import { Section4 } from "@/app/components/(homepage)/section-4";
import { Section5 } from "@/app/components/(homepage)/section-5";
import { Section6 } from "@/app/components/(homepage)/section-6";
import { Section7 } from "@/app/components/(homepage)/section-7";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section7 />
      <Section6 />
    </div>
  );
}