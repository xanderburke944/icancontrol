'use client'

interface Protocol {
  id: string
  title: string
  description: string
  category: string
  lastUpdated: string
}

export function ProtocolCard({ protocol }: { protocol: Protocol }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{protocol.title}</h3>
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
          {protocol.category}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{protocol.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Last updated: {new Date(protocol.lastUpdated).toLocaleDateString()}
        </span>
        <button className="text-blue-600 hover:underline text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  )
}
