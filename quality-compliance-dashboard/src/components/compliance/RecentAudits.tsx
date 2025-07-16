'use client'

import { Badge } from '../ui/badge'
import { Database } from '../../../types/database'

type Audit = Database['public']['Tables']['audits']['Row']

interface RecentAuditsProps {
  audits: Audit[]
}

export function RecentAudits({ audits }: RecentAuditsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'planned':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Audits</h3>
      
      {audits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No audits found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Audit ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Area</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Findings</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {audits.slice(0, 10).map((audit) => (
                <tr key={audit.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {audit.audit_number}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {audit.area}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`${getStatusColor(audit.status)} border-0`}>
                      {audit.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-gray-900 font-medium">
                        {audit.findings_count}
                      </span>
                      {audit.findings_count > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          findings
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {formatDate(audit.start_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}