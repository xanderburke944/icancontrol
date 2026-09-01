'use client'

import { useState } from 'react'
import { ProtocolCard } from '@/components/ProtocolCard'

export default function ProtocolsPage() {
  const [protocols] = useState([])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Protocols & SOPs</h1>
          <p className="text-gray-600 mt-2">Month-end protocols and standard operating procedures</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          New Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {protocols.length > 0 ? (
          protocols.map((protocol) => (
            <ProtocolCard key={protocol.id} protocol={protocol} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No protocols found. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
