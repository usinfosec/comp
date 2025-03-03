"use client";

import { env } from "@/env.mjs";
import { AnalyticsProvider } from "@bubba/analytics";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

type ProviderProps = {
	children: ReactNode;
};

function AnalyticsWrapper({ children }: ProviderProps) {
	const hasAnalyticsKeys =
		env.NEXT_PUBLIC_POSTHOG_KEY && env.NEXT_PUBLIC_POSTHOG_HOST;

	if (!hasAnalyticsKeys) return <>{children}</>;

	return (
		<AnalyticsProvider
			apiKey={env.NEXT_PUBLIC_POSTHOG_KEY!}
			apiHost={env.NEXT_PUBLIC_POSTHOG_HOST!}
		>
			{children}
		</AnalyticsProvider>
	);
}

export function Providers({ children }: ProviderProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			disableTransitionOnChange
			scriptProps={{ "data-cfasync": "false" }}
		>
			<div suppressHydrationWarning>
				<AnalyticsWrapper>{children}</AnalyticsWrapper>
			</div>
		</ThemeProvider>
	);
}
