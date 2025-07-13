'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Play, 
  Pause, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle,
  Brain,
  Code,
  TestTube,
  Users,
  User,
  Palette,
  FileText,
  Loader2,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'

interface AgentStep {
  id: string
  name: string
  description: string
  icon: any
  color: string
  status: 'pending' | 'running' | 'completed' | 'error' | 'paused'
  startTime?: string
  endTime?: string
  duration?: number
  progress?: number
  logs: LogEntry[]
  outputs: AgentOutput[]
  dependencies?: string[]
}

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  details?: string
}

interface AgentOutput {
  id: string
  title: string
  type: 'document' | 'code' | 'analysis' | 'recommendation'
  content: string
  size?: string
  downloadable?: boolean
}

interface WorkflowPipelineProps {
  workflowId: string;
  onComplete?: (results: any) => void;
  onPause?: () => void;
  onCancel?: () => void;
  selectedAgentIds?: string[];
}

const AGENT_DEFINITIONS = {
  'orchestrator': {
    id: 'orchestrator',
    name: 'BMad Orchestrator',
    description: 'Coordinates workflow and manages agent handoffs',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    dependencies: []
  },
  'analyst': {
    id: 'analyst',
    name: 'Business Analyst',
    description: 'Analyzes requirements and creates project brief',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    dependencies: ['orchestrator']
  },
  'architect': {
    id: 'architect',
    name: 'Solution Architect',
    description: 'Designs system architecture and technical approach',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
    dependencies: ['analyst']
  },
  'developer': {
    id: 'developer',
    name: 'Lead Developer',
    description: 'Implements features and writes code',
    icon: Code,
    color: 'from-purple-500 to-pink-500',
    dependencies: ['architect']
  },
  'qa': {
    id: 'qa',
    name: 'QA Engineer',
    description: 'Creates test plans and validates quality',
    icon: TestTube,
    color: 'from-yellow-500 to-orange-500',
    dependencies: ['developer']
  },
  'ux': {
    id: 'ux',
    name: 'UX Designer',
    description: 'Designs user experience and interface',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    dependencies: ['analyst']
  }
}

import { BMadAgentCollaboration } from '../collaboration/BMadAgentCollaboration';

export function WorkflowPipeline({ workflowId, onComplete, onPause, onCancel, selectedAgentIds = [] }: WorkflowPipelineProps) {
  const [projectContext, setProjectContext] = useState({
    name: 'My Project',
    description: 'A new project',
    type: 'fullstack-webapp'
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get('project') || 'My Project';
    const workflowType = urlParams.get('template') || 'fullstack-webapp';
    
    setProjectContext({
      name: decodeURIComponent(projectName),
      description: `${projectName} - Generated using BMad AI workflow`,
      type: workflowType
    });
  }, [workflowId]);

  return (
    <BMadAgentCollaboration 
      projectName={projectContext.name}
      uploadedContent={projectContext.description}
      onComplete={onComplete}
      selectedAgentIds={selectedAgentIds}
    />
  );
}