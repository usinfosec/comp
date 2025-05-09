"use client";

import { AnalyticsProvider } from "@comp/analytics";
import { GoogleTagManager } from "@next/third-parties/google";
import { Session, User } from "better-auth";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

type ProviderProps = {
    children: ReactNode;
    locale: string;
    session: {
        session: Session | null;
        user: User | null;
    } | null;
};

export function Providers({ children, locale, session }: ProviderProps) {
    return (
        <ThemeProvider
            attribute="class"
            disableTransitionOnChange
            scriptProps={{ "data-cfasync": "false" }}
            defaultTheme="dark"
            enableSystem={false}
        >
            <GoogleTagManager
                gtmId="GTM-56GW3TVW"
                dataLayer={{
                    user_id: session?.user?.id ?? "",
                    user_email: session?.user?.email ?? "",
                }}
            />
            <GoogleTagManager
                gtmId="AW-16886441131"
                dataLayer={{
                    user_id: session?.user?.id ?? "",
                    user_email: session?.user?.email ?? "",
                }}
            />
            <AnalyticsProvider
                userId={session?.user?.id ?? undefined}
                userEmail={session?.user?.email ?? undefined}
            >
                {children}
            </AnalyticsProvider>
        </ThemeProvider>
    );
}
