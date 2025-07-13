'use client'

import { WorkflowPipeline } from '../../../components/workflow/WorkflowPipeline'

export default function WorkflowPage() {
  const handleWorkflowComplete = (results: any) => {
    console.log('Workflow completed:', results)
    // Could show a completion modal or redirect to results page
  }

  const handleWorkflowPause = () => {
    console.log('Workflow paused')
  }

  const handleWorkflowCancel = () => {
    console.log('Workflow cancelled')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">AI Workflow Pipeline</h1>
        <p className="text-slate-300 text-lg">
          Watch your AI agents collaborate in real-time to transform your project from concept to completion
        </p>
      </div>
      
      <WorkflowPipeline
        workflowId="default-fullstack"
        onComplete={handleWorkflowComplete}
        onPause={handleWorkflowPause}
        onCancel={handleWorkflowCancel}
      />
    </div>
  )
}