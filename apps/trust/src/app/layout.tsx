import { cn } from "@comp/ui/cn";
import "@comp/ui/globals.css";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { Providers } from "./providers";

const font = localFont({
    src: "../../public/fonts/GeneralSans-Variable.ttf",
    display: "swap",
    variable: "--font-general-sans",
});

export default async function Layout(props: {
    children: React.ReactNode;
}) {
    const { children } = props;

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    `${GeistMono.variable} ${font.variable}`,
                    "whitespace-pre-line overscroll-none antialiased",
                )}
            >
                <Providers locale="en" session={null}>
                    <main>{children}</main>
                </Providers>
                <Toaster richColors />
            </body>
        </html>
    );
}
