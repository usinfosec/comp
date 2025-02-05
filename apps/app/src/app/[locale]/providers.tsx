"use client";

import { env } from "@/env.mjs";
import { I18nProviderClient } from "@/locales/client";
import { Analytics, AnalyticsProvider } from "@bubba/analytics";
import { useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import type { ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
  locale: string;
};

export function Providers({ children, locale }: ProviderProps) {
  const { data: session } = useSession();
  const hasAnalyticsKeys =
    env.NEXT_PUBLIC_POSTHOG_KEY && env.NEXT_PUBLIC_POSTHOG_HOST;

  useEffect(() => {
    if (hasAnalyticsKeys) {
      Analytics.init({
        apiKey: env.NEXT_PUBLIC_POSTHOG_KEY!,
        apiHost: env.NEXT_PUBLIC_POSTHOG_HOST!,
      });

      if (session?.user) {
        Analytics.identify(session.user.id, {
          email: session.user.email,
          name: session.user.name,
        });
      }
    }
  }, [hasAnalyticsKeys, session]);

  return (
    <I18nProviderClient locale={locale}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {hasAnalyticsKeys ? (
          <AnalyticsProvider
            apiKey={env.NEXT_PUBLIC_POSTHOG_KEY!}
            apiHost={env.NEXT_PUBLIC_POSTHOG_HOST!}
            userId={session?.user?.id}
          >
            {children}
          </AnalyticsProvider>
        ) : (
          children
        )}
      </ThemeProvider>
    </I18nProviderClient>
  );
}
