'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Bot, MessageCircle, CheckCircle, Clock, ArrowRight, Sparkles, Code, Palette, 
  TestTube, Rocket, TrendingUp, Target, Building, List, Crown, CheckSquare,
  FileText, Users, AlertCircle, Lightbulb, Zap, Settings, Play, Pause
} from 'lucide-react'
import { BMAD_AGENTS, BMadAgent, getAgentsByWorkflowOrder, getNextAgent } from '../../lib/bmad/agents'
import { WorkflowStep, WorkflowTask } from '../../lib/bmad/workflows';
import { generateDynamicWorkflow } from '../../lib/bmad/dynamicWorkflow';

interface AgentState {
  id: string
  status: 'waiting' | 'active' | 'completed' | 'paused'
  progress: number
  currentTask?: WorkflowTask
  currentTaskIndex: number
  outputs: string[]
  startTime?: Date
  endTime?: Date
  messages: AgentMessage[]
}

interface AgentMessage {
  id: string
  agentId: string
  agentName: string
  message: string
  timestamp: Date
  type: 'task-start' | 'task-progress' | 'task-complete' | 'collaboration' | 'output' | 'error'
  taskId?: string
  outputs?: string[]
}

interface BMadAgentCollaborationProps {
  projectName: string;
  uploadedContent: string;
  onComplete: (result: any) => void;
  showDownloads?: boolean;
  selectedAgentIds: string[]; // Add this line
}

