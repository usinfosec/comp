import type { Metadata } from 'next'
import './globals.css'
import Navigation, { MenuTabs } from './components/MenuTabs'
import Toolbar from './components/Toolbar'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
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
