'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Users, FileText, CheckCircle } from 'lucide-react'
import { Card } from '../ui/card'
import { Database } from '../../../types/database'

type ComplianceMetric = Database['public']['Tables']['compliance_metrics']['Row']
type CAPA = Database['public']['Tables']['capas']['Row']
type TrainingRecord = Database['public']['Tables']['training_records']['Row']
type Audit = Database['public']['Tables']['audits']['Row']

interface KPICardsProps {
  metrics: ComplianceMetric[]
  capas: CAPA[]
  trainingRecords: TrainingRecord[]
  audits: Audit[]
}

export function KPICards({ metrics, capas, trainingRecords, audits }: KPICardsProps) {
  const kpiData = useMemo(() => {
    // Calculate Overall Compliance Rate
    const complianceMetric = metrics.find(m => m.metric_type === 'overall_compliance')
    const complianceRate = complianceMetric ? complianceMetric.value : 0
    const complianceTarget = complianceMetric ? complianceMetric.target_value : 95
    const complianceChange = 1.2 // Mock change from last month

    // Calculate Open CAPAs
    const openCAPAs = capas.filter(c => c.status === 'open').length
    const overdueCAPAs = capas.filter(c => {
      if (!c.due_date) return false
      return new Date(c.due_date) < new Date() && c.status === 'open'
    }).length

    // Calculate Training Completion
    const completedTraining = trainingRecords.filter(t => t.status === 'completed').length
    const totalTraining = trainingRecords.length || 1
    const trainingCompletionRate = (completedTraining / totalTraining) * 100

    // Calculate Audit Findings
    const totalFindings = audits.reduce((sum, audit) => sum + audit.findings_count, 0)
    const majorFindings = Math.floor(totalFindings * 0.3)
    const minorFindings = Math.floor(totalFindings * 0.35)
    const opportunities = totalFindings - majorFindings - minorFindings

    return {
      compliance: {
        rate: complianceRate,
        target: complianceTarget,
        change: complianceChange,
        trend: complianceChange > 0 ? 'up' : 'down'
      },
      capas: {
        open: openCAPAs,
        overdue: overdueCAPAs,
        total: capas.length
      },
      training: {
        rate: trainingCompletionRate,
        target: 95,
        completed: completedTraining,
        total: totalTraining
      },
      findings: {
        major: majorFindings,
        minor: minorFindings,
        opportunities,
        total: totalFindings
      }
    }
  }, [metrics, capas, trainingRecords, audits])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Overall Compliance Rate */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Overall Compliance Rate</h3>
          <CheckCircle className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-3xl font-bold text-blue-600">
            {kpiData.compliance.rate}%
          </span>
          <div className={`flex items-center ${kpiData.compliance.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {kpiData.compliance.trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm ml-1">
              {kpiData.compliance.change}% from last month
            </span>
          </div>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(kpiData.compliance.rate, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">Target: {kpiData.compliance.target}%</p>
      </Card>

      {/* Open CAPAs */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Open CAPAs</h3>
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-3xl font-bold text-orange-600">
            {kpiData.capas.open}
          </span>
          {kpiData.capas.overdue > 0 && (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm ml-1">
                {kpiData.capas.overdue} Overdue
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-1 mb-2">
          <div className="flex-1 bg-orange-200 rounded h-2">
            <div 
              className="bg-orange-600 h-2 rounded transition-all duration-300"
              style={{ width: `${kpiData.capas.open > 0 ? (kpiData.capas.open / kpiData.capas.total) * 100 : 0}%` }}
            />
          </div>
          {kpiData.capas.overdue > 0 && (
            <div className="flex-1 bg-red-200 rounded h-2">
              <div 
                className="bg-red-600 h-2 rounded transition-all duration-300"
                style={{ width: `${(kpiData.capas.overdue / kpiData.capas.total) * 100}%` }}
              />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600">Total: {kpiData.capas.total}</p>
      </Card>

      {/* Training Completion */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Training Completion</h3>
          <Users className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-3xl font-bold text-green-600">
            {kpiData.training.rate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-green-200 rounded-full h-2 mb-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(kpiData.training.rate, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600">
          {kpiData.training.completed} of {kpiData.training.total} completed
        </p>
        <p className="text-xs text-gray-600">Target: {kpiData.training.target}%</p>
      </Card>

      {/* Audit Findings */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Audit Findings</h3>
          <FileText className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-3xl font-bold text-purple-600">
            {kpiData.findings.total}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              Major ({kpiData.findings.major})
            </span>
            <span className="text-red-600 font-medium">30%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
              Minor ({kpiData.findings.minor})
            </span>
            <span className="text-orange-600 font-medium">35%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              Opportunities ({kpiData.findings.opportunities})
            </span>
            <span className="text-green-600 font-medium">35%</span>
          </div>
        </div>
      </Card>
    </div>
  )
}