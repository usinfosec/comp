import type { Metadata } from 'next'
import { MenuTabs } from './components/MenuTabs'
import Toolbar from './components/Toolbar'

import "@comp/ui/globals.css";
import './globals.css'

export const metadata: Metadata = {
  title: 'Comp AI - Framework Editor',
  description: 'Edit your framework',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col">
        <div className="flex flex-col">
          <Toolbar/>
          <MenuTabs />
        </div>
          {children}
      </body>
    </html>
  )
}
