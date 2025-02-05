"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { Analytics } from "..";
import { PostHogPageView } from "./page-view";

interface ProviderProps {
  children: React.ReactNode;
  apiKey: string;
  apiHost: string;
  userId?: string;
}

export function AnalyticsProvider({
  children,
  apiKey,
  apiHost,
  userId,
}: ProviderProps) {
  useEffect(() => {
    const posthog = Analytics.init({ apiKey, apiHost });

    if (userId) {
      posthog?.identify(userId);
    }

    return () => {
      posthog?.reset();
    };
  }, [apiKey, apiHost, userId]);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
