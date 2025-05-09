"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NuqsAdapter>
        {children}
      </NuqsAdapter>
    </Suspense>
  )
};