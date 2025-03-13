/* eslint-disable @next/next/no-img-element */
interface BentoItem {
  image: string;
  title: string;
  description: string;
  imgClassName: string;
  bentoClassName: string;
}

const bentoItems: BentoItem[] = [
  {
    image: "/bento-1.png",
    title: "Compliance made easy",
    description:
      "Access your information security program and controls, track, monitor and access risks, and manage your vendors, all from one platform.",
    bentoClassName: "col-span-2 lg:border-r border-border/5 border-b",
    imgClassName: "top-0",
  },
  {
    image: "/bento-2.png",
    title: "One platform, every framework",
    description:
      "One platform for frameworks like SOC 2, ISO 27001, and GDPR—streamlined compliance, automated with AI & integrations.",
    bentoClassName: "col-span-2 lg:border-r border-border/5 border-b",
    imgClassName: "top-0",
  },
  {
    image: "/bento-3.png",
    title: "Evidence on autopilot",
    description:
      "Automated evidence gathering keeps you compliant, while real-time monitoring catches gaps before they become problems.",
    bentoClassName: "col-span-2 border-border/5 border-b",
    imgClassName: "top-0",
  },
  {
    image: "/bento-4.png",
    title: "Enterprise platform, low barrier to entry",
    description:
      "Get started with Compa in 4 minutes—simply create your account & integrate your tech stack to get an instant overview, all without frustrating sales calls and upfront annual contracts.",
    bentoClassName:
      "col-span-3 lg:border-r border-border/5 border-b lg:border-b-0",
    imgClassName: "-top-10",
  },
  {
    image: "/bento-5.png",
    title: "Security & Compliance",
    description:
      "Compa AI automates your journey with frameworks like SOC 2, ISO 27001, and GDPR—from start to finish, and beyond—backed by our open-source community, get help, advice & support through the process.",
    bentoClassName: "col-span-3",
    imgClassName: "-top-10",
  },
];

export function Section3() {
  return (
    <section className="relative grid gap-16 md:gap-24 py-20 px-10 md:px-6 border-b border-border/5">
      <div className="relative z-10 max-w-3xl mx-auto h-full w-full flex flex-col items-center justify-center">
        <p className="bg-[#00DC73B2]/10 mb-6 font-mono text-[#00DC73] text-sm h-8 px-3 border-l-2 border-[#00DC73] flex items-center gap-2">
          Why Us
        </p>
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-balance text-center text-white">
            Everything you need to get compliant, fast.
          </h1>
          <p className="text-base md:text-lg text-center text-[#E1E1E1]/70 max-w-xl mx-auto text-balance leading-relaxed tracking-tight">
            Transparent, automated, and cost-effective compliance powered by
            open-source and community-driven innovation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 text-white overflow-hidden max-w-6xl mx-auto border rounded-2xl border-[#26272B]">
        {bentoItems.map((item) => (
          <div key={item.title} className={`${item.bentoClassName}`}>
            <div className="p-4 relative z-20 min-h-[450px] grid items-end justify-end">
              <img
                src={item.image}
                alt={item.title}
                className={`w-full h-full object-contain rounded-lg absolute left-0 -z-10 ${item.imgClassName}`}
              />
              <div>
                <h2 className="mt-2">{item.title}</h2>
                <p className="mt-1 text-sm text-[#E1E1E1]/70">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
