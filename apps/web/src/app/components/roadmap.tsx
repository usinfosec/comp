"use client";

import { useState } from "react";
import { FlickeringGrid } from "@/app/components/flickering-grid";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TabContentOne } from "./tab-one";

type ComplianceTab =
  | "soc2-type1"
  | "soc2-type2"
  | "hipaa"
  | "iso27001"
  | "gdpr"
  | "pci-dss";

export function ComplianceRoadmap() {
  const [activeTab, setActiveTab] = useState<ComplianceTab>("soc2-type1");

  // Tab configuration
  const tabs = [
    {
      id: "soc2-type1",
      label: "SOC 2 Type I",
      content: <TabContentOne />,
    },
    {
      id: "soc2-type2",
      label: "SOC 2 Type II",
      content: (
        <div className="h-full  flex items-center justify-center">
          <p className="text-sm backdrop-blur-sm border border-border/5 px-3 py-2 rounded-lg">
            Coming Soon
          </p>
        </div>
      ),
    },
    {
      id: "hipaa",
      label: "HIPAA",
      content: (
        <div className="h-full  flex items-center justify-center">
          <p className="text-sm backdrop-blur-sm border border-border/5 px-3 py-2 rounded-lg">
            Coming Soon
          </p>
        </div>
      ),
    },
    {
      id: "iso27001",
      label: "ISO 27001",
      content: (
        <div className="h-full  flex items-center justify-center">
          <p className="text-sm backdrop-blur-sm border border-border/5 px-3 py-2 rounded-lg">
            Coming Soon
          </p>
        </div>
      ),
    },
    {
      id: "gdpr",
      label: "GDPR",
      content: (
        <div className="h-full  flex items-center justify-center">
          <p className="text-sm backdrop-blur-sm border border-border/5 px-3 py-2 rounded-lg">
            Coming Soon
          </p>
        </div>
      ),
    },
    {
      id: "pci-dss",
      label: "PCI DSS",
      content: (
        <div className="h-full  flex items-center justify-center">
          <p className="text-sm backdrop-blur-sm border border-border/5 px-3 py-2 rounded-lg">
            Coming Soon
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="text-white w-full border border-border/5 rounded-2xl overflow-hidden">
      {/* Updated Tab navigation with horizontal scroll */}
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-max w-full border-b border-gray-800">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              className={`p-4 md:p-6 border-r w-full border-gray-800 flex items-center justify-center cursor-pointer relative whitespace-nowrap min-w-[120px] ${index === tabs.length - 1 ? "border-r-0" : ""
                } ${activeTab === tab.id
                  ? "text-[#00ff9d]"
                  : "text-white hover:text-gray-300"
                }`}
              onClick={() => setActiveTab(tab.id as ComplianceTab)}
            >
              {activeTab === tab.id && (
                <motion.div
                  className="absolute w-full h-full [mask-image:radial-gradient(circle,transparent_25%,black_95%);]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FlickeringGrid
                    className="absolute inset-0 z-0 size-full"
                    squareSize={3}
                    gridGap={4}
                    color="#00DC73"
                    maxOpacity={0.5}
                    flickerChance={0.2}
                  />
                </motion.div>
              )}
              <div className="text-center">
                <div
                  className={cn(
                    "text-xs bg-[#16171B] z-40 h-6 flex items-center justify-center w-fit px-3 rounded-xl",
                    activeTab === tab.id
                      ? "border border-border/5 backdrop-blur-sm"
                      : ""
                  )}
                >
                  {tab.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content section */}
      <div className="p-8 relative w-full h-[500px]">
        <div className="absolute inset-0 flex -z-10 [mask:linear-gradient(180deg,transparent,black_40%,black_40%,transparent)] ">
          <div className=" w-1/2 h-full" />
          <div className="bg-[#1B1C20] w-1/2 h-full border-x border-[#2D2E32]/50" />
          <div className=" w-1/2 h-full" />
          <div className="bg-[#1B1C20] w-1/2 h-full border-x border-[#2D2E32]/50" />
          <div className=" w-1/2 h-full" />
          <div className="bg-[#1B1C20] w-1/2 h-full border-x border-[#2D2E32]/50" />
          <div className=" w-1/2 h-full" />
          <div className="bg-[#1B1C20] w-1/2 h-full border-x border-[#2D2E32]/50" />
        </div>

        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
