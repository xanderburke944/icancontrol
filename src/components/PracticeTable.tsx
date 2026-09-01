'use client'

import { useState } from 'react'

interface Practice {
  id: string
  name: string
  location: string
  contactPerson: string
  status: 'active' | 'inactive'
}

export function PracticeTable({ practices }: { practices: Practice[] }) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Location</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Contact Person</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {practices.map((practice) => (
            <tr key={practice.id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{practice.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{practice.location}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{practice.contactPerson}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  practice.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {practice.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {practices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No practices found. Create one to get started.
        </div>
      )}
    </div>
  )
}
