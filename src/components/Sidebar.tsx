'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">i10 Portal</h1>
      
      <nav className="space-y-2">
        <Link
          href="/"
          className={`block px-4 py-2 rounded transition-colors ${
            isActive('/') 
              ? 'bg-blue-600' 
              : 'hover:bg-gray-800'
          }`}
        >
          Dashboard
        </Link>
        
        <Link
          href="/practices"
          className={`block px-4 py-2 rounded transition-colors ${
            isActive('/practices') 
              ? 'bg-blue-600' 
              : 'hover:bg-gray-800'
          }`}
        >
          Practices
        </Link>
        
        <Link
          href="/ageing"
          className={`block px-4 py-2 rounded transition-colors ${
            isActive('/ageing') 
              ? 'bg-blue-600' 
              : 'hover:bg-gray-800'
          }`}
        >
          Ageing
        </Link>
        
        <Link
          href="/protocols"
          className={`block px-4 py-2 rounded transition-colors ${
            isActive('/protocols') 
              ? 'bg-blue-600' 
              : 'hover:bg-gray-800'
          }`}
        >
          Protocols
        </Link>
      </nav>
    </aside>
  )
}
