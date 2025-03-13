/* eslint-disable @next/next/no-img-element */

"use client";

import { FlickeringGrid } from "@/app/components/flickering-grid";
import { motion } from "motion/react";
import { WaitlistForm } from "@/app/components/(homepage)/waitlist-form";


export function HeroSection() {
  return (
    <section className="relative m-4 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(150%_120%_at_55%_10%,transparent_40%,#00DC73_100%)]" />
      </div>

      <div className="absolute w-full h-56 [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
        <FlickeringGrid
          className="absolute inset-0 z-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
      </div>
      <div className="relative z-10 pt-56 h-full w-full flex flex-col items-center justify-center">
        <div className="max-w-xl lg:max-w-3xl mx-auto h-full w-full flex flex-col items-center justify-center">
          <button
            type="button"
            className="h-9 mb-6 w-fit px-1 pl-3 py-1 flex items-center gap-2 rounded-full text-sm border border-white/[0.012] cursor-pointer [background:radial-gradient(251.65%_175%_at_50%_-15%,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_31.41%),rgba(255,255,255,0.08)] text-white"
          >
            Automate your path to compliance{" "}
            <span className="ml-2 size-6 bg-white rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="12"
                viewBox="0 0 13 12"
                fill="none"
                className="size-4"
              >
                <path
                  d="M2.5 6H10.5M10.5 6L7.5 3M10.5 6L7.5 9"
                  stroke="#16171B"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-balance text-center text-white">
              Open Source Compliance Automation Platform
            </h1>
            <p className="text-base lg:text-lg text-center text-[#E1E1E1]/70 max-w-xl mx-auto text-balance leading-relaxed tracking-tight">
              Get audit ready, fast. Automate compliance with frameworks like
              SOC 2, ISO 27001, and GDPR - in weeks, not months.
            </p>
          </div>
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </div>

        <div className=" w-full max-w-5xl mx-auto relative flex items-center justify-center">
          <div className="absolute inset-0 overflow-hidden [mask-image:radial-gradient(circle_at_center,black_50%,transparent_80%)]">
            <motion.div
              initial={{
                opacity: 0,
                rotateX: 70,
                rotateZ: -60,
              }}
              animate={{
                opacity: 1,
                rotateX: 60,
                rotateZ: -45,
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
              className="absolute inset-0 [perspective:1000px] transform-gpu"
              style={{
                transformOrigin: "50% 50%",
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  translateY: ["-50%", "-48%", "-50%"],
                  translateX: ["-50%", "-52%", "-50%"],
                }}
                transition={{
                  opacity: { duration: 1 },
                  translateY: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 20,
                    ease: "linear",
                  },
                  translateX: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 20,
                    ease: "linear",
                  },
                }}
                className="absolute inset-0 h-[1000%] w-[1000%] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]"
                style={{
                  backgroundSize: "10rem 10rem",
                }}
              />
            </motion.div>
          </div>
          <img
            src="/hero-showcase.png"
            alt=""
            className="size-full object-contain rotate-[3deg] z-[999]"
          />
        </div>
      </div>
    </section>
  );
}
