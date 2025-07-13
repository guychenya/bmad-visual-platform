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
  workflowId: string
  onComplete?: (results: any) => void
  onPause?: () => void
  onCancel?: () => void
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

export function WorkflowPipeline({ workflowId, onComplete, onPause, onCancel }: WorkflowPipelineProps) {
  const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'running' | 'paused' | 'completed' | 'error'>('idle')
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [startTime, setStartTime] = useState<string | null>(null)
  const [totalDuration, setTotalDuration] = useState<number>(0)

  // Initialize workflow steps
  useEffect(() => {
    const initialSteps: AgentStep[] = Object.values(AGENT_DEFINITIONS).map(agent => ({
      ...agent,
      status: 'pending' as const,
      progress: 0,
      logs: [],
      outputs: []
    }))

    setSteps(initialSteps)
  }, [workflowId])

  // Simulate workflow execution
  const startWorkflow = async () => {
    setWorkflowStatus('running')
    setStartTime(new Date().toISOString())
    
    // Execute steps in dependency order
    const executionOrder = ['orchestrator', 'analyst', 'architect', 'developer', 'qa', 'ux']
    
    for (const stepId of executionOrder) {
      await executeStep(stepId)
      if (workflowStatus === 'paused') break
    }
    
    if (workflowStatus === 'running') {
      setWorkflowStatus('completed')
      onComplete?.({
        duration: totalDuration,
        outputs: steps.flatMap(step => step.outputs)
      })
    }
  }

  const executeStep = async (stepId: string) => {
    setCurrentStep(stepId)
    
    // Update step status to running
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'running', startTime: new Date().toISOString() }
        : step
    ))

    // Simulate step execution with logs and progress
    await simulateStepExecution(stepId)
    
    // Mark step as completed
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            status: 'completed', 
            endTime: new Date().toISOString(),
            progress: 100
          }
        : step
    ))
  }

  const simulateStepExecution = async (stepId: string) => {
    const stepDef = AGENT_DEFINITIONS[stepId as keyof typeof AGENT_DEFINITIONS]
    const totalSteps = 5
    
    for (let i = 0; i <= totalSteps; i++) {
      if (workflowStatus === 'paused') return
      
      const progress = (i / totalSteps) * 100
      const logMessage = getStepLogMessage(stepId, i, totalSteps)
      
      // Add log entry
      const newLog: LogEntry = {
        id: `${stepId}-${i}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: i === totalSteps ? 'success' : 'info',
        message: logMessage,
        details: `Step ${i + 1} of ${totalSteps + 1} for ${stepDef.name}`
      }
      
      setSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              progress,
              logs: [...step.logs, newLog]
            }
          : step
      ))
      
      // Simulate work time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    }
    
    // Add outputs for completed step
    const outputs = generateStepOutputs(stepId)
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, outputs }
        : step
    ))
  }

  const getStepLogMessage = (stepId: string, step: number, total: number): string => {
    const messages = {
      'orchestrator': [
        'Initializing workflow orchestration...',
        'Analyzing project requirements...',
        'Determining agent execution order...',
        'Preparing agent handoff protocols...',
        'Setting up monitoring and logging...',
        'Orchestrator ready - handing off to Analyst'
      ],
      'analyst': [
        'Starting business analysis...',
        'Gathering stakeholder requirements...',
        'Analyzing market conditions...',
        'Defining success criteria...',
        'Creating project brief...',
        'Analysis complete - handing off to Architect'
      ],
      'architect': [
        'Beginning system architecture design...',
        'Analyzing technical requirements...',
        'Designing scalable architecture...',
        'Creating technical specifications...',
        'Validating architecture decisions...',
        'Architecture complete - handing off to Developer'
      ],
      'developer': [
        'Setting up development environment...',
        'Implementing core features...',
        'Writing unit tests...',
        'Optimizing performance...',
        'Code review and refactoring...',
        'Development complete - handing off to QA'
      ],
      'qa': [
        'Creating comprehensive test plan...',
        'Setting up test automation...',
        'Executing functional tests...',
        'Performing security testing...',
        'Validating user acceptance criteria...',
        'QA complete - final validation passed'
      ],
      'ux': [
        'Analyzing user journey requirements...',
        'Creating wireframes and mockups...',
        'Designing user interface components...',
        'Conducting usability validation...',
        'Finalizing design specifications...',
        'UX design complete - ready for implementation'
      ]
    }
    
    return messages[stepId as keyof typeof messages]?.[step] || `Processing step ${step + 1}...`
  }

  const generateStepOutputs = (stepId: string): AgentOutput[] => {
    const outputs = {
      'orchestrator': [
        {
          id: 'workflow-plan',
          title: 'Workflow Execution Plan',
          type: 'document' as const,
          content: 'Detailed workflow execution plan with agent dependencies and handoff protocols',
          size: '2.3 KB'
        }
      ],
      'analyst': [
        {
          id: 'project-brief',
          title: 'Project Requirements Brief',
          type: 'document' as const,
          content: 'Comprehensive project brief with requirements, stakeholder analysis, and success criteria',
          size: '15.7 KB'
        },
        {
          id: 'market-analysis',
          title: 'Market Analysis Report',
          type: 'analysis' as const,
          content: 'Market conditions analysis and competitive landscape overview',
          size: '8.2 KB'
        }
      ],
      'architect': [
        {
          id: 'system-architecture',
          title: 'System Architecture Document',
          type: 'document' as const,
          content: 'Detailed system architecture with components, data flow, and technical specifications',
          size: '23.4 KB'
        },
        {
          id: 'tech-stack',
          title: 'Technology Stack Recommendations',
          type: 'recommendation' as const,
          content: 'Recommended technologies, frameworks, and tools for implementation',
          size: '6.8 KB'
        }
      ],
      'developer': [
        {
          id: 'implementation-code',
          title: 'Core Implementation',
          type: 'code' as const,
          content: 'Core application code with features, components, and utilities',
          size: '156.2 KB'
        },
        {
          id: 'api-documentation',
          title: 'API Documentation',
          type: 'document' as const,
          content: 'Complete API documentation with endpoints, parameters, and examples',
          size: '12.9 KB'
        }
      ],
      'qa': [
        {
          id: 'test-plan',
          title: 'Comprehensive Test Plan',
          type: 'document' as const,
          content: 'Detailed test plan with test cases, automation scripts, and validation criteria',
          size: '18.6 KB'
        },
        {
          id: 'quality-report',
          title: 'Quality Assurance Report',
          type: 'analysis' as const,
          content: 'Quality metrics, test results, and recommendations for improvement',
          size: '9.4 KB'
        }
      ],
      'ux': [
        {
          id: 'design-mockups',
          title: 'UI/UX Design Mockups',
          type: 'document' as const,
          content: 'Complete user interface designs with wireframes, mockups, and style guide',
          size: '45.3 KB'
        },
        {
          id: 'usability-analysis',
          title: 'Usability Analysis',
          type: 'analysis' as const,
          content: 'User experience analysis with recommendations and best practices',
          size: '7.1 KB'
        }
      ]
    }
    
    return outputs[stepId as keyof typeof outputs] || []
  }

  const pauseWorkflow = () => {
    setWorkflowStatus('paused')
    onPause?.()
  }

  const resumeWorkflow = () => {
    setWorkflowStatus('running')
    // Continue from current step
  }

  const cancelWorkflow = () => {
    setWorkflowStatus('idle')
    setCurrentStep(null)
    onCancel?.()
  }

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stepId)) {
        newSet.delete(stepId)
      } else {
        newSet.add(stepId)
      }
      return newSet
    })
  }

  const getStepStatusIcon = (step: AgentStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />
      case 'paused':
        return <Pause className="h-5 w-5 text-yellow-400" />
      default:
        return <Circle className="h-5 w-5 text-slate-500" />
    }
  }

  const formatDuration = (start: string, end?: string): string => {
    const startTime = new Date(start).getTime()
    const endTime = end ? new Date(end).getTime() : Date.now()
    const duration = Math.round((endTime - startTime) / 1000)
    
    if (duration < 60) return `${duration}s`
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white flex items-center">
                <Brain className="h-6 w-6 mr-3" />
                BMad Workflow Pipeline
              </CardTitle>
              <p className="text-slate-400 mt-1">
                AI Agent collaboration workflow - Status: {workflowStatus}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {workflowStatus === 'idle' && (
                <Button onClick={startWorkflow} className="gradient-button">
                  <Play className="h-4 w-4 mr-2" />
                  Start Workflow
                </Button>
              )}
              {workflowStatus === 'running' && (
                <>
                  <Button onClick={pauseWorkflow} variant="outline" className="glass-button">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button onClick={cancelWorkflow} variant="outline" className="glass-button">
                    <Square className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
              {workflowStatus === 'paused' && (
                <Button onClick={resumeWorkflow} className="gradient-button">
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}
              {workflowStatus === 'completed' && (
                <Button onClick={() => window.location.reload()} variant="outline" className="glass-button">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Workflow
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Pipeline Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isExpanded = expandedSteps.has(step.id)
          const isActive = currentStep === step.id
          
          return (
            <Card 
              key={step.id} 
              className={`glass-card transition-all duration-300 ${
                isActive ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {getStepStatusIcon(step)}
                        {index > 0 && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-px h-8 bg-slate-600"></div>
                        )}
                      </div>
                      <div className={`p-3 bg-gradient-to-r ${step.color} rounded-xl`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white">{step.name}</h3>
                        {step.status === 'running' && step.progress !== undefined && (
                          <div className="flex items-center space-x-2 text-sm text-slate-400">
                            <span>{Math.round(step.progress)}%</span>
                          </div>
                        )}
                        {step.startTime && (
                          <div className="flex items-center space-x-1 text-sm text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(step.startTime, step.endTime)}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{step.description}</p>
                      {step.status === 'running' && step.progress !== undefined && (
                        <div className="mt-2">
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${step.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {step.outputs.length > 0 && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                        {step.outputs.length} output{step.outputs.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStepExpansion(step.id)}
                      className="glass-button"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0 border-t border-white/10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {/* Logs Section */}
                    <div>
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Execution Logs
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                        {step.logs.length === 0 ? (
                          <p className="text-slate-500 text-sm italic">No logs yet...</p>
                        ) : (
                          step.logs.map(log => (
                            <div key={log.id} className="bg-slate-800/50 rounded p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  log.level === 'error' ? 'bg-red-500/20 text-red-300' :
                                  log.level === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                                  log.level === 'success' ? 'bg-green-500/20 text-green-300' :
                                  'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {log.level}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-300">{log.message}</p>
                              {log.details && (
                                <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Outputs Section */}
                    <div>
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Generated Outputs
                      </h4>
                      <div className="space-y-2">
                        {step.outputs.length === 0 ? (
                          <p className="text-slate-500 text-sm italic">No outputs yet...</p>
                        ) : (
                          step.outputs.map(output => (
                            <div key={output.id} className="bg-slate-800/50 rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-white text-sm font-medium">{output.title}</h5>
                                <span className="text-xs text-slate-500">{output.size}</span>
                              </div>
                              <p className="text-xs text-slate-400 mb-2">{output.content}</p>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  output.type === 'code' ? 'bg-purple-500/20 text-purple-300' :
                                  output.type === 'document' ? 'bg-blue-500/20 text-blue-300' :
                                  output.type === 'analysis' ? 'bg-green-500/20 text-green-300' :
                                  'bg-orange-500/20 text-orange-300'
                                }`}>
                                  {output.type}
                                </span>
                                <Button size="sm" variant="outline" className="glass-button h-6 px-2 text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}