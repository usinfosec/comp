import type { Metadata } from 'next'
import { MenuTabs } from './components/MenuTabs'
import Toolbar from './components/Toolbar'
import { Toaster } from '@comp/ui/toaster';
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { type ReactNode } from 'react'

import "@comp/ui/globals.css";
import '../styles/globals.css'
import { Providers } from './components/Providers';

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
    <html lang="en" className="h-full">
        <body>
          <Providers>
            <div className="flex flex-col container gap-2 h-full">
              <Toolbar/>
              <MenuTabs />
              {children}
              <Toaster />
            </div>
          </Providers>
        </body>
    </html>
  )
}
