import { ComplianceRoadmap } from "@/app/components/roadmap";

export function Section5() {
  return (
    <section className="relative py-20 px-10 md:px-6 border-b border-border/5">
      <div className="max-w-6xl mx-auto grid gap-16 md:gap-24">
        <div className="relative z-10 max-w-3xl mx-auto h-full w-full flex flex-col items-center justify-center">
          <p className="bg-[#00DC73B2]/10 mb-6 font-mono uppercase text-[#00DC73] text-sm h-8 px-3 border-l-2 border-[#00DC73] flex items-center gap-2">
            Framework
          </p>
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-balance text-center text-white">
              Flexible compliance for you and your customers
            </h1>
            <p className="text-base md:text-lg text-center text-[#E1E1E1]/70 max-w-xl mx-auto text-balance leading-relaxed tracking-tight">
              Compliance solutions and schedules tailored to fit your business
              and customers&apos; needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
