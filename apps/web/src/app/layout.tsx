import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "@bubba/ui/globals.css";
import { Providers } from "@/app/providers";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Comp AI",
  description: "Automate SOC 2, ISO 27001 and GDPR compliance with AI.",
  icons: {
    icon: "/android-chrome-192x192.png",
  },
};

export const preferredRegion = ["auto"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-sans antialiased",
          geistSans.variable,
        )}
      >
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-svh flex-col">
            <main className="flex-1">{children}</main>
            <Toaster richColors />
          </div>
        </Providers>
      </body>
    </html>
  );
}