export function BMadAgentCollaboration({ 
  projectName, 
  uploadedContent, 
  onComplete, 
  showDownloads = false, 
  selectedAgentIds 
}: BMadAgentCollaborationProps) {
  const [workflow, setWorkflow] = useState(generateDynamicWorkflow(selectedAgentIds));
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>({})
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [allMessages, setAllMessages] = useState<AgentMessage[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [projectOutputs, setProjectOutputs] = useState<string[]>(['uploaded-prd'])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const iconMap: Record<string, any> = {
    Crown, TrendingUp, Target, Palette, Building, CheckSquare, List, Code, TestTube
  }

  useEffect(() => {
    if (workflow) {
      initializeAgentStates();
    }
  }, [workflow]);

  const initializeAgentStates = () => {
    if (!workflow) return;
    const initialStates: Record<string, AgentState> = {};
    
    workflow.steps.forEach(step => {
      initialStates[step.agentId] = {
        id: step.agentId,
        status: 'waiting',
        progress: 0,
        currentTaskIndex: 0,
        outputs: [],
        messages: []
      };
    });

    if (workflow.steps.length > 0) {
      initialStates[workflow.steps[0].agentId].status = 'active';
    }

    setAgentStates(initialStates);
  };

  const addMessage = (message: Omit<AgentMessage, 'id' | 'timestamp'>) => {
    const newMessage: AgentMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    }

    setAllMessages(prev => [...prev, newMessage])
    
    // Add to agent's messages
    setAgentStates(prev => ({
      ...prev,
      [message.agentId]: {
        ...prev[message.agentId],
        messages: [...prev[message.agentId].messages, newMessage]
      }
    }))
  }

  const executeAgentTask = async (agentId: string, task: WorkflowTask, step: WorkflowStep) => {
    const agent = BMAD_AGENTS.find(a => a.id === agentId)
    if (!agent) return

    // Task start message
    addMessage({
      agentId,
      agentName: agent.name,
      message: `Starting task: ${task.name}`,
      type: 'task-start',
      taskId: task.id
    })

    // Simulate task execution with progress updates
    const progressSteps = 10
    for (let i = 0; i <= progressSteps; i++) {
      if (isPaused) {
        setAgentStates(prev => ({
          ...prev,
          [agentId]: { ...prev[agentId], status: 'paused' }
        }))
        return
      }

      await new Promise(resolve => setTimeout(resolve, task.estimatedTime * 100 / progressSteps))
      
      const progress = (i / progressSteps) * 100
      setAgentStates(prev => ({
        ...prev,
        [agentId]: { ...prev[agentId], progress }
      }))

      // Add progress messages for key milestones
      if (i === Math.floor(progressSteps * 0.3)) {
        addMessage({
          agentId,
          agentName: agent.name,
          message: `Processing: ${task.instructions[0]}`,
          type: 'task-progress',
          taskId: task.id
        })
      } else if (i === Math.floor(progressSteps * 0.7)) {
        addMessage({
          agentId,
          agentName: agent.name,
          message: `Finalizing: ${task.instructions[task.instructions.length - 1]}`,
          type: 'task-progress',
          taskId: task.id
        })
      }
    }

    // Task completion
    addMessage({
      agentId,
      agentName: agent.name,
      message: `Completed task: ${task.name}`,
      type: 'task-complete',
      taskId: task.id,
      outputs: task.outputs
    })

    // Update agent state with completed outputs
    setAgentStates(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        outputs: [...prev[agentId].outputs, ...task.outputs]
      }
    }))

    // Update global project outputs
    setProjectOutputs(prev => [...prev, ...task.outputs])
  }

  const executeAgentStep = async (stepIndex: number) => {
    const step = workflow.steps[stepIndex]
    const agent = BMAD_AGENTS.find(a => a.id === step.agentId)
    if (!agent) return

    // Check dependencies
    const dependenciesMet = step.dependencies.every(dep => projectOutputs.includes(dep))
    if (!dependenciesMet) {
      addMessage({
        agentId: step.agentId,
        agentName: agent.name,
        message: `Waiting for dependencies: ${step.dependencies.filter(dep => !projectOutputs.includes(dep)).join(', ')}`,
        type: 'error'
      })
      return
    }

    // Start agent
    setAgentStates(prev => ({
      ...prev,
      [step.agentId]: {
        ...prev[step.agentId],
        status: 'active',
        startTime: new Date(),
        currentTaskIndex: 0
      }
    }))

    addMessage({
      agentId: step.agentId,
      agentName: agent.name,
      message: `${agent.name} is now active. Role: ${agent.role}`,
      type: 'collaboration'
    })

    // Execute all tasks in sequence
    for (let taskIndex = 0; taskIndex < step.tasks.length; taskIndex++) {
      const task = step.tasks[taskIndex]
      
      setAgentStates(prev => ({
        ...prev,
        [step.agentId]: {
          ...prev[step.agentId],
          currentTask: task,
          currentTaskIndex: taskIndex,
          progress: 0
        }
      }))

      await executeAgentTask(step.agentId, task, step)

      if (isPaused) return
    }

    // Complete agent step
    setAgentStates(prev => ({
      ...prev,
      [step.agentId]: {
        ...prev[step.agentId],
        status: 'completed',
        endTime: new Date(),
        progress: 100,
        currentTask: undefined
      }
    }))

    addMessage({
      agentId: step.agentId,
      agentName: agent.name,
      message: `${agent.name} has completed all tasks. Outputs: ${step.outputs.join(', ')}`,
      type: 'output',
      outputs: step.outputs
    })

    // Collaboration handoff message
    if (stepIndex < workflow.steps.length - 1) {
      const nextStep = workflow.steps[stepIndex + 1]
      const nextAgent = BMAD_AGENTS.find(a => a.id === nextStep.agentId)
      if (nextAgent) {
        addMessage({
          agentId: step.agentId,
          agentName: agent.name,
          message: `Handing off to ${nextAgent.name} for ${nextStep.name}`,
          type: 'collaboration'
        })
      }
    }
  }

  const startWorkflow = async () => {
    if (!workflow) {
      console.error("Cannot start workflow: no valid workflow generated.");
      return;
    }
    setIsRunning(true)
    setIsPaused(false)

    addMessage({
      agentId: 'bmad-orchestrator',
      agentName: 'BMad Orchestrator',
      message: `Starting ${workflow.name} for project: ${projectName}`,
      type: 'collaboration'
    })

    for (let i = 0; i < workflow.steps.length; i++) {
      if (isPaused) break
      
      setCurrentStepIndex(i)
      await executeAgentStep(i)
    }

    if (!isPaused) {
      setIsRunning(false)
      
      // Generate final result
      const result = {
        appName: projectName,
        framework: 'React + Next.js + TypeScript',
        features: [
          'User Authentication & Authorization',
          'Responsive Dashboard Interface',
          'Real-time Data Processing',
          'API Integration Layer',
          'Comprehensive Testing Suite',
          'Production Deployment Pipeline'
        ],
        deploymentUrl: `https://${projectName.toLowerCase().replace(/\s+/g, '-')}.netlify.app`,
        codeRepository: `https://github.com/bmad-ai/${projectName.toLowerCase().replace(/\s+/g, '-')}`,
        artifacts: {
          'Project Brief': 'Comprehensive business analysis and requirements',
          'Product Requirements': 'Detailed PRD with acceptance criteria',
          'UI/UX Design': 'Complete design system and wireframes',
          'System Architecture': 'Scalable technical architecture',
          'User Stories': 'Development-ready story cards',
          'Source Code': 'Production-quality implementation',
          'Test Results': 'Comprehensive quality assurance report'
        },
        metrics: {
          totalTime: workflow.totalEstimatedTime,
          linesOfCode: 2500,
          testCoverage: 95,
          performanceScore: 92
        }
      }

      setTimeout(() => onComplete(result), 1000)
    }
  }

  const pauseWorkflow = () => {
    setIsPaused(true)
  }

  const resumeWorkflow = () => {
    setIsPaused(false)
    if (isRunning) {
      startWorkflow()
    }
  }

  const getAgentIcon = (agentId: string) => {
    const agent = BMAD_AGENTS.find(a => a.id === agentId)
    if (!agent) return Bot
    return iconMap[agent.icon] || Bot
  }

  const getCurrentStepAgent = () => {
    return workflow.steps[currentStepIndex]?.agentId
  }

