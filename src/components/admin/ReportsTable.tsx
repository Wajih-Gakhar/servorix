'use client'

import React from 'react'
import Link from 'next/link'
import StatusBadge from './StatusBadge'

interface Report {
  id: string
  businessName: string
  businessId?: string
  reporterName: string
  reporterEmail: string
  reason: string | null
  status: string | null
  lastMessage: string
  createdAt: Date
  updatedAt: Date
}

interface ReportsTableProps {
  reports: Report[]
}

export default function ReportsTable({ reports }: ReportsTableProps) {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-500 font-medium">No reports found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Business</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Reporter</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Reason</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Created At</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report) => (
              <tr 
                key={report.id} 
                className="hover:bg-gray-50/80 transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {report.businessName}
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{report.id.slice(0, 8)}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-medium text-gray-700">{report.reporterName}</div>
                  <div className="text-xs text-gray-400">{report.reporterEmail}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-gray-600 truncate max-w-[200px]">
                    {report.reason || 'Not specified'}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-6 py-5">
                  <div className="text-xs text-gray-500">
                    {new Date(report.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 italic truncate max-w-[150px]">
                    "{report.lastMessage}"
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link 
                    href={`/admin/reports/${report.id}`}
                    className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
