'use client'

import { useState } from 'react';
import { WorkflowPipeline } from '../../../components/workflow/WorkflowPipeline';
import { AgentSelector } from '../../../components/workflow/AgentSelector';

export default function WorkflowPage() {
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);

  const handleWorkflowComplete = (results: any) => {
    console.log('Workflow completed:', results);
  };

  const handleWorkflowPause = () => {
    console.log('Workflow paused');
  };

  const handleWorkflowCancel = () => {
    console.log('Workflow cancelled');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Select Your Team</h1>
        <p className="text-slate-300 text-lg">
          Choose the agents you need for your project. The workflow will adapt to your selection.
        </p>
      </div>

      <AgentSelector onSelectionChange={setSelectedAgentIds} />

      {selectedAgentIds.length > 0 && (
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">AI Workflow Pipeline</h1>
          <p className="text-slate-300 text-lg">
            Watch your AI agents collaborate in real-time to transform your project from concept to completion
          </p>
        </div>
      )}

      {selectedAgentIds.length > 0 && (
        <WorkflowPipeline
          workflowId="default-fullstack"
          onComplete={handleWorkflowComplete}
          onPause={handleWorkflowPause}
          onCancel={handleWorkflowCancel}
          selectedAgentIds={selectedAgentIds}
        />
      )}
    </div>
  );
}