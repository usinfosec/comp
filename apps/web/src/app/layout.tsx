import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "@/app/providers";
import { env } from "@/env.mjs";
import { generatePageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { GoogleTagManager } from "@next/third-parties/google";
import localFont from "next/font/local";
import { initializeServer } from "@bubba/analytics";
import { Footer } from "./components/footer";
import Header from "./components/header";
import { CTA } from "./components/cta-section";

export const metadata = generatePageMeta({
  url: "/",
});

const font = localFont({
  src: "../../public/fonts/GeneralSans-Variable.ttf",
  display: "swap",
  variable: "--font-general-sans",
});

if (env.NEXT_PUBLIC_POSTHOG_KEY && env.NEXT_PUBLIC_POSTHOG_HOST) {
  initializeServer({
    apiKey: env.NEXT_PUBLIC_POSTHOG_KEY,
    apiHost: env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export const preferredRegion = ["auto"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId={env.NEXT_PUBLIC_GOOGLE_TAG_ID!} />
      <body
        className={cn(
          "font-sans antialiased relative bg-[#16171B]",
          `${GeistMono.variable} ${font.variable}`,
        )}
      >
        <Providers>
          <Header />
          <main>{children}</main>
          <CTA />
          <Footer />
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
