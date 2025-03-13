"use client";

import { motion } from "motion/react";
import { WaitlistForm } from "./(homepage)/waitlist-form";

export function CTA() {
  return (
    <section className="relative grid gap-16 md:gap-24 py-20 px-10 md:px-6 border-b border-border/5 min-h-[50vh] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,trßansparent_40%,#00DC73_100%)]" />
      </div>

      <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_40%)]">
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
            className="absolute inset-0 h-[500%] w-[500%] bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"
            style={{
              backgroundSize: "10rem 10rem",
            }}
          />
        </motion.div>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto h-full w-full flex flex-col items-center justify-center">
        <p className="bg-[#00DC73B2]/10 mb-6 font-mono uppercase text-[#00DC73] text-sm h-8 px-3 border-l-2 border-[#00DC73] flex items-center gap-2">
          Built for scale
        </p>
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-balance text-center text-white">
            Ready to get compliant?
          </h1>
          <p className="text-base md:text-lg text-center text-[#E1E1E1]/70 max-w-xl mx-auto text-balance leading-relaxed tracking-tight">
            Start your compliance journey today and join thousands of companies
            building trust through transparent, automated compliance.
          </p>
          <div className="w-full flex flex-col items-center justify-center gap-4 mx-auto">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
