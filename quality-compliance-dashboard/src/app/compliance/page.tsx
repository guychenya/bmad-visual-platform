'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { KPICards } from '../../components/compliance/KPICards'
import { RecentAudits } from '../../components/compliance/RecentAudits'
import { ComplianceAreasChart } from '../../components/compliance/ComplianceAreasChart'
import { DocumentManagement } from '../../components/compliance/DocumentManagement'
import { LoadingSpinner } from '../../components/ui/loading-spinner'
import { Database } from '../../types/database'

type ComplianceMetric = Database['public']['Tables']['compliance_metrics']['Row']
type CAPA = Database['public']['Tables']['capas']['Row']
type TrainingRecord = Database['public']['Tables']['training_records']['Row']
type Audit = Database['public']['Tables']['audits']['Row']
type ComplianceArea = Database['public']['Tables']['compliance_areas']['Row']
type ComplianceDocument = Database['public']['Tables']['compliance_documents']['Row']

export default function ComplianceDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentProject, setCurrentProject] = useState<string | null>(null)
  
  // Data states
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([])
  const [capas, setCAPAs] = useState<CAPA[]>([])
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([])
  const [audits, setAudits] = useState<Audit[]>([])
  const [complianceAreas, setComplianceAreas] = useState<ComplianceArea[]>([])
  const [documents, setDocuments] = useState<ComplianceDocument[]>([])

  useEffect(() => {
    if (!authLoading && user) {
      fetchDefaultProject()
    }
  }, [authLoading, user])

  useEffect(() => {
    if (currentProject) {
      fetchComplianceData()
    }
  }, [currentProject])

  const fetchDefaultProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .eq('owner_id', user?.id)
        .limit(1)
        .single()

      if (error) {
        // Create a default project if none exists
        const { data: newProject, error: createError } = await supabase
          .from('projects')
          .insert({
            name: 'Quality Compliance Project',
            description: 'Default project for quality compliance dashboard',
            owner_id: user?.id!,
            status: 'active'
          })
          .select()
          .single()

        if (createError) {
          setError('Failed to create default project')
          return
        }
        setCurrentProject(newProject.id)
      } else {
        setCurrentProject(data.id)
      }
    } catch (err) {
      setError('Failed to fetch project')
    }
  }

  const fetchComplianceData = async () => {
    try {
      setLoading(true)
      const [
        metricsResult,
        capasResult,
        trainingResult,
        auditsResult,
        areasResult,
        documentsResult
      ] = await Promise.all([
        supabase.from('compliance_metrics').select('*').eq('project_id', currentProject),
        supabase.from('capas').select('*').eq('project_id', currentProject),
        supabase.from('training_records').select('*').eq('project_id', currentProject),
        supabase.from('audits').select('*').eq('project_id', currentProject),
        supabase.from('compliance_areas').select('*').eq('project_id', currentProject),
        supabase.from('compliance_documents').select('*').eq('project_id', currentProject)
      ])

      if (metricsResult.error) throw metricsResult.error
      if (capasResult.error) throw capasResult.error
      if (trainingResult.error) throw trainingResult.error
      if (auditsResult.error) throw auditsResult.error
      if (areasResult.error) throw areasResult.error
      if (documentsResult.error) throw documentsResult.error

      setMetrics(metricsResult.data || [])
      setCAPAs(capasResult.data || [])
      setTrainingRecords(trainingResult.data || [])
      setAudits(auditsResult.data || [])
      setComplianceAreas(areasResult.data || [])
      setDocuments(documentsResult.data || [])
    } catch (err) {
      setError('Failed to fetch compliance data')
      console.error('Error fetching compliance data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Quality Compliance Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {profile?.full_name}</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {profile?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards 
            metrics={metrics}
            capas={capas}
            trainingRecords={trainingRecords}
            audits={audits}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Audits */}
          <div className="bg-white rounded-lg shadow p-6">
            <RecentAudits audits={audits} />
          </div>

          {/* Compliance Areas Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <ComplianceAreasChart complianceAreas={complianceAreas} />
          </div>
        </div>

        {/* Document Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <DocumentManagement 
            documents={documents}
            projectId={currentProject!}
            onDocumentUploaded={fetchComplianceData}
          />
        </div>
      </main>
    </div>
  )
}