"use client";

import { env } from "@/env.mjs";
import { TooltipProvider } from "@bubba/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import type * as React from "react";
import PostHogPageView from "./components/posthog-pageview";

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  useEffect(() => {
    if (env.NEXT_PUBLIC_POSTHOG_KEY && env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: true,
        capture_pageleave: true,
      });
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <NextThemesProvider {...props} scriptProps={{ "data-cfasync": "false" }}>
        <PostHogPageView />
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </NextThemesProvider>
    </PHProvider>
  );
}
