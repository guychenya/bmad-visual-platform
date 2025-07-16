'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { Database } from '../../types/database'

type ComplianceArea = Database['public']['Tables']['compliance_areas']['Row']

interface ComplianceAreasChartProps {
  complianceAreas: ComplianceArea[]
}

export function ComplianceAreasChart({ complianceAreas }: ComplianceAreasChartProps) {
  const chartData = complianceAreas.map(area => ({
    area: area.area_name,
    score: Math.round((area.score / area.max_score) * 100),
    fullMark: 100
  }))

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Areas Performance</h3>
      
      {chartData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No compliance areas data available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Radar Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="area" 
                  tick={{ fill: '#374151', fontSize: 12 }}
                  className="text-sm"
                />
                <PolarRadiusAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  tickCount={6}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#3b82f6' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 gap-3">
            {complianceAreas.map((area) => {
              const score = Math.round((area.score / area.max_score) * 100)
              return (
                <div key={area.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {area.area_name}
                      </span>
                      <span className={`font-bold ${getScoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          score >= 90 ? 'bg-green-500' :
                          score >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Last assessment: {formatDate(area.last_assessment)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <span>Excellent (90%+)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
              <span>Good (80-89%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <span>Needs Improvement (&lt;80%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}