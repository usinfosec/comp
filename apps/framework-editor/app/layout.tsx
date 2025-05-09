import type { Metadata } from 'next'
import { MenuTabs } from './components/MenuTabs'
import Toolbar from './components/Toolbar'
import { Toaster } from '@comp/ui/toaster';
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { type ReactNode } from 'react'

import "@comp/ui/globals.css";
import './globals.css'

export const metadata: Metadata = {
  title: 'Comp AI - Framework Editor',
  description: 'Edit your framework',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
        <NuqsAdapter>
    <html lang="en" className="h-full">
        <body>
          <div className="flex flex-col container gap-2 h-full">
            <Toolbar/>
            <MenuTabs />
            {children}
            <Toaster />
          </div>
        </body>
    </html>
        </NuqsAdapter>
  )
}
