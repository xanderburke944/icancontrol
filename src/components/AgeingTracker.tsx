'use client'

import { useState } from 'react'

interface AgeingRecord {
  id: string
  fileName: string
  ageInDays: number
  claimAmount: number
  status: 'pending' | 'resolved'
  lastFollowUp: string
}

export function AgeingTracker({ records }: { records: AgeingRecord[] }) {
  const getAgeCategory = (days: number) => {
    if (days <= 30) return { label: '0-30 days', color: 'bg-green-100 text-green-800' }
    if (days <= 60) return { label: '31-60 days', color: 'bg-yellow-100 text-yellow-800' }
    if (days <= 90) return { label: '61-90 days', color: 'bg-orange-100 text-orange-800' }
    return { label: '90+ days', color: 'bg-red-100 text-red-800' }
  }

  const totalAmount = records.reduce((sum, r) => sum + r.claimAmount, 0)
  const pendingCount = records.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-600 text-sm">Total Claims</p>
          <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-600 text-sm">Resolved</p>
          <p className="text-2xl font-bold">{records.length - pendingCount}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">File Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Age</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Last Follow-up</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const ageCategory = getAgeCategory(record.ageInDays)
              return (
                <tr key={record.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{record.fileName}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${ageCategory.color}`}>
                      {ageCategory.label} ({record.ageInDays}d)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">${record.claimAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      record.status === 'pending'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.lastFollowUp}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
