import type { Metadata } from 'next'
import { Sidebar } from '@/components/Sidebar'
import './globals.css'

export const metadata: Metadata = {
  title: 'i10 Group Portal',
  description: 'Group practice management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
