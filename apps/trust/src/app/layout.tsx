import { Toaster } from '@comp/ui/toaster';
import type { Metadata } from 'next';
import { type ReactNode } from 'react';
import "@comp/ui/globals.css";

export const metadata: Metadata = {
    title: 'Comp AI - Trust Portal',
    description: 'Trust Portal',
}

export default function RootLayout({
    children,
}: {
    children: ReactNode
}) {
    return (
        <html lang="en" className="h-full">
            <body>
                <div className="flex flex-col container gap-2 h-full mx-auto">
                    {children}
                    <Toaster />
                </div>
            </body>
        </html>
    )
}
