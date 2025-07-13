'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AgentTabWorkspace } from '../../../components/workflow/AgentTabWorkspace'
import { Card, CardContent } from '../../../components/ui/card'
import { Loader2 } from 'lucide-react'

function WorkspaceContent() {
  const searchParams = useSearchParams()
  const templateId = searchParams?.get('template') || undefined
  const projectId = searchParams?.get('project') || undefined

  const handleWorkflowComplete = () => {
    // Handle workflow completion - could redirect to results, save to database, etc.
    console.log('Workflow completed!')
  }

  return (
    <div className="h-full">
      <AgentTabWorkspace 
        templateId={templateId}
        projectId={projectId}
        onWorkflowComplete={handleWorkflowComplete}
      />
    </div>
  )
}

export default function WorkspacePage() {
  return (
    <Suspense 
      fallback={
        <div className="h-full flex items-center justify-center">
          <Card className="glass-card p-8 text-center">
            <CardContent>
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold text-white mb-2">Loading Workspace</h3>
              <p className="text-slate-400">Setting up your AI agent workspace...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  )
}