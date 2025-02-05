"use client";

import { env } from "@/env.mjs";
import { Analytics, AnalyticsProvider } from "@bubba/analytics";
import { TooltipProvider } from "@bubba/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import type * as React from "react";

interface ProvidersProps
  extends React.ComponentProps<typeof NextThemesProvider> {
  children: React.ReactNode;
}

export function Providers({ children, ...props }: ProvidersProps) {
  const hasAnalyticsKeys =
    env.NEXT_PUBLIC_POSTHOG_KEY && env.NEXT_PUBLIC_POSTHOG_HOST;

  useEffect(() => {
    if (hasAnalyticsKeys) {
      Analytics.init({
        apiKey: env.NEXT_PUBLIC_POSTHOG_KEY!,
        apiHost: env.NEXT_PUBLIC_POSTHOG_HOST!,
      });
    }
  }, [hasAnalyticsKeys]);

  return hasAnalyticsKeys ? (
    <AnalyticsProvider
      apiKey={env.NEXT_PUBLIC_POSTHOG_KEY!}
      apiHost={env.NEXT_PUBLIC_POSTHOG_HOST!}
    >
      <NextThemesProvider {...props} scriptProps={{ "data-cfasync": "false" }}>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </NextThemesProvider>
    </AnalyticsProvider>
  ) : (
    <NextThemesProvider {...props} scriptProps={{ "data-cfasync": "false" }}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </NextThemesProvider>
  );
}