if (!workflow) {
    return (
      <div className="text-center text-red-500">
        Failed to generate a valid workflow. Please check the agent selections and dependencies.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-viby rounded-full mb-4 animate-pulse">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text">BMad-Method AI Collaboration</h2>
        <p className="text-slate-300 text-lg">
          Watch specialized BMad agents follow the complete methodology to build <span className="text-white font-semibold">{projectName}</span>
        </p>
        
        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <Button onClick={startWorkflow} className="gradient-button">
              <Play className="h-4 w-4 mr-2" />
              Start BMad Workflow
            </Button>
          ) : isPaused ? (
            <Button onClick={resumeWorkflow} className="gradient-button">
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          ) : (
            <Button onClick={pauseWorkflow} variant="outline" className="glass-button">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
        </div>
      </div>

      {/* Workflow Progress Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Crown className="h-5 w-5 mr-2" />
            BMad Workflow Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">{currentStepIndex + 1}/{workflow.steps.length}</div>
              <div className="text-slate-400 text-sm">Current Step</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">
                {Math.round(((currentStepIndex / workflow.steps.length) * 100))}%
              </div>
              <div className="text-slate-400 text-sm">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">
                {Math.floor(workflow.totalEstimatedTime / 60)}min
              </div>
              <div className="text-slate-400 text-sm">Estimated Time</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-viby h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStepIndex / workflow.steps.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Agent Pipeline */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            BMad Agent Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflow.steps.map((step, index) => {
              const agent = BMAD_AGENTS.find(a => a.id === step.agentId)
              const agentState = agentStates[step.agentId]
              const Icon = getAgentIcon(step.agentId)
              
              if (!agent || !agentState) return null

              return (
                <div 
                  key={step.id} 
                  className={`border rounded-lg p-4 transition-all cursor-pointer ${
                    selectedAgent === agent.id 
                      ? 'border-purple-500/50 bg-purple-500/10' 
                      : 'border-white/10 hover:border-white/20'
                  } ${agentState.status === 'active' ? 'animate-pulse' : ''}`}
                  onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                >
                  <div className="flex items-center space-x-4">
                    {/* Agent Icon */}
                    <div className={`p-3 bg-gradient-to-r ${agent.color} rounded-xl relative ${
                      agentState.status === 'active' ? 'animate-pulse' : ''
                    }`}>
                      <Icon className="h-6 w-6 text-white" />
                      {agentState.status === 'completed' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {agentState.status === 'active' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-ping" />
                      )}
                    </div>

                    {/* Agent Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-white font-medium">{agent.name}</h3>
                          <p className="text-slate-400 text-sm">{agent.role}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-sm">{agentState.progress.toFixed(0)}%</div>
                          <div className={`text-xs capitalize ${
                            agentState.status === 'completed' ? 'text-green-400' :
                            agentState.status === 'active' ? 'text-yellow-400' : 'text-slate-500'
                          }`}>
                            {agentState.status}
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-viby h-2 rounded-full transition-all duration-500"
                          style={{ width: `${agentState.progress}%` }}
                        />
                      </div>
                      
                      {/* Current Task */}
                      {agentState.currentTask && (
                        <p className="text-slate-300 text-sm">
                          <strong>Current Task:</strong> {agentState.currentTask.name}
                        </p>
                      )}
                      
                      {/* Outputs */}
                      {agentState.outputs.length > 0 && (
                        <div className="mt-2">
                          <p className="text-slate-400 text-xs mb-1">Outputs:</p>
                          <div className="flex flex-wrap gap-1">
                            {agentState.outputs.map((output, idx) => (
                              <span key={idx} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                                {output}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connection Arrow */}
                    {index < workflow.steps.length - 1 && (
                      <ArrowRight className={`h-5 w-5 ${
                        agentState.status === 'completed' ? 'text-green-400' : 'text-slate-600'
                      }`} />
                    )}
                  </div>

                  {/* Expanded Agent Details */}
                  {selectedAgent === agent.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      {/* Agent Instructions */}
                      <div>
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <Lightbulb className="h-4 w-4 mr-1" />
                          Instructions & Logic
                        </h4>
                        <ul className="space-y-1">
                          {agent.instructions.map((instruction, idx) => (
                            <li key={idx} className="text-slate-300 text-sm flex items-start">
                              <span className="text-purple-400 mr-2">•</span>
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Current Step Tasks */}
                      <div>
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <Settings className="h-4 w-4 mr-1" />
                          Workflow Tasks
                        </h4>
                        <div className="space-y-2">
                          {step.tasks.map((task, taskIdx) => (
                            <div 
                              key={task.id} 
                              className={`p-2 rounded border ${
                                agentState.currentTaskIndex === taskIdx && agentState.status === 'active'
                                  ? 'border-yellow-400 bg-yellow-400/10'
                                  : agentState.currentTaskIndex > taskIdx || agentState.status === 'completed'
                                  ? 'border-green-400 bg-green-400/10'
                                  : 'border-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white text-sm font-medium">{task.name}</span>
                                <span className="text-xs text-slate-400">{task.estimatedTime}s</span>
                              </div>
                              <p className="text-slate-400 text-xs">{task.description}</p>
                              
                              {/* Task Instructions */}
                              <div className="mt-2">
                                <details className="text-xs">
                                  <summary className="text-slate-300 cursor-pointer hover:text-white">
                                    View Instructions ({task.instructions.length})
                                  </summary>
                                  <ul className="mt-1 ml-2 space-y-1">
                                    {task.instructions.map((instruction, iIdx) => (
                                      <li key={iIdx} className="text-slate-400 flex items-start">
                                        <span className="text-blue-400 mr-1">{iIdx + 1}.</span>
                                        {instruction}
                                      </li>
                                    ))}
                                  </ul>
                                </details>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expected Outputs */}
                      <div>
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Expected Outputs
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {step.outputs.map((output, idx) => (
                            <span key={idx} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                              {output}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity Feed */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Real-time Agent Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {allMessages.slice(-10).map((message) => (
              <div key={message.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  message.type === 'task-complete' || message.type === 'output' ? 'bg-green-500/20' :
                  message.type === 'collaboration' ? 'bg-purple-500/20' :
                  message.type === 'task-start' ? 'bg-blue-500/20' :
                  message.type === 'error' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                }`}>
                  {message.type === 'task-complete' || message.type === 'output' ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : message.type === 'collaboration' ? (
                    <ArrowRight className="h-4 w-4 text-purple-400" />
                  ) : message.type === 'task-start' ? (
                    <Play className="h-4 w-4 text-blue-400" />
                  ) : message.type === 'error' ? (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium text-sm">{message.agentName}</span>
                    <span className="text-slate-500 text-xs">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      message.type === 'task-complete' ? 'bg-green-500/20 text-green-300' :
                      message.type === 'collaboration' ? 'bg-purple-500/20 text-purple-300' :
                      message.type === 'task-start' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {message.type.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{message.message}</p>
                  
                  {/* Show outputs if available */}
                  {message.outputs && message.outputs.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.outputs.map((output, idx) => (
                        <span key={idx} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                          {output}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {allMessages.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                No activity yet. Click "Start BMad Workflow" to begin the collaboration process.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Downloads Section */}
      {showDownloads && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Generated Documents & Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectOutputs.map((output, index) => (
                <div key={index} className="p-4 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="h-6 w-6 text-blue-400" />
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        {output.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-xs text-slate-400">Ready for download</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full glass-button"
                    onClick={() => {
                      // Create downloadable content
                      const content = `# ${output.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\nGenerated by BMad-Method for project: ${projectName}\n\nThis document contains the ${output} specifications and requirements.`
                      const blob = new Blob([content], { type: 'text/markdown' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${output}.md`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    }}
                  >
                    Download
                  </Button>
                </div>
              ))}
              
              {projectOutputs.length === 0 && (
                <div className="col-span-full text-center text-slate-400 py-8">
                  No documents generated yet. Start the workflow to begin creating deliverables.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}