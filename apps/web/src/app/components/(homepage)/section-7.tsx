/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";

import React from "react";

interface BentoItem {
  id: number;
  image: string;
  title: string;
  description: string;
  imgClassName: string;
  bentoClassName: string;
  contentAlign: string;
}

const bentoItems: BentoItem[] = [
  {
    id: 1,
    image: "/comp-step-1.png",
    title: "Connect your tech stack",
    description:
      "Easily integrate with your existing tools like AWS, GCP, Azure, GitHub, Slack and more.",
    bentoClassName: "row-span-4 border-b border-border/5 md:border-b-0",
    contentAlign: "grid items-start",
    imgClassName: "order-0 md:order-1",
  },
  {
    id: 2,
    image: "/comp-step-2.png",
    title: "Get an instant overview",
    description:
      "Get real-time insights into security gaps, misconfigurations, and compliance deviations.",
    bentoClassName: "col-span-2 row-span-2 border-b border-border/5",
    contentAlign: "grid items-start",
    imgClassName: "order-0",
  },
  {
    id: 3,
    image: "/comp-step-3.png",
    title: "Immediate action",
    description:
      "Receive immediate actions your company  can take to help get you compliant.",
    bentoClassName:
      "col-span-2 row-span-2 border-b border-border/5 md:border-b-0",
    contentAlign: "grid items-start",
    imgClassName: "order-0",
  },
  {
    id: 4,
    image: "/comp-step-4.png",
    title: "Effortless audit preparation",
    description:
      "Generate comprehensive reports and evidence logs for auditors with one click.",
    bentoClassName: "row-span-4",
    contentAlign: "grid items-start",
    imgClassName: "order-0 md:order-1",
  },
];

export function Section7() {
  return (
    <section className="relative py-20 px-10 md:px-6 border-b border-border/5">
      <div className="max-w-7xl mx-auto grid gap-16 md:gap-24">
        <div className="flex flex-col gap-y items-start justify-start">
          <p className="bg-[#00DC73B2]/10 mb-6 font-mono uppercase text-[#00DC73] text-sm h-8 px-3 border-l-2 border-[#00DC73] flex items-center gap-2">
            How it works
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl max-w-3xl mx-0 font-medium tracking-tight text-balance text-left text-white">
            Get compliant in weeks, not months
          </h1>
        </div>

        <div className="z-10 mx-auto w-full col-start-1 row-start-2 grid md:grid-flow-col grid-rows-2 rounded-2xl text-center text-sm text-white h-full items-start justify-end border border-border/5 divide-x divide-border/5">
          {bentoItems.map((item, index) => (
            <div
              key={item.id}
              className={cn("col-span-2 h-full", item.bentoClassName)}
            >
              <div
                className={cn("p-4 relative z-20 h-full", item.contentAlign)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-fit object-contain rounded-lg ${item.imgClassName}`}
                />
                <div className="flex flex-col gap-2 items-start justify-start">
                  <p className="text-xs text-[#00DC73] text-left font-semibold">
                    STEP {item.id}
                  </p>
                  <div className="flex flex-col items-start justify-start gap-1">
                    <h2 className="mt-2 text-[17px] font-normal">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-[15px] text-[#E1E1E1]/70 text-left font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
